(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.CPUScheduler = root.CPUScheduler || {};
    root.CPUScheduler.UI = root.CPUScheduler.UI || {};
    root.CPUScheduler.UI.initGuideModal = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  return function initGuideModal(options = {}) {
    const modal = options.modal || document.getElementById('guide-modal');
    const backdrop = options.backdrop || document.getElementById('guide-backdrop');
    const panel = options.panel || document.getElementById('guide-panel');
    const btnOpen = options.btnOpen || document.getElementById('btn-open-guide');
    const btnClose = options.btnClose || document.getElementById('btn-close-guide');

    function openModal() {
      if (!modal || !backdrop || !panel) return;
      modal.classList.remove('hidden');
      document.body.classList.add('overflow-hidden');
      requestAnimationFrame(() => {
        backdrop.classList.remove('opacity-0');
        backdrop.classList.add('opacity-100');
        panel.classList.remove('scale-95', 'opacity-0');
        panel.classList.add('scale-100', 'opacity-100');
      });
    }

    function closeModal() {
      if (!modal || !backdrop || !panel) return;
      backdrop.classList.remove('opacity-100');
      backdrop.classList.add('opacity-0');
      panel.classList.remove('scale-100', 'opacity-100');
      panel.classList.add('scale-95', 'opacity-0');
      setTimeout(() => {
        modal.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
      }, 200);
    }

    if (btnOpen) {
      btnOpen.addEventListener('click', openModal);
    }
    if (btnClose) {
      btnClose.addEventListener('click', closeModal);
    }
    if (backdrop) {
      backdrop.addEventListener('click', closeModal);
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
        closeModal();
      }
    });

    return {
      open: openModal,
      close: closeModal,
    };
  };
});
