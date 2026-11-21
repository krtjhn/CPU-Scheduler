(function () {
  'use strict';

  const Utils = window.CPUScheduler?.Utils || {};
  const Algos = window.CPUScheduler?.Algorithms || {};
  const UI = window.CPUScheduler?.UI || {};

  const {
    parseStrictInt,
    parsePositiveFloat,
    formatNum,
    escapeHtml,
    validateInputBox,
    clearValidationStyles,
  } = Utils;

  const state = {
    algo: 'fcfs',
    mode: 'np',
    priorityRule: 1,
    qt: '2',
    rows: [
      { at: '', bt: '', priority: '' },
      { at: '', bt: '', priority: '' },
      { at: '', bt: '', priority: '' },
    ],
  };

  const btnReset = document.getElementById('btn-reset');
  const algoBtns = document.querySelectorAll('.algo-btn');
  const subOptions = document.getElementById('sub-options');
  const optModeGroup = document.getElementById('opt-mode-group');
  const modeBtns = document.querySelectorAll('.mode-btn');
  const optPruleGroup = document.getElementById('opt-prule-group');
  const pruleBtns = document.querySelectorAll('.prule-btn');
  const optQuantumGroup = document.getElementById('opt-quantum-group');
  const inputQt = document.getElementById('input-qt');
  const schedulerForm = document.getElementById('scheduler-form');
  const processBody = document.getElementById('process-body');
  const btnAddRow = document.getElementById('btn-add-row');
  const btnRemoveRow = document.getElementById('btn-remove-row');
  const thPriority = document.getElementById('th-priority');

  const resultsSection = document.getElementById('results-section');
  const exportContainer = document.getElementById('export-container');
  const exportTitle = document.getElementById('export-title');
  const exportSubtitle = document.getElementById('export-subtitle');
  const btnExportImg = document.getElementById('btn-export-img');
  const ganttWrapper = document.getElementById('gantt-wrapper');
  const resHead = document.getElementById('res-head');
  const resBody = document.getElementById('res-body');
  const resFoot = document.getElementById('res-foot');
  const resCpuVal = document.getElementById('res-cpu-val');

  function getAlgorithmTitle() {
    switch (state.algo) {
      case 'fcfs':
        return {
          title: 'FCFS',
          subtitle: 'First-Come, First-Served',
        };
      case 'sjf':
        return {
          title: state.mode === 'p' ? 'SJF (Preemptive)' : 'SJF (Non-Preemptive)',
          subtitle: state.mode === 'p' ? 'Shortest Remaining Time First (SRTF)' : 'Shortest Job First',
        };
      case 'priority': {
        const ruleText = state.priorityRule === 1 ? 'Higher number = High' : 'Lower number = High';
        return {
          title: state.mode === 'p' ? 'Priority (Preemptive)' : 'Priority (Non-Preemptive)',
          subtitle: `Priority Scheduling (${ruleText})`,
        };
      }
      case 'rr':
        return {
          title: 'Round Robin',
          subtitle: `Time Quantum = ${inputQt.value || state.qt}`,
        };
      default:
        return { title: 'CPU Scheduling', subtitle: '' };
    }
  }

  function renderControls() {
    algoBtns.forEach((btn) => {
      const active = btn.dataset.algo === state.algo;
      btn.classList.toggle('bg-slate-900', active);
      btn.classList.toggle('text-white', active);
      btn.classList.toggle('shadow-sm', active);
      btn.classList.toggle('text-slate-800', !active);
    });

    const showMode = state.algo === 'sjf' || state.algo === 'priority';
    const showPriority = state.algo === 'priority';
    const showQuantum = state.algo === 'rr';

    subOptions.classList.toggle('hidden', !(showMode || showPriority || showQuantum));
    optModeGroup.classList.toggle('hidden', !showMode);
    optPruleGroup.classList.toggle('hidden', !showPriority);
    optQuantumGroup.classList.toggle('hidden', !showQuantum);
    thPriority.classList.toggle('hidden', !showPriority);

    modeBtns.forEach((btn) => {
      const active = btn.dataset.mode === state.mode;
      btn.classList.toggle('bg-slate-900', active);
      btn.classList.toggle('text-white', active);
      btn.classList.toggle('shadow-sm', active);
      btn.classList.toggle('text-slate-800', !active);
    });

    pruleBtns.forEach((btn) => {
      const active = Number(btn.dataset.prule) === state.priorityRule;
      btn.classList.toggle('bg-slate-900', active);
      btn.classList.toggle('text-white', active);
      btn.classList.toggle('shadow-sm', active);
      btn.classList.toggle('text-slate-800', !active);
    });

    renderRows();
  }

  function renderRows() {
    const isPriority = state.algo === 'priority';
    processBody.innerHTML = '';

    state.rows.forEach((row, i) => {
      const tr = document.createElement('tr');
      tr.className = 'hover:bg-slate-50 transition-colors divide-x divide-slate-300';

      tr.innerHTML = `
        <td class="py-2.5 px-4 text-slate-900 font-bold border-r border-slate-300">P${i + 1}</td>
        <td class="py-2 px-4 border-r border-slate-300">
          <input
            type="number"
            min="0"
            data-idx="${i}"
            data-field="at"
            value="${escapeHtml ? escapeHtml(row.at) : row.at}"
            class="row-input w-full max-w-[160px] px-3 py-1.5 rounded-lg bg-white border border-slate-400 text-xs sm:text-sm text-slate-900 font-semibold focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-colors"
          />
        </td>
        <td class="py-2 px-4 border-r border-slate-300">
          <input
            type="number"
            min="1"
            data-idx="${i}"
            data-field="bt"
            value="${escapeHtml ? escapeHtml(row.bt) : row.bt}"
            class="row-input w-full max-w-[160px] px-3 py-1.5 rounded-lg bg-white border border-slate-400 text-xs sm:text-sm text-slate-900 font-semibold focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-colors"
          />
        </td>
        ${
          isPriority
            ? `<td class="py-2 px-4 border-r border-slate-300">
                <input
                  type="number"
                  min="0"
                  data-idx="${i}"
                  data-field="priority"
                  value="${escapeHtml ? escapeHtml(row.priority) : row.priority}"
                  class="row-input w-full max-w-[160px] px-3 py-1.5 rounded-lg bg-white border border-slate-400 text-xs sm:text-sm text-slate-900 font-semibold focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-colors"
                />
              </td>`
            : ''
        }
        <td class="py-2 px-4 text-center">
          ${
            state.rows.length > 1
              ? `<button
                  type="button"
                  data-remove="${i}"
                  title="Remove row"
                  class="btn-row-del w-7 h-7 inline-flex items-center justify-center rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 text-lg font-bold transition-all cursor-pointer"
                >&times;</button>`
              : ''
          }
        </td>
      `;
      processBody.appendChild(tr);
    });

    processBody.querySelectorAll('.row-input').forEach((input) => {
      input.addEventListener('input', (e) => {
        const idx = Number(e.target.dataset.idx);
        const field = e.target.dataset.field;
        state.rows[idx][field] = e.target.value;
        if (validateInputBox) validateInputBox(e.target);
      });
      input.addEventListener('blur', (e) => {
        if (validateInputBox) validateInputBox(e.target);
      });
    });

    processBody.querySelectorAll('.btn-row-del').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const idx = Number(e.currentTarget.dataset.remove);
        if (state.rows.length > 1) {
          state.rows.splice(idx, 1);
          renderRows();
        }
      });
    });
  }

  function handleSolve(e) {
    e.preventDefault();

    const isPriority = state.algo === 'priority';
    const isRR = state.algo === 'rr';
    let allValid = true;
    let firstInvalid = null;

    if (isRR && validateInputBox) {
      if (!validateInputBox(inputQt)) {
        allValid = false;
        firstInvalid = firstInvalid || inputQt;
      }
    }

    processBody.querySelectorAll('.row-input').forEach((inp) => {
      if (validateInputBox && !validateInputBox(inp)) {
        allValid = false;
        firstInvalid = firstInvalid || inp;
      }
    });

    if (!allValid) {
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    const parsedProcesses = state.rows.map((r, idx) => ({
      pid: idx + 1,
      at: parseStrictInt ? parseStrictInt(r.at) : Number(r.at),
      bt: parseStrictInt ? parseStrictInt(r.bt) : Number(r.bt),
      priority: isPriority ? (parseStrictInt ? parseStrictInt(r.priority) : Number(r.priority)) : 0,
    }));

    const qtVal = isRR ? (parsePositiveFloat ? parsePositiveFloat(inputQt.value) : Number(inputQt.value)) : null;

    let result = null;
    if (state.algo === 'fcfs') {
      result = Algos.runFCFS ? Algos.runFCFS(parsedProcesses) : null;
    } else if (state.algo === 'sjf') {
      result =
        state.mode === 'p'
          ? Algos.runSJF_P(parsedProcesses)
          : Algos.runSJF_NP(parsedProcesses);
    } else if (state.algo === 'priority') {
      result =
        state.mode === 'p'
          ? Algos.runPriority_P(parsedProcesses, state.priorityRule)
          : Algos.runPriority_NP(parsedProcesses, state.priorityRule);
    } else if (state.algo === 'rr') {
      result = Algos.runRoundRobin ? Algos.runRoundRobin(parsedProcesses, qtVal) : null;
    }

    if (result) {
      displayResults(result);
    }
  }

  function displayResults(res) {
    const algoTitle = getAlgorithmTitle();
    if (exportTitle) exportTitle.textContent = algoTitle.title;
    if (exportSubtitle) exportSubtitle.textContent = algoTitle.subtitle;

    if (UI.renderResultsTable) {
      UI.renderResultsTable(
        {
          head: resHead,
          body: resBody,
          foot: resFoot,
          cpuVal: resCpuVal,
          section: resultsSection,
        },
        res,
        formatNum
      );
    }

    if (UI.renderGanttTimeline) {
      UI.renderGanttTimeline(ganttWrapper, res.segments, formatNum);
    }

    if (resultsSection) {
      resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  algoBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      state.algo = btn.dataset.algo;
      if (clearValidationStyles) clearValidationStyles(processBody, inputQt);
      renderControls();
    });
  });

  modeBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      state.mode = btn.dataset.mode;
      if (clearValidationStyles) clearValidationStyles(processBody, inputQt);
      renderControls();
    });
  });

  pruleBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      state.priorityRule = Number(btn.dataset.prule);
      if (clearValidationStyles) clearValidationStyles(processBody, inputQt);
      renderControls();
    });
  });

  if (inputQt) {
    inputQt.addEventListener('input', () => {
      if (validateInputBox) validateInputBox(inputQt);
    });
    inputQt.addEventListener('blur', () => {
      if (validateInputBox) validateInputBox(inputQt);
    });
  }

  if (btnAddRow) {
    btnAddRow.addEventListener('click', () => {
      if (state.rows.length < 50) {
        state.rows.push({ at: '', bt: '', priority: '' });
        renderRows();
      }
    });
  }

  if (btnRemoveRow) {
    btnRemoveRow.addEventListener('click', () => {
      if (state.rows.length > 1) {
        state.rows.pop();
        renderRows();
      }
    });
  }

  if (btnReset) {
    btnReset.addEventListener('click', () => {
      if (clearValidationStyles) clearValidationStyles(processBody, inputQt);
      state.algo = 'fcfs';
      state.mode = 'np';
      state.priorityRule = 1;
      state.qt = '2';
      state.rows = [
        { at: '', bt: '', priority: '' },
        { at: '', bt: '', priority: '' },
        { at: '', bt: '', priority: '' },
      ];
      if (inputQt) inputQt.value = '2';
      if (resultsSection) resultsSection.classList.add('hidden');
      renderControls();
    });
  }

  if (schedulerForm) {
    schedulerForm.addEventListener('submit', handleSolve);
  }

  if (btnExportImg) {
    btnExportImg.addEventListener('click', async () => {
      if (!exportContainer) return;
      if (typeof html2canvas === 'undefined') {
        alert('Photo export library is still loading. Please check your internet connection and try again.');
        return;
      }

      const originalHtml = btnExportImg.innerHTML;
      btnExportImg.disabled = true;
      btnExportImg.innerHTML = `<span>Saving...</span>`;

      try {
        const canvas = await html2canvas(exportContainer, {
          scale: 2,
          backgroundColor: '#ffffff',
          useCORS: true,
          logging: false,
          windowWidth: Math.max(exportContainer.scrollWidth + 80, 1200),
        });

        const titleSlug = getAlgorithmTitle().title.replace(/[^a-zA-Z0-9_-]/g, '_');
        const link = document.createElement('a');
        link.download = `CPU_Schedule_${titleSlug}_${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (err) {
        console.error('Export photo error:', err);
        alert('Could not export photo: ' + err.message);
      } finally {
        btnExportImg.disabled = false;
        btnExportImg.innerHTML = originalHtml;
      }
    });
  }

  if (UI.initGuideModal) {
    UI.initGuideModal();
  }

  renderControls();
})();
