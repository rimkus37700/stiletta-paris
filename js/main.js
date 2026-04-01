/* =============================================
   STILETTA PARIS — JavaScript principal
   ============================================= */

/* =============================================
   PRELOADER
   ============================================= */

window.addEventListener('load', function() {
  var preloader = document.querySelector('.preloader');
  if (!preloader) return;
  setTimeout(function() {
    preloader.classList.add('hidden');
  }, 1800);
});

/* =============================================
   TRANSITIONS ENTRE PAGES
   ============================================= */

var transition = document.querySelector('.page-transition');

document.addEventListener('DOMContentLoaded', function() {
  if (!transition) return;
  transition.classList.add('leave');
  transition.addEventListener('animationend', function() {
    transition.classList.remove('leave');
  }, { once: true });
});

document.addEventListener('click', function(e) {
  var link = e.target.closest('a');
  if (!link) return;
  var href = link.getAttribute('href');
  if (!href || href.startsWith('#') || href.startsWith('mailto:') ||
      href.startsWith('http') || link.target === '_blank') return;
  e.preventDefault();
  if (transition) {
    transition.classList.add('enter');
    transition.addEventListener('animationend', function() {
      window.location.href = href;
    }, { once: true });
  } else {
    window.location.href = href;
  }
});

/* =============================================
   PARALLAX HERO
   ============================================= */

var heroBg = document.querySelector('.hero-bg');
if (heroBg) {
  window.addEventListener('scroll', function() {
    heroBg.style.transform = 'translateY(' + (window.scrollY * 0.35) + 'px)';
  }, { passive: true });
}

/* =============================================
   COMPTEUR ÉDITION LIMITÉE
   ============================================= */

var TOTAL_EDITION = 250;

function getStockData() {
  var sold = parseInt(localStorage.getItem('stiletta_sold') || '100', 10);
  var cartData;
  try { cartData = JSON.parse(localStorage.getItem('stiletta_cart')) || { qty: 0 }; }
  catch(e) { cartData = { qty: 0 }; }
  var reserved = cartData.qty || 0;
  return { sold: sold, reserved: reserved, remaining: Math.max(0, TOTAL_EDITION - sold - reserved) };
}

function renderCounter() {
  var counterEl = document.querySelector('.edition-counter');
  if (!counterEl) return;
  var data = getStockData();
  var filledPct = ((data.sold + data.reserved) / TOTAL_EDITION) * 100;
  var bar = counterEl.querySelector('.counter-bar');
  var textEl = counterEl.querySelector('.counter-text');
  if (bar && textEl) {
    bar.style.width = filledPct + '%';
    textEl.innerHTML = '<span class="counter-number">' + data.remaining + '</span> exemplaire' + (data.remaining > 1 ? 's' : '') + ' disponible' + (data.remaining > 1 ? 's' : '');
  } else {
    counterEl.innerHTML =
      '<div class="counter-track"><div class="counter-bar" style="width:0%"></div></div>' +
      '<p class="counter-text"><span class="counter-number">' + data.remaining + '</span> exemplaire' + (data.remaining > 1 ? 's' : '') + ' disponible' + (data.remaining > 1 ? 's' : '') + '</p>';
    requestAnimationFrame(function() {
      setTimeout(function() {
        var b = counterEl.querySelector('.counter-bar');
        if (b) {
          b.style.transition = 'width 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
          b.style.width = filledPct + '%';
        }
      }, 200);
    });
  }
}

window.addEventListener('storage', renderCounter);
renderCounter();

/* =============================================
   BLOC PRINCIPAL — DOMContentLoaded
   ============================================= */

