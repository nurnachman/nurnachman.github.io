/* audio.js */
window.AudioEngine = (function () {
  let ctx = null;
  const buffers = new Map();
  const reversedCache = new Map();
  const padStops = new Map();
  const activePlaybacks = new Map();
  const clock = {
    enabled: false,
    bpm: 120,
    parts: 4,
    origin: null,
  };

  function ensureContext() {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    return ctx;
  }

  function setClock(enabled, bpm, parts) {
    const audioCtx = ensureContext();
    clock.bpm = Math.max(40, Math.min(300, Number(bpm) || 120));
    clock.parts = Math.max(1, Math.min(8, Number(parts) || 4));
    if (enabled && !clock.enabled) {
      clock.origin = audioCtx.currentTime;
    } else if (!enabled) {
      clock.origin = null;
    }
    clock.enabled = !!enabled;
  }

  function getScheduledTime() {
    const audioCtx = ensureContext();
    if (!clock.enabled || clock.origin === null) return audioCtx.currentTime;

    const interval = 60 / clock.bpm / clock.parts;
    const elapsed = Math.max(0, audioCtx.currentTime - clock.origin);
    const nextPart = Math.floor(elapsed / interval) + 1;
    return clock.origin + nextPart * interval;
  }

  function getClockState() {
    if (!ctx || !clock.enabled || clock.origin === null) {
      return { enabled: false, phase: 0, bpm: clock.bpm, parts: clock.parts };
    }
    const interval = 60 / clock.bpm / clock.parts;
    const elapsed = Math.max(0, ctx.currentTime - clock.origin);
    return {
      enabled: true,
      phase: (elapsed % interval) / interval,
      bpm: clock.bpm,
      parts: clock.parts,
    };
  }

  async function decodeBlob(blob) {
    const arrayBuffer = await blob.arrayBuffer();
    const audioCtx = ensureContext();
    return new Promise((resolve, reject) => {
      audioCtx.decodeAudioData(arrayBuffer.slice(0), resolve, reject);
    });
  }

  async function loadPadSample(padId, blob) {
    try {
      const buf = await decodeBlob(blob);
      buffers.set(padId, buf);
      reversedCache.delete(padId);
      return { ok: true, scheduledAt: now, delay: Math.max(0, now - audioCtx.currentTime) };
    } catch (err) {
      return { ok: false, error: err };
    }
  }

  function hasBuffer(padId) {
    return buffers.has(padId);
  }

  function clearPadSample(padId) {
    stopPad(padId);
    buffers.delete(padId);
    reversedCache.delete(padId);
  }

  function getBuffer(padId) {
    return buffers.get(padId);
  }

  function getReversedBuffer(padId) {
    if (reversedCache.has(padId)) return reversedCache.get(padId);
    const src = buffers.get(padId);
    if (!src) return null;
    const audioCtx = ensureContext();
    const rev = audioCtx.createBuffer(src.numberOfChannels, src.length, src.sampleRate);
    for (let ch = 0; ch < src.numberOfChannels; ch++) {
      const srcData = src.getChannelData(ch);
      const revData = rev.getChannelData(ch);
      for (let i = 0; i < srcData.length; i++) {
        revData[i] = srcData[srcData.length - 1 - i];
      }
    }
    reversedCache.set(padId, rev);
    return rev;
  }

  function mapRange(v, outMin, outMax) {
    const t = Math.max(0, Math.min(100, v)) / 100;
    return outMin + t * (outMax - outMin);
  }

  function logMap(v, outMin, outMax) {
    const t = Math.max(0, Math.min(100, v)) / 100;
    return Math.exp(Math.log(outMin) + t * (Math.log(outMax) - Math.log(outMin)));
  }

  function makeImpulse(audioCtx, size, decay) {
    const duration = mapRange(size, 0.15, 3.0);
    const decayPower = mapRange(decay, 0.5, 6);
    const length = Math.max(1, Math.floor(audioCtx.sampleRate * duration));
    const impulse = audioCtx.createBuffer(2, length, audioCtx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const data = impulse.getChannelData(ch);
      for (let i = 0; i < length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decayPower);
      }
    }
    return impulse;
  }

  function makeBitcrushCurve(bits) {
    const steps = Math.max(2, Math.pow(2, Math.round(mapRange(bits, 2, 16))));
    const curve = new Float32Array(1024);
    for (let i = 0; i < 1024; i++) {
      const x = (i / 1023) * 2 - 1;
      curve[i] = Math.round(x * steps) / steps;
    }
    return curve;
  }

  function stopPad(padId) {
    if (padStops.has(padId)) {
      padStops.get(padId).forEach(fn => fn());
      padStops.get(padId).clear();
    }
    if (activePlaybacks.has(padId)) {
      activePlaybacks.get(padId).clear();
    }
  }

  function stopAll() {
    for (const stops of padStops.values()) {
      stops.forEach(fn => fn());
      stops.clear();
    }
    for (const tracks of activePlaybacks.values()) {
      tracks.clear();
    }
  }

  function getProgress(padId) {
    if (!ctx || !activePlaybacks.has(padId)) return -1;
    const playbacks = activePlaybacks.get(padId);
    if (playbacks.size === 0) return -1;
    
    let latest = null;
    for (const pb of playbacks) {
      if (!latest || pb.start > latest.start) {
        latest = pb;
      }
    }
    
    if (!latest) return -1;
    const elapsed = ctx.currentTime - latest.start;
    if (elapsed < 0) return -1;
    if (elapsed >= latest.duration) return -1;
    
    const t = elapsed / latest.duration;
    return latest.startRatio + t * (latest.endRatio - latest.startRatio);
  }

  function applyFilter(type, p1, p2, p3, src, audioCtx, localMaster, now, startOffset, playDur) {
    const dry = audioCtx.createGain();
    const wet = audioCtx.createGain();
    const mix = mapRange(p3, 0, 1);
    dry.gain.value = 1 - mix;
    wet.gain.value = mix;

    const filter = audioCtx.createBiquadFilter();
    filter.type = type;
    filter.frequency.value = logMap(p1, 20, 20000);

    if (type === 'lowpass' || type === 'highpass') {
      filter.Q.value = mapRange(p2, 0.0001, 20);
    } else {
      filter.Q.value = mapRange(p2, 0.1, 50);
    }

    src.connect(dry); dry.connect(localMaster);
    src.connect(filter); filter.connect(wet); wet.connect(localMaster);
    src.start(now, startOffset, playDur);
  }

  function playPad(padId, padState) {
    const audioCtx = ensureContext();
    const buffer = buffers.get(padId);
    if (!buffer) return { ok: false, reason: 'empty' };

    if (padState.playback === 'Restart') {
      stopPad(padId);
    }

    const behavior = padState.behavior || 'None';
    const p1 = padState.param1 || 0;
    const p2 = padState.param2 || 0;
    const p3 = padState.param3 || 0;

    const startRatio = (padState.start !== undefined ? padState.start : 0) / 100;
    const endRatio = (padState.end !== undefined ? padState.end : 100) / 100;
    const actualStart = Math.min(startRatio, endRatio) * buffer.duration;
    let actualEnd = Math.max(startRatio, endRatio) * buffer.duration;
    
    if (actualStart === actualEnd) actualEnd = buffer.duration; // Fallback so we hear something
    const playDuration = actualEnd - actualStart;

    let speed = 1.0;
    if (behavior === 'Stretch') {
      speed = Math.pow(2, mapRange(p1, -2, 2));
    }

    const now = clock.enabled ? getScheduledTime() : audioCtx.currentTime;
    const actualDuration = (behavior === 'Stretch') ? playDuration / speed : playDuration;

    const localMaster = audioCtx.createGain();
    localMaster.gain.value = mapRange(padState.volume != null ? padState.volume : 100, 0, 1);
    localMaster.connect(audioCtx.destination);
    
    const stopFn = () => {
      try {
        localMaster.gain.value = 0;
        localMaster.disconnect();
      } catch (e) {}
    };

    if (!padStops.has(padId)) padStops.set(padId, new Set());
    padStops.get(padId).add(stopFn);

    const pb = { 
      start: now, 
      duration: actualDuration, 
      startRatio: Math.min(startRatio, endRatio), 
      endRatio: Math.max(startRatio, endRatio) 
    };
    if (!activePlaybacks.has(padId)) activePlaybacks.set(padId, new Set());
    activePlaybacks.get(padId).add(pb);

    setTimeout(() => {
      if (padStops.has(padId)) padStops.get(padId).delete(stopFn);
      if (activePlaybacks.has(padId)) activePlaybacks.get(padId).delete(pb);
    }, Math.max(0, now - audioCtx.currentTime) * 1000 + actualDuration * 1000 + 100);

    try {
      const src = audioCtx.createBufferSource();
      src.buffer = buffer;

      switch (behavior) {
        case 'Delay': {
          const dry = audioCtx.createGain();
          const wet = audioCtx.createGain();
          const mix = mapRange(p3, 0, 1);
          dry.gain.value = 1 - mix;
          wet.gain.value = mix;
          const delay = audioCtx.createDelay(2.0);
          delay.delayTime.value = mapRange(p2, 0.01, 1.0);
          const feedback = audioCtx.createGain();
          feedback.gain.value = mapRange(p1, 0, 0.9);
          src.connect(dry); dry.connect(localMaster);
          src.connect(delay);
          delay.connect(feedback); feedback.connect(delay);
          delay.connect(wet); wet.connect(localMaster);
          src.start(now, actualStart, playDuration);
          break;
        }
        case 'Reverb': {
          const dry = audioCtx.createGain();
          const wet = audioCtx.createGain();
          const mix = mapRange(p3, 0, 1);
          dry.gain.value = 1 - mix;
          wet.gain.value = mix;
          const convolver = audioCtx.createConvolver();
          convolver.buffer = makeImpulse(audioCtx, p1, p2);
          src.connect(dry); dry.connect(localMaster);
          src.connect(convolver); convolver.connect(wet); wet.connect(localMaster);
          src.start(now, actualStart, playDuration);
          break;
        }
        case 'Lowpass': 
          applyFilter('lowpass', p1, p2, p3, src, audioCtx, localMaster, now, actualStart, playDuration); 
          break;
        case 'Highpass': 
          applyFilter('highpass', p1, p2, p3, src, audioCtx, localMaster, now, actualStart, playDuration); 
          break;
        case 'Bandpass': 
          applyFilter('bandpass', p1, p2, p3, src, audioCtx, localMaster, now, actualStart, playDuration); 
          break;
        case 'Reverse': {
          const revBuf = getReversedBuffer(padId);
          const revStartOffset = revBuf.duration - actualEnd;
          const windowT = Math.min(mapRange(p1, 0.05, revBuf.duration), playDuration);
          const fadeT = mapRange(p2, 0.0, Math.min(0.5, windowT / 2));
          const mix = mapRange(p3, 0, 1);

          const dry = audioCtx.createGain();
          dry.gain.value = 1 - mix;
          src.connect(dry); dry.connect(localMaster);
          src.start(now, actualStart, playDuration);

          const revSrc = audioCtx.createBufferSource();
          revSrc.buffer = revBuf;
          const env = audioCtx.createGain();
          env.gain.setValueAtTime(0, now);
          env.gain.linearRampToValueAtTime(mix, now + fadeT);
          env.gain.setValueAtTime(mix, now + Math.max(fadeT, windowT - fadeT));
          env.gain.linearRampToValueAtTime(0, now + windowT);
          revSrc.connect(env); env.connect(localMaster);
          revSrc.start(now, revStartOffset, windowT);
          break;
        }
        case 'Stretch': {
          const dry = audioCtx.createGain();
          const wet = audioCtx.createGain();
          const mix = mapRange(p3, 0, 1);
          dry.gain.value = 1 - mix;
          wet.gain.value = mix;

          const drySrc = audioCtx.createBufferSource();
          drySrc.buffer = buffer;
          drySrc.connect(dry); dry.connect(localMaster);
          drySrc.start(now, actualStart, playDuration);

          src.playbackRate.value = speed;
          src.detune.value = mapRange(p2, -2400, 2400);
          src.preservesPitch = true;
          src.connect(wet); wet.connect(localMaster);
          src.start(now, actualStart, playDuration);
          break;
        }
        case 'Bit Crush': {
          const dry = audioCtx.createGain();
          const wet = audioCtx.createGain();
          const mix = mapRange(p3, 0, 1);
          dry.gain.value = 1 - mix;
          wet.gain.value = mix;
          const shaper = audioCtx.createWaveShaper();
          shaper.curve = makeBitcrushCurve(p1);
          const rateReduce = audioCtx.createBiquadFilter();
          rateReduce.type = 'lowpass';
          rateReduce.frequency.value = mapRange(100 - p2, 800, 16000);
          src.connect(dry); dry.connect(localMaster);
          src.connect(shaper); shaper.connect(rateReduce); rateReduce.connect(wet); wet.connect(localMaster);
          src.start(now, actualStart, playDuration);
          break;
        }
        case 'Tape Stop': {
          const dry = audioCtx.createGain();
          const wet = audioCtx.createGain();
          const mix = mapRange(p3, 0, 1);
          dry.gain.value = 1 - mix;
          wet.gain.value = mix;

          const drySrc = audioCtx.createBufferSource();
          drySrc.buffer = buffer;
          drySrc.connect(dry); dry.connect(localMaster);
          drySrc.start(now, actualStart, playDuration);

          const length = mapRange(p2, 0.1, 3.0);
          const speedCurve = mapRange(p1, 0.3, 3.0);
          src.connect(wet); wet.connect(localMaster);
          src.playbackRate.setValueAtTime(1, now);
          src.playbackRate.setTargetAtTime(0.001, now, length / (3 * speedCurve));
          src.start(now, actualStart, playDuration);
          src.stop(now + Math.min(length + 0.05, playDuration));
          break;
        }
        case 'Stutter': {
          const dry = audioCtx.createGain();
          const wet = audioCtx.createGain();
          const mix = mapRange(p3, 0, 1);
          dry.gain.value = 1 - mix;
          wet.gain.value = mix;

          const drySrc = audioCtx.createBufferSource();
          drySrc.buffer = buffer;
          drySrc.connect(dry); dry.connect(localMaster);
          drySrc.start(now, actualStart, playDuration);

          const interval = mapRange(p1, 0.03, 0.4);
          const totalLength = mapRange(p2, 0.1, 2.0);
          const sliceLength = Math.min(interval * 0.9, playDuration);
          const repeats = Math.max(1, Math.floor(totalLength / interval));
          wet.connect(localMaster);
          for (let i = 0; i < repeats; i++) {
            const s = audioCtx.createBufferSource();
            s.buffer = buffer;
            s.connect(wet);
            s.start(now + i * interval, actualStart, sliceLength);
          }
          break;
        }
        case 'None':
        default: {
          src.connect(localMaster);
          src.start(now, actualStart, playDuration);
          break;
        }
      }
      return { ok: true };
    } catch (err) {
      console.error('Playback error', err);
      return { ok: false, reason: 'playback', error: err };
    }
  }

  return {
    ensureContext,
    loadPadSample,
    clearPadSample,
    hasBuffer,
    getBuffer,
    playPad,
    stopAll,
    getProgress,
    setClock,
    getClockState,
  };
})();