const leftCursor = document.querySelector('.left-cursor');
const rightCursor = document.querySelector('.right-cursor');
const logoIcon = document.querySelector('.logo-icon');
const contactLink = document.querySelector('.contact-link');
const emailLink = document.querySelector('.email-link');
const phoneLink = document.querySelector('.phone-link');
const addressLink = document.querySelector('.address-link');

// Only add event listeners if elements exist
if (leftCursor && rightCursor) {
  let isScrolling = false;

  // Hide during scroll
  window.addEventListener('scroll', function() {
    isScrolling = true;
    leftCursor.style.display = 'none';
    rightCursor.style.display = 'none';
    setTimeout(() => isScrolling = false, 50);
  });

  // Smooth cursor movement with instant switching
  document.addEventListener('mousemove', function(e) {
    if (isScrolling) return;
    
    // Check if hovering over clickable elements
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

  // Hide when mouse leaves window
  document.addEventListener('mouseout', function() {
    leftCursor.style.display = 'none';
    rightCursor.style.display = 'none';
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

// Counter animation function
function animateCounters() {
  const counters = document.querySelectorAll('.counter');
  
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target'));
    let current = 0;
    const increment = Math.ceil(target / 100); // Divide the animation into 100 steps
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        counter.textContent = target.toLocaleString();
        clearInterval(timer);
      } else {
        counter.textContent = current.toLocaleString();
      }
    }, 20); // Update every 20ms
  });
}

// Start animation when page loads
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, starting counter animation');
  animateCounters();
});

// Rest of your existing cursor code...