document.addEventListener('DOMContentLoaded', function() {

  /* ---- HEADER scroll ---- */
  var header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', function() {
      header.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
  }

  /* ---- NAVIGATION MOBILE ---- */
  var hamburger   = document.querySelector('.hamburger');
  var mobileNav   = document.querySelector('.mobile-nav');
  var mobileClose = document.querySelector('.mobile-nav-close');

  if (hamburger && mobileNav) {
    function openNav() {
      mobileNav.classList.add('open');
      hamburger.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
    function closeNav() {
      mobileNav.classList.remove('open');
      hamburger.classList.remove('active');
      document.body.style.overflow = '';
    }
    hamburger.addEventListener('click', function() {
      mobileNav.classList.contains('open') ? closeNav() : openNav();
    });
    if (mobileClose) mobileClose.addEventListener('click', closeNav);
    mobileNav.querySelectorAll('a').forEach(function(l) { l.addEventListener('click', closeNav); });
  }

  /* ---- CITATION ---- */
  var citationInner = document.querySelector('.citation-inner');
  if (citationInner) {
    var citObs = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting) { e.target.classList.add('visible'); citObs.unobserve(e.target); }
      });
    }, { threshold: 0.4 });
    citObs.observe(citationInner);
  }

  /* ---- FADE-IN SCROLL ---- */
  var fadeEls = document.querySelectorAll('.fade-in');
  if (fadeEls.length) {
    var io = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    fadeEls.forEach(function(el) { io.observe(el); });
  }

  /* ---- PANIER ---- */
  var PRODUCT = { name: 'Stiletta Palm', edition: 'Édition Inaugurale', price: 540, image: 'images/product-01.png' };
  var cart;
  try { cart = JSON.parse(localStorage.getItem('stiletta_cart')) || { qty: 0, color: 'Noir Intense' }; }
  catch(e) { cart = { qty: 0, color: 'Noir Intense' }; }

  function saveCart() { localStorage.setItem('stiletta_cart', JSON.stringify(cart)); }

  var cartOverlay  = document.querySelector('.cart-overlay');
  var cartPanel    = document.querySelector('.cart-panel');
  var cartCloseBtn = document.querySelector('.cart-close');
  var cartIconBtn  = document.querySelector('.cart-icon');
  var cartCountEl  = document.querySelector('.cart-count');
  var cartBodyEl   = document.querySelector('.cart-body');
  var cartTotalEl  = document.querySelector('.cart-total-price');
  var addToCartBtn = document.querySelector('.btn-add-cart');

  function openCart()  { if (cartOverlay) cartOverlay.classList.add('open'); if (cartPanel) cartPanel.classList.add('open'); document.body.style.overflow = 'hidden'; }
  function closeCart() { if (cartOverlay) cartOverlay.classList.remove('open'); if (cartPanel) cartPanel.classList.remove('open'); document.body.style.overflow = ''; }

  function renderCart() {
    if (cartCountEl) { cartCountEl.textContent = cart.qty; cartCountEl.style.display = cart.qty > 0 ? 'inline-flex' : 'none'; }
    if (cartTotalEl) cartTotalEl.textContent = (PRODUCT.price * cart.qty).toLocaleString('fr-FR') + ' €';
    if (!cartBodyEl) return;
    if (cart.qty === 0) { cartBodyEl.innerHTML = '<p class="cart-empty">Votre sélection est vide.</p>'; return; }
    cartBodyEl.innerHTML =
      '<div class="cart-item">' +
      '<img src="' + PRODUCT.image + '" alt="Stiletta Palm" class="cart-item-image" loading="lazy">' +
      '<div class="cart-item-info">' +
      '<p class="cart-item-name">' + PRODUCT.name + '</p>' +
      '<p class="cart-item-edition">' + cart.color + '</p>' +
      '<p class="cart-item-price">' + (PRODUCT.price * cart.qty).toLocaleString('fr-FR') + ' €</p>' +
      '<div class="qty-control">' +
      '<button class="qty-btn minus" aria-label="Réduire">−</button>' +
      '<span class="qty-value">' + cart.qty + '</span>' +
      '<button class="qty-btn plus" aria-label="Augmenter">+</button>' +
      '</div></div></div>';
    cartBodyEl.querySelector('.minus').addEventListener('click', function() { cart.qty = Math.max(0, cart.qty - 1); saveCart(); renderCart(); renderCounter(); });
    cartBodyEl.querySelector('.plus').addEventListener('click', function() { if (getStockData().remaining <= 0) return; cart.qty++; saveCart(); renderCart(); renderCounter(); });
  }

  if (cartIconBtn) cartIconBtn.addEventListener('click', openCart);
  if (cartCloseBtn) cartCloseBtn.addEventListener('click', closeCart);
  if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', function() {
      if (getStockData().remaining <= 0) return;
      var swatch = document.querySelector('.coloris-swatch.active');
      if (swatch) cart.color = swatch.dataset.color || cart.color;
      cart.qty++;
      saveCart();
      renderCart();
      renderCounter();
      openCart();
    });
  }

  var checkoutBtn = document.querySelector('.btn-checkout');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', function(e) {
      if (cart.qty === 0) return;
      e.preventDefault();
      var currentSold = parseInt(localStorage.getItem('stiletta_sold') || '100', 10);
      localStorage.setItem('stiletta_sold', currentSold + cart.qty);
      cart.qty = 0; cart.color = 'Noir Intense';
      saveCart(); renderCart(); renderCounter(); closeCart();
      setTimeout(function() { window.location.href = 'boutique.html'; }, 400);
    });
  }

  renderCart();

  /* ---- GALERIE PRODUIT ---- */
  var thumbs  = document.querySelectorAll('.product-thumb');
  var mainImg = document.querySelector('.product-main-image');
  if (mainImg) mainImg.style.transition = 'opacity 0.2s ease';
  thumbs.forEach(function(thumb) {
    thumb.addEventListener('click', function() {
      thumbs.forEach(function(t) { t.classList.remove('active'); });
      thumb.classList.add('active');
      if (mainImg) {
        mainImg.style.opacity = '0';
        setTimeout(function() {
          mainImg.src = thumb.querySelector('img').src;
          mainImg.alt = thumb.querySelector('img').alt;
          mainImg.style.opacity = '1';
        }, 200);
      }
    });
  });

  /* ---- COLORIS ---- */
  document.querySelectorAll('.coloris-swatch').forEach(function(swatch) {
    swatch.addEventListener('click', function() {
      document.querySelectorAll('.coloris-swatch').forEach(function(s) { s.classList.remove('active'); });
      swatch.classList.add('active');
      cart.color = swatch.dataset.color || 'Noir Intense';
    });
  });

  /* ---- NEWSLETTER ---- */
  document.querySelectorAll('.newsletter-form').forEach(function(form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      var input = form.querySelector('.newsletter-input');
      if (!input || !input.value.trim()) return;
      var original = input.placeholder;
      input.value = '';
      input.placeholder = 'Inscription confirmée — merci.';
      input.style.color = 'var(--or)';
      setTimeout(function() { input.placeholder = original; input.style.color = ''; }, 4000);
    });
  });

  /* ---- FORMULAIRE CONTACT ---- */
  var contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      var btn     = contactForm.querySelector('.btn-submit');
      var success = document.getElementById('form-success');
      var data    = new FormData(contactForm);
      btn.textContent = 'Envoi en cours…';
      btn.disabled = true;
      btn.style.opacity = '0.6';
      fetch(contactForm.action, { method: 'POST', body: data, headers: { 'Accept': 'application/json' } })
        .then(function(res) { return res.json(); })
        .then(function(json) {
          if (json.success) {
            contactForm.reset();
            btn.style.display = 'none';
            if (success) success.style.display = 'block';
          } else {
            btn.textContent = json.message || 'Une erreur est survenue';
            btn.style.opacity = '1';
            btn.disabled = false;
            setTimeout(function() { btn.textContent = 'Envoyer'; btn.style.opacity = ''; }, 3000);
          }
        })
        .catch(function() {
          btn.textContent = 'Vérifiez votre connexion';
          btn.style.opacity = '1';
          btn.disabled = false;
          setTimeout(function() { btn.textContent = 'Envoyer'; }, 3000);
        });
    });
  }

  /* ---- COOKIES ---- */
  var cookieBanner = document.querySelector('.cookie-banner');
  if (cookieBanner && !localStorage.getItem('stiletta_cookies')) {
    setTimeout(function() { cookieBanner.classList.add('visible'); }, 1800);
  }
  var acceptBtn = document.querySelector('.cookie-btn.accept');
  var refuseBtn = document.querySelector('.cookie-btn.refuse');
  if (acceptBtn) acceptBtn.addEventListener('click', function() { localStorage.setItem('stiletta_cookies', 'accepted'); if (cookieBanner) cookieBanner.classList.remove('visible'); });
  if (refuseBtn) refuseBtn.addEventListener('click', function() { localStorage.setItem('stiletta_cookies', 'refused'); if (cookieBanner) cookieBanner.classList.remove('visible'); });

  /* =============================================
     SEARCH OVERLAY
     ============================================= */

  var searchOverlay  = document.querySelector('.search-overlay');
  var searchInput    = document.querySelector('.search-input');
  var searchCloseBtn = document.querySelector('.search-close-btn');
  var searchBtn      = document.querySelector('.icon-btn[aria-label="Rechercher"]');

  function openSearch() {
    if (!searchOverlay) return;
    searchOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(function() { if (searchInput) searchInput.focus(); }, 100);
  }

  function closeSearch() {
    if (searchOverlay) searchOverlay.classList.remove('open');
    document.body.style.overflow = '';
    if (searchInput) searchInput.value = '';
    filterSearchResults('');
  }

  function filterSearchResults(q) {
    document.querySelectorAll('.search-result-item').forEach(function(item) {
      var text = (item.getAttribute('data-search') || '') + ' ' + (item.querySelector('.search-result-name') ? item.querySelector('.search-result-name').textContent : '');
      item.classList.toggle('hidden', q.length > 0 && text.toLowerCase().indexOf(q.toLowerCase()) === -1);
    });
  }

  if (searchBtn)      searchBtn.addEventListener('click', openSearch);
  if (searchCloseBtn) searchCloseBtn.addEventListener('click', closeSearch);
  if (searchInput)    searchInput.addEventListener('input', function() { filterSearchResults(searchInput.value); });
  if (searchOverlay)  searchOverlay.addEventListener('click', function(e) { if (e.target === searchOverlay) closeSearch(); });

  /* =============================================
     ACCOUNT DROPDOWN
     ============================================= */

  var accountBtn      = document.querySelector('.icon-btn[aria-label="Mon compte"]');
  var accountDropdown = document.querySelector('.account-dropdown');

  if (accountBtn) {
    accountBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      if (accountDropdown) accountDropdown.classList.toggle('open');
    });
  }

  document.addEventListener('click', function(e) {
    if (!accountDropdown) return;
    if (!accountDropdown.contains(e.target) && e.target !== accountBtn) {
      accountDropdown.classList.remove('open');
    }
  });

  /* =============================================
     WAITLIST FORM
     ============================================= */

  var waitlistForm    = document.getElementById('waitlist-form');
  var waitlistConfirm = document.getElementById('waitlist-confirm');

  if (waitlistForm) {
    // If already registered, show confirmation immediately
    var alreadyRegistered = false;
    try { alreadyRegistered = !!localStorage.getItem('stiletta_waitlist_email'); } catch(e) {}
    if (alreadyRegistered && waitlistConfirm) {
      waitlistForm.style.display = 'none';
      waitlistConfirm.style.display = 'block';
    }

    waitlistForm.addEventListener('submit', function(e) {
      e.preventDefault();
      var emailInput = waitlistForm.querySelector('.waitlist-input');
      var email = emailInput ? emailInput.value.trim() : '';
      if (!email || email.indexOf('@') === -1) {
        if (emailInput) emailInput.focus();
        return;
      }
      // Store in localStorage
      try {
        var list;
        try { list = JSON.parse(localStorage.getItem('stiletta_waitlist')) || []; } catch(er) { list = []; }
        if (list.indexOf(email) === -1) list.push(email);
        localStorage.setItem('stiletta_waitlist', JSON.stringify(list));
        localStorage.setItem('stiletta_waitlist_email', email);
      } catch(er) {}
      // Show confirmation
      waitlistForm.style.display = 'none';
      if (waitlistConfirm) waitlistConfirm.style.display = 'block';
    });
  }

  /* =============================================
     WISHLIST
     ============================================= */

  var WISHLIST_PRODUCT = { name: 'Stiletta Palm', price: 540, image: 'images/product-01.png' };
  var wishlist;
  try { wishlist = JSON.parse(localStorage.getItem('stiletta_wishlist')) || []; }
  catch(e) { wishlist = []; }

  function saveWishlist() { localStorage.setItem('stiletta_wishlist', JSON.stringify(wishlist)); }

  var wishlistOverlay  = document.querySelector('.wishlist-overlay');
  var wishlistPanel    = document.querySelector('.wishlist-panel');
  var wishlistCloseBtn = document.querySelector('.wishlist-close');
  var wishlistBtn      = document.querySelector('.icon-btn[aria-label="Mes favoris"]');
  var wishlistCountEl  = document.querySelector('.wishlist-count');
  var wishlistBodyEl   = document.querySelector('.wishlist-body');

  function openWishlist()  { if (wishlistOverlay) wishlistOverlay.classList.add('open'); if (wishlistPanel) wishlistPanel.classList.add('open'); document.body.style.overflow = 'hidden'; }
  function closeWishlist() { if (wishlistOverlay) wishlistOverlay.classList.remove('open'); if (wishlistPanel) wishlistPanel.classList.remove('open'); document.body.style.overflow = ''; }

  function renderWishlist() {
    if (wishlistCountEl) { wishlistCountEl.textContent = wishlist.length; wishlistCountEl.style.display = wishlist.length > 0 ? 'inline-flex' : 'none'; }
    if (!wishlistBodyEl) return;
    if (wishlist.length === 0) { wishlistBodyEl.innerHTML = '<p class="wishlist-empty">Votre liste de souhaits est vide.</p>'; return; }
    var html = '';
    for (var i = 0; i < wishlist.length; i++) {
      var item = wishlist[i];
      html += '<div class="wishlist-item" data-index="' + i + '">' +
        '<img src="' + item.image + '" alt="' + item.name + '" class="wishlist-item-image" loading="lazy">' +
        '<div class="wishlist-item-info">' +
        '<p class="wishlist-item-name">' + item.name + '</p>' +
        '<p class="wishlist-item-price">' + item.price.toLocaleString('fr-FR') + ' €</p>' +
        '<div class="wishlist-item-actions">' +
        '<button class="btn-wishlist-to-cart" data-index="' + i + '">Ajouter au panier</button>' +
        '<button class="btn-wishlist-remove" data-index="' + i + '">Retirer</button>' +
        '</div></div></div>';
    }
    wishlistBodyEl.innerHTML = html;
    wishlistBodyEl.querySelectorAll('.btn-wishlist-remove').forEach(function(btn) {
      btn.addEventListener('click', function() {
        wishlist.splice(parseInt(btn.getAttribute('data-index'), 10), 1);
        saveWishlist(); renderWishlist();
      });
    });
    wishlistBodyEl.querySelectorAll('.btn-wishlist-to-cart').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var c;
        try { c = JSON.parse(localStorage.getItem('stiletta_cart')) || { qty: 0, color: 'Noir Intense' }; }
        catch(e) { c = { qty: 0, color: 'Noir Intense' }; }
        c.qty++;
        localStorage.setItem('stiletta_cart', JSON.stringify(c));
        closeWishlist();
        if (window.location.pathname.indexOf('boutique') === -1) {
          window.location.href = 'boutique.html';
        } else {
          window.dispatchEvent(new Event('storage'));
        }
      });
    });
  }

  var addWishlistBtn = document.querySelector('.btn-add-wishlist');
  if (addWishlistBtn) {
    addWishlistBtn.addEventListener('click', function() {
      var exists = false;
      for (var i = 0; i < wishlist.length; i++) { if (wishlist[i].name === WISHLIST_PRODUCT.name) { exists = true; break; } }
      if (!exists) { wishlist.push({ name: WISHLIST_PRODUCT.name, price: WISHLIST_PRODUCT.price, image: WISHLIST_PRODUCT.image }); saveWishlist(); renderWishlist(); }
      openWishlist();
    });
  }

  if (wishlistBtn)      wishlistBtn.addEventListener('click', openWishlist);
  if (wishlistCloseBtn) wishlistCloseBtn.addEventListener('click', closeWishlist);
  if (wishlistOverlay)  wishlistOverlay.addEventListener('click', closeWishlist);

  renderWishlist();

  /* ---- ECHAP global ---- */
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeSearch();
      if (accountDropdown) accountDropdown.classList.remove('open');
      closeWishlist();
      closeCart();
    }
  });

  /* ---- FAQ (si page faq.html) ---- */
  document.querySelectorAll('.faq-cat-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.faq-cat-btn').forEach(function(b) { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
      document.querySelectorAll('.faq-section').forEach(function(s) { s.classList.remove('visible'); });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      var target = document.getElementById(btn.getAttribute('data-target'));
      if (target) target.classList.add('visible');
    });
  });

  document.querySelectorAll('.faq-question').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var item = btn.closest('.faq-item');
      var isOpen = item.classList.contains('open');
      var section = item.closest('.faq-section');
      if (section) section.querySelectorAll('.faq-item').forEach(function(i) { i.classList.remove('open'); });
      if (!isOpen) item.classList.add('open');
    });
  });

}); // fin DOMContentLoaded
