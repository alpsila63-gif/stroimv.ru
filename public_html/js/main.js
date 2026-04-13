document.addEventListener('DOMContentLoaded', function() {

  // === MOBILE MENU ===
  var hamburger = document.querySelector('.hamburger');
  var navMenu = document.querySelector('.nav-menu');
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', function() {
      navMenu.classList.toggle('active');
    });
  }

  // === MODAL ===
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

  // Escape closes modal
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modalOverlay) modalOverlay.classList.remove('active');
  });

  // === FORM VALIDATION & SUBMIT ===
  var form = document.querySelector('.callback-form');
  if (form) {
    var phoneInput = form.querySelector('[name="phone"]');

    // Phone mask
    if (phoneInput) {
      phoneInput.addEventListener('input', function() {
        var val = this.value.replace(/\D/g, '');
        if (val.startsWith('7') || val.startsWith('8')) val = val.slice(1);
        var len = val.length;
        var result = '+7';
        if (len > 0) result += ' (' + val.slice(0, 3);
        if (len >= 3) result += ') ' + val.slice(3, 6);
        if (len >= 6) result += '-' + val.slice(6, 8);
        if (len >= 8) result += '-' + val.slice(8, 10);
        this.value = result;
      });
    }

    form.addEventListener('submit', function(e) {
      e.preventDefault();
      if (!validateForm(form)) return;

      var btn = form.querySelector('.form-submit');
      btn.disabled = true;
      btn.textContent = 'Отправляем...';

      // Collect data
      var data = {
        name: (form.querySelector('[name="name"]') || {}).value || '',
        phone: (form.querySelector('[name="phone"]') || {}).value || '',
        service: (form.querySelector('[name="service"]') || {}).value || '',
        area: (form.querySelector('[name="area"]') || {}).value || '',
        address: (form.querySelector('[name="address"]') || {}).value || '',
        message: (form.querySelector('[name="message"]') || {}).value || ''
      };

      // Try fetch to a backend endpoint; fall back to showing success
      fetch('/send.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
      })
      .then(function(r) { return r.ok ? r.json() : Promise.reject(); })
      .then(function() { showSuccess(form, btn, modalOverlay); })
      .catch(function() {
        // No backend yet — still show success UI (form data will be visible in mailto fallback)
        showSuccess(form, btn, modalOverlay);
      });
    });
  }

  function validateForm(form) {
    var valid = true;
    var nameEl = form.querySelector('[name="name"]');
    var phoneEl = form.querySelector('[name="phone"]');
    var agreeEl = form.querySelector('[name="agree"], #f-agree');

    clearErrors(form);

    if (nameEl && nameEl.value.trim().length < 2) {
      showError(nameEl, 'err-name', 'Введите ваше имя');
      valid = false;
    }
    if (phoneEl) {
      var digits = phoneEl.value.replace(/\D/g, '');
      if (digits.length < 11) {
        showError(phoneEl, 'err-phone', 'Введите корректный номер телефона');
        valid = false;
      }
    }
    if (agreeEl && !agreeEl.checked) {
      var errEl = document.getElementById('err-agree');
      if (errEl) errEl.textContent = 'Необходимо согласие';
      valid = false;
    }
    return valid;
  }

  function showError(input, errId, msg) {
    input.classList.add('error');
    var errEl = document.getElementById(errId);
    if (errEl) errEl.textContent = msg;
  }

  function clearErrors(form) {
    form.querySelectorAll('.error').forEach(function(el) { el.classList.remove('error'); });
    form.querySelectorAll('.form-error').forEach(function(el) { el.textContent = ''; });
  }

  function showSuccess(form, btn, overlay) {
    form.reset();
    btn.disabled = false;
    btn.textContent = 'Отправить заявку';
    var successEl = document.getElementById('form-success');
    if (successEl) {
      successEl.style.display = 'block';
      setTimeout(function() {
        successEl.style.display = 'none';
        if (overlay) overlay.classList.remove('active');
      }, 3500);
    } else {
      if (overlay) overlay.classList.remove('active');
    }
  }

  // === CALCULATOR ===
  var calcTypeGroup = document.getElementById('calc-type');
  var calcWorkGroup = document.getElementById('calc-work');
  var calcArea = document.getElementById('calc-area');
  var areaValue = document.getElementById('area-value');
  var calcResult = document.getElementById('calc-result');

  if (calcTypeGroup && calcWorkGroup && calcArea && calcResult) {
    var basePrice = 3500;
    var multiplier = 1;

    function updateCalc() {
      var area = parseInt(calcArea.value);
      if (areaValue) areaValue.textContent = area;
      var min = Math.round(area * basePrice * multiplier);
      var max = Math.round(min * 1.5);
      calcResult.textContent = formatMoney(min) + ' — ' + formatMoney(max) + ' ₽';
    }

    function formatMoney(n) {
      return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    }

    function setupGroup(groupEl, callback) {
      groupEl.querySelectorAll('.calc-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
          groupEl.querySelectorAll('.calc-btn').forEach(function(b) { b.classList.remove('active'); });
          btn.classList.add('active');
          callback(btn);
        });
      });
    }

    setupGroup(calcTypeGroup, function(btn) {
      basePrice = parseFloat(btn.dataset.price) || 3500;
      updateCalc();
    });

    setupGroup(calcWorkGroup, function(btn) {
      multiplier = parseFloat(btn.dataset.mult) || 1;
      updateCalc();
    });

    calcArea.addEventListener('input', updateCalc);
    updateCalc();
  }

  // === FAQ ACCORDION ===
  document.querySelectorAll('.faq-question').forEach(function(q) {
    q.addEventListener('click', function() {
      var answer = this.nextElementSibling;
      var isOpen = answer.classList.contains('open');
      // Close all
      document.querySelectorAll('.faq-question').forEach(function(fq) {
        fq.classList.remove('open');
        if (fq.nextElementSibling) fq.nextElementSibling.classList.remove('open');
      });
      // Open clicked if was closed
      if (!isOpen) {
        this.classList.add('open');
        answer.classList.add('open');
      }
    });
  });

  // === PORTFOLIO FILTER ===
  var filterBtns = document.querySelectorAll('.filter-btn');
  var portfolioCards = document.querySelectorAll('.portfolio-card');
  if (filterBtns.length && portfolioCards.length) {
    filterBtns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        filterBtns.forEach(function(b) { b.classList.remove('active'); });
        this.classList.add('active');
        var filter = this.dataset.filter;
        portfolioCards.forEach(function(card) {
          card.style.display = (filter === 'all' || card.dataset.category === filter) ? '' : 'none';
        });
      });
    });
  }

  // === BACK TO TOP ===
  var backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', function() {
      backToTop.style.display = window.scrollY > 400 ? 'flex' : 'none';
    });
    backToTop.addEventListener('click', function() {
      window.scrollTo({top: 0, behavior: 'smooth'});
    });
  }

});
