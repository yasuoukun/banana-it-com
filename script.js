document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle (Top Down)
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (mobileMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });
        
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            });
        });
    }

    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Reveal Animation on Scroll
    function reveal() {
        const reveals = document.querySelectorAll('.reveal, .reveal-right');
        for (let i = 0; i < reveals.length; i++) {
            const windowHeight = window.innerHeight;
            const elementTop = reveals[i].getBoundingClientRect().top;
            const elementVisible = 150;
            if (elementTop < windowHeight - elementVisible) {
                reveals[i].classList.add('active');
            }
        }
    }
    
    window.addEventListener('scroll', reveal);
    setTimeout(reveal, 100);

    // Initial Scroll Arrow Check
    initAllScrollGroups();
    initReelsScroll();
    initDragToScroll('.reels-scroll-wrapper');

    // Draggable FB Button Logic
    initDraggableFB();
});

// Tab Switcher
function switchTab(tabId) {
    document.querySelectorAll('.price-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.price-tab-content').forEach(c => c.classList.remove('active'));
    
    const targetId = tabId.startsWith('tab-') ? tabId : 'tab-' + tabId;
    const content = document.getElementById(targetId);
    if (content) {
        content.classList.add('active');
        setTimeout(() => {
            const wrappers = content.querySelectorAll('.price-scroll-wrapper');
            wrappers.forEach(w => {
                if (w.id) updateScrollArrows(w.id);
            });
        }, 100);
    }
    
    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    }
}

// Scroll Cards Logic
function scrollCards(wrapperId, direction) {
    const wrapper = document.getElementById(wrapperId);
    if (!wrapper) return;
    const grid = wrapper.querySelector('.price-cards-grid');
    if (!grid) return;
    const card = grid.querySelector('.price-cat-card');
    const scrollAmount = card ? (card.offsetWidth + 25) : 300;
    grid.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
    setTimeout(() => updateScrollArrows(wrapperId), 400);
}

// Arrow Visibility Logic
function updateScrollArrows(wrapperId) {
    const wrapper = document.getElementById(wrapperId);
    if (!wrapper) return;
    const grid = wrapper.querySelector('.price-cards-grid');
    const leftArrow = wrapper.querySelector('.scroll-arrow-left');
    const rightArrow = wrapper.querySelector('.scroll-arrow-right');
    if (!grid || !leftArrow || !rightArrow) return;
    const scrollLeft = grid.scrollLeft;
    const scrollWidth = grid.scrollWidth;
    const clientWidth = grid.clientWidth;
    if (scrollLeft <= 5) leftArrow.classList.add('hidden'); else leftArrow.classList.remove('hidden');
    if (scrollLeft + clientWidth >= scrollWidth - 5) rightArrow.classList.add('hidden'); else rightArrow.classList.remove('hidden');
}

function initAllScrollGroups() {
    const wrappers = document.querySelectorAll('.price-scroll-wrapper');
    wrappers.forEach(wrapper => {
        if (wrapper.id) {
            const grid = wrapper.querySelector('.price-cards-grid');
            if (grid) {
                grid.addEventListener('scroll', () => updateScrollArrows(wrapper.id));
                updateScrollArrows(wrapper.id);
            }
        }
    });
}

// Reels Scroll Logic
function initReelsScroll() {
    const wrapper = document.getElementById('reels-wrapper');
    if (!wrapper) return;
    const grid = wrapper.querySelector('.reels-scroll-wrapper');
    if (grid) {
        grid.addEventListener('scroll', () => updateReelsArrows());
        updateReelsArrows();
    }
}

function scrollReels(direction) {
    const wrapper = document.getElementById('reels-wrapper');
    if (!wrapper) return;
    const grid = wrapper.querySelector('.reels-scroll-wrapper');
    if (!grid) return;
    const item = grid.querySelector('.reel-item');
    const scrollAmount = item ? (item.offsetWidth + 20) : 300;
    grid.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
    setTimeout(updateReelsArrows, 500);
}

function updateReelsArrows() {
    const wrapper = document.getElementById('reels-wrapper');
    if (!wrapper) return;
    const grid = wrapper.querySelector('.reels-scroll-wrapper');
    const leftArrow = wrapper.querySelector('.scroll-arrow-left');
    const rightArrow = wrapper.querySelector('.scroll-arrow-right');
    if (!grid || !leftArrow || !rightArrow) return;
    
    const scrollLeft = grid.scrollLeft;
    const scrollWidth = grid.scrollWidth;
    const clientWidth = grid.clientWidth;
    
    if (scrollLeft <= 5) leftArrow.classList.add('hidden'); else leftArrow.classList.remove('hidden');
    if (scrollLeft + clientWidth >= scrollWidth - 5) rightArrow.classList.add('hidden'); else rightArrow.classList.remove('hidden');
}

