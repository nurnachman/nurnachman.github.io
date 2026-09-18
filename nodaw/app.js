/* app.js */
window.App = (function () {
  const PAD_COUNT = 16;
  const SUPPORTED_EXT = ['wav', 'aiff', 'aif', 'flac', 'mp3', 'ogg', 'm4a', 'aac'];
  const FIELD_ORDER = ['sample', 'start', 'end', 'playback', 'behavior', 'param1', 'param2', 'param3', 'volume', 'duplicate'];
  const NAVIGATION_VERSION = 3;
  const PREVIOUS_FIELD_COUNT = FIELD_ORDER.length - 1;
  const TOTAL_FIELDS = PAD_COUNT * FIELD_ORDER.length;
  const PART_LABELS = { 1: 'beat', 2: '1/2', 4: '1/4', 8: '1/8' };

  function defaultPad() {
    return {
      hasSample: false,
      sampleName: null,
      start: 0,
      end: 100,
      playback: 'Overlap',
      behavior: 'None',
      param1: 0,
      param2: 0,
      param3: 0,
      volume: 100,
    };
  }

  const state = {
    mode: 'PLAY',
    globalIndex: 0,
    quantize: false,
    bpm: 120,
    parts: 4,
    pads: Array.from({ length: PAD_COUNT }, defaultPad),
  };
  const sampleBlobs = new Map();

  function render() {
    UI.setMode(state.mode);
    UI.renderGrid(state.pads, state.mode, state.globalIndex);
    UI.renderClock(state.quantize, state.bpm, state.parts);
  }

  function renderLoop() {
    requestAnimationFrame(renderLoop);
    for (let i = 0; i < PAD_COUNT; i++) {
      const progress = AudioEngine.getProgress(i);
      UI.setPadProgress(i, progress);
      if (progress >= 0) UI.setPadQueued(i, false);
    }
  }

  function persistPad(index) {
    Storage.savePad(index, state.pads[index]).catch(err => console.error(err));
  }

  function persistSampleBlob(index, blob) {
    Storage.saveSampleBlob(index, blob).catch(err => console.error(err));
  }

  function persistGlobal() {
    Storage.saveGlobalState({
      mode: state.mode,
      globalIndex: state.globalIndex,
      quantize: state.quantize,
      bpm: state.bpm,
      parts: state.parts,
      navigationVersion: NAVIGATION_VERSION,
    }).catch(err => console.error(err));
  }

  function toggleMode() {
    state.mode = state.mode === 'PLAY' ? 'SETUP' : 'PLAY';
    persistGlobal();
    render();
  }

  function pressPad(index) {
    UI.setPadTriggered(index);
    if (state.mode === 'SETUP') {
      const currentPadIndex = Math.floor(state.globalIndex / FIELD_ORDER.length);
      if (index !== currentPadIndex) {
        state.globalIndex = index * FIELD_ORDER.length; 
        persistGlobal();
        render();
      }
    }
    playPad(index);
  }

  function playPad(index) {
    const pad = state.pads[index];
    if (!pad.hasSample || !AudioEngine.hasBuffer(index)) {
      UI.setStatus('Empty');
      return;
    }
    const result = AudioEngine.playPad(index, pad);
    if (!result.ok) {
      UI.setStatus('Cannot load sample');
      return;
    }
    UI.setPadQueued(index, state.quantize && result.delay > 0);
    UI.setStatus(state.quantize ? `Queued for ${PART_LABELS[state.parts]}` : 'Ready');
  }

  function persistClock() {
    AudioEngine.setClock(state.quantize, state.bpm, state.parts);
    persistGlobal();
    render();
  }

  function setQuantize(enabled) {
    state.quantize = !!enabled;
    persistClock();
  }

  function setBpm(value) {
    state.bpm = Math.max(40, Math.min(300, Number(value) || 120));
    persistClock();
  }

  function setParts(value) {
    state.parts = [1, 2, 4, 8].includes(Number(value)) ? Number(value) : 4;
    persistClock();
  }

  function moveFocus(delta) {
    if (state.mode !== 'SETUP') return;
    state.globalIndex = (state.globalIndex + delta + TOTAL_FIELDS) % TOTAL_FIELDS;
    persistGlobal();
    render();
  }

  function adjustValue(dir, fine) {
    if (state.mode !== 'SETUP') return;
    
    const padIndex = Math.floor(state.globalIndex / FIELD_ORDER.length);
    const fieldIndex = state.globalIndex % FIELD_ORDER.length;
    const field = FIELD_ORDER[fieldIndex];
    const pad = state.pads[padIndex];

    if (field === 'sample' || field === 'duplicate') return;

    if (field === 'playback') {
      pad.playback = pad.playback === 'Overlap' ? 'Restart' : 'Overlap';
    } else if (field === 'behavior') {
      pad.behavior = dir > 0 ? Behaviors.next(pad.behavior) : Behaviors.prev(pad.behavior);
    } else {
      const step = fine ? 1 : 5;
      const current = pad[field] !== undefined ? pad[field] : (field === 'end' || field === 'volume' ? 100 : 0);
      pad[field] = Math.max(0, Math.min(100, current + (dir > 0 ? step : -step)));
    }
    
    persistPad(padIndex);
    render();
  }

  function resetValue() {
    if (state.mode !== 'SETUP') return;
    
    const padIndex = Math.floor(state.globalIndex / FIELD_ORDER.length);
    const fieldIndex = state.globalIndex % FIELD_ORDER.length;
    const field = FIELD_ORDER[fieldIndex];
    const pad = state.pads[padIndex];
    const def = defaultPad();

    if (field === 'sample' || field === 'duplicate') {
      if (field === 'duplicate') return;
      pad.hasSample = def.hasSample;
      pad.sampleName = def.sampleName;
      sampleBlobs.delete(padIndex);
      AudioEngine.clearPadSample(padIndex);
      Storage.deleteSampleBlob(padIndex).catch(err => console.error(err));
    } else {
      pad[field] = def[field];
    }
    
    persistPad(padIndex);
    render();
  }

  function handleEnter() {
    if (state.mode !== 'SETUP') return;
    const fieldIndex = state.globalIndex % FIELD_ORDER.length;
    const padIndex = Math.floor(state.globalIndex / FIELD_ORDER.length);
    
    if (FIELD_ORDER[fieldIndex] === 'sample') {
      assignSample(padIndex);
    } else if (FIELD_ORDER[fieldIndex] === 'duplicate') {
      duplicatePad(padIndex);
    }
  }

  async function assignSample(index) {
    const fileInput = document.getElementById('file-input');
    fileInput.value = '';
    fileInput.onchange = async () => {
      const file = fileInput.files && fileInput.files[0];
      if (!file) return;
      await handleFile(index, file);
    };

    if (window.showOpenFilePicker) {
      try {
        const [handle] = await window.showOpenFilePicker({
          types: [{
            description: 'Audio',
            accept: { 'audio/*': ['.wav', '.aiff', '.aif', '.flac', '.mp3', '.ogg', '.m4a', '.aac'] },
          }],
        });
        const file = await handle.getFile();
        await handleFile(index, file);
        return;
      } catch (err) {
        if (err && err.name === 'AbortError') return;
        fileInput.click();
        return;
      }
    }
    fileInput.click();
  }

  async function handleFile(index, file) {
    const ext = (file.name.split('.').pop() || '').toLowerCase();
    if (SUPPORTED_EXT.indexOf(ext) === -1) {
      UI.setStatus('Unsupported format');
      return;
    }
    const result = await AudioEngine.loadPadSample(index, file);
    if (!result.ok) {
      UI.setStatus('Cannot load sample');
      return;
    }
    const pad = state.pads[index];
    pad.hasSample = true;
    pad.sampleName = file.name;
    sampleBlobs.set(index, file);
    persistPad(index);
    persistSampleBlob(index, file);
    UI.setStatus('Ready');
    render();
  }

  async function duplicatePad(sourceIndex) {
    if (sourceIndex < 0 || sourceIndex >= PAD_COUNT) return;

    const targetIndex = state.pads.findIndex((pad) => !pad.hasSample);
    if (targetIndex === -1) {
      UI.setStatus('No empty pad');
      return;
    }

    const sourcePad = state.pads[sourceIndex];
    const sampleBlob = sampleBlobs.get(sourceIndex);
    if (sourcePad.hasSample && !sampleBlob) {
      UI.setStatus('Cannot duplicate sample');
      return;
    }

    state.pads[targetIndex] = Object.assign(defaultPad(), sourcePad);
    if (sampleBlob) {
      const result = await AudioEngine.loadPadSample(targetIndex, sampleBlob);
      if (!result.ok) {
        state.pads[targetIndex] = defaultPad();
        UI.setStatus('Cannot duplicate sample');
        return;
      }
      sampleBlobs.set(targetIndex, sampleBlob);
      persistSampleBlob(targetIndex, sampleBlob);
    }
    persistPad(targetIndex);
    UI.setStatus(`Duplicated to ${UI.KEYS[targetIndex].toUpperCase()}`);
    render();
  }

  async function loadPersistedState() {
    const [padsData, globalState] = await Promise.all([
      Storage.loadAllPads(),
      Storage.loadGlobalState(),
    ]);

    padsData.forEach((p) => {
      if (p.id >= 0 && p.id < PAD_COUNT) {
        const merged = Object.assign(defaultPad(), p);
        delete merged.id;
        state.pads[p.id] = merged;
      }
    });

    if (globalState) {
      state.mode = globalState.mode || 'PLAY';
      state.quantize = !!globalState.quantize;
      state.bpm = Math.max(40, Math.min(300, Number(globalState.bpm) || 120));
      state.parts = [1, 2, 4, 8].includes(Number(globalState.parts)) ? Number(globalState.parts) : 4;
      if (globalState.navigationVersion === NAVIGATION_VERSION) {
        state.globalIndex = globalState.globalIndex || 0;
      } else if (globalState.navigationVersion === 2) {
        const oldIndex = globalState.globalIndex || 0;
        const oldPadIndex = Math.floor(oldIndex / FIELD_ORDER.length);
        const oldFieldIndex = oldIndex % FIELD_ORDER.length;
        const newFieldIndex = oldFieldIndex === 0 ? FIELD_ORDER.length - 1 : oldFieldIndex - 1;
        state.globalIndex = oldPadIndex * FIELD_ORDER.length + newFieldIndex;
      } else {
        const oldIndex = globalState.globalIndex || 0;
        const oldPadIndex = Math.floor(oldIndex / PREVIOUS_FIELD_COUNT);
        const oldFieldIndex = oldIndex % PREVIOUS_FIELD_COUNT;
        state.globalIndex = oldPadIndex * FIELD_ORDER.length + oldFieldIndex;
      }
    }

    AudioEngine.setClock(state.quantize, state.bpm, state.parts);

    const blobs = await Storage.loadAllSampleBlobs();
    for (const b of blobs) {
      sampleBlobs.set(b.id, b.blob);
      if (state.pads[b.id] && state.pads[b.id].hasSample) {
        await AudioEngine.loadPadSample(b.id, b.blob);
      }
    }
  }

  async function init() {
    UI.init();
    Keyboard.init();
    await loadPersistedState();
    render();
    requestAnimationFrame(renderLoop);
  }

  return {
    init,
    toggleMode,
    pressPad,
    moveFocus,
    adjustValue,
    resetValue,
    handleEnter,
    duplicatePad,
    setQuantize,
    setBpm,
    setParts,
    getMode: () => state.mode,
    stopAllSounds: () => AudioEngine.stopAll()
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
