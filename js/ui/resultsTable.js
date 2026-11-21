(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.CPUScheduler = root.CPUScheduler || {};
    root.CPUScheduler.UI = root.CPUScheduler.UI || {};
    root.CPUScheduler.UI.renderResultsTable = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  return function renderResultsTable(elements, res, formatNum) {
    const { head, body, foot, cpuVal, section } = elements;
    if (section) section.classList.remove('hidden');

    if (cpuVal) {
      cpuVal.textContent = `${res.cpu_util.toFixed(2)}%`;
    }

    const headers = res.hasPriority
      ? ['PID', 'AT', 'BT', 'Priority', 'CT', 'RT', 'TAT', 'WT']
      : ['PID', 'AT', 'BT', 'CT', 'RT', 'TAT', 'WT'];

    if (head) {
      head.innerHTML = headers
        .map((h, i) => `
          <th class="py-2.5 px-3.5 ${i === 0 ? 'text-left' : 'text-right'} font-bold text-slate-900 border-r border-slate-300 last:border-r-0">
            ${h}
          </th>
        `)
        .join('');
    }

    if (body) {
      body.innerHTML = res.rows
        .map((r) => {
          const pCell = res.hasPriority
            ? `<td class="py-2.5 px-3.5 text-right border-r border-slate-300">
                ${
                  r.isHighest
                    ? `<span class="font-bold text-amber-800">${r.priority} <span class="text-[10px] text-amber-700 font-sans">H</span></span>`
                    : r.priority
                }
               </td>`
            : '';

          return `
            <tr class="hover:bg-slate-50 transition-colors">
              <td class="py-2.5 px-3.5 font-bold text-slate-900 border-r border-slate-300">P${r.pid}</td>
              <td class="py-2.5 px-3.5 text-right border-r border-slate-300">${r.at}</td>
              <td class="py-2.5 px-3.5 text-right border-r border-slate-300">${r.bt}</td>
              ${pCell}
              <td class="py-2.5 px-3.5 text-right border-r border-slate-300">${formatNum ? formatNum(r.ct) : r.ct}</td>
              <td class="py-2.5 px-3.5 text-right border-r border-slate-300">${formatNum ? formatNum(r.rt) : r.rt}</td>
              <td class="py-2.5 px-3.5 text-right font-bold text-slate-900 border-r border-slate-300">${formatNum ? formatNum(r.tat) : r.tat}</td>
              <td class="py-2.5 px-3.5 text-right font-bold text-slate-900">${formatNum ? formatNum(r.wt) : r.wt}</td>
            </tr>
          `;
        })
        .join('');
    }

    if (foot) {
      const colSpan = res.hasPriority ? 6 : 5;
      foot.innerHTML = `
        <tr>
          <td colspan="${colSpan}" class="py-2.5 px-3.5 text-right text-xs uppercase text-slate-900 font-sans font-bold border-r border-slate-300">
            AVG
          </td>
          <td class="py-2.5 px-3.5 text-right font-bold text-slate-900 border-r border-slate-300">${res.avg_tat.toFixed(2)}</td>
          <td class="py-2.5 px-3.5 text-right font-bold text-slate-900">${res.avg_wt.toFixed(2)}</td>
        </tr>
      `;
    }
  };
});