// Draggable FB Button Functionality with Physics (Messenger-style)
function initDraggableFB() {
    const fbBtn = document.querySelector('.fb-float');
    if (!fbBtn) return;

    let isDragging = false;
    let startX, startY;
    let currentX, currentY;
    
    // Velocity tracking
    let velocityX = 0;
    let velocityY = 0;
    let lastMouseX = 0;
    let lastMouseY = 0;
    let lastTime = 0;
    let animationFrameId = null;

    const onStart = (e) => {
        // Prevent dragging with mouse on PC (large screens)
        const isTouch = e.type === 'touchstart';
        if (!isTouch && window.innerWidth > 1024) return;
        
        isDragging = true;
        fbBtn.classList.add('is-dragging');
        fbBtn.classList.add('has-moved');

        
        const clientX = isTouch ? e.touches[0].clientX : e.clientX;
        const clientY = isTouch ? e.touches[0].clientY : e.clientY;
        
        const rect = fbBtn.getBoundingClientRect();
        currentX = rect.left;
        currentY = rect.top;
        startX = clientX - currentX;
        startY = clientY - currentY;
        
        lastMouseX = clientX;
        lastMouseY = clientY;
        lastTime = performance.now();
        
        cancelAnimationFrame(animationFrameId);
        fbBtn.style.transition = 'none';

        // Switch to pixel-based positioning for physics
        fbBtn.style.left = `${currentX}px`;
        fbBtn.style.top = `${currentY}px`;
        fbBtn.style.bottom = 'auto';
        fbBtn.style.right = 'auto';
        
        if (isTouch) e.preventDefault();
    };

    const onMove = (e) => {
        if (!isDragging) return;
        
        const isTouch = e.type === 'touchmove';
        const clientX = isTouch ? e.touches[0].clientX : e.clientX;
        const clientY = isTouch ? e.touches[0].clientY : e.clientY;
        
        const now = performance.now();
        const dt = now - lastTime;
        
        if (dt > 0) {
            velocityX = (clientX - lastMouseX) / dt;
            velocityY = (clientY - lastMouseY) / dt;
        }
        
        lastMouseX = clientX;
        lastMouseY = clientY;
        lastTime = now;

        currentX = clientX - startX;
        currentY = clientY - startY;

        // Keep within bounds
        const btnWidth = fbBtn.offsetWidth;
        const btnHeight = fbBtn.offsetHeight;
        currentX = Math.max(0, Math.min(window.innerWidth - btnWidth, currentX));
        currentY = Math.max(0, Math.min(window.innerHeight - btnHeight, currentY));

        fbBtn.style.left = `${currentX}px`;
        fbBtn.style.top = `${currentY}px`;
        
        if (isTouch) e.preventDefault();
    };

    const onEnd = () => {
        if (!isDragging) return;
        isDragging = false;
        fbBtn.classList.remove('is-dragging');
        
        const friction = 0.92;
        const bounce = 0.2;
        const snapSpring = 0.08;
        
        const animate = () => {
            // Cap velocity
            velocityX = Math.max(-1.5, Math.min(1.5, velocityX));
            velocityY = Math.max(-1.5, Math.min(1.5, velocityY));

            currentX += velocityX * 16;
            currentY += velocityY * 16;
            
            velocityX *= friction;
            velocityY *= friction;

            const btnWidth = fbBtn.offsetWidth;
            const btnHeight = fbBtn.offsetHeight;
            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;

            if (currentX < 0) { currentX = 0; velocityX *= -bounce; }
            if (currentX > screenWidth - btnWidth) { currentX = screenWidth - btnWidth; velocityX *= -bounce; }
            if (currentY < 0) { currentY = 0; velocityY *= -bounce; }
            if (currentY > screenHeight - btnHeight) { currentY = screenHeight - btnHeight; velocityY *= -bounce; }

            if (Math.abs(velocityX) < 0.5) {
                const targetX = currentX + btnWidth / 2 < screenWidth / 2 ? 15 : screenWidth - btnWidth - 15;
                currentX += (targetX - currentX) * snapSpring;
            }

            fbBtn.style.left = `${currentX}px`;
            fbBtn.style.top = `${currentY}px`;

            const targetSnapX = currentX + btnWidth / 2 < screenWidth / 2 ? 15 : screenWidth - btnWidth - 15;
            if (Math.abs(velocityX) < 0.01 && Math.abs(velocityY) < 0.01 && Math.abs(currentX - targetSnapX) < 0.1) {
                fbBtn.style.left = `${targetSnapX}px`;
                cancelAnimationFrame(animationFrameId);
                return;
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        animationFrameId = requestAnimationFrame(animate);
    };

    fbBtn.addEventListener('mousedown', onStart);
    fbBtn.addEventListener('touchstart', onStart, { passive: false });

    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove, { passive: false });

    window.addEventListener('mouseup', onEnd);
    window.addEventListener('touchend', onEnd);
}



// Drag-to-Scroll Functionality
function initDragToScroll(selector) {
    const slider = document.querySelector(selector);
    if (!slider) return;
    
    let isDown = false;
    let startX;
    let scrollLeft;
    let startTime;

    const start = (e) => {
        isDown = true;
        slider.classList.add('active');
        startX = (e.pageX || e.touches[0].pageX) - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
        startTime = new Date().getTime();
        slider.style.scrollSnapType = 'none'; 
    };

    const end = (e) => {
        if (!isDown) return;
        isDown = false;
        slider.classList.remove('active');
        slider.style.scrollSnapType = 'x mandatory';

        const endTime = new Date().getTime();
        const duration = endTime - startTime;

        // If it was a quick tap, let the user interact with the video
        if (duration < 200) {
            const target = e.target;
            if (target.classList.contains('reel-overlay')) {
                target.classList.add('hidden');
                // Re-enable overlay when user scrolls or after some time
                setTimeout(() => target.classList.remove('hidden'), 5000);
            }
        }
    };

    const move = (e) => {
        if (!isDown) return;
        const x = (e.pageX || e.touches[0].pageX) - slider.offsetLeft;
        const walk = (x - startX) * 2;
        slider.scrollLeft = scrollLeft - walk;
    };

    slider.addEventListener('mousedown', start);
    slider.addEventListener('touchstart', start);

    slider.addEventListener('mouseleave', end);
    slider.addEventListener('mouseup', end);
    slider.addEventListener('touchend', end);

    slider.addEventListener('mousemove', move);
    slider.addEventListener('touchmove', move);

    // Auto-restore overlays on scroll
    slider.addEventListener('scroll', () => {
        const overlays = slider.querySelectorAll('.reel-overlay');
        overlays.forEach(o => o.classList.remove('hidden'));
    });
}
