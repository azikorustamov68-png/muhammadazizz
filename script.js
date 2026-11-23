/**
 * MEGA WESTER XUSUSIY MAKTABI
 * Asosiy JavaScript kodi (Barcha interaktiv tugmalar, formalar va mantiq)
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ==================== 1. TUN / KUN (DARK/LIGHT) MAVZUSI ====================
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeText = themeToggleBtn?.querySelector('.theme-text');
  const themeIcon = themeToggleBtn?.querySelector('i');
  const htmlEl = document.documentElement;

  // Saqlangan mavzuni tekshirish
  const savedTheme = localStorage.getItem('mw_theme') || 'light';
  applyTheme(savedTheme);

  themeToggleBtn?.addEventListener('click', () => {
    const currentTheme = htmlEl.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(newTheme);
    localStorage.setItem('mw_theme', newTheme);
    showToast(
      newTheme === 'dark' ? 'Tun rejimi yoqildi' : 'Kun rejimi yoqildi',
      'info'
    );
  });

  function applyTheme(theme) {
    htmlEl.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      if (themeIcon) themeIcon.className = 'fa-solid fa-sun';
      if (themeText) themeText.textContent = 'Kun';
    } else {
      if (themeIcon) themeIcon.className = 'fa-solid fa-moon';
      if (themeText) themeText.textContent = 'Tun';
    }
  }

  // ==================== 2. MOBIL MENYU (BURGER) VA SCROLL NAVBAR ====================
  const header = document.getElementById('header');
  const burgerBtn = document.getElementById('burgerBtn');
  const navLinks = document.getElementById('navLinks');
  const menuBackdrop = document.getElementById('menuBackdrop');

  function toggleMobileMenu() {
    const isOpen = navLinks.classList.contains('active');
    if (isOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }

  function openMobileMenu() {
    navLinks.classList.add('active');
    burgerBtn.classList.add('active');
    burgerBtn.setAttribute('aria-expanded', 'true');
    menuBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  window.closeMobileMenu = function() {
    navLinks.classList.remove('active');
    burgerBtn.classList.remove('active');
    burgerBtn.setAttribute('aria-expanded', 'false');
    menuBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  };

  burgerBtn?.addEventListener('click', toggleMobileMenu);
  menuBackdrop?.addEventListener('click', closeMobileMenu);

  // Mobil menyu havolalari bosilganda menyuni yopish
  navLinks?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      closeMobileMenu();
    });
  });

  // Skroll bo'yicha sticky navbar va aktiv menyu aniqlash
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scroll-to-top tugmasi
    const scrollTopBtn = document.getElementById('scrollToTopBtn');
    if (scrollTopBtn) {
      if (window.scrollY > 400) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    }

    // Scrollspy - Qaysi bo'limda ekanligini belgilash
    updateActiveNavLink();
  });

  // Yuqoriga qaytish
  document.getElementById('scrollToTopBtn')?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 120;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');
      const navLink = document.querySelector(`.nav-links a[href="#${id}"]`);

      if (navLink) {
        if (scrollPosition >= top && scrollPosition < top + height) {
          document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
          navLink.classList.add('active');
        }
      }
    });
  }

  // ==================== 3. RAQAMLAR ANIMATSIYASI (STATISTIKA) ====================
  let statsCounted = false;
  const statsBar = document.getElementById('statsBar');

  function checkStatsInView() {
    if (!statsBar || statsCounted) return;
    const rect = statsBar.getBoundingClientRect();
    if (rect.top <= window.innerHeight - 80) {
      statsCounted = true;
      animateCounters();
    }
  }

  function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      let current = 0;
      const duration = 1800; // 1.8 sekund
      const stepTime = 20;
      const totalSteps = duration / stepTime;
      const increment = target / totalSteps;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          counter.textContent = target.toLocaleString('uz-UZ');
          clearInterval(timer);
        } else {
          counter.textContent = Math.floor(current).toLocaleString('uz-UZ');
        }
      }, stepTime);
    });
  }

  window.addEventListener('scroll', checkStatsInView);
  checkStatsInView();

  // ==================== 4. KURSLARNI FILTRLASH (TABS) ====================
  const filterBtns = document.querySelectorAll('.filter-tab-btn');
  const courseCards = document.querySelectorAll('.course-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      courseCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.3s ease-in-out';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Kurs kartasidagi "Tanlash" tugmasi -> To'g'ridan-to'g'ri qabul formasiga olib o'tadi
  document.querySelectorAll('.select-course-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      const courseName = button.getAttribute('data-course');
      const targetSelect = document.getElementById('targetClass');

      if (targetSelect) {
        // Mos variantni topish yoki eng yaqinini tanlash
        let found = false;
        for (let i = 0; i < targetSelect.options.length; i++) {
          if (targetSelect.options[i].text.toLowerCase().includes(courseName.toLowerCase()) || 
              targetSelect.options[i].value.toLowerCase().includes(courseName.toLowerCase())) {
            targetSelect.selectedIndex = i;
            found = true;
            break;
          }
        }
        if (!found) {
          targetSelect.selectedIndex = 1;
        }
        targetSelect.classList.remove('is-invalid');
        targetSelect.classList.add('is-valid');
      }

      // Silliq ko'chish
      const qabulSection = document.getElementById('qabul');
      if (qabulSection) {
        qabulSection.scrollIntoView({ behavior: 'smooth' });
        showToast(`"${courseName}" yo'nalishi tanlandi. Iltimos, ma'lumotlaringizni to'ldiring!`, 'info');
      }
    });
  });

  // ==================== 5. TO'LOV VA CHEGIRMALAR KALKULYATORI ====================
  const calcGradeInputs = document.querySelectorAll('input[name="calcGrade"]');
  const periodButtons = document.querySelectorAll('.period-btn');
  const calcBus = document.getElementById('calcBus');
  const calcRobot = document.getElementById('calcRobot');
  const calcSibling = document.getElementById('calcSibling');

  const basePriceDisplay = document.getElementById('basePriceDisplay');
  const discountDisplay = document.getElementById('discountDisplay');
  const finalAmountDisplay = document.getElementById('finalAmountDisplay');
  const paymentPeriodNote = document.getElementById('paymentPeriodNote');
  const calcApplyBtn = document.getElementById('calcApplyBtn');

  let currentPeriod = 'monthly'; // 'monthly', 'quarterly', 'yearly'

  periodButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      periodButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentPeriod = btn.getAttribute('data-period');
      calculateTuition();
    });
  });

  calcGradeInputs.forEach(input => input.addEventListener('change', calculateTuition));
  calcBus?.addEventListener('change', calculateTuition);
  calcRobot?.addEventListener('change', calculateTuition);
  calcSibling?.addEventListener('change', calculateTuition);

  function calculateTuition() {
    let baseMonthly = 3800000;
    calcGradeInputs.forEach(inp => {
      if (inp.checked) {
        baseMonthly = parseInt(inp.value, 10);
      }
    });

    let extraMonthly = 0;
    if (calcBus && calcBus.checked) extraMonthly += parseInt(calcBus.value, 10);
    if (calcRobot && calcRobot.checked) extraMonthly += parseInt(calcRobot.value, 10);

    const subtotalMonthly = baseMonthly + extraMonthly;

    // Chegirmalarni hisoblash
    let discountPercent = 0;
    let periodMultiplier = 1;
    let noteText = 'Oyiga';

    if (currentPeriod === 'quarterly') {
      discountPercent += 5; // 5% chegirma
      periodMultiplier = 3;
      noteText = '3 oylik (Choraklik)';
    } else if (currentPeriod === 'yearly') {
      discountPercent += 15; // 15% yillik to'lov chegirmasi
      periodMultiplier = 9; // 9 oylik o'quv yili
      noteText = 'Yillik (9 oylik o\'quv kursi)';
    }

    if (calcSibling && calcSibling.checked) {
      discountPercent += 10; // 2-farzand uchun 10% chegirma
    }

    const totalBeforeDiscount = subtotalMonthly * periodMultiplier;
    const discountAmount = totalBeforeDiscount * (discountPercent / 100);
    const finalTotal = totalBeforeDiscount - discountAmount;

    // Ko'rsatish
    if (basePriceDisplay) {
      basePriceDisplay.textContent = formatMoney(totalBeforeDiscount);
    }
    if (discountDisplay) {
      discountDisplay.textContent = `${formatMoney(discountAmount)} (-${discountPercent}%)`;
    }
    if (finalAmountDisplay) {
      finalAmountDisplay.innerHTML = `${formatMoney(finalTotal)} <span>so'm</span>`;
    }
    if (paymentPeriodNote) {
      paymentPeriodNote.textContent = noteText;
    }
  }

  function formatMoney(amount) {
    return Math.round(amount).toLocaleString('uz-UZ') + " so'm";
  }

  // Kalkulyator rejasini formaga ko'chirish
  calcApplyBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    let gradeName = "Boshlang'ich (1-4)";
    calcGradeInputs.forEach(inp => {
      if (inp.checked) {
        const strong = inp.closest('.radio-card')?.querySelector('strong');
        if (strong) gradeName = strong.textContent.trim();
      }
    });

    const userMessage = document.getElementById('userMessage');
    if (userMessage) {
      userMessage.value = `[Kalkulyatordan tanlandi]: Reja: ${gradeName}, To'lov rejasi: ${currentPeriod === 'yearly' ? 'Yillik (-15%)' : (currentPeriod === 'quarterly' ? 'Choraklik (-5%)' : 'Oylik')}, Avtobus: ${calcBus?.checked ? 'Ha' : "Yo'q"}, Robototexnika: ${calcRobot?.checked ? 'Ha' : "Yo'q"}.`;
    }

    const qabulSection = document.getElementById('qabul');
    if (qabulSection) {
      qabulSection.scrollIntoView({ behavior: 'smooth' });
      showToast('Kalkulyatorda hisoblangan variantingiz arizaga biriktirildi!', 'success');
    }
  });

  // Boshlang'ich hisoblash
  calculateTuition();

  // ==================== 6. TELEFON RAQAM MASKASI (+998 FORMAT) ====================
  const phoneInputs = document.querySelectorAll('.phone-input');

  phoneInputs.forEach(input => {
    input.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, ''); // faqat raqamlar
      if (value.startsWith('998')) {
        value = value.substring(3);
      }
      value = value.substring(0, 9); // ko'pi bilan 9 ta raqam (masalan: 901234567)

      let formatted = '';
      if (value.length > 0) {
        formatted += '(' + value.substring(0, 2);
      }
      if (value.length >= 2) {
        formatted += ') ';
      }
      if (value.length > 2) {
        formatted += value.substring(2, 5);
      }
      if (value.length >= 5) {
        formatted += '-';
      }
      if (value.length > 5) {
        formatted += value.substring(5, 7);
      }
      if (value.length >= 7) {
        formatted += '-';
      }
      if (value.length > 7) {
        formatted += value.substring(7, 9);
      }

      e.target.value = formatted;
    });
  });

  // ==================== 7. ASOSIY QABUL FORMASI VA VALIDATSIYA ====================
  const admissionForm = document.getElementById('admissionForm');
  const firstNameInput = document.getElementById('firstName');
  const lastNameInput = document.getElementById('lastName');
  const userRegionSelect = document.getElementById('userRegion');
  const userAddressInput = document.getElementById('userAddress');
  const phoneNumberInput = document.getElementById('phoneNumber');
  const targetClassSelect = document.getElementById('targetClass');
  const agreeTermsCheckbox = document.getElementById('agreeTerms');
  const submitFormBtn = document.getElementById('submitFormBtn');

  // Input o'zgarganda xatolikni yo'qotish
  [firstNameInput, lastNameInput, userRegionSelect, userAddressInput, phoneNumberInput, targetClassSelect].forEach(field => {
    field?.addEventListener('input', () => {
      validateSingleField(field);
    });
    field?.addEventListener('change', () => {
      validateSingleField(field);
    });
  });

  function validateSingleField(field) {
    const errorEl = document.getElementById(field.id + 'Error');
    let isValid = true;
    let message = '';

    const val = field.value.trim();

    if (field.id === 'firstName') {
      if (val.length < 2) {
        isValid = false;
        message = 'Ismingizni to\'liq kiriting (kamida 2 ta harf)';
      }
    } else if (field.id === 'lastName') {
      if (val.length < 2) {
        isValid = false;
        message = 'Familiyangizni kiriting (kamida 2 ta harf)';
      }
    } else if (field.id === 'userRegion') {
      if (!val) {
        isValid = false;
        message = 'Iltimos, viloyatingizni tanlang';
      }
    } else if (field.id === 'userAddress') {
      if (val.length < 4) {
        isValid = false;
        message = 'Yashash manzilingizni to\'liqroq kiriting';
      }
    } else if (field.id === 'phoneNumber') {
      const rawNumbers = val.replace(/\D/g, '');
      if (rawNumbers.length < 9) {
        isValid = false;
        message = 'Telefon raqamini to\'liq kiriting: (XX) XXX-XX-XX';
      }
    } else if (field.id === 'targetClass') {
      if (!val) {
        isValid = false;
        message = 'Iltimos, o\'quvchi sinfi yoki kursini tanlang';
      }
    }

    if (isValid) {
      field.classList.remove('is-invalid');
      field.classList.add('is-valid');
      if (errorEl) errorEl.textContent = '';
    } else {
      field.classList.remove('is-valid');
      field.classList.add('is-invalid');
      if (errorEl) errorEl.textContent = message;
    }

    return isValid;
  }

  admissionForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    const isFirstValid = validateSingleField(firstNameInput);
    const isLastValid = validateSingleField(lastNameInput);
    const isRegionValid = validateSingleField(userRegionSelect);
    const isAddressValid = validateSingleField(userAddressInput);
    const isPhoneValid = validateSingleField(phoneNumberInput);
    const isClassValid = validateSingleField(targetClassSelect);

    const agreeError = document.getElementById('agreeTermsError');
    let isAgreeValid = true;
    if (agreeTermsCheckbox && !agreeTermsCheckbox.checked) {
      isAgreeValid = false;
      if (agreeError) agreeError.textContent = 'Arizani yuborish uchun rozilik belgilanishi shart';
    } else if (agreeError) {
      agreeError.textContent = '';
    }

    if (!isFirstValid || !isLastValid || !isRegionValid || !isAddressValid || !isPhoneValid || !isClassValid || !isAgreeValid) {
      showToast('Iltimos, qizil bilan belgilangan maydonlarni to\'g\'ri to\'ldiring!', 'error');
      return;
    }

    // Yuborish jarayoni
    const btnText = submitFormBtn.querySelector('.btn-text');
    const btnSpinner = submitFormBtn.querySelector('.btn-spinner');

    if (btnText) btnText.classList.add('d-none');
    if (btnSpinner) btnSpinner.classList.remove('d-none');
    submitFormBtn.disabled = true;

    // Simulyatsiya (1 soniya)
    setTimeout(() => {
      const ticketId = 'MW-' + Math.floor(100000 + Math.random() * 900000);
      const applicationData = {
        id: ticketId,
        firstName: firstNameInput.value.trim(),
        lastName: lastNameInput.value.trim(),
        region: userRegionSelect.value,
        address: userAddressInput.value.trim(),
        phone: '+998 ' + phoneNumberInput.value.trim(),
        course: targetClassSelect.value,
        message: document.getElementById('userMessage')?.value.trim() || "Ko'rsatilmagan",
        createdAt: new Date().toLocaleString('uz-UZ')
      };

      // Brauzerda saqlash
      saveApplicationToStorage(applicationData);

      // Yuborish tugmasini asliga qaytarish
      if (btnText) btnText.classList.remove('d-none');
      if (btnSpinner) btnSpinner.classList.add('d-none');
      submitFormBtn.disabled = false;

      // Modalni to'ldirish va ochish
      document.getElementById('modalApplicantName').textContent = `${applicationData.firstName} ${applicationData.lastName}`;
      document.getElementById('modalTicketId').textContent = '#' + applicationData.id;
      document.getElementById('modalApplicantRegion').textContent = `${applicationData.region}, ${applicationData.address}`;
      document.getElementById('modalApplicantPhone').textContent = applicationData.phone;
      document.getElementById('modalApplicantCourse').textContent = applicationData.course;

      openModal('successModal');
      showToast('Arizangiz muvaffaqiyatli qabul qilindi!', 'success');

      // Formani tozalash
      admissionForm.reset();
      document.querySelectorAll('.form-control').forEach(el => {
        el.classList.remove('is-valid');
      });
    }, 900);
  });

  function saveApplicationToStorage(data) {
    try {
      const list = JSON.parse(localStorage.getItem('mw_applications') || '[]');
      list.unshift(data);
      localStorage.setItem('mw_applications', JSON.stringify(list));
    } catch (err) {
      console.warn('LocalStorage xatosi:', err);
    }
  }

  // ==================== 8. MODALLARNI BOSHQARISH ====================
  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  // Muvaffaqiyat modali yopish
  document.getElementById('closeSuccessModalBtn')?.addEventListener('click', () => closeModal('successModal'));
  document.getElementById('closeSuccessModalDoneBtn')?.addEventListener('click', () => closeModal('successModal'));

  // Virtual sayohat modali
  document.getElementById('openVideoTourBtn')?.addEventListener('click', () => openModal('videoModal'));
  document.getElementById('closeVideoModalBtn')?.addEventListener('click', () => closeModal('videoModal'));

  // Tezkor qo'ng'iroq modali
  document.getElementById('quickCallBtn')?.addEventListener('click', () => openModal('callbackModal'));
  document.getElementById('closeCallbackModalBtn')?.addEventListener('click', () => closeModal('callbackModal'));

  // Arizalar tarixi modali
  document.getElementById('openArizalarHistoryBtn')?.addEventListener('click', () => {
    renderApplicationsHistory();
    openModal('historyModal');
  });
  document.getElementById('closeHistoryModalBtn')?.addEventListener('click', () => closeModal('historyModal'));

  // Modallar foniga bosilganda yopish
  document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        closeModal(backdrop.id);
      }
    });
  });

  // Escape tugmasi bosilganda modallarni yopish
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-backdrop.active').forEach(m => closeModal(m.id));
      closeMobileMenu();
    }
  });

  // Tarixni tozalash
  document.getElementById('clearHistoryBtn')?.addEventListener('click', () => {
    if (confirm("Haqiqatan ham saqlangan barcha arizalar tarixini tozalamoqchimisiz?")) {
      localStorage.removeItem('mw_applications');
      renderApplicationsHistory();
      showToast('Arizalar tarixi tozalandi', 'info');
    }
  });

  function renderApplicationsHistory() {
    const container = document.getElementById('applicationsListContainer');
    if (!container) return;

    const list = JSON.parse(localStorage.getItem('mw_applications') || '[]');
    if (list.length === 0) {
      container.innerHTML = `
        <div class="history-empty">
          <i class="fa-regular fa-folder-open"></i>
          <h4>Hozircha hech qanday ariza yuborilmagan</h4>
          <p>Siz sayt orqali ariza topshirganingizda, ular shu yerda ko'rinadi.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = list.map(item => `
      <div class="history-item">
        <div class="history-item-left">
          <h5>${escapeHtml(item.firstName)} ${escapeHtml(item.lastName)} <span style="font-weight: normal; color: var(--primary);">#${escapeHtml(item.id)}</span></h5>
          <p><i class="fa-solid fa-graduation-cap"></i> ${escapeHtml(item.course)} | <i class="fa-solid fa-location-dot"></i> ${escapeHtml(item.region)}</p>
          <p><i class="fa-regular fa-clock"></i> ${escapeHtml(item.createdAt)}</p>
        </div>
        <div class="history-item-status">
          <i class="fa-solid fa-spinner fa-spin"></i> Ko'rib chiqilmoqda
        </div>
      </div>
    `).join('');
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  // ==================== 9. TEZKOR QAYTA QO'NG'IROQ FORMASI ====================
  const quickCallbackForm = document.getElementById('quickCallbackForm');
  quickCallbackForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('quickName')?.value.trim();
    const phone = document.getElementById('quickPhone')?.value.trim();

    if (!name || phone.length < 8) {
      showToast('Iltimos, ismingiz va to\'liq telefon raqamingizni kiriting!', 'error');
      return;
    }

    closeModal('callbackModal');
    showToast(`Rahmat, ${name}! Operatorimiz 1 daqiqa ichida qo'ng'iroq qiladi.`, 'success');
    quickCallbackForm.reset();
  });

  // ==================== 10. FIKRLAR SLAYDERI (TESTIMONIALS CAROUSEL) ====================
  const testimonials = document.querySelectorAll('.testi-card');
  const dots = document.querySelectorAll('.slider-dots .dot');
  const prevBtn = document.getElementById('sliderPrevBtn');
  const nextBtn = document.getElementById('sliderNextBtn');
  let currentSlide = 0;
  let slideInterval = null;

  function showSlide(index) {
    if (index >= testimonials.length) index = 0;
    if (index < 0) index = testimonials.length - 1;

    currentSlide = index;

    testimonials.forEach((card, idx) => {
      card.classList.toggle('active', idx === currentSlide);
    });

    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentSlide);
    });
  }

  prevBtn?.addEventListener('click', () => {
    showSlide(currentSlide - 1);
    resetSlideTimer();
  });

  nextBtn?.addEventListener('click', () => {
    showSlide(currentSlide + 1);
    resetSlideTimer();
  });

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.getAttribute('data-index'), 10);
      showSlide(idx);
      resetSlideTimer();
    });
  });

  function startSlideTimer() {
    slideInterval = setInterval(() => {
      showSlide(currentSlide + 1);
    }, 6000);
  }

  function resetSlideTimer() {
    clearInterval(slideInterval);
    startSlideTimer();
  }

  startSlideTimer();

  // ==================== 11. FAQ AKKORDEON ====================
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    questionBtn?.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Boshqa barcha savollarni yopish
      faqItems.forEach(f => f.classList.remove('active'));

      // Tanlanganni ochish/yopish
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // ==================== 12. TOAST BILDIRISHNOMALARI TIZIMI ====================
  window.showToast = function(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let iconClass = 'fa-solid fa-circle-info';
    if (type === 'success') iconClass = 'fa-solid fa-circle-check';
    if (type === 'error') iconClass = 'fa-solid fa-triangle-exclamation';

    toast.innerHTML = `
      <i class="${iconClass} toast-icon"></i>
      <span class="toast-msg">${message}</span>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-100%)';
      toast.style.transition = 'all 0.3s ease-out';
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 4000);
  };
});
