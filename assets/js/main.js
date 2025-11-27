/**
* Template Name: PhotoFolio
* Template URL: https://bootstrapmade.com/photofolio-bootstrap-photography-website-template/
* Updated: Aug 07 2024 with Bootstrap v5.3.3
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

(function() {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  mobileNavToggleBtn.addEventListener('click', mobileNavToogle);

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });


  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

})();

 

let selectedItem = {};
let totalPrice = 0;
let popupHistoryActive = false;
let popupScrollPosition = 0;

// Убеждаемся, что функция доступна глобально
window.openOrder = function(image, title, price) {
  console.log('openOrder called with:', { image, title, price });
  
  // сохраняем выбранный товар
  selectedItem = { image, title, price: parseInt(price, 10) };

  popupScrollPosition = window.scrollY || document.documentElement.scrollTop || 0;
  if (!popupHistoryActive) {
    window.history.pushState({ popup: 'order' }, '');
    popupHistoryActive = true;
  }

  // показываем попап
  const popup = document.getElementById('orderPopup');
  if (!popup) {
    console.error('Popup element not found!');
    alert('Ошибка: попап не найден на странице');
    return;
  }
  
  console.log('Showing popup');
  popup.style.display = 'flex';
  document.body.style.overflow = 'hidden';

  // подставляем данные
  const popupImage = document.getElementById('popupImage');
  const popupTitle = document.getElementById('popupTitle');
  if (popupImage) {
    popupImage.src = image;
    popupImage.onerror = function() {
      console.error('Failed to load popup image:', image);
      this.src = 'assets/img/favicon.png';
    };
    popupImage.onload = function() {
      console.log('Popup image loaded successfully:', image);
    };
  } else {
    console.error('popupImage element not found!');
  }
  if (popupTitle) {
    popupTitle.innerText = title;
  } else {
    console.error('popupTitle element not found!');
  }

  // сбрасываем чекбоксы
  const designReadyCheckbox = document.getElementById('designReadyCheckbox');
  if (designReadyCheckbox) designReadyCheckbox.checked = false;
  const policyCheckbox = document.getElementById('policyAgree');
  if (policyCheckbox) policyCheckbox.checked = false;

  // ставим базовую цену для товара
  totalPrice = selectedItem.price;

  // обновляем цену и WhatsApp ссылку
  updatePrice();
  updateConsentStatus();

  // закрытие по клику вне окна
  popup.onclick = function (event) {
    if (event.target === popup) {
      closeOrder();
    }
  };
};

// Алиас для обратной совместимости
function openOrder(image, title, price) {
  window.openOrder(image, title, price);
}

// Альтернативная функция для открытия попапа из data-атрибутов
function openOrderFromData(element) {
  const image = element.getAttribute('data-image');
  const title = element.getAttribute('data-title');
  const price = element.getAttribute('data-price');
  if (image && title && price) {
    window.openOrder(image, title, price);
  } else {
    console.error('Missing data attributes:', { image, title, price });
  }
}

function updatePrice() {
  if (!selectedItem || !selectedItem.price) return;
  
  totalPrice = selectedItem.price;

  const popupPrice = document.getElementById('popupPrice');
  if (popupPrice) popupPrice.innerText = `Цена: ${totalPrice} ₽`;

  const designReadyCheckbox = document.getElementById('designReadyCheckbox');
  const designStatus = designReadyCheckbox && designReadyCheckbox.checked ? ' (готовая картина)' : ' (индивидуальная работа)';
  
  const message = encodeURIComponent(`Хочу заказать ${selectedItem.title} за ${totalPrice} ₽${designStatus}`);
  const whatsappLink = document.getElementById('whatsappLink');
  const telegramLink = document.getElementById('telegramLink');
  if (whatsappLink) whatsappLink.href = `https://wa.me/79517623467?text=${message}`;
  if (telegramLink) telegramLink.href = `https://t.me/IrisArts1?text=${message}`;
}

function openPolicyPopup(event) {
  if (event) event.preventDefault();
  const popup = document.getElementById('policyPopup');
  if (popup) {
    popup.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
}

function closePolicyPopup(event) {
  if (event && event.target !== event.currentTarget) return;
  const popup = document.getElementById('policyPopup');
  if (popup) {
    popup.style.display = 'none';
    document.body.style.overflow = '';
  }
}

function updateConsentStatus() {
  const policyCheckbox = document.getElementById('policyAgree');
  const messengerButtons = document.querySelectorAll('.popup-messengers a');

  if (!messengerButtons.length) return;
  const isAllowed = policyCheckbox ? policyCheckbox.checked : true;

  messengerButtons.forEach((button) => {
    if (!button) return;
    button.classList.toggle('disabled', !isAllowed);
    button.setAttribute('aria-disabled', (!isAllowed).toString());
    button.tabIndex = isAllowed ? 0 : -1;
  });
}



// Закрытие попапа
function closeOrder(event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  if (popupHistoryActive) {
    window.history.back();
    return;
  }
  hideOrderPopup();
}

function hideOrderPopup(scrollTarget) {
  const popup = document.getElementById('orderPopup');
  if (!popup) return;
  popup.style.display = 'none';
  document.body.style.overflow = '';
  if (typeof scrollTarget === 'number') {
    requestAnimationFrame(() => {
      window.scrollTo({
        top: scrollTarget,
        behavior: 'auto'
      });
    });
  }
}

window.addEventListener('popstate', () => {
  if (popupHistoryActive) {
    popupHistoryActive = false;
    hideOrderPopup(popupScrollPosition);
  }
});

  function toggleItems(type) {
    const frontItems = document.getElementById('frontItems');
    const backItems = document.getElementById('backItems');
    const frontBtn = document.getElementById('frontBtn');
    const backBtn = document.getElementById('backBtn');

    if (type === 'front') {
      frontItems.style.display = 'flex';
      backItems.style.display = 'none';
      frontBtn.classList.add('active');
      backBtn.classList.remove('active');
    } else {
      backItems.style.display = 'flex';
      frontItems.style.display = 'none';
      backBtn.classList.add('active');
      frontBtn.classList.remove('active');
    }
  }
  const reviewsWrapper = document.querySelector('.reviews-wrapper');
let isMouseDown = false;
let startX, scrollLeft;

reviewsWrapper.addEventListener('mousedown', (e) => {
  isMouseDown = true;
  startX = e.pageX - reviewsWrapper.offsetLeft;
  scrollLeft = reviewsWrapper.scrollLeft;
  reviewsWrapper.style.cursor = 'grabbing';
});

reviewsWrapper.addEventListener('mouseleave', () => {
  isMouseDown = false;
  reviewsWrapper.style.cursor = 'grab';
});

reviewsWrapper.addEventListener('mouseup', () => {
  isMouseDown = false;
  reviewsWrapper.style.cursor = 'grab';
});

reviewsWrapper.addEventListener('mousemove', (e) => {
  if (!isMouseDown) return;
  const x = e.pageX - reviewsWrapper.offsetLeft;
  const walk = (x - startX) * 3; // Скорость прокрутки
  reviewsWrapper.scrollLeft = scrollLeft - walk;
});

reviewsWrapper.addEventListener('wheel', (e) => {
  e.preventDefault();
  reviewsWrapper.scrollLeft += e.deltaY; // Прокрутка мышью
});

// Автозапуск видео в отзывах при появлении в области видимости
function initReviewVideos() {
  const reviewVideos = document.querySelectorAll('.review-video video');
  
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.3 // Видео начнет воспроизводиться, когда 30% его видно
  };

  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const video = entry.target;
      if (entry.isIntersecting) {
        video.play().catch(err => {
          // Игнорируем ошибки автозапуска (некоторые браузеры блокируют автозапуск)
          console.log('Video autoplay prevented:', err);
        });
      } else {
        video.pause();
        video.currentTime = 0; // Сбрасываем видео в начало
      }
    });
  }, observerOptions);

  reviewVideos.forEach(video => {
    video.setAttribute('autoplay', '');
    video.setAttribute('loop', '');
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    videoObserver.observe(video);
  });

  // Также запускаем видео при наведении на карточку
  const reviewCards = document.querySelectorAll('.review-card');
  reviewCards.forEach(card => {
    const video = card.querySelector('video');
    if (!video) return;

    card.addEventListener('mouseenter', () => {
      video.play().catch(err => {
        console.log('Video play on hover prevented:', err);
      });
    });

    card.addEventListener('mouseleave', () => {
      // Не останавливаем видео при уходе мыши, только при выходе из области видимости
    });
  });
}

// Инициализация при загрузке страницы
window.addEventListener('load', initReviewVideos);

