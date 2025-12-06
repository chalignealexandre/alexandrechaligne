/**
 * CREATIVE ANIMATIONS - PREMIUM EFFECTS
 * Advanced visual effects for homepage
 */

class CreativeAnimations {
    constructor() {
        this.init();
    }

    init() {
        this.initParticleSystem();
        this.initCustomCursor();
        this.initParallaxEffects();
        this.initScrollAnimations();
        this.initMagneticEffects();
        this.initTextRevealEffects();
        // this.initCircularValuesAnimation(); // Disabled - using original grid layout
        this.initImageDistortion();
    }

    /* ===================================
       PARTICLE SYSTEM - CANVAS
       =================================== */
    initParticleSystem() {
        const hero = document.querySelector('.hero-organic');
        if (!hero) return;

        const canvas = document.createElement('canvas');
        canvas.className = 'particle-canvas';
        canvas.style.cssText = 'position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 1;';
        hero.querySelector('.hero-background').appendChild(canvas);

        const ctx = canvas.getContext('2d');
        let particles = [];
        let mouse = { x: 0, y: 0 };

        const resize = () => {
            canvas.width = hero.offsetWidth;
            canvas.height = hero.offsetHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        hero.addEventListener('mousemove', (e) => {
            const rect = hero.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });

        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.radius = Math.random() * 2 + 1;
                this.opacity = Math.random() * 0.5 + 0.2;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    const force = (150 - distance) / 150;
                    this.vx += dx * force * 0.001;
                    this.vy += dy * force * 0.001;
                }

                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

                this.vx *= 0.99;
                this.vy *= 0.99;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(201, 178, 153, ' + this.opacity + ')';
                ctx.fill();
            }
        }

        for (let i = 0; i < 80; i++) {
            particles.push(new Particle());
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });

            particles.forEach((p1, i) => {
                particles.slice(i + 1).forEach(p2 => {
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 120) {
                        ctx.beginPath();
                        ctx.strokeStyle = 'rgba(201, 178, 153, ' + (0.15 * (1 - distance / 120)) + ')';
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                });
            });

            requestAnimationFrame(animate);
        };
        animate();
    }

    /* ===================================
       CUSTOM CURSOR
       =================================== */
    initCustomCursor() {
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        const cursorFollower = document.createElement('div');
        cursorFollower.className = 'custom-cursor-follower';
        document.body.appendChild(cursor);
        document.body.appendChild(cursorFollower);

        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;
        let followerX = 0, followerY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        const animateCursor = () => {
            cursorX += (mouseX - cursorX) * 0.3;
            cursorY += (mouseY - cursorY) * 0.3;
            followerX += (mouseX - followerX) * 0.1;
            followerY += (mouseY - followerY) * 0.1;

            cursor.style.transform = 'translate(' + cursorX + 'px, ' + cursorY + 'px)';
            cursorFollower.style.transform = 'translate(' + followerX + 'px, ' + followerY + 'px)';

            requestAnimationFrame(animateCursor);
        };
        animateCursor();

        const interactiveElements = document.querySelectorAll('a, button, .bento-item, .expertise-hex, .value-circle');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('cursor-hover');
                cursorFollower.classList.add('cursor-hover');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('cursor-hover');
                cursorFollower.classList.remove('cursor-hover');
            });
        });
    }

    /* ===================================
       PARALLAX EFFECTS
       =================================== */
    initParallaxEffects() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');

        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;

            parallaxElements.forEach(el => {
                const speed = el.dataset.parallax || 0.5;
                const offset = scrolled * speed;
                el.style.transform = 'translateY(' + offset + 'px)';
            });
        });

        const hero = document.querySelector('.hero-organic');
        if (hero) {
            const layers = hero.querySelectorAll('.hero-shape, .hero-content');

            hero.addEventListener('mousemove', (e) => {
                const rect = hero.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;

                layers.forEach((layer, index) => {
                    const depth = (index + 1) * 20;
                    const moveX = x * depth;
                    const moveY = y * depth;
                    layer.style.transform = 'translate(' + moveX + 'px, ' + moveY + 'px)';
                });
            });
        }
    }

    /* ===================================
       SCROLL ANIMATIONS
       =================================== */
    initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');

                    const children = entry.target.querySelectorAll('[data-stagger]');
                    children.forEach((child, index) => {
                        setTimeout(() => {
                            child.classList.add('stagger-in');
                        }, index * 100);
                    });
                }
            });
        }, observerOptions);

        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            // Skip intro section - no animation
            if (section.classList.contains('intro-section')) return;

            section.style.opacity = '0';
            section.style.transform = 'translateY(50px)';
            section.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            observer.observe(section);
        });

        const cards = document.querySelectorAll('.expertise-hex, .bento-item, .value-circle');
        cards.forEach(card => {
            card.setAttribute('data-stagger', '');
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px) scale(0.95)';
            card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            observer.observe(card);
        });
    }

    /* ===================================
       MAGNETIC EFFECTS
       =================================== */
    initMagneticEffects() {
        const magneticElements = document.querySelectorAll('.bento-item, .btn');

        magneticElements.forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                const moveX = x * 0.15;
                const moveY = y * 0.15;

                el.style.transform = 'translate(' + moveX + 'px, ' + moveY + 'px)';
            });

            el.addEventListener('mouseleave', () => {
                el.style.transform = 'translate(0, 0)';
            });
        });
    }

    /* ===================================
       TEXT REVEAL EFFECTS
       =================================== */
    initTextRevealEffects() {
        const splitText = (element) => {
            const text = element.textContent;
            const chars = text.split('');
            element.innerHTML = chars.map(char =>
                '<span class="char" style="display: inline-block;">' + (char === ' ' ? '&nbsp;' : char) + '</span>'
            ).join('');
        };

        // Apply to hero title (home page)
        const revealElements = document.querySelectorAll('.hero-main');
        revealElements.forEach(el => {
            splitText(el);

            const chars = el.querySelectorAll('.char');
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        chars.forEach((char, index) => {
                            setTimeout(() => {
                                char.style.opacity = '1';
                                char.style.transform = 'translateY(0)';
                            }, index * 30);
                        });
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.3 });

            observer.observe(el);

            chars.forEach(char => {
                char.style.opacity = '0';
                char.style.transform = 'translateY(20px)';
                char.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            });
        });
    }

    /* ===================================
       CIRCULAR VALUES ANIMATION
       =================================== */
    initCircularValuesAnimation() {
        const container = document.querySelector('.values-circle-container');
        if (!container) return;

        const circles = container.querySelectorAll('.value-circle');
        let angle = 0;

        const animate = () => {
            angle += 0.002;

            circles.forEach((circle, index) => {
                const baseAngle = (Math.PI * 2 / circles.length) * index;
                const currentAngle = baseAngle + angle;

                const float = Math.sin(angle * 2 + index) * 5;
                const currentTransform = circle.style.transform;

                if (currentTransform.includes('translate')) {
                    circle.style.transform = currentTransform.replace(/translateY\([^)]+\)/, '') + ' translateY(' + float + 'px)';
                }
            });

            requestAnimationFrame(animate);
        };
        animate();
    }

    /* ===================================
       IMAGE DISTORTION
       =================================== */
    initImageDistortion() {
        const images = document.querySelectorAll('.bento-item img, .intro-image img');

        images.forEach(img => {
            const parent = img.parentElement;

            parent.addEventListener('mouseenter', (e) => {
                const rect = parent.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;

                const ripple = document.createElement('div');
                ripple.className = 'image-ripple';
                ripple.style.cssText = 'position: absolute; left: ' + x + '%; top: ' + y + '%; width: 0; height: 0; border-radius: 50%; background: radial-gradient(circle, rgba(201,178,153,0.3) 0%, transparent 70%); transform: translate(-50%, -50%); pointer-events: none; z-index: 10;';
                parent.appendChild(ripple);

                let size = 0;
                const animateRipple = () => {
                    size += 5;
                    ripple.style.width = size + 'px';
                    ripple.style.height = size + 'px';
                    ripple.style.opacity = 1 - (size / 200);

                    if (size < 200) {
                        requestAnimationFrame(animateRipple);
                    } else {
                        ripple.remove();
                    }
                };
                animateRipple();
            });
        });
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new CreativeAnimations();
    });
} else {
    new CreativeAnimations();
}
