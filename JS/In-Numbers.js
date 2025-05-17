const leftCursor = document.querySelector('.left-cursor');
const rightCursor = document.querySelector('.right-cursor');
const logoIcon = document.querySelector('.logo-icon');
const contactLink = document.querySelector('.contact-link');
const emailLink = document.querySelector('.email-link');
const phoneLink = document.querySelector('.phone-link');
const addressLink = document.querySelector('.address-link');

const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

// ======================
// DESKTOP BEHAVIOR ONLY
// ======================
if (!isMobile && leftCursor && rightCursor) {
  let isScrolling = false;

  window.addEventListener('scroll', function () {
    isScrolling = true;
    leftCursor.style.display = 'none';
    rightCursor.style.display = 'none';
    setTimeout(() => isScrolling = false, 50);
  });

  document.addEventListener('mousemove', function (e) {
    if (isScrolling) return;

    const isOverClickable = e.target.closest('.top-bar') ||
      e.target === logoIcon ||
      e.target === contactLink ||
      e.target === emailLink ||
      e.target === phoneLink ||
      e.target === addressLink ||
      e.target.closest('a[href^="mailto:"]') ||
      e.target.closest('a[href^="tel:"]') ||
      e.target.closest('a.address-link');

    if (isOverClickable) {
      leftCursor.style.display = 'none';
      rightCursor.style.display = 'none';
      document.body.style.cursor = 'pointer';
      return;
    } else {
      document.body.style.cursor = 'none';
    }

    const middle = window.innerWidth / 2;
    const isLeftSide = e.clientX < middle;

    if (isLeftSide) {
      leftCursor.style.display = 'block';
      leftCursor.style.left = e.clientX + 'px';
      leftCursor.style.top = e.clientY + 'px';
      rightCursor.style.display = 'none';
    } else {
      rightCursor.style.display = 'block';
      rightCursor.style.left = e.clientX + 'px';
      rightCursor.style.top = e.clientY + 'px';
      leftCursor.style.display = 'none';
    }
  });

  document.addEventListener('mouseout', function () {
    leftCursor.style.display = 'none';
    rightCursor.style.display = 'none';
  });

  // Desktop click navigation
  document.addEventListener('click', function (e) {
    if (e.target.closest('.top-bar') ||
      e.target === logoIcon ||
      e.target === contactLink ||
      e.target.closest('.team-member a')) {
      return;
    }

    const middle = window.innerWidth / 2;
    const isLeftSide = e.clientX < middle;

    if (isLeftSide) {
      window.location.href = './Partners.html';
    } else {
      window.location.href = './Journey.html';
    }
  });
}

// Add pointer cursor for interactive elements if they exist
[logoIcon, contactLink, emailLink, phoneLink, addressLink].forEach(el => {
  if (el) {
    el.addEventListener('mouseenter', () => {
      document.body.style.cursor = 'pointer';
    });
    el.addEventListener('mouseleave', () => {
      document.body.style.cursor = 'none';
    });
  }
});

// ======================
// COUNTER ANIMATION
// ======================
function animateCounters() {
  const counters = document.querySelectorAll('.counter');

  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target'));
    let current = 0;
    const increment = Math.ceil(target / 100);

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        counter.textContent = target.toLocaleString();
        clearInterval(timer);
      } else {
        counter.textContent = current.toLocaleString();
      }
    }, 20);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  animateCounters();
});

// ======================
// MOBILE SWIPE NAVIGATION ONLY
// ======================
if (isMobile) {
  let touchStartX = 0;
  let touchEndX = 0;

  function handleSwipe() {
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Swipe Left → next page
        window.location.href = './Journey.html';
      } else {
        // Swipe Right → previous page
        window.location.href = './Partners.html';
      }
    }
  }

  document.addEventListener('touchstart', function (e) {
    touchStartX = e.changedTouches[0].screenX;
  }, false);

  document.addEventListener('touchend', function (e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, false);
}
