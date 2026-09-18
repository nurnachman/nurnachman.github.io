/* ui.js */
window.UI = (function () {
  const KEYS = ['1', '2', '3', '4', 'q', 'w', 'e', 'r', 'a', 's', 'd', 'f', 'z', 'x', 'c', 'v'];

  let gridEl, statusEl, modeSetupEl, modePlayEl, quantizeEl, bpmEl, partsEl;
  let padEls = [];
  let drawnSamples = [];

  function init() {
    gridEl = document.getElementById('grid');
    statusEl = document.getElementById('status-text');
    modeSetupEl = document.getElementById('mode-setup');
    modePlayEl = document.getElementById('mode-play');
    quantizeEl = document.getElementById('quantize-toggle');
    bpmEl = document.getElementById('bpm-input');
    partsEl = document.getElementById('parts-select');

    quantizeEl.addEventListener('change', () => App.setQuantize(quantizeEl.checked));
    bpmEl.addEventListener('change', () => App.setBpm(bpmEl.value));
    partsEl.addEventListener('change', () => App.setParts(partsEl.value));

    gridEl.innerHTML = '';
    gridEl.addEventListener('pointerdown', (event) => {
      const button = event.target.closest('[data-action="duplicate"]');
      if (button) {
        App.duplicatePad(Number(button.closest('.pad').dataset.index));
        return;
      }
      const pad = event.target.closest('.pad');
      if (pad && document.body.classList.contains('mode-play')) {
        App.pressPad(Number(pad.dataset.index));
      }
    });
    padEls = KEYS.map((key, i) => {
      drawnSamples[i] = null;
      const el = document.createElement('div');
      el.className = 'pad';
      el.dataset.index = String(i);
      el.setAttribute('role', 'gridcell');
      el.setAttribute('aria-label', `Pad ${key.toUpperCase()}`);
      
      el.innerHTML = `
        <canvas class="waveform"></canvas>
        <div class="playhead"></div>
        <div class="pad-header"><span>${key.toUpperCase()}</span></div>
        <div class="setting" data-field="0"><span class="setting-label">Sample</span><span class="setting-value pad-sample"></span></div>
        <div class="setting" data-field="1"><span class="setting-label">Start</span><span class="setting-value"></span></div>
        <div class="setting" data-field="2"><span class="setting-label">End</span><span class="setting-value"></span></div>
        <div class="setting" data-field="3"><span class="setting-label">Playback</span><span class="setting-value"></span></div>
        <div class="setting" data-field="4"><span class="setting-label">Behavior</span><span class="setting-value"></span></div>
        <div class="setting" data-field="5"><span class="setting-label">P1</span><span class="setting-value"></span></div>
        <div class="setting" data-field="6"><span class="setting-label">P2</span><span class="setting-value"></span></div>
        <div class="setting" data-field="7"><span class="setting-label">P3</span><span class="setting-value"></span></div>
        <div class="setting" data-field="8"><span class="setting-label">Volume</span><span class="setting-value"></span></div>
        <div class="setting duplicate-setting"><button class="duplicate-button" type="button" tabindex="-1" data-action="duplicate" title="Duplicate into an empty pad">duplicate into an empty pad</button></div>
      `;
      gridEl.appendChild(el);
      return el;
    });
  }

  function setStatus(text) {
    statusEl.textContent = text;
  }

  function setMode(mode) {
    modeSetupEl.classList.toggle('active', mode === 'SETUP');
    modePlayEl.classList.toggle('active', mode === 'PLAY');
    document.body.classList.toggle('mode-play', mode === 'PLAY');
  }

  function renderClock(quantize, bpm, parts) {
    quantizeEl.checked = quantize;
    bpmEl.value = String(bpm);
    partsEl.value = String(parts);
    bpmEl.disabled = !quantize;
    partsEl.disabled = !quantize;
    document.body.classList.toggle('quantize-active', quantize);
  }

  function focusClockControl(control) {
    const controls = {
      quantize: quantizeEl,
      bpm: bpmEl,
      grid: partsEl,
    };
    const element = controls[control];
    if (element) element.focus();
  }

  function setPadQueued(index, queued) {
    const el = padEls[index];
    if (el) el.classList.toggle('queued', queued);
  }

  function setPadTriggered(index) {
    const el = padEls[index];
    if (!el) return;
    el.classList.remove('triggered');
    void el.offsetWidth;
    el.classList.add('triggered');
    window.setTimeout(() => el.classList.remove('triggered'), 120);
  }
  
  function makeBar(value) {
    const blocks = Math.round(Math.max(0, Math.min(100, value || 0)) / 10);
    return '█'.repeat(blocks) + '░'.repeat(10 - blocks);
  }

  function drawWaveform(canvas, buffer, start, end) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width = 300;
    const height = canvas.height = 150;
    ctx.clearRect(0, 0, width, height);
    if (!buffer) return;

    const data = buffer.getChannelData(0);
    const step = Math.max(1, Math.floor(data.length / width));
    const amp = height / 2;

    const fg = getComputedStyle(document.documentElement).getPropertyValue('--fg').trim() || '#fff';
    ctx.fillStyle = fg;

    const startRatio = Math.max(0, Math.min(100, start !== undefined ? start : 0)) / 100;
    const endRatio = Math.max(0, Math.min(100, end !== undefined ? end : 100)) / 100;
    const minX = Math.min(startRatio, endRatio) * width;
    const maxX = Math.max(startRatio, endRatio) * width;

    // Draw inactive regions (dimmer)
    ctx.globalAlpha = 0.3;
    for (let i = 0; i < width; i++) {
      if (i >= minX && i <= maxX) continue;
      let min = 1.0;
      let max = -1.0;
      const offset = i * step;
      for (let j = 0; j < step; j++) {
        if (offset + j >= data.length) break;
        const val = data[offset + j];
        if (val < min) min = val;
        if (val > max) max = val;
      }
      ctx.fillRect(i, amp + min * amp, 1, Math.max(1, (max - min) * amp));
    }

    // Draw active region (brighter)
    ctx.globalAlpha = 1.0;
    for (let i = Math.floor(minX); i <= Math.ceil(maxX); i++) {
      if (i < 0 || i >= width) continue;
      let min = 1.0;
      let max = -1.0;
      const offset = i * step;
      for (let j = 0; j < step; j++) {
        if (offset + j >= data.length) break;
        const val = data[offset + j];
        if (val < min) min = val;
        if (val > max) max = val;
      }
      ctx.fillRect(i, amp + min * amp, 1, Math.max(1, (max - min) * amp));
    }
    ctx.globalAlpha = 1.0;
  }

  function renderGrid(pads, mode, globalIndex) {
    padEls.forEach((el, i) => {
      const pad = pads[i];
      const labels = Behaviors.labelsFor(pad.behavior);
      const settings = el.querySelectorAll('.setting[data-field]');

      el.classList.toggle('has-sample', !!pad.hasSample);
      
      const canvas = el.querySelector('.waveform');
      const cached = drawnSamples[i];
      if (pad.hasSample && (!cached || cached.name !== pad.sampleName || cached.start !== pad.start || cached.end !== pad.end)) {
        const buf = AudioEngine.getBuffer(i);
        if (buf) {
          drawWaveform(canvas, buf, pad.start, pad.end);
          drawnSamples[i] = { name: pad.sampleName, start: pad.start, end: pad.end };
        }
      } else if (!pad.hasSample) {
        if (canvas) {
          const ctx = canvas.getContext('2d');
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        drawnSamples[i] = null;
      }
      
      settings[0].querySelector('.setting-value').textContent = pad.hasSample ? pad.sampleName : '(Enter to select)';
      settings[1].querySelector('.setting-value').textContent = makeBar(pad.start);
      settings[2].querySelector('.setting-value').textContent = makeBar(pad.end);
      settings[3].querySelector('.setting-value').textContent = pad.playback || 'Overlap';
      settings[4].querySelector('.setting-value').textContent = pad.behavior;
      
      settings[5].querySelector('.setting-label').textContent = labels[0];
      settings[5].querySelector('.setting-value').textContent = makeBar(pad.param1);

      settings[6].querySelector('.setting-label').textContent = labels[1];
      settings[6].querySelector('.setting-value').textContent = makeBar(pad.param2);

      settings[7].querySelector('.setting-label').textContent = labels[2];
      settings[7].querySelector('.setting-value').textContent = makeBar(pad.param3);

      settings[8].querySelector('.setting-label').textContent = 'Volume';
      settings[8].querySelector('.setting-value').textContent = makeBar(pad.volume);

      settings.forEach((s, fieldIdx) => {
        const isFocused = (mode === 'SETUP') && (globalIndex === i * 10 + fieldIdx);
        s.classList.toggle('focused', isFocused);
      });
      const duplicateSetting = el.querySelector('.duplicate-setting');
      const duplicateButton = el.querySelector('.duplicate-button');
      duplicateSetting.classList.toggle('focused', mode === 'SETUP' && globalIndex === i * 10 + 9);
      duplicateButton.classList.toggle('focused', mode === 'SETUP' && globalIndex === i * 10 + 9);
    });
  }

  function setPadProgress(index, progress) {
    const el = padEls[index];
    if (el) {
      if (progress >= 0) {
        el.style.setProperty('--progress', progress);
        el.classList.add('playing');
      } else {
        el.classList.remove('playing');
      }
    }
  }

  return { init, setStatus, setMode, renderClock, focusClockControl, renderGrid, setPadProgress, setPadQueued, setPadTriggered, KEYS };
})();