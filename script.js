document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. LOADING SCREEN
       ========================================================================== */
    const loaderScreen = document.getElementById('loader-screen');
    
    const hideLoader = () => {
        setTimeout(() => {
            loaderScreen.classList.add('fade-out');
        }, 500); // 500ms artificial delay to show off beautiful loading animation
    };

    if (document.readyState === 'complete') {
        hideLoader();
    } else {
        window.addEventListener('load', hideLoader);
    }

    // Fallback: If load event doesn't fire fast, hide loader anyway
    setTimeout(() => {
        if (!loaderScreen.classList.contains('fade-out')) {
            loaderScreen.classList.add('fade-out');
        }
    }, 3000);


    /* ==========================================================================
       2. STICKY NAVBAR & SCROLL-ACTIVE LINK OBSERVER (SCROLL SPY)
       ========================================================================== */
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
    });

    // Scroll Active Link Highlighting using IntersectionObserver
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const scrollObserverOptions = {
        root: null,
        rootMargin: '-30% 0px -60% 0px', // Highlights as the section takes up the center viewport
        threshold: 0
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, scrollObserverOptions);

    sections.forEach(section => scrollObserver.observe(section));


    /* ==========================================================================
       3. MOBILE HAMBURGER MENU
       ========================================================================== */
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    const toggleMenu = () => {
        mobileMenuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('no-scroll', navMenu.classList.contains('active'));
    };

    mobileMenuToggle.addEventListener('click', toggleMenu);

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    });


    /* ==========================================================================
       4. DARK MODE THEME SWITCHER
       ========================================================================== */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    // Load user theme preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'light') {
        htmlElement.setAttribute('data-theme', 'light');
    } else if (savedTheme === 'dark') {
        htmlElement.setAttribute('data-theme', 'dark');
    } else {
        // Fallback to system preference (or default dark)
        htmlElement.setAttribute('data-theme', systemPrefersDark ? 'dark' : 'light');
    }

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        showToast(`Theme changed to ${newTheme === 'dark' ? 'Dark' : 'Light'} Mode`);
    });


    /* ==========================================================================
       5. HERO PRODUCT IMAGE SLIDER
       ========================================================================== */
    const slides = document.querySelectorAll('#hero-slider .slide');
    const dots = document.querySelectorAll('#slider-dots .dot');
    const prevBtn = document.getElementById('slider-prev');
    const nextBtn = document.getElementById('slider-next');
    
    let currentSlide = 0;
    let sliderInterval;
    const slideDuration = 3000; // Autoplay every 3s

    const showSlide = (index) => {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        currentSlide = (index + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    };

    const nextSlide = () => showSlide(currentSlide + 1);
    const prevSlide = () => showSlide(currentSlide - 1);

    const startSlider = () => {
        sliderInterval = setInterval(nextSlide, slideDuration);
    };

    const stopSlider = () => {
        clearInterval(sliderInterval);
    };

    // Controls listeners
    nextBtn.addEventListener('click', () => {
        nextSlide();
        stopSlider();
        startSlider();
    });

    prevBtn.addEventListener('click', () => {
        prevSlide();
        stopSlider();
        startSlider();
    });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            stopSlider();
            startSlider();
        });
    });

    // Start auto slider
    startSlider();

    // Pause on hover
    const sliderWrapper = document.querySelector('.hero-slider-wrapper');
    sliderWrapper.addEventListener('mouseenter', stopSlider);
    sliderWrapper.addEventListener('mouseleave', startSlider);


    /* ==========================================================================
       6. PRODUCT GALLERY LIGHTBOX
       ========================================================================== */
    const galleryCards = document.querySelectorAll('.gallery-card');
    const lightboxModal = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');

    galleryCards.forEach(card => {
        card.addEventListener('click', () => {
            const imgSrc = card.getAttribute('data-src');
            lightboxImg.setAttribute('src', imgSrc);
            lightboxModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    const closeLightbox = () => {
        lightboxModal.classList.remove('active');
        setTimeout(() => {
            lightboxImg.setAttribute('src', '');
        }, 300);
        document.body.style.overflow = '';
    };

    lightboxClose.addEventListener('click', closeLightbox);
    
    // Close on click outside image
    lightboxModal.addEventListener('click', (e) => {
        if (e.target === lightboxModal) {
            closeLightbox();
        }
    });

    // Escape key listener for closing lightbox
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
            closeLightbox();
        }
    });


    /* ==========================================================================
       7. PRICING PLAN SELECTION (LOCAL STORAGE SYNC)
       ========================================================================== */
    const pricingCards = document.querySelectorAll('.pricing-card');
    
    // Load cached plan selection
    const savedPlan = localStorage.getItem('selectedPlan');
    if (savedPlan) {
        pricingCards.forEach(card => {
            card.classList.remove('selected');
            if (card.getAttribute('data-plan') === savedPlan) {
                card.classList.add('selected');
            }
        });
    }

    pricingCards.forEach(card => {
        const selectBtn = card.querySelector('.select-plan-btn');
        
        // Select by card click or button click
        const selectPlan = () => {
            pricingCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            
            const planName = card.getAttribute('data-plan');
            localStorage.setItem('selectedPlan', planName);
            
            // Format nice plan text for toast
            const planTitle = card.querySelector('.plan-name').textContent;
            showToast(`✔ Selected the ${planTitle} Plan`);
        };

        selectBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Avoid card double triggers
            selectPlan();
        });
        
        card.addEventListener('click', selectPlan);
    });


    /* ==========================================================================
       8. ANIMATED STATISTICS COUNTERS
       ========================================================================== */
    const counters = document.querySelectorAll('.stat-value');
    const statsCounterSection = document.getElementById('stats-counter-section');
    let countersAnimated = false;

    const animateCounters = () => {
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'), 10);
            const duration = 2000; // Animation duration in milliseconds
            const startTime = performance.now();

            const updateCount = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Quadratic out easing formula
                const easeProgress = progress * (2 - progress);
                const currentValue = Math.floor(easeProgress * target);

                // Add plus sign or percentage format based on text requirements
                if (counter.id === 'stat-customers') {
                    counter.textContent = currentValue.toLocaleString() + '+';
                } else if (counter.id === 'stat-reviews') {
                    counter.textContent = currentValue.toLocaleString() + '+';
                } else if (counter.id === 'stat-satisfaction') {
                    counter.textContent = currentValue + '%';
                } else {
                    counter.textContent = currentValue.toString();
                }

                if (progress < 1) {
                    requestAnimationFrame(updateCount);
                } else {
                    // Force exact final value
                    if (counter.id === 'stat-customers' || counter.id === 'stat-reviews') {
                        counter.textContent = target.toLocaleString() + '+';
                    } else if (counter.id === 'stat-satisfaction') {
                        counter.textContent = target + '%';
                    } else {
                        counter.textContent = target.toString();
                    }
                }
            };

            requestAnimationFrame(updateCount);
        });
    };

    const counterObserverOptions = {
        root: null,
        threshold: 0.2 // Triggers when 20% of section enters viewport
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !countersAnimated) {
                animateCounters();
                countersAnimated = true; // Run exactly once
                counterObserver.unobserve(entry.target);
            }
        });
    }, counterObserverOptions);

    if (statsCounterSection) {
        counterObserver.observe(statsCounterSection);
    }


    /* ==========================================================================
       9. FAQ ACCORDION (ONLY ONE OPEN AT A TIME)
       ========================================================================== */
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        const answerWrapper = item.querySelector('.faq-answer');

        questionBtn.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Collapse all items first
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                otherItem.querySelector('.faq-answer').style.maxHeight = '0';
            });

            // If it wasn't active, expand it
            if (!isActive) {
                item.classList.add('active');
                questionBtn.setAttribute('aria-expanded', 'true');
                answerWrapper.style.maxHeight = answerWrapper.scrollHeight + 'px';
            }
        });
    });


    /* ==========================================================================
       10. NEWSLETTER SUBSCRIPTION VALIDATION (LOCAL STORAGE SYNC)
       ========================================================================== */
    const newsletterForm = document.getElementById('newsletter-form');
    const newsletterEmail = document.getElementById('newsletter-email');
    const newsletterError = document.getElementById('newsletter-error');

    // Pre-fill email if already subscribed
    const savedEmail = localStorage.getItem('newsletterEmail');
    if (savedEmail) {
        newsletterEmail.value = savedEmail;
    }

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailVal = newsletterEmail.value.trim();

        if (emailVal === '') {
            newsletterError.textContent = 'Please enter an email address.';
            newsletterEmail.parentNode.style.borderColor = '#ef4444';
        } else if (!validateEmail(emailVal)) {
            newsletterError.textContent = 'Please enter a valid email address.';
            newsletterEmail.parentNode.style.borderColor = '#ef4444';
        } else {
            newsletterError.textContent = '';
            newsletterEmail.parentNode.style.borderColor = '';
            
            // Save email to Local Storage
            localStorage.setItem('newsletterEmail', emailVal);
            
            showToast('✔ Subscription Successful! Welcome to the club.');
            newsletterForm.reset();
        }
    });

    newsletterEmail.addEventListener('input', () => {
        newsletterError.textContent = '';
        newsletterEmail.parentNode.style.borderColor = '';
    });


    /* ==========================================================================
       11. CONTACT FORM VALIDATIONS
       ========================================================================== */
    const contactForm = document.getElementById('contact-form');
    const contactName = document.getElementById('contact-name');
    const contactEmail = document.getElementById('contact-email');
    const contactPhone = document.getElementById('contact-phone');
    const contactMessage = document.getElementById('contact-message');

    // Get error slots
    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const phoneError = document.getElementById('phone-error');
    const messageError = document.getElementById('message-error');

    const setError = (inputElement, errorElement, message) => {
        inputElement.style.borderColor = '#ef4444';
        errorElement.textContent = message;
    };

    const clearError = (inputElement, errorElement) => {
        inputElement.style.borderColor = '';
        errorElement.textContent = '';
    };

    // Clean errors on input typing
    contactName.addEventListener('input', () => clearError(contactName, nameError));
    contactEmail.addEventListener('input', () => clearError(contactEmail, emailError));
    contactPhone.addEventListener('input', () => clearError(contactPhone, phoneError));
    contactMessage.addEventListener('input', () => clearError(contactMessage, messageError));

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let isValid = true;

        const nameVal = contactName.value.trim();
        const emailVal = contactEmail.value.trim();
        const phoneVal = contactPhone.value.trim();
        const messageVal = contactMessage.value.trim();

        // 1. Name Check
        if (nameVal === '') {
            setError(contactName, nameError, 'Full name is required.');
            isValid = false;
        } else {
            clearError(contactName, nameError);
        }

        // 2. Email Check
        if (emailVal === '') {
            setError(contactEmail, emailError, 'Email address is required.');
            isValid = false;
        } else if (!validateEmail(emailVal)) {
            setError(contactEmail, emailError, 'Please enter a valid email address.');
            isValid = false;
        } else {
            clearError(contactEmail, emailError);
        }

        // 3. Phone Check (Minimum 10 digits validation)
        const phoneDigits = phoneVal.replace(/\D/g, ''); // strip non-numeric
        if (phoneVal === '') {
            setError(contactPhone, phoneError, 'Phone number is required.');
            isValid = false;
        } else if (phoneDigits.length < 10) {
            setError(contactPhone, phoneError, 'Phone number must be at least 10 digits.');
            isValid = false;
        } else {
            clearError(contactPhone, phoneError);
        }

        // 4. Message Check
        if (messageVal === '') {
            setError(contactMessage, messageError, 'Message content cannot be empty.');
            isValid = false;
        } else {
            clearError(contactMessage, messageError);
        }

        if (isValid) {
            showToast('✔ Message Sent Successfully! We will contact you soon.');
            contactForm.reset();
        }
    });


    /* ==========================================================================
       12. HERO BUY BUTTON TRIGGER
       ========================================================================== */
    const heroBuyBtn = document.getElementById('hero-buy-btn');
    heroBuyBtn.addEventListener('click', () => {
        showToast('✔ Product Added Successfully! Loading checkout...');
        
        // Scroll to pricing section so user can select their option
        setTimeout(() => {
            const pricingSection = document.getElementById('pricing');
            pricingSection.scrollIntoView({ behavior: 'smooth' });
        }, 1000);
    });


    /* ==========================================================================
       13. BACK TO TOP BUTTON
       ========================================================================== */
    const backToTopBtn = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('active');
        } else {
            backToTopBtn.classList.remove('active');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });


    /* ==========================================================================
       14. TOAST NOTIFICATION SYSTEM
       ========================================================================== */
    const toastContainer = document.getElementById('toast-container');

    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        
        // Build toast item content
        toast.innerHTML = `
            <span class="toast-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
            </span>
            <span class="toast-message">${message}</span>
        `;
        
        toastContainer.appendChild(toast);

        // Slide in
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);

        // Slide out and remove
        setTimeout(() => {
            toast.classList.remove('show');
            toast.addEventListener('transitionend', () => {
                toast.remove();
            });
        }, 4000); // Stays visible for 4s
    }


    /* ==========================================================================
       15. SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
       ========================================================================== */
    const revealElements = document.querySelectorAll('.reveal-fade-up, .reveal-fade-left, .reveal-zoom-in');

    const revealObserverOptions = {
        root: null,
        rootMargin: '0px 0px -10% 0px', // Animates slightly before reaching the bottom edge
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Read and set transitions delay from html attributes
                const delay = entry.target.getAttribute('data-delay');
                if (delay) {
                    entry.target.style.transitionDelay = `${delay}ms`;
                }
                entry.target.classList.add('reveal-active');
                revealObserver.unobserve(entry.target); // Trigger exactly once
            }
        });
    }, revealObserverOptions);

    revealElements.forEach(element => revealObserver.observe(element));


    /* ==========================================================================
       16. 3D INTERACTIVE TILT ANIMATION
       ========================================================================== */
    const tiltElements = document.querySelectorAll('.feature-card, .pricing-card, .testimonial-card, .gallery-card');

    tiltElements.forEach(card => {
        // Create dynamic card shimmer elements
        const shimmer = document.createElement('div');
        shimmer.className = 'card-shimmer';
        card.appendChild(shimmer);

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position within the element
            const y = e.clientY - rect.top;  // y position within the element

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Calculate tilt angle (max 10 degrees)
            const rotateX = ((centerY - y) / centerY) * 10;
            const rotateY = ((x - centerX) / centerX) * 10;

            // Set shimmer variables for CSS background
            card.style.setProperty('--shimmer-x', `${(x / rect.width) * 100}%`);
            card.style.setProperty('--shimmer-y', `${(y / rect.height) * 100}%`);

            // Apply 3D perspective rotation
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            card.style.transition = 'none';
        });

        card.addEventListener('mouseleave', () => {
            // Smoothly animate back to baseline
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            card.style.transition = 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.6s cubic-bezier(0.25, 1, 0.5, 1)';
        });
    });

    // Subtle tilt for the Hero slider images on mouse movement
    const heroSliderWrapper = document.querySelector('.hero-slider-wrapper');
    if (heroSliderWrapper) {
        heroSliderWrapper.addEventListener('mousemove', (e) => {
            const rect = heroSliderWrapper.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Subtle rotation (max 6 degrees)
            const rotateX = ((centerY - y) / centerY) * 6;
            const rotateY = ((x - centerX) / centerX) * 6;

            const activeImg = heroSliderWrapper.querySelector('.slide.active img');
            if (activeImg) {
                // Pause float animation briefly by setting animation-play-state
                activeImg.style.animationPlayState = 'paused';
                activeImg.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
                activeImg.style.transition = 'none';
            }
        });

        heroSliderWrapper.addEventListener('mouseleave', () => {
            const activeImg = heroSliderWrapper.querySelector('.slide.active img');
            if (activeImg) {
                activeImg.style.animationPlayState = 'running';
                activeImg.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
                activeImg.style.transition = 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)';
            }
        });
    }

});
