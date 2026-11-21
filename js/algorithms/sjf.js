(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.CPUScheduler = root.CPUScheduler || {};
    root.CPUScheduler.Algorithms = root.CPUScheduler.Algorithms || {};
    const algos = factory();
    root.CPUScheduler.Algorithms.runSJF_NP = algos.runSJF_NP;
    root.CPUScheduler.Algorithms.runSJF_P = algos.runSJF_P;
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  function runSJF_NP(processes) {
    const n = processes.length;
    const pid = processes.map((p) => p.pid);
    const at = processes.map((p) => p.at);
    const bt = processes.map((p) => p.bt);
    const st = new Array(n).fill(0);
    const ct = new Array(n).fill(0);
    const tat = new Array(n).fill(0);
    const wt = new Array(n).fill(0);
    const rt = new Array(n).fill(0);
    const completed = new Array(n).fill(false);

    let sum_bt = 0;
    for (let i = 0; i < n; i++) sum_bt += bt[i];

    let completed_count = 0;
    let current_time = 0;
    let total_wt = 0, total_tat = 0;
    const segments = [];

    while (completed_count < n) {
      let idx = -1;
      let min_bt = Infinity;

      for (let i = 0; i < n; i++) {
        if (!completed[i] && at[i] <= current_time) {
          if (idx === -1) {
            idx = i;
            min_bt = bt[i];
          } else if (bt[i] < min_bt) {
            min_bt = bt[i];
            idx = i;
          } else if (bt[i] === min_bt) {
            if (at[i] < at[idx]) {
              idx = i;
            } else if (at[i] === at[idx]) {
              if (pid[i] < pid[idx]) idx = i;
            }
          }
        }
      }

      if (idx === -1) {
        let next_at = Infinity;
        for (let i = 0; i < n; i++) {
          if (!completed[i] && at[i] < next_at) next_at = at[i];
        }
        segments.push({ pid: -1, start: current_time, end: next_at });
        current_time = next_at;
        continue;
      }

      st[idx] = current_time;
      ct[idx] = st[idx] + bt[idx];
      tat[idx] = ct[idx] - at[idx];
      wt[idx] = tat[idx] - bt[idx];
      rt[idx] = st[idx] - at[idx];
      total_wt += wt[idx];
      total_tat += tat[idx];
      completed[idx] = true;
      completed_count++;

      segments.push({ pid: pid[idx], start: current_time, end: ct[idx] });
      current_time = ct[idx];
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
  }

  function runSJF_P(processes) {
    const n = processes.length;
    const pid = processes.map((p) => p.pid);
    const at = processes.map((p) => p.at);
    const bt = processes.map((p) => p.bt);
    const remaining = [...bt];
    const st = new Array(n).fill(0);
    const ct = new Array(n).fill(0);
    const tat = new Array(n).fill(0);
    const wt = new Array(n).fill(0);
    const rt = new Array(n).fill(0);

    let sum_bt = 0;
    for (let i = 0; i < n; i++) sum_bt += bt[i];

    let completed = 0;
    let current_time = 0;
    let last_pid = -1;
    const gantt = [];

    while (completed < n) {
      let min_rem = Infinity;
      let idx = -1;
      let found = false;

      for (let i = 0; i < n; i++) {
        if (at[i] <= current_time && remaining[i] > 0) {
          if (idx === -1) {
            min_rem = remaining[i];
            idx = i;
            found = true;
          } else if (
            remaining[i] < min_rem ||
            (remaining[i] === min_rem &&
              (at[i] < at[idx] || (at[i] === at[idx] && pid[i] < pid[idx])))
          ) {
            min_rem = remaining[i];
            idx = i;
            found = true;
          }
        }
      }

      if (found) {
        if (last_pid !== pid[idx]) {
          gantt.push({ pid: pid[idx], start: current_time });
          last_pid = pid[idx];
        }
        if (remaining[idx] === bt[idx]) {
          st[idx] = current_time;
        }
        remaining[idx]--;
        current_time++;
        if (remaining[idx] === 0) {
          ct[idx] = current_time;
          tat[idx] = ct[idx] - at[idx];
          wt[idx] = tat[idx] - bt[idx];
          rt[idx] = st[idx] - at[idx];
          completed++;
        }
      } else {
        if (last_pid !== -1 || gantt.length === 0) {
          gantt.push({ pid: -1, start: current_time });
          last_pid = -1;
        }
        current_time++;
      }
    }

    const segments = gantt.map((seg, k) => ({
      pid: seg.pid,
      start: seg.start,
      end: k < gantt.length - 1 ? gantt[k + 1].start : current_time,
    }));

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
  }

  return {
    runSJF_NP,
    runSJF_P,
  };
});
