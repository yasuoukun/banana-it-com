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

// Draggable FB Button Functionality
function initDraggableFB() {
    const fbBtn = document.querySelector('.fb-float');
    if (!fbBtn) return;

    let isDragging = false;
    let offset = { x: 0, y: 0 };

    fbBtn.addEventListener('touchstart', (e) => {
        isDragging = true;
        const touch = e.touches[0];
        const rect = fbBtn.getBoundingClientRect();
        offset.x = touch.clientX - rect.left;
        offset.y = touch.clientY - rect.top;
        fbBtn.style.transition = 'none'; 
    });

    document.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const touch = e.touches[0];
        
        let x = touch.clientX - offset.x;
        let y = touch.clientY - offset.y;

        const btnWidth = fbBtn.offsetWidth;
        const btnHeight = fbBtn.offsetHeight;
        
        x = Math.max(0, Math.min(window.innerWidth - btnWidth, x));
        y = Math.max(0, Math.min(window.innerHeight - btnHeight, y));

        fbBtn.style.left = `${x}px`;
        fbBtn.style.top = `${y}px`;
        fbBtn.style.bottom = 'auto';
        fbBtn.style.right = 'auto';
        
        e.preventDefault(); 
    }, { passive: false });

    document.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        isDragging = false;
        
        const rect = fbBtn.getBoundingClientRect();
        const screenWidth = window.innerWidth;
        const btnWidth = fbBtn.offsetWidth;
        
        fbBtn.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        
        if (rect.left + btnWidth / 2 < screenWidth / 2) {
            fbBtn.style.left = '15px';
        } else {
            fbBtn.style.left = `${screenWidth - btnWidth - 15}px`;
        }
    });
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
