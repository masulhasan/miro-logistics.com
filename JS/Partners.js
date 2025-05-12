const leftCursor = document.querySelector('.left-cursor');
const rightCursor = document.querySelector('.right-cursor');
const logoIcon = document.querySelector('.logo-icon');
const contactLink = document.querySelector('.contact-link');
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
                          e.target === contactLink;

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