/* keyboard.js */
window.Keyboard = (function () {
  const KEY_TO_INDEX = {};

  const REPEAT_INITIAL_DELAY = 320;  // ms before auto-repeat kicks in
  const REPEAT_MAX_INTERVAL = 150;   // ms between steps at the start of a hold
  const REPEAT_MIN_INTERVAL = 30;    // ms between steps once fully accelerated
  const REPEAT_ACCEL_TIME = 1500;    // ms of holding to reach full speed

  let shiftHeld = false;
  const activeRepeats = {}; // key -> { timeoutId, dir, startTime }

  function init() {
    UI.KEYS.forEach((k, i) => { KEY_TO_INDEX[k] = i; });
    window.addEventListener('keydown', handleKeydown);
    window.addEventListener('keyup', handleKeyup);
    window.addEventListener('blur', stopAllRepeats);
  }

  function startRepeat(key, dir) {
    if (activeRepeats[key]) return; // already repeating this key

    const entry = { timeoutId: null, dir, startTime: performance.now() };
    activeRepeats[key] = entry;

    const tick = () => {
      App.adjustValue(entry.dir, shiftHeld);
      const elapsed = performance.now() - entry.startTime;
      const t = Math.min(1, elapsed / REPEAT_ACCEL_TIME);
      const interval = REPEAT_MAX_INTERVAL - t * (REPEAT_MAX_INTERVAL - REPEAT_MIN_INTERVAL);
      entry.timeoutId = setTimeout(tick, interval);
    };

    entry.timeoutId = setTimeout(tick, REPEAT_INITIAL_DELAY);
  }

  function stopRepeat(key) {
    const entry = activeRepeats[key];
    if (entry) {
      clearTimeout(entry.timeoutId);
      delete activeRepeats[key];
    }
  }

  function stopAllRepeats() {
    Object.keys(activeRepeats).forEach(stopRepeat);
    shiftHeld = false;
  }

  function handleKeydown(e) {
    const key = e.key;

    if (key === ' ') {
      e.preventDefault();
      App.toggleQuantize();
      return;
    }

    const target = e.target;
    const isFormControl = target instanceof HTMLInputElement || target instanceof HTMLSelectElement;
    if (isFormControl) {
      if (target.id === 'quantize-toggle') {
        if (key === 'ArrowRight') {
          e.preventDefault();
          UI.focusClockControl('bpm');
        } else if (key === 'ArrowLeft') {
          e.preventDefault();
          UI.focusClockControl('grid');
        } else if (key === 'ArrowUp' || key === 'ArrowDown') {
          e.preventDefault();
          target.checked = !target.checked;
          target.dispatchEvent(new Event('change', { bubbles: true }));
        }
      } else if (target.id === 'bpm-input' && key === 'ArrowRight') {
        e.preventDefault();
        UI.focusClockControl('grid');
      } else if (target.id === 'bpm-input' && key === 'ArrowLeft') {
        e.preventDefault();
        UI.focusClockControl('quantize');
      } else if (target.id === 'parts-select' && key === 'ArrowRight') {
        e.preventDefault();
        UI.focusClockControl('quantize');
      } else if (target.id === 'parts-select' && key === 'ArrowLeft') {
        e.preventDefault();
        UI.focusClockControl('bpm');
      }
      return;
    }

    if (App.getMode() === 'PLAY' && (key === 'ArrowUp' || key === 'ArrowDown' || key === 'ArrowLeft' || key === 'ArrowRight')) {
      e.preventDefault();
      UI.focusClockControl('quantize');
      return;
    }

    if (key === 'Shift') {
      shiftHeld = true;
      return;
    }

    if (e.repeat) {
      // Left/Right manage their own repeat timing below; ignore the browser's
      // native key-repeat events for them (but still block default scrolling).
      // Every other key keeps its original no-retrigger behavior.
      if (key === 'ArrowLeft' || key === 'ArrowRight') e.preventDefault();
      return;
    }

    const lower = key.length === 1 ? key.toLowerCase() : key;

    if (key === 'Tab') {
      e.preventDefault();
      App.toggleMode();
      return;
    }

    if (key === 'Escape') {
      e.preventDefault();
      App.stopAllSounds();
      return;
    }

    if (key === 'Enter') {
      e.preventDefault();
      App.handleEnter();
      return;
    }
    
    if (key === 'Backspace' || key === 'Delete') {
      e.preventDefault();
      App.resetValue();
      return;
    }

    // Up/Down changes focus vertically, Left/Right changes highlighted value.
    // Holding Shift steps by a smaller, finer amount. Holding Left/Right
    // auto-repeats and speeds up the longer it's held.
    if (key === 'ArrowUp') { e.preventDefault(); App.moveFocus(-1); return; }
    if (key === 'ArrowDown') { e.preventDefault(); App.moveFocus(1); return; }
    if (key === 'ArrowLeft') {
      e.preventDefault();
      App.adjustValue(-1, e.shiftKey);
      startRepeat('ArrowLeft', -1);
      return;
    }
    if (key === 'ArrowRight') {
      e.preventDefault();
      App.adjustValue(1, e.shiftKey);
      startRepeat('ArrowRight', 1);
      return;
    }

    if (Object.prototype.hasOwnProperty.call(KEY_TO_INDEX, lower)) {
      e.preventDefault();
      App.pressPad(KEY_TO_INDEX[lower]);
      return;
    }
  }

  function handleKeyup(e) {
    const key = e.key;
    if (key === 'Shift') {
      shiftHeld = false;
      return;
    }
    if (key === 'ArrowLeft' || key === 'ArrowRight') {
      stopRepeat(key);
    }
  }

  return { init };
})();
