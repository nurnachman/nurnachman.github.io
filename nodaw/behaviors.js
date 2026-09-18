/* behaviors.js */
window.Behaviors = (function () {
  const LIST = [
    'None',
    'Delay',
    'Reverb',
    'Lowpass',
    'Highpass',
    'Bandpass',
    'Reverse',
    'Stretch',
    'Bit Crush',
    'Tape Stop',
    'Stutter',
  ];

  const PARAM_LABELS = {
    'None': ['Parameter 1', 'Parameter 2', 'Parameter 3'],
    'Delay': ['Feedback', 'Time', 'Mix'],
    'Reverb': ['Size', 'Decay', 'Mix'],
    'Lowpass': ['Cutoff', 'Resonance', 'Mix'],
    'Highpass': ['Cutoff', 'Resonance', 'Mix'],
    'Bandpass': ['Frequency', 'Q', 'Mix'],
    'Reverse': ['Window', 'Fade', 'Mix'],
    'Stretch': ['Speed', 'Detune', 'Mix'],
    'Bit Crush': ['Bits', 'Rate', 'Mix'],
    'Tape Stop': ['Speed', 'Length', 'Mix'],
    'Stutter': ['Rate', 'Length', 'Mix'],
  };

  function next(behavior) {
    const i = LIST.indexOf(behavior);
    return LIST[(i + 1) % LIST.length];
  }

  function prev(behavior) {
    const i = LIST.indexOf(behavior);
    return LIST[(i - 1 + LIST.length) % LIST.length];
  }

  function labelsFor(behavior) {
    return PARAM_LABELS[behavior] || PARAM_LABELS['None'];
  }

  return { LIST, PARAM_LABELS, next, prev, labelsFor };
})();