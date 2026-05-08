// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger, TextPlugin);

// 1. Scroll Progress & Mouse Tracking
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');
let cursorTimer;

// Hide cursor on touch devices
if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    if (cursor) cursor.style.display = 'none';
    if (follower) follower.style.display = 'none';
} else {
    // Initially hide opacity on desktop until first move
    if (cursor) cursor.style.opacity = '0';
    if (follower) follower.style.opacity = '0';
}

window.addEventListener('mousemove', (e) => {
    const x = e.clientX;
    const y = e.clientY;
    document.documentElement.style.setProperty('--mouse-x', `${x}px`);
    document.documentElement.style.setProperty('--mouse-y', `${y}px`);
    
    // Idle Hide Logic
    if (cursor && follower) {
        cursor.style.opacity = '1';
        follower.style.opacity = '1';
        clearTimeout(cursorTimer);
        cursorTimer = setTimeout(() => {
            cursor.style.opacity = '0';
            follower.style.opacity = '0';
        }, 2000); // Hide after 2s of idleness
    }
}, { passive: true });

window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    document.getElementById("scroll-progress").style.width = scrolled + "%";
});

// 2. Hamburger Menu Accessibility & Logic
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
let isMenuOpen = false;

hamburger.addEventListener('click', () => {
    isMenuOpen = !isMenuOpen;
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('fa-times');
    hamburger.setAttribute('aria-expanded', isMenuOpen);
});

// Project Cards Hover Animation (GSAP)
document.querySelectorAll('.project-card').forEach(card => {
    const img = card.querySelector('img');
    const links = card.querySelector('.project-links');
    
    card.addEventListener('mouseenter', () => {
        gsap.to(img, { scale: 1.05, duration: 0.6, ease: 'power2.out' });
        if (links) gsap.to(links, { y: 0, opacity: 1, duration: 0.4 });
    });
    
    card.addEventListener('mouseleave', () => {
        gsap.to(img, { scale: 1, duration: 0.6, ease: 'power2.out' });
        if (links) gsap.to(links, { y: 20, opacity: 0, duration: 0.4 });
    });
});

// Close menu on link click
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.classList.remove('fa-times');
        isMenuOpen = false;
        hamburger.setAttribute('aria-expanded', false);
    });
});

// 3. Optimized Background Animation
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let animationFrameId;
let isTabVisible = true;

// Handle tab visibility to save resources
document.addEventListener('visibilitychange', () => {
    isTabVisible = !document.hidden;
});

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
}
window.addEventListener('resize', resize);
resize();

class Particle {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.5 + 0.1;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x > canvas.width || this.x < 0 || this.y > canvas.height || this.y < 0) {
            this.reset();
        }
    }
    draw() {
        ctx.fillStyle = `rgba(112, 0, 255, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    const count = window.innerWidth < 768 ? 40 : 80;
    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }
}

function animateParticles() {
    if (isTabVisible) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
    }
    animationFrameId = requestAnimationFrame(animateParticles);
}
animateParticles();

// 4. Navbar Scroll Effect & Scroll Indicator
window.addEventListener('scroll', () => {
    const nav = document.querySelector('.navbar');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
        if (scrollIndicator) gsap.to(scrollIndicator, { opacity: 0, pointerEvents: 'none', duration: 0.4 });
    } else {
        nav.classList.remove('scrolled');
        if (scrollIndicator) gsap.to(scrollIndicator, { opacity: 0.6, pointerEvents: 'all', duration: 0.4 });
    }
});

// 5. Typed.js Animation
const typed = new Typed('.typing-text', {
    strings: ['Django Developer', 'Backend Architect', 'MCA Scholar', 'Problem Solver'],
    typeSpeed: 50,
    backSpeed: 30,
    backDelay: 2000,
    loop: true
});

// 6. GSAP Reveal Animations
const revealOptions = {
    threshold: 0.15,
    once: true
};

document.querySelectorAll('.reveal').forEach(el => {
    gsap.from(el, {
        scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            toggleActions: 'play none none none'
        },
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'power2.out'
    });
});

// Staggered Skills
gsap.from('.skills-category-box', {
    scrollTrigger: {
        trigger: '.skills',
        start: 'top 80%'
    },
    y: 30,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    ease: 'power2.out'
});

// Staggered Achievements
gsap.from('.achievement-card', {
    scrollTrigger: {
        trigger: '.achievements',
        start: 'top 80%'
    },
    y: 30,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    ease: 'power2.out'
});

// 7. Micro-interactions: Magnetic Buttons
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        gsap.to(btn, {
            x: x * 0.2,
            y: y * 0.2,
            duration: 0.3,
            ease: 'power2.out'
        });
    });
    
    btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: 'elastic.out(1, 0.3)'
        });
    });
});

// 8. Form Validation Polish
const form = document.querySelector('.contact-form');
if (form) {
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            if (input.value.trim() !== '') {
                input.style.borderColor = 'var(--secondary-color)';
            } else {
                input.style.borderColor = 'var(--border-color)';
            }
        });
    });
}
