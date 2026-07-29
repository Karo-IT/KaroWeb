/* ==========================================================================
   KARO - PERSONAL WEBSITE INTERACTIVE JAVASCRIPT MODULE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initParticleCanvas();
    initTypewriter();
    initNavigation();
    initSkillFilters();
    initLightbox();
    initContactForm();
    initTiltEffect();
});

/* ==========================================
   1. BACKGROUND PARTICLE CANVAS
   ========================================== */
function initParticleCanvas() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const mouse = { x: null, y: null, radius: 140 };

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.8;
            this.vy = (Math.random() - 0.5) * 0.8;
            this.radius = Math.random() * 2 + 1;
            this.color = Math.random() > 0.5 ? 'rgba(0, 240, 255, ' : 'rgba(168, 85, 247, ';
            this.alpha = Math.random() * 0.5 + 0.2;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;

            if (mouse.x !== null && mouse.y !== null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    const angle = Math.atan2(dy, dx);
                    const force = (mouse.radius - dist) / mouse.radius;
                    this.x -= Math.cos(angle) * force * 2;
                    this.y -= Math.sin(angle) * force * 2;
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color + this.alpha + ')';
            ctx.fill();
        }
    }

    const particleCount = Math.min(Math.floor(width * 0.05), 65);
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 130) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(0, 240, 255, ${0.12 * (1 - dist / 130)})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        }

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        requestAnimationFrame(animate);
    }

    animate();
}

/* ==========================================
   2. HERO TYPEWRITER ANIMATION
   ========================================== */
function initTypewriter() {
    const typewriterElement = document.getElementById('typewriter-text');
    if (!typewriterElement) return;

    const phrases = [
        "IT Student | Tech Creator | Digital Builder",
        "Technical Systems & Networking Specialist",
        "Creative Web Builder & Video Editor",
        "Digital Content & Growth Strategist"
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typeSpeed = 65;
    const deleteSpeed = 30;
    const pauseDelay = 2200;

    function type() {
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            typewriterElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typewriterElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
        }

        let currentSpeed = isDeleting ? deleteSpeed : typeSpeed;

        if (!isDeleting && charIndex === currentPhrase.length) {
            currentSpeed = pauseDelay;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            currentSpeed = 400;
        }

        setTimeout(type, currentSpeed);
    }

    type();
}

/* ==========================================
   3. NAVIGATION & SCROLL HIGHLIGHT
   ========================================== */
function initNavigation() {
    const navMenu = document.getElementById('nav-menu');
    const mobileToggle = document.getElementById('mobile-toggle');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    const backToTopBtn = document.getElementById('back-to-top');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = mobileToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.className = 'fa-solid fa-xmark';
            } else {
                icon.className = 'fa-solid fa-bars';
            }
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            if (mobileToggle) {
                mobileToggle.querySelector('i').className = 'fa-solid fa-bars';
            }
        });
    });

    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120;
            const sectionId = current.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });

        if (backToTopBtn) {
            if (scrollY > 400) {
                backToTopBtn.style.opacity = '1';
                backToTopBtn.style.pointerEvents = 'auto';
            } else {
                backToTopBtn.style.opacity = '0';
                backToTopBtn.style.pointerEvents = 'none';
            }
        }
    });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

/* ==========================================
   4. SKILL MATRIX CATEGORY FILTERING
   ========================================== */
function initSkillFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const skillCards = document.querySelectorAll('.skill-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            skillCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || filterValue === category) {
                    card.classList.remove('hidden');
                    card.style.animation = 'fadeIn 0.4s forwards';
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });
}

/* ==========================================
   5. LIGHTBOX MODAL FOR SHOWCASE ASSETS
   ========================================== */
function initLightbox() {
    const modal = document.getElementById('lightbox-modal');
    const modalImg = document.getElementById('lightbox-img');
    const modalTitle = document.getElementById('lightbox-title');
    const modalClose = document.getElementById('lightbox-close');
    const backdrop = modal ? modal.querySelector('.lightbox-backdrop') : null;

    const triggers = document.querySelectorAll('.gallery-trigger, .gallery-trigger-btn');

    triggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const imgSrc = trigger.getAttribute('data-img');
            const title = trigger.getAttribute('data-title');

            if (modalImg && modalTitle) {
                modalImg.src = imgSrc;
                modalTitle.textContent = title || 'Work Showcase Asset';
                modal.classList.add('active');
            }
        });
    });

    function closeModal() {
        if (modal) modal.classList.remove('active');
    }

    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (backdrop) backdrop.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
}

/* ==========================================
   6. CONTACT FORM & EMAIL COPY
   ========================================== */
function initContactForm() {
    const form = document.getElementById('contact-form');
    const copyEmailBtn = document.getElementById('copy-email-btn');

    if (copyEmailBtn) {
        copyEmailBtn.addEventListener('click', () => {
            const email = "karobakr.hasan000@gmail.com";
            navigator.clipboard.writeText(email).then(() => {
                showToast("Email address copied to clipboard! 📋");
            }).catch(() => {
                showToast("Email: karobakr.hasan000@gmail.com");
            });
        });
    }

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = document.getElementById('form-submit-btn');
            const origText = submitBtn.innerHTML;

            submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Sending...`;
            submitBtn.disabled = true;

            setTimeout(() => {
                submitBtn.innerHTML = `<i class="fa-solid fa-check"></i> Message Sent!`;
                showToast("Thank you! Your message has been sent successfully. 🚀");
                form.reset();

                setTimeout(() => {
                    submitBtn.innerHTML = origText;
                    submitBtn.disabled = false;
                }, 3000);
            }, 1200);
        });
    }
}

/* ==========================================
   7. 3D CARD MOUSE TILT EFFECT
   ========================================== */
function initTiltEffect() {
    const tiltCard = document.getElementById('hero-card');
    if (!tiltCard) return;

    tiltCard.addEventListener('mousemove', (e) => {
        const rect = tiltCard.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -8;
        const rotateY = ((x - centerX) / centerX) * 8;

        tiltCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    tiltCard.addEventListener('mouseleave', () => {
        tiltCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    });
}

/* ==========================================
   8. TOAST NOTIFICATION SYSTEM
   ========================================== */
function showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa-solid fa-circle-info" style="color: #00f0ff;"></i> <span>${escapeHTML(message)}</span>`;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}
