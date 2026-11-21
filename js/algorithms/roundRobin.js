(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.CPUScheduler = root.CPUScheduler || {};
    root.CPUScheduler.Algorithms = root.CPUScheduler.Algorithms || {};
    root.CPUScheduler.Algorithms.runRoundRobin = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  return function runRoundRobin(processes, qt) {
    const n = processes.length;
    const pid = processes.map((p) => p.pid);
    const at = processes.map((p) => p.at);
    const bt = processes.map((p) => p.bt);
    const remaining = [...bt];
    const st = new Array(n).fill(-1.0);
    const ct = new Array(n).fill(0.0);
    const tat = new Array(n).fill(0.0);
    const wt = new Array(n).fill(0.0);
    const rt = new Array(n).fill(0.0);
    const seen = new Array(n).fill(false);

    let sum_bt = 0;
    for (let i = 0; i < n; i++) sum_bt += bt[i];

    let completed = 0;
    let current_time = 0.0;
    let last_pid = -2;
    const segments = [];
    const q = [];
    let qf = 0;

    for (let i = 0; i < n; i++) {
      if (!seen[i] && at[i] <= current_time && remaining[i] > 0) {
        q.push(i);
        seen[i] = true;
      }
    }

    while (completed < n) {
      if (qf === q.length) {
        let next_at = Infinity;
        let next_idx = -1;
        for (let i = 0; i < n; i++) {
          if (remaining[i] > 0 && at[i] < next_at && at[i] > current_time) {
            next_at = at[i];
            next_idx = i;
          }
        }
        if (next_idx === -1) break;
        if (last_pid !== -1 && segments.length > 0) {
          segments[segments.length - 1].end = current_time;
        }
        segments.push({ pid: -1, start: current_time, end: next_at });
        last_pid = -1;
        current_time = next_at;
        for (let i = 0; i < n; i++) {
          if (!seen[i] && remaining[i] > 0 && at[i] <= current_time) {
            q.push(i);
            seen[i] = true;
          }
        }
        continue;
      }

      const idx = q[qf++];

      if (last_pid !== pid[idx]) {
        if (last_pid !== -2 && segments.length > 0) {
          segments[segments.length - 1].end = current_time;
        }
        segments.push({ pid: pid[idx], start: current_time, end: current_time });
        last_pid = pid[idx];
      }

      if (st[idx] < 0.0) {
        st[idx] = current_time;
      }

      const slice = Math.min(qt, remaining[idx]);
      current_time += slice;
      remaining[idx] -= slice;
      if (remaining[idx] < 1e-6) remaining[idx] = 0.0;

      for (let i = 0; i < n; i++) {
        if (!seen[i] && remaining[i] > 0 && at[i] <= current_time) {
          q.push(i);
          seen[i] = true;
        }
      }

      if (remaining[idx] > 0.0) {
        q.push(idx);
      } else {
        ct[idx] = current_time;
        tat[idx] = ct[idx] - at[idx];
        wt[idx] = tat[idx] - bt[idx];
        rt[idx] = st[idx] - at[idx];
        completed++;
      }
    }

    if (segments.length > 0) {
      segments[segments.length - 1].end = current_time;
    }

    let total_wt = 0, total_tat = 0;
    for (let i = 0; i < n; i++) {
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
