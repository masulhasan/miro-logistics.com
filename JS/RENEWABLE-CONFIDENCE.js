
// RENEWABLE-CONFIDENCE.js - Flicker-Free Enhanced Version
const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
let isScrolling = false;
let scrollTimeout;
let videoObserver;

document.addEventListener('DOMContentLoaded', function() {
    const leftCursor = document.querySelector('.left-cursor');
    const rightCursor = document.querySelector('.right-cursor');
    const logoIcon = document.querySelector('.logo-icon');
    const contactLink = document.querySelector('.contact-link');
    const carouselTrack = document.querySelector('.carousel-track');

    initializeVideos();

    if (carouselTrack) {
        void carouselTrack.offsetWidth;
        carouselTrack.style.animationPlayState = 'running';
    }

    setupScrollHandler(leftCursor, rightCursor, carouselTrack);

    if (!isMobile) {
        setupDesktopInteractions(leftCursor, rightCursor, logoIcon, contactLink);
    } else {
        setupMobileInteractions();
    }
});

function initializeVideos() {
    if (videoObserver) {
        videoObserver.disconnect();
    }

    const carouselContainer = document.querySelector('.right-carousel');
    if (!carouselContainer) return;

    videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const videoContainer = entry.target;
            const video = videoContainer.querySelector('video');
            if (!video) return;

            if (entry.isIntersecting) {
                if (!videoContainer.dataset.canvasCreated) {
                    setupCanvasVideoPlayer(videoContainer, video);
                }
                if (video.readyState >= 2) {
                    playVideoSafely(video);
                } else {
                    video.addEventListener('canplaythrough', () => playVideoSafely(video), { once: true });
                }
            } else {
                video.pause();
            }
        });
    }, {
        root: carouselContainer,
        threshold: [0, 0.25, 0.5, 0.75, 1],
        rootMargin: '25% 0px'
    });

    document.querySelectorAll('.carousel-video').forEach(container => {
        const video = container.querySelector('video');
        if (video) {
            video.loop = true;
            video.muted = true;
            video.playsInline = true;
            video.preload = 'auto';
            video.style.visibility = 'hidden';
            video.style.position = 'absolute';
            video.style.pointerEvents = 'none';
            videoObserver.observe(container);
        }
    });
}

function setupCanvasVideoPlayer(container, video) {
    const canvas = document.createElement('canvas');
    canvas.className = 'video-canvas';
    container.appendChild(canvas);

    const resizeCanvas = () => {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const ctx = canvas.getContext('2d');

    let animationId;
    let lastTime = 0;
    const fadeDuration = 0.5;

    const renderFrame = (timestamp) => {
        if (!container.isConnected) {
            cancelAnimationFrame(animationId);
            return;
        }

        const deltaTime = lastTime ? (timestamp - lastTime) / 1000 : 0;
        lastTime = timestamp;

        let alpha = 1;
        const timeToEnd = video.duration - video.currentTime;

        if (timeToEnd < fadeDuration) {
            alpha = timeToEnd / fadeDuration;
        } else if (video.currentTime < fadeDuration) {
            alpha = video.currentTime / fadeDuration;
        }

        alpha = Math.max(0.1, Math.min(1, alpha));

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#2CA5A0';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = alpha;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 1;

        animationId = requestAnimationFrame(renderFrame);
    };

    video.addEventListener('play', () => {
        if (!animationId) {
            lastTime = 0;
            animationId = requestAnimationFrame(renderFrame);
        }
    });

    video.addEventListener('pause', () => {
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
    });

    const observer = new MutationObserver(() => {
        if (!container.isConnected) {
            if (animationId) cancelAnimationFrame(animationId);
            observer.disconnect();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    container.dataset.canvasCreated = 'true';
}

function playVideoSafely(video) {
    if (video.paused) {
        video.currentTime = 0;
        const playPromise = video.play();

        if (playPromise !== undefined) {
            playPromise.catch(() => {
                video.muted = true;
                video.play().catch(e => console.debug('Video play error:', e));
            });
        }
    }
}

function setupScrollHandler(leftCursor, rightCursor, carouselTrack) {
    window.addEventListener('scroll', function() {
        if (!isScrolling) {
            isScrolling = true;
            if (leftCursor) leftCursor.style.display = 'none';
            if (rightCursor) rightCursor.style.display = 'none';
            if (carouselTrack) {
                carouselTrack.style.animationPlayState = 'running';
            }
        }
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            isScrolling = false;
        }, 100);
    }, { passive: true });
}

function setupDesktopInteractions(leftCursor, rightCursor, logoIcon, contactLink) {
    let mouseMoveThrottle = false;

    document.addEventListener('mousemove', function(e) {
        if (mouseMoveThrottle || isScrolling) return;
        mouseMoveThrottle = true;

        requestAnimationFrame(() => {
            const isOverClickable = e.target.closest('.top-bar') ||
                e.target === logoIcon ||
                e.target === contactLink;

            if (isOverClickable) {
                leftCursor.style.display = 'none';
                rightCursor.style.display = 'none';
            } else {
                const middle = window.innerWidth / 2;
                const isLeftSide = e.clientX < middle;
                const cursor = isLeftSide ? leftCursor : rightCursor;
                const otherCursor = isLeftSide ? rightCursor : leftCursor;

                otherCursor.style.display = 'none';
                cursor.style.display = 'block';
                cursor.style.left = `${e.clientX}px`;
                cursor.style.top = `${e.clientY}px`;
            }
            mouseMoveThrottle = false;
        });
    }, { passive: true });

    document.addEventListener('click', function(e) {
        if (e.target.closest('.top-bar') ||
            e.target === logoIcon ||
            e.target === contactLink) {
            return;
        }

        const middle = window.innerWidth / 2;
        const isLeftSide = e.clientX < middle;
        const pageContainer = document.body;

        if (isLeftSide) {
            pageContainer.classList.add('slide-out-right');
        } else {
            pageContainer.classList.add('slide-out-left');
        }

        setTimeout(() => {
            window.location.href = isLeftSide ? './index.html' : './partners.html';
        }, 600);
    });
}

function setupMobileInteractions() {
    let touchStartX = 0;
    let touchStartY = 0;
    const swipeThreshold = 50;

    document.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    document.addEventListener('touchend', function(e) {
        const touchEndX = e.changedTouches[0].screenX;
        const touchEndY = e.changedTouches[0].screenY;
        const diffX = touchStartX - touchEndX;
        const diffY = touchStartY - touchEndY;

        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > swipeThreshold) {
            const pageContainer = document.body;

            if (diffX > 0) {
                pageContainer.classList.add('slide-out-left');
                setTimeout(() => {
                    window.location.href = './Partners.html';
                }, 500);
            } else {
                pageContainer.classList.add('slide-out-right');
                setTimeout(() => {
                    window.location.href = './index.html';
                }, 500);
            }
        }
    }, { passive: true });
}
