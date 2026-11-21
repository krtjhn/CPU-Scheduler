const assert = require('assert');
const {
  runFCFS,
  runSJF_NP,
  runSJF_P,
  runPriority_NP,
  runPriority_P,
  runRoundRobin,
} = require('../js/algorithms');

console.log('Running CPU Scheduler Algorithm Unit Tests...\n');

{
  const procs = [
    { pid: 1, at: 0, bt: 4, priority: 1 },
    { pid: 2, at: 6, bt: 3, priority: 2 },
    { pid: 3, at: 7, bt: 1, priority: 3 },
  ];
  const res = runFCFS(procs);
  assert.strictEqual(res.rows[0].ct, 4, 'FCFS P1 CT');
  assert.strictEqual(res.rows[1].ct, 9, 'FCFS P2 CT');
  assert.strictEqual(res.rows[2].ct, 10, 'FCFS P3 CT');
  assert.strictEqual(res.segments.length, 4, 'FCFS segments count with idle gap');
  assert.strictEqual(res.segments[1].pid, -1, 'FCFS Idle segment detected');
  assert.strictEqual(res.segments[1].start, 4);
  assert.strictEqual(res.segments[1].end, 6);
  console.log('[PASS] FCFS with Idle Gap passed');
}

{
  const procs = [
    { pid: 1, at: 0, bt: 7, priority: 1 },
    { pid: 2, at: 2, bt: 4, priority: 1 },
    { pid: 3, at: 4, bt: 1, priority: 1 },
    { pid: 4, at: 5, bt: 4, priority: 1 },
  ];
  const res = runSJF_NP(procs);
  assert.strictEqual(res.rows[0].ct, 7, 'SJF-NP P1 CT');
  assert.strictEqual(res.rows[2].ct, 8, 'SJF-NP P3 CT');
  assert.strictEqual(res.rows[1].ct, 12, 'SJF-NP P2 CT');
  assert.strictEqual(res.rows[3].ct, 16, 'SJF-NP P4 CT');
  console.log('[PASS] SJF Non-Preemptive (with tie-breaking) passed');
}

{
  const procs = [
    { pid: 1, at: 0, bt: 8, priority: 1 },
    { pid: 2, at: 1, bt: 4, priority: 1 },
    { pid: 3, at: 2, bt: 9, priority: 1 },
    { pid: 4, at: 3, bt: 5, priority: 1 },
  ];
  const res = runSJF_P(procs);
  assert.strictEqual(res.rows[1].ct, 5, 'SRTF P2 CT');
  assert.strictEqual(res.rows[3].ct, 10, 'SRTF P4 CT');
  assert.strictEqual(res.rows[0].ct, 17, 'SRTF P1 CT');
  assert.strictEqual(res.rows[2].ct, 26, 'SRTF P3 CT');
  console.log('[PASS] SJF Preemptive (SRTF) passed');
}

{
  const procs = [
    { pid: 1, at: 0, bt: 4, priority: 2 },
    { pid: 2, at: 1, bt: 3, priority: 5 },
    { pid: 3, at: 2, bt: 5, priority: 1 },
  ];
  const res = runPriority_NP(procs, 1);
  assert.strictEqual(res.rows[0].ct, 4, 'Priority-NP P1 CT');
  assert.strictEqual(res.rows[1].ct, 7, 'Priority-NP P2 CT');
  assert.strictEqual(res.rows[2].ct, 12, 'Priority-NP P3 CT');
  console.log('[PASS] Priority Non-Preemptive (Higher=1) passed');
}

{
  const procs = [
    { pid: 1, at: 0, bt: 4, priority: 3 },
    { pid: 2, at: 1, bt: 2, priority: 1 },
  ];
  const res = runPriority_P(procs, 2);
  assert.strictEqual(res.rows[1].ct, 3, 'Priority-P P2 CT');
  assert.strictEqual(res.rows[0].ct, 6, 'Priority-P P1 CT');
  console.log('[PASS] Priority Preemptive (Lower=2) passed');
}

{
  const procs = [
    { pid: 1, at: 0, bt: 5, priority: 1 },
    { pid: 2, at: 1, bt: 3, priority: 1 },
    { pid: 3, at: 2, bt: 1, priority: 1 },
  ];
  const res = runRoundRobin(procs, 2);
  assert.strictEqual(res.rows[2].ct, 5, 'RR P3 CT');
  assert.strictEqual(res.rows[1].ct, 8, 'RR P2 CT');
  assert.strictEqual(res.rows[0].ct, 9, 'RR P1 CT');
  console.log('[PASS] Round Robin (QT=2) passed');
}

console.log('\nAll Algorithm Tests Passed Successfully (6/6).');
