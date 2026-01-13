document.addEventListener('DOMContentLoaded', () => {
    // --- Particle System ---
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '1';
    canvas.style.opacity = '0.3';
    document.body.prepend(canvas);

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 80;

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            this.color = `rgba(${Math.random() > 0.5 ? '99, 102, 241' : '236, 72, 153'}, 0.5)`;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        particles.forEach((a, i) => {
            particles.slice(i + 1).forEach(b => {
                const dx = a.x - b.x;
                const dy = a.y - b.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 120) {
                    ctx.strokeStyle = `rgba(99, 102, 241, ${1 - distance / 120})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.stroke();
                }
            });
        });

        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    // --- Magnetic Buttons ---
    const buttons = document.querySelectorAll('.btn-custom');
    buttons.forEach(button => {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            button.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translate(0, 0)';
        });
    });

    // --- Ripple Effect ---
    function createRipple(e) {
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');

        const rect = e.currentTarget.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';

        e.currentTarget.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    }

    document.querySelectorAll('.btn-custom, .card, .skill-badge').forEach(el => {
        el.addEventListener('click', createRipple);
        el.style.position = 'relative';
        el.style.overflow = 'hidden';
    });

    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple-animation 0.6s ease-out;
            pointer-events: none;
        }
        @keyframes ripple-animation {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);

    // --- Scroll Reveal ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    document.querySelectorAll('.card, .hero-content, h2, .skill-badge').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
        observer.observe(el);
    });

    const revealStyle = document.createElement("style");
    revealStyle.innerText = `.visible { opacity: 1 !important; transform: translateY(0) !important; }`;
    document.head.appendChild(revealStyle);

    // --- Typing Animation ---
    const textToType = "Portfolio Elone LEVY";
    const titleElement = document.getElementById('typing-title');
    if (titleElement) {
        let charIndex = 0;
        function typeText() {
            if (charIndex < textToType.length) {
                titleElement.textContent += textToType.charAt(charIndex);
                charIndex++;
                setTimeout(typeText, 100);
            }
        }
        setTimeout(typeText, 500);
    }

    // --- 3D Tilt with Shine ---
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        const shine = document.createElement('div');
        shine.classList.add('card-shine');
        card.appendChild(shine);

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            shine.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.15), transparent)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            shine.style.background = 'transparent';
        });
    });

    const shineStyle = document.createElement('style');
    shineStyle.textContent = `.card-shine { position: absolute; top: 0; left: 0; right: 0; bottom: 0; border-radius: 24px; pointer-events: none; transition: background 0.3s ease; }`;
    document.head.appendChild(shineStyle);

    // --- Scroll Progress & Parallax ---
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        const progressBar = document.getElementById('scroll-progress');
        if (progressBar) progressBar.style.width = scrolled + "%";

        const shapes = document.querySelectorAll('.shape');
        shapes.forEach((shape, i) => {
            const speed = 0.5 + (i * 0.2);
            shape.style.transform = `translateY(${winScroll * speed}px)`;
        });
    });

    // --- Modals ---
    const modalTriggers = document.querySelectorAll('[data-trigger="modal"]');
    const modalClose = document.querySelectorAll('[data-close="modal"]');
    const modal = document.getElementById('demo-modal');

    function openModal() {
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeModal() {
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    modalTriggers.forEach(trigger => trigger.addEventListener('click', (e) => {
        e.preventDefault();
        openModal();
    }));

    modalClose.forEach(btn => btn.addEventListener('click', closeModal));
    if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

    // --- Project Modal ---
    const projectCards = document.querySelectorAll('.card[data-project]');
    const projectModal = document.getElementById('project-modal');
    const projectClose = document.getElementById('close-project-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');

    const projectData = {
        1: {
            title: "Site E-Commerce",
            content: `
                <div style="background: rgba(255,255,255,0.05); padding: 1.5rem; border-radius: 1rem; margin-bottom: 1.5rem; border: 1px solid rgba(255,255,255,0.1);">
                    <p style="margin-bottom: 0.5rem; color: #a855f7;"><strong>Technologies</strong></p>
                    <p>HTML5, CSS3, JavaScript, Stripe API</p>
                    <br>
                    <p style="margin-bottom: 0.5rem; color: #a855f7;"><strong>Description</strong></p>
                    <p>Une plateforme de vente en ligne complète permettant auxutilisateurs de parcourir des produits, de les ajouter au panier et de procéder au paiement sécurisé.</p>
                </div>
                <div style="border: 1px dashed rgba(255,255,255,0.2); padding: 3rem; text-align: center; color: var(--text-muted); border-radius: 1rem;">
                    <span style="font-size: 3rem; display: block; margin-bottom: 1rem;">🛒</span>
                    Simulation d'ajout au panier...
                </div>
            `
        },
        2: {
            title: "Dashboard Analytics",
            content: `
                <div style="background: rgba(255,255,255,0.05); padding: 1.5rem; border-radius: 1rem; margin-bottom: 1.5rem; border: 1px solid rgba(255,255,255,0.1);">
                    <p style="margin-bottom: 0.5rem; color: #a855f7;"><strong>Technologies</strong></p>
                    <p>React, Chart.js, Node.js</p>
                    <br>
                    <p style="margin-bottom: 0.5rem; color: #a855f7;"><strong>Description</strong></p>
                    <p>Un tableau de bord interactif pour visualiser les données de vente en temps réel. Inclut des graphiques dynamiques et des filtres avancés.</p>
                </div>
                <div style="border: 1px dashed rgba(255,255,255,0.2); padding: 3rem; text-align: center; color: var(--text-muted); border-radius: 1rem;">
                    <span style="font-size: 3rem; display: block; margin-bottom: 1rem;">📊</span>
                    Graphique en chargement...
                </div>
            `
        },
        3: {
            title: "App Mobile Météo",
            content: `
                <div style="background: rgba(255,255,255,0.05); padding: 1.5rem; border-radius: 1rem; margin-bottom: 1.5rem; border: 1px solid rgba(255,255,255,0.1);">
                    <p style="margin-bottom: 0.5rem; color: #a855f7;"><strong>Technologies</strong></p>
                    <p>Flutter, OpenWeatherMap API</p>
                    <br>
                    <p style="margin-bottom: 0.5rem; color: #a855f7;"><strong>Description</strong></p>
                    <p>Application mobile cross-platform affichant la météo locale avec des animations basées sur les conditions climatiques actuelles.</p>
                </div>
                <div style="border: 1px dashed rgba(255,255,255,0.2); padding: 3rem; text-align: center; color: var(--text-muted); border-radius: 1rem;">
                    <span style="font-size: 3rem; display: block; margin-bottom: 1rem;">🌤️</span>
                    24°C - Ensoleillé
                </div>
            `
        }
    };

    function openProjectModal(id) {
        const data = projectData[id];
        if (data) {
            modalTitle.textContent = data.title;
            modalBody.innerHTML = data.content;
            projectModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    projectCards.forEach(card => {
        card.addEventListener('click', () => {
            const projectId = card.getAttribute('data-project');
            openProjectModal(projectId);
        });
    });

    if (projectClose) projectClose.addEventListener('click', () => {
        projectModal.classList.remove('active');
        document.body.style.overflow = '';
    });

    if (projectModal) projectModal.addEventListener('click', (e) => {
        if (e.target === projectModal) {
            projectModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // --- Copy to Clipboard ---
    const contactItems = document.querySelectorAll('.contact-item[data-copy]');
    const copyNotification = document.getElementById('copy-notification');

    contactItems.forEach(item => {
        item.addEventListener('click', async () => {
            const textToCopy = item.getAttribute('data-copy');

            try {
                await navigator.clipboard.writeText(textToCopy);

                // Show notification
                copyNotification.style.opacity = '1';
                copyNotification.style.transform = 'translateX(0)';

                // Add pulse animation class
                item.classList.add('copying');

                // Reset after animation
                setTimeout(() => {
                    copyNotification.style.opacity = '0';
                    copyNotification.style.transform = 'translateX(400px)';
                    item.classList.remove('copying');
                }, 2000);
            } catch (err) {
                console.error('Erreur de copie:', err);
            }
        });
    });

    console.log("🚀✨ Next-Level Experience Loaded!");
});
