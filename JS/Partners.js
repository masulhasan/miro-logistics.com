const leftCursor = document.querySelector('.left-cursor');
const rightCursor = document.querySelector('.right-cursor');
const logoIcon = document.querySelector('.logo-icon');
const contactLink = document.querySelector('.contact-link');
const segments = document.querySelectorAll('.segment');

const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
let isScrolling = false;
let activeSegment = null;

// =========================
// Desktop Cursor Behavior
// =========================
if (!isMobile) {
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
                            e.target.closest('.segment');

    if (isOverClickable) {
      leftCursor.style.display = 'none';
      rightCursor.style.display = 'none';
      return;
    }

    const middle = window.innerWidth / 2;
    const isLeftSide = e.clientX < middle;

    const cursor = isLeftSide ? leftCursor : rightCursor;
    const otherCursor = isLeftSide ? rightCursor : leftCursor;

    otherCursor.style.display = 'none';
    cursor.style.display = 'block';
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
  });

  // Desktop click-based navigation
  document.addEventListener('click', function (e) {
    if (
      e.target.closest('.top-bar') ||
      e.target === logoIcon ||
      e.target === contactLink ||
      e.target.closest('.segment') ||
      e.target.closest('.team-member a')
    ) {
      return;
    }

    const middle = window.innerWidth / 2;
    const isLeftSide = e.clientX < middle;

    if (isLeftSide) {
      window.location.href = './Renewable-confidence.html';
    } else {
      window.location.href = './In-Numbers.html';
    }
  });
}

// =========================
// Segment Click Behavior (Shared)
// =========================
segments.forEach(segment => {
  segment.addEventListener('click', function (e) {
    e.preventDefault();
    e.stopPropagation();

    if (activeSegment) {
      activeSegment.classList.remove('active');
    }

    if (activeSegment === this) {
      activeSegment = null;
    } else {
      this.classList.add('active');
      activeSegment = this;
    }
  });
});

// =========================
// Mobile Swipe Navigation Only
// =========================
if (isMobile) {
  let touchStartX = 0;
  let touchEndX = 0;

  function handleSwipe() {
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Swipe left: go to next
        window.location.href = './In-Numbers.html';
      } else {
        // Swipe right: go to previous
        window.location.href = './Renewable-confidence.html';
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
