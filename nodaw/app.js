/* app.js */
window.App = (function () {
  const PAD_COUNT = 16;
  const SUPPORTED_EXT = ['wav', 'aiff', 'aif', 'flac', 'mp3', 'ogg', 'm4a', 'aac'];
  const FIELD_ORDER = ['sample', 'start', 'end', 'playback', 'behavior', 'param1', 'param2', 'param3', 'volume'];
  const TOTAL_FIELDS = PAD_COUNT * FIELD_ORDER.length;

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
    pads: Array.from({ length: PAD_COUNT }, defaultPad),
  };

  function render() {
    UI.setMode(state.mode);
    UI.renderGrid(state.pads, state.mode, state.globalIndex);
  }

  function renderLoop() {
    requestAnimationFrame(renderLoop);
    for (let i = 0; i < PAD_COUNT; i++) {
      const progress = AudioEngine.getProgress(i);
      UI.setPadProgress(i, progress);
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
    }).catch(err => console.error(err));
  }

  function toggleMode() {
    state.mode = state.mode === 'PLAY' ? 'SETUP' : 'PLAY';
    persistGlobal();
    render();
  }

  function pressPad(index) {
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
    UI.setStatus('Ready');
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

    if (field === 'sample') return; 

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

    if (field === 'sample') {
      pad.hasSample = def.hasSample;
      pad.sampleName = def.sampleName;
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
    persistPad(index);
    persistSampleBlob(index, file);
    UI.setStatus('Ready');
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
      state.globalIndex = globalState.globalIndex || 0;
    }

    const blobs = await Storage.loadAllSampleBlobs();
    for (const b of blobs) {
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
    getMode: () => state.mode,
    stopAllSounds: () => AudioEngine.stopAll()
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
