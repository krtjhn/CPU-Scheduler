(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.CPUScheduler = root.CPUScheduler || {};
    root.CPUScheduler.Algorithms = root.CPUScheduler.Algorithms || {};
    root.CPUScheduler.Algorithms.runFCFS = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  return function runFCFS(processes) {
    const n = processes.length;
    const pid = processes.map((p) => p.pid);
    const at = processes.map((p) => p.at);
    const bt = processes.map((p) => p.bt);

    const s_pid = [...pid];
    const s_at = [...at];
    const s_bt = [...bt];

    let sum_bt = 0;
    for (let i = 0; i < n; i++) sum_bt += bt[i];

    for (let i = 0; i < n - 1; i++) {
      for (let j = i + 1; j < n; j++) {
        if (s_at[j] < s_at[i] || (s_at[j] === s_at[i] && s_pid[j] < s_pid[i])) {
          let t;
          t = s_at[i]; s_at[i] = s_at[j]; s_at[j] = t;
          t = s_bt[i]; s_bt[i] = s_bt[j]; s_bt[j] = t;
          t = s_pid[i]; s_pid[i] = s_pid[j]; s_pid[j] = t;
        }
      }
    }

    const st = new Array(n).fill(0);
    const ct = new Array(n).fill(0);
    const tat = new Array(n).fill(0);
    const wt = new Array(n).fill(0);
    const rt = new Array(n).fill(0);
    const segments = [];

    let current_time = 0;
    for (let i = 0; i < n; i++) {
      const idx = s_pid[i] - 1;
      if (current_time < s_at[i]) {
        segments.push({ pid: -1, start: current_time, end: s_at[i] });
        current_time = s_at[i];
      }
      st[idx] = current_time;
      ct[idx] = st[idx] + s_bt[i];
      segments.push({ pid: s_pid[i], start: st[idx], end: ct[idx] });
      current_time = ct[idx];
    }

    let total_wt = 0, total_tat = 0;
    for (let i = 0; i < n; i++) {
      tat[i] = ct[i] - at[i];
      wt[i] = tat[i] - bt[i];
      rt[i] = st[i] - at[i];
      total_wt += wt[i];
      total_tat += tat[i];
    }

    return {
      hasPriority: false,
      rows: pid.map((p, i) => ({
        pid: p, at: at[i], bt: bt[i], ct: ct[i], rt: rt[i], tat: tat[i], wt: wt[i],
      })),
      segments,
      avg_tat: Math.floor((total_tat / n) * 100) / 100,
      avg_wt: Math.floor((total_wt / n) * 100) / 100,
      cpu_util: current_time > 0 ? (sum_bt / current_time) * 100 : 0,
    };
  };
});
