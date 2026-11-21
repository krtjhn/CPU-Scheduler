(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.CPUScheduler = root.CPUScheduler || {};
    root.CPUScheduler.Utils = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  function parseStrictInt(val) {
    const trimmed = String(val ?? '').trim();
    if (!/^\d+$/.test(trimmed)) return null;
    const num = Number(trimmed);
    return Number.isSafeInteger(num) ? num : null;
  }

  function parsePositiveFloat(val) {
    const trimmed = String(val ?? '').trim();
    if (!/^(?:\d+\.?\d*|\.\d+)$/.test(trimmed)) return null;
    const num = Number(trimmed);
    return Number.isFinite(num) && num > 0 ? num : null;
  }

  function formatNum(val) {
    if (typeof val !== 'number' || Number.isNaN(val)) return '0';
    if (Math.abs(val - Math.round(val)) < 1e-6) {
      return String(Math.round(val));
    }
    return val.toFixed(2);
  }

  function escapeHtml(str) {
    return String(str ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function validateInputBox(el) {
    if (!el) return true;
    const field = el.dataset?.field;
    const val = el.value ? el.value.trim() : '';
    let isValid = false;

    if (field === 'at') {
      const num = parseStrictInt(val);
      isValid = num !== null && num >= 0;
    } else if (field === 'bt') {
      const num = parseStrictInt(val);
      isValid = num !== null && num > 0;
    } else if (field === 'priority') {
      const num = parseStrictInt(val);
      isValid = num !== null && num >= 0;
    } else if (el.id === 'input-qt') {
      const num = parsePositiveFloat(val);
      isValid = num !== null && num > 0;
    }

    if (isValid) {
      el.classList.remove('border-rose-500', 'ring-2', 'ring-rose-500', 'bg-rose-50/20');
      el.classList.add('border-slate-400');
    } else {
      el.classList.add('border-rose-500', 'ring-2', 'ring-rose-500', 'bg-rose-50/20');
      el.classList.remove('border-slate-400');
    }
    return isValid;
  }

  function clearValidationStyles(container, inputQt) {
    if (inputQt) {
      inputQt.classList.remove('border-rose-500', 'ring-2', 'ring-rose-500', 'bg-rose-50/20');
      inputQt.classList.add('border-slate-400');
    }
    if (container) {
      container.querySelectorAll('.row-input').forEach((el) => {
        el.classList.remove('border-rose-500', 'ring-2', 'ring-rose-500', 'bg-rose-50/20');
        el.classList.add('border-slate-400');
      });
    }
  }

  return {
    parseStrictInt,
    parsePositiveFloat,
    formatNum,
    escapeHtml,
    validateInputBox,
    clearValidationStyles,
  };
});
