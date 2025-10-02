// RENEWABLE-CONFIDENCE.js - Enhanced with Safari Fallback
const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
let isScrolling = false;
let scrollTimeout;
let videoObserver;

document.addEventListener('DOMContentLoaded', function() {
    const leftCursor = document.querySelector('.left-cursor');
    const rightCursor = document.querySelector('.right-cursor');
    const logoIcon = document.querySelector('.logo-icon');
    const contactLink = document.querySelector('.contact-link');
    const carouselTrack = document.querySelector('.carousel-track');

    // Safari fallback - replace videos with images
    if (isSafari) {
        setupSafariFallback();
        return; // Skip video initialization for Safari
    }

    // Non-Safari browsers - continue with video logic
    initializeVideos();
    
    // Ensure carousel starts and never stops
    if (carouselTrack) {
        // Force a reflow
        carouselTrack.offsetHeight;
        // Ensure animation is running
        carouselTrack.style.animationPlayState = 'running';
        carouselTrack.style.willChange = 'transform';
        
        // Backup: restart animation if it ever stops
        setInterval(() => {
            if (carouselTrack.style.animationPlayState !== 'running') {
                carouselTrack.style.animationPlayState = 'running';
            }
        }, 1000);
    }

    setupScrollHandler(leftCursor, rightCursor);

    if (!isMobile) {
        setupDesktopInteractions(leftCursor, rightCursor, logoIcon, contactLink);
    } else {
        setupMobileInteractions();
    }
});

function setupSafariFallback() {
    const carousel = document.querySelector(".right-carousel");
    
    if (carousel) {
        const imageSet = [
            "Assets/img/Safari-Img/Ship_2.jpg",
            "Assets/img/Safari-Img/Transport_2.jpg", 
            "Assets/img/Safari-Img/219_bWV0ICgzNik_2.jpg",
            "Assets/img/Safari-Img/Plastic_Small_2.jpg"
        ];

        let imageHTML = "";
        // Create enough images for smooth infinite scrolling
        for (let i = 0; i < 12; i++) {
            for (let j = 0; j < imageSet.length; j++) {
                imageHTML += `
                    <div class="carousel-image">
                        <img src="${imageSet[j]}" alt="Fallback image ${j + 1}" loading="lazy" />
                    </div>
                `;
            }
        }

        carousel.innerHTML = `
            <div class="carousel-track">
                ${imageHTML}
            </div>
        `;

        // Setup interactions for Safari
        const leftCursor = document.querySelector('.left-cursor');
        const rightCursor = document.querySelector('.right-cursor');
        const logoIcon = document.querySelector('.logo-icon');
        const contactLink = document.querySelector('.contact-link');
        
        setupScrollHandler(leftCursor, rightCursor);

        if (!isMobile) {
            setupDesktopInteractions(leftCursor, rightCursor, logoIcon, contactLink);
        } else {
            setupMobileInteractions();
        }
    }
}

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
            
            video.addEventListener('ended', function() {
                this.currentTime = 0;
                this.play();
            });
            
            videoObserver.observe(container);
        }
    });
}

function setupCanvasVideoPlayer(container, video) {
    const canvas = document.createElement('canvas');
    canvas.className = 'video-canvas';
    canvas.style.display = 'block';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    container.appendChild(canvas);

    const resizeCanvas = () => {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    let animationId;
    let isPlaying = false;

    const renderFrame = () => {
        if (!container.isConnected || !isPlaying) {
            return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        try {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        } catch (e) {
            // Handle any drawing errors silently
        }

        animationId = requestAnimationFrame(renderFrame);
    };

    video.addEventListener('play', () => {
        isPlaying = true;
        if (!animationId) {
            animationId = requestAnimationFrame(renderFrame);
        }
    });

    video.addEventListener('pause', () => {
        isPlaying = false;
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
    });

    video.addEventListener('timeupdate', () => {
        if (video.duration && video.currentTime >= video.duration - 0.1) {
            video.currentTime = 0;
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

function setupScrollHandler(leftCursor, rightCursor) {
    // Simplified scroll handler - don't touch carousel animation at all
    window.addEventListener('scroll', function() {
        if (!isScrolling) {
            isScrolling = true;
            if (leftCursor) leftCursor.style.display = 'none';
            if (rightCursor) rightCursor.style.display = 'none';
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
                    window.location.href = './partners.html';
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