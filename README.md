<h1 align="center">CPU Scheduler Simulator</h1>

<p align="center">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black" alt="JavaScript" height="20" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS" height="20" />
  <img src="https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white" alt="HTML5" height="20" />
  <img src="https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=white" alt="Node.js" height="20" />
</p>

An architectural reference implementation and educational simulation suite for Operating System CPU scheduling algorithms. Built with vanilla JavaScript, modern CSS, and automated unit testing, adhering to academic scheduling definitions and deterministic state machine specifications.

---

## Table of Contents

1. [Overview and Objectives](#overview-and-objectives)
2. [Fundamental Concepts and Metrics](#fundamental-concepts-and-metrics)
3. [Scheduling Algorithms Logic](#scheduling-algorithms-logic)
   - [First-Come, First-Served (FCFS)](#first-come-first-served-fcfs)
   - [Shortest Job First - Non-Preemptive (SJF NP)](#shortest-job-first---non-preemptive-sjf-np)
   - [Shortest Remaining Time First (SJF Preemptive / SRTF)](#shortest-remaining-time-first-sjf-preemptive--srtf)
   - [Priority Scheduling - Non-Preemptive](#priority-scheduling---non-preemptive)
   - [Priority Scheduling - Preemptive](#priority-scheduling---preemptive)
   - [Round Robin (RR)](#round-robin-rr)
4. [Deterministic Tie-Breaking Rules](#deterministic-tie-breaking-rules)
5. [Mathematical Formulas](#mathematical-formulas)

---

## Overview and Objectives

In multiprogrammed operating systems, the Central Processing Unit (CPU) is the primary computing resource. CPU scheduling is the process by which the operating system kernel (specifically the short-term scheduler or CPU dispatcher) selects an executable process from the ready queue and allocates the CPU core to it.

The primary objectives of CPU scheduling include:

- **CPU Utilization:** Keeping the CPU core as busy as possible (theoretically 100% in compute-bound environments).
- **Throughput:** Maximizing the number of processes completed per unit time.
- **Turnaround Time:** Minimizing the total elapsed duration from process submission to complete termination.
- **Waiting Time:** Minimizing the cumulative amount of time a process spends idle in the ready queue.
- **Response Time:** Minimizing the latency between job arrival and its first scheduled execution.
- **Fairness:** Ensuring every process obtains an equitable share of the processor without indefinite starvation.

---

## Fundamental Concepts and Metrics

| Parameter | Identifier | Definition |
| :--- | :--- | :--- |
| **Process Identifier** | `PID` | Unique positive integer assigned to each process (e.g., P1, P2, P3). |
| **Arrival Time** | `AT` | The clock time at which a process enters the ready queue. |
| **Burst Time** | `BT` | Total CPU execution time required by the process to complete. |
| **Priority** | `Priority` | Numerical priority rank assigned to a process. |
| **Start Time** | `ST` | The clock time at which the process is dispatched to the CPU for the first time. |
| **Completion Time** | `CT` | The clock time at which the process finishes its total required burst time. |
| **Turnaround Time** | `TAT` | Total elapsed duration spent in the system: `TAT = CT - AT`. |
| **Waiting Time** | `WT` | Total duration spent waiting inside the ready queue: `WT = TAT - BT`. |
| **Response Time** | `RT` | Time elapsed from arrival until first execution: `RT = ST - AT`. |
| **CPU Utilization** | `Util` | Ratio of active execution time to total schedule duration: `(Sum(BT) / Total Time) * 100`. |
| **CPU Idle** | `IDLE` | Time intervals during which no arrived process is available in the ready queue. |

---

## Scheduling Algorithms Logic

### First-Come, First-Served (FCFS)

#### Mechanism
FCFS is a non-preemptive algorithm that allocates the CPU to processes in strict chronological order of their arrival in the ready queue (First-In, First-Out queue model). Once a process gains control of the processor, it retains execution until its entire burst time is exhausted.

#### Algorithmic Procedure
1. Sort all processes primarily by Arrival Time (`AT`) ascending. If arrival times are identical, sort secondarily by Process ID (`PID`) ascending.
2. Initialize `current_time = 0`.
3. For each process in sorted order:
   - If `current_time < AT`, record an `IDLE` segment from `current_time` to `AT`, then advance `current_time = AT`.
   - Record `ST = current_time`.
   - Compute `CT = current_time + BT`.
   - Advance `current_time = CT`.
4. Calculate `TAT`, `WT`, and `RT` for all processes.

#### Behavioral Characteristics
- **Convoy Effect:** If a compute-heavy process with an extensive burst time arrives first, subsequent short I/O-bound processes are blocked behind it, resulting in high average waiting times.
- **Deterministic:** Non-preemptive and free of starvation, as every arrived process is guaranteed to run eventually in arrival sequence.

---

### Shortest Job First - Non-Preemptive (SJF NP)

#### Mechanism
SJF Non-Preemptive selects the process with the smallest burst time from the set of arrived processes in the ready queue. Once scheduled, the process executes uninterrupted to completion.

#### Algorithmic Procedure
1. Initialize `completed_count = 0` and `current_time = 0`.
2. While `completed_count < N`:
   - Inspect all uncompleted processes where `AT <= current_time`.
   - Select the candidate with the minimum `BT`.
   - If multiple candidates share the identical minimum `BT`, apply tie-breaking: choose the process with the earlier `AT`; if still tied, choose the lower `PID`.
   - If no process has arrived (`ready queue is empty`):
     - Identify the earliest arrival time among remaining uncompleted processes (`next_at`).
     - Record an `IDLE` segment from `current_time` to `next_at`.
     - Update `current_time = next_at` and restart evaluation.
   - Dispatch the selected process:
     - `ST = current_time`
     - `CT = current_time + BT`
     - Mark process as completed and increment `completed_count`.
     - Update `current_time = CT`.

#### Behavioral Characteristics
- **Optimality:** Provably minimizes average waiting time among all non-preemptive algorithms for a fixed set of processes available at the same time.
- **Starvation Risk:** Continuous arrival of short jobs will indefinitely delay long jobs.

---

### Shortest Remaining Time First (SJF Preemptive / SRTF)

#### Mechanism
SRTF is the preemptive variant of SJF. At every unit clock tick or whenever a new process arrives, the remaining burst time of the currently executing process is compared with the burst times of all other available processes in the ready queue. If a newly arrived job requires less remaining time to complete than the current running process has remaining, the current job is preempted and returned to the ready queue.

#### Algorithmic Procedure
1. Initialize `remaining_bt[i] = BT[i]` for all processes.
2. Initialize `completed_count = 0`, `current_time = 0`, and `last_pid = -1`.
3. While `completed_count < N`:
   - Identify all processes where `AT <= current_time` and `remaining_bt > 0`.
   - Select the candidate with the smallest `remaining_bt`.
   - Resolve ties by earliest `AT`, then lowest `PID`.
   - If no process is ready:
     - Record `IDLE` state at `current_time` if previous state was active.
     - Increment `current_time++` and continue.
   - If a valid process is selected:
     - If the process is executing for the first time (`remaining_bt == BT`), record `ST = current_time`.
     - Decrement `remaining_bt[selected]--`.
     - Record timeline segment for the executing process.
     - Increment `current_time++`.
     - If `remaining_bt[selected] == 0`:
       - Record `CT = current_time`.
       - Compute `TAT = CT - AT`, `WT = TAT - BT`, and `RT = ST - AT`.
       - Increment `completed_count++`.

#### Behavioral Characteristics
- Achieves the lowest theoretical average waiting time across all scheduling algorithms.
- Incurs runtime overhead due to frequent context switches whenever preemption occurs.

---

### Priority Scheduling - Non-Preemptive

#### Mechanism
Each process is assigned an integer priority rank. When the CPU becomes idle, the dispatcher selects the ready process with the highest priority rank. The process runs to completion without interruption.

The simulator supports two standard priority interpretation modes:
- **Mode 1 (Higher Number = Higher Priority):** Priority value 5 takes precedence over priority value 2.
- **Mode 2 (Lower Number = Higher Priority):** Priority value 1 takes precedence over priority value 4 (Unix standard convention).

#### Algorithmic Procedure
1. Initialize `completed_count = 0` and `current_time = 0`.
2. While `completed_count < N`:
   - Filter all uncompleted processes where `AT <= current_time`.
   - Evaluate priority according to the selected mode (maximum or minimum integer).
   - If multiple processes share identical top priority:
     - Select earlier `AT`.
     - If `AT` is also identical, select lower `PID`.
   - If the ready queue is empty, advance `current_time` to the next earliest uncompleted `AT` and insert an `IDLE` segment.
   - Dispatch the selected process to completion:
     - `ST = current_time`
     - `CT = current_time + BT`
     - Mark process as completed and update `current_time = CT`.

---

### Priority Scheduling - Preemptive

#### Mechanism
Preemptive Priority scheduling compares the priority of the currently running process with newly arrived ready jobs. If an arriving process has a higher priority than the currently active process, the running job is preempted immediately and returned to the ready queue.

#### Algorithmic Procedure
1. Initialize `remaining_bt[i] = BT[i]` and `ST[i] = -1` for all processes.
2. Initialize `current_time = 0` and `completed_count = 0`.
3. At each time tick `current_time`:
   - Find all arrived processes (`AT <= current_time`) with `remaining_bt > 0`.
   - Pick the process with highest priority rank under the active priority rule.
   - Resolve ties by earlier `AT`, then lower `PID`.
   - If the selected process differs from the previous tick, a context switch occurs.
   - If `ST` has not been set for this process, record `ST = current_time`.
   - Execute for 1 unit: decrement `remaining_bt[selected]--` and advance `current_time++`.
   - If `remaining_bt[selected] == 0`:
     - Set `CT = current_time`.
     - Calculate `TAT = CT - AT` and `WT = TAT - BT`.
     - Increment `completed_count++`.

---

### Round Robin (RR)

#### Mechanism
Round Robin is a preemptive scheduling algorithm tailored for time-sharing systems. The CPU is allocated to ready processes in a circular First-In, First-Out sequence for a fixed slice of execution time known as the **Time Quantum** (`QT`).

If a process finishes its burst within the quantum, it releases the CPU immediately. If its burst exceeds the quantum, the process is preempted at the quantum boundary and appended to the tail of the ready queue.

#### Ready Queue Ordering Specification
To prevent race conditions and maintain strict deterministic behavior when jobs arrive simultaneously with quantum expirations:
1. **New Arrivals First:** Any process arriving at clock time `t` (`AT <= t`) is enqueued into the ready queue *before* an interrupted process that completed its quantum slice at time `t` is re-enqueued.
2. **Preempted Job Re-enqueue:** The preempted process is placed at the back of the queue behind all newly arrived processes.

#### Algorithmic Procedure
1. Initialize `remaining_bt = copy(BT)`, `ST = -1`, `CT = 0`, `current_time = 0`.
2. Initialize an explicit FIFO queue `Q = []` and tracking array `enqueued = [false]`.
3. Check and enqueue all processes where `AT <= current_time` in order of arrival.
4. While uncompleted processes remain:
   - If `Q` is empty:
     - Determine the next earliest `AT` among remaining processes.
     - Append an `IDLE` block from `current_time` to `next_at`.
     - Advance `current_time = next_at`.
     - Enqueue all processes arriving at `current_time`.
     - Continue loop.
   - Dequeue the front process index `idx`.
   - If `ST[idx] == -1`, record `ST[idx] = current_time`.
   - Determine execution slice: `slice = min(QT, remaining_bt[idx])`.
   - Advance `current_time += slice` and decrement `remaining_bt[idx] -= slice`.
   - Check all processes not yet enqueued: if `AT <= current_time`, enqueue them into `Q`.
   - If `remaining_bt[idx] > 0`:
     - Re-enqueue `idx` to the tail of `Q`.
   - Else:
     - Process completed: `CT[idx] = current_time`.
     - Calculate `TAT[idx] = CT[idx] - AT[idx]` and `WT[idx] = TAT[idx] - BT[idx]`.
     - Increment completed counter.

---

## Deterministic Tie-Breaking Rules

When multiple processes satisfy identical scheduling criteria (e.g., identical burst times in SJF or identical priority ranks in Priority scheduling), ties are resolved using a two-tier deterministic rule:

1. **Primary Tie-Breaker: Earlier Arrival Time (`AT`)**
   The process that entered the ready queue earlier is dispatched first.
2. **Secondary Tie-Breaker: Lower Process ID (`PID`)**
   If arrival times are also identical, the process with the smaller numeric identifier is dispatched first (e.g., P1 before P2).

---

## Mathematical Formulas

### Turnaround Time (TAT)
Total elapsed time between process arrival and final completion:
```
TAT = CT - AT
```

### Waiting Time (WT)
Total duration spent waiting in the ready queue without CPU allocation:
```
WT = TAT - BT
```

### Response Time (RT)
Time between process arrival and its first scheduled execution on the CPU:
```
RT = First_Execution_Time - AT
```

### Average Turnaround Time
Arithmetic mean across all N processes:
```
Average TAT = (Sum of all TAT) / N
```

### Average Waiting Time
Arithmetic mean across all N processes:
```
Average WT = (Sum of all WT) / N
```

### CPU Utilization Percentage
Percentage of total elapsed schedule time during which the CPU was actively executing processes:
```
CPU Utilization (%) = (Sum of all BT / Total Schedule Duration) * 100
```
