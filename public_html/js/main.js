// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
  var hamburger = document.querySelector('.hamburger');
  var navMenu = document.querySelector('.nav-menu');
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', function() {
      navMenu.classList.toggle('active');
    });
  }

  // Modal
  var modalOverlay = document.querySelector('.modal-overlay');
  var openBtns = document.querySelectorAll('.btn-callback, .open-modal');
  var closeBtn = document.querySelector('.close-modal');

  openBtns.forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      if (modalOverlay) modalOverlay.classList.add('active');
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', function() {
      modalOverlay.classList.remove('active');
    });
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', function(e) {
      if (e.target === modalOverlay) modalOverlay.classList.remove('active');
    });
  }

  // Form submit
  var form = document.querySelector('.callback-form');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      alert('Спасибо! Мы свяжемся с вами в ближайшее время.');
      if (modalOverlay) modalOverlay.classList.remove('active');
      form.reset();
    });
  }
});
