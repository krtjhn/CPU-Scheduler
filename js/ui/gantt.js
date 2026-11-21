(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.CPUScheduler = root.CPUScheduler || {};
    root.CPUScheduler.UI = root.CPUScheduler.UI || {};
    root.CPUScheduler.UI.renderGanttTimeline = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const PROCESS_COLORS = [
    { bg: 'bg-blue-100',    border: 'border-blue-600',   text: 'text-blue-950' },
    { bg: 'bg-emerald-100', border: 'border-emerald-600', text: 'text-emerald-950' },
    { bg: 'bg-purple-100',  border: 'border-purple-600',  text: 'text-purple-950' },
    { bg: 'bg-amber-100',   border: 'border-amber-600',   text: 'text-amber-950' },
    { bg: 'bg-rose-100',    border: 'border-rose-600',    text: 'text-rose-950' },
    { bg: 'bg-cyan-100',    border: 'border-cyan-600',    text: 'text-cyan-950' },
    { bg: 'bg-indigo-100',  border: 'border-indigo-600',  text: 'text-indigo-950' },
    { bg: 'bg-teal-100',    border: 'border-teal-600',    text: 'text-teal-950' },
    { bg: 'bg-orange-100',  border: 'border-orange-600',  text: 'text-orange-950' },
    { bg: 'bg-fuchsia-100', border: 'border-fuchsia-600', text: 'text-fuchsia-950' },
  ];

  return function renderGanttTimeline(container, segments, formatNum) {
    if (!container) return;
    container.innerHTML = '';
    if (!segments || segments.length === 0) return;

    const row = document.createElement('div');
    row.className = 'flex items-stretch';

    segments.forEach((seg, i) => {
      const isIdle = seg.pid === -1;
      const duration = seg.end - seg.start;
      const color = isIdle
        ? null
        : PROCESS_COLORS[(seg.pid - 1) % PROCESS_COLORS.length];

      const blockCol = document.createElement('div');
      blockCol.style.flex = `${Math.max(duration, 1)} 0 60px`;
      blockCol.className = 'flex flex-col min-w-[60px]';

      const label = isIdle ? 'IDLE' : `P${seg.pid}`;
      const startStr = formatNum ? formatNum(seg.start) : String(seg.start);
      const endStr = formatNum ? formatNum(seg.end) : String(seg.end);
      const durStr = formatNum ? formatNum(duration) : String(duration);

      const bar = document.createElement('div');
      bar.title = `${label}: ${startStr} → ${endStr} (${durStr} units)`;
      bar.className = `h-11 flex flex-col items-center justify-center border-y-2 border-l-2 ${
        i === segments.length - 1 ? 'border-r-2 rounded-r-xl' : ''
      } ${i === 0 ? 'rounded-l-xl' : ''} ${
        isIdle
          ? 'bg-idle-stripes border-slate-600 text-slate-700 font-bold'
          : `${color.bg} border-slate-600 ${color.text} font-bold`
      } select-none transition-transform hover:brightness-95`;

      bar.innerHTML = `
        <span class="font-mono font-bold text-xs sm:text-sm leading-none">${label}</span>
      `;

      const ticks = document.createElement('div');
      ticks.className = 'relative h-5 mt-1 font-mono text-xs font-bold text-slate-900 select-none';

      const startTick = document.createElement('span');
      startTick.textContent = startStr;
      startTick.className =
        i === 0
          ? 'absolute left-0 top-0 text-slate-900 font-bold'
          : 'absolute left-0 top-0 -translate-x-1/2 text-slate-900 font-bold';
      ticks.appendChild(startTick);

      if (i === segments.length - 1) {
        const endTick = document.createElement('span');
        endTick.textContent = endStr;
        endTick.className = 'absolute right-0 top-0 text-slate-900 font-bold';
        ticks.appendChild(endTick);
      }

      blockCol.appendChild(bar);
      blockCol.appendChild(ticks);
      row.appendChild(blockCol);
    });

    container.appendChild(row);
  };
});
