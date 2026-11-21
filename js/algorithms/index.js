(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    const runFCFS = require('./fcfs');
    const { runSJF_NP, runSJF_P } = require('./sjf');
    const { runPriority_NP, runPriority_P } = require('./priority');
    const runRoundRobin = require('./roundRobin');
    module.exports = factory(runFCFS, runSJF_NP, runSJF_P, runPriority_NP, runPriority_P, runRoundRobin);
  } else {
    root.CPUScheduler = root.CPUScheduler || {};
    root.CPUScheduler.Algorithms = root.CPUScheduler.Algorithms || {};
  }
})(typeof self !== 'undefined' ? self : this, function (runFCFS, runSJF_NP, runSJF_P, runPriority_NP, runPriority_P, runRoundRobin) {
  'use strict';
  return {
    runFCFS,
    runSJF_NP,
    runSJF_P,
    runPriority_NP,
    runPriority_P,
    runRoundRobin,
  };
});
