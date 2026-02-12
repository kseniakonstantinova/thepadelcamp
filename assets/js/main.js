/**
 * Padel Camp Cyprus - Main JavaScript
 * ===================================
 */

// Google Apps Script URL для отправки данных
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyRFc1LgrjR1okUiCvZRepdiKKhM0u_BcIfJz0pfpJhnqDvkXpHCeUUQYiEVpt18CvLOA/exec';

// Функция для отправки данных в Google Sheets + Telegram
function sendToGoogleSheets(data) {
    return fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
}

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initMobileMenu();
    initSmoothScroll();
    initCountdown();
    initProgramTabs();
    initMassageCalendar();
    initFAQ();
    initHeaderScroll();
    initContactForm();
    initAnimations();
});

/**
 * Mobile Menu Toggle
 */
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const nav = document.getElementById('nav');
    const navLinks = document.querySelectorAll('.nav-list a');

    if (mobileMenuBtn && nav) {
        mobileMenuBtn.addEventListener('click', function() {
            this.classList.toggle('active');
            nav.classList.toggle('active');
            document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenuBtn.classList.remove('active');
                nav.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!nav.contains(e.target) && !mobileMenuBtn.contains(e.target) && nav.classList.contains('active')) {
                mobileMenuBtn.classList.remove('active');
                nav.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
}

/**
 * Smooth Scrolling for Anchor Links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');

            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Countdown Timer
 */
function initCountdown() {
    // Camp start date: April 13, 2026
    const campDate = new Date('April 13, 2026 09:00:00').getTime();

    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = campDate - now;

        if (distance < 0) {
            daysEl.textContent = '00';
            hoursEl.textContent = '00';
            minutesEl.textContent = '00';
            secondsEl.textContent = '00';
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        daysEl.textContent = days.toString().padStart(2, '0');
        hoursEl.textContent = hours.toString().padStart(2, '0');
        minutesEl.textContent = minutes.toString().padStart(2, '0');
        secondsEl.textContent = seconds.toString().padStart(2, '0');
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
}

/**
 * Program Tabs (Limassol / Larnaca)
 */
function initProgramTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const programContents = document.querySelectorAll('.program-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetTab = this.dataset.tab;

            // Remove active class from all
            tabBtns.forEach(b => b.classList.remove('active'));
            programContents.forEach(c => c.classList.remove('active'));

            // Add active class to clicked
            this.classList.add('active');
            const targetContent = document.getElementById(targetTab);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}

/**
 * Massage Booking Calendar (Simplified - no calendar needed)
 */
function initMassageCalendar() {
    // Calendar no longer needed - booking handled directly through session cards
}

/**
 * Service Booking Form Modal
 */
function openServiceBookingForm(serviceName, price) {
    const modal = document.getElementById('serviceBookingModal');
    const titleEl = document.getElementById('serviceBookingTitle');
    const infoEl = document.getElementById('selectedServiceInfo');
    const serviceNameInput = document.getElementById('serviceName');
    const priceInput = document.getElementById('servicePrice');

    if (modal && infoEl && serviceNameInput && priceInput) {
        // Update the displayed info
        const isRussian = document.documentElement.lang === 'ru';

        if (titleEl) {
            titleEl.textContent = isRussian ? 'Забронировать услугу' : 'Book Service';
        }

        const priceText = serviceName.includes('hour') || serviceName.includes('час')
            ? `€${price} / ${isRussian ? 'час' : 'hour'}`
            : `€${price}`;

        infoEl.textContent = `${serviceName} — ${priceText}`;

        // Set hidden form values
        serviceNameInput.value = serviceName;
        priceInput.value = price;

        // Open booking form modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeServiceBookingModal() {
    const modal = document.getElementById('serviceBookingModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';

        // Reset form
        const form = document.getElementById('serviceBookingForm');
        if (form) {
            form.reset();
        }
    }
}

/**
 * Massage Booking Form Modal
 */
function openMassageBookingForm(duration, price) {
    const modal = document.getElementById('massageBookingModal');
    const infoEl = document.getElementById('selectedMassageInfo');
    const durationInput = document.getElementById('massageDuration');
    const priceInput = document.getElementById('massagePrice');

    if (modal && infoEl && durationInput && priceInput) {
        // Update the displayed info
        const isRussian = document.documentElement.lang === 'ru';
        infoEl.textContent = isRussian ? `${duration} мин — €${price}` : `${duration} min — €${price}`;

        // Set hidden form values
        durationInput.value = duration;
        priceInput.value = price;

        // Close main massage modal if open
        closeMassageModal();

        // Open booking form modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeMassageBookingModal() {
    const modal = document.getElementById('massageBookingModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';

        // Reset form
        const form = document.getElementById('massageBookingForm');
        if (form) {
            form.reset();
        }
    }
}

/**
 * Massage Modal
 */
function openMassageModal() {
    const modal = document.getElementById('massageModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeMassageModal() {
    const modal = document.getElementById('massageModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

/**
 * Media Package Modal
 */
function openMediaPackageModal() {
    const modal = document.getElementById('mediaPackageModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeMediaPackageModal() {
    const modal = document.getElementById('mediaPackageModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

/**
 * FAQ Accordion
 */
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');

            // Close all FAQ items
            faqItems.forEach(i => i.classList.remove('active'));

            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // Approach Accordion (Goals/Methodology)
    const approachItems = document.querySelectorAll('.approach-item');

    approachItems.forEach(item => {
        const question = item.querySelector('.approach-question');

        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');

            // Close all approach items
            approachItems.forEach(i => i.classList.remove('active'));

            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

/**
 * Header Scroll Effect
 */
function initHeaderScroll() {
    const header = document.querySelector('.header');

    if (!header) return;

    let lastScroll = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });
}

/**
 * Contact Form Handling
 */
function initContactForm() {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());

            // Here you would typically send the data to a server
            // For now, we'll show a success message

            // Create success message
            const successMsg = document.createElement('div');
            successMsg.className = 'form-success';
            successMsg.innerHTML = `
                <div style="text-align: center; padding: 30px;">
                    <span style="font-size: 50px;">✅</span>
                    <h3 style="margin: 20px 0 10px;">Message Sent!</h3>
                    <p style="color: #6B7280;">We'll get back to you within 24 hours.</p>
                </div>
            `;

            // Replace form with success message
            contactForm.innerHTML = '';
            contactForm.appendChild(successMsg);

            // Track contact form event
            if (typeof trackContact === 'function') {
                trackContact();
            }

            // Log data (for development)
            console.log('Form submitted:', data);
        });
    }

}

/**
 * Scroll Animations (Intersection Observer)
 */
function initAnimations() {
    const animatedElements = document.querySelectorAll('.feature-card, .service-card, .price-card, .coach-card, .schedule-day');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }
}

/**
 * Utility: Format date for different locales
 */
function formatDate(date, locale = 'en') {
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    return new Date(date).toLocaleDateString(locale, options);
}

/**
 * Venue Gallery Modal
 */
const venueImages = [
    'assets/images/venue/court-1.jpg',
    'assets/images/venue/court-2.jpg',
    'assets/images/venue/court-3.jpg',
    'assets/images/venue/facilities.jpg',
    'assets/images/venue/clubhouse.jpg',
    'assets/images/venue/lounge.jpg'
];
let currentVenueSlide = 0;

function openVenueModal(index) {
    currentVenueSlide = index;
    const modal = document.getElementById('venueModal');
    const img = document.getElementById('venueModalImg');
    if (modal && img) {
        img.src = venueImages[index];
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeVenueModal() {
    const modal = document.getElementById('venueModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function changeVenueSlide(direction) {
    currentVenueSlide += direction;
    if (currentVenueSlide >= venueImages.length) currentVenueSlide = 0;
    if (currentVenueSlide < 0) currentVenueSlide = venueImages.length - 1;

    const img = document.getElementById('venueModalImg');
    if (img) {
        img.src = venueImages[currentVenueSlide];
    }
}

// Close modal on escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeVenueModal();
        closeMassageModal();
        closeMassageBookingModal();
        closeServiceBookingModal();
        closeMediaPackageModal();
    }
    if (e.key === 'ArrowRight') {
        changeVenueSlide(1);
    }
    if (e.key === 'ArrowLeft') {
        changeVenueSlide(-1);
    }
});

// Close modal on backdrop click
document.addEventListener('click', function(e) {
    const venueModal = document.getElementById('venueModal');
    const massageModal = document.getElementById('massageModal');
    const massageBookingModal = document.getElementById('massageBookingModal');
    const serviceBookingModal = document.getElementById('serviceBookingModal');
    const mediaPackageModal = document.getElementById('mediaPackageModal');
    if (e.target === venueModal) {
        closeVenueModal();
    }
    if (e.target === massageModal) {
        closeMassageModal();
    }
    if (e.target === massageBookingModal) {
        closeMassageBookingModal();
    }
    if (e.target === serviceBookingModal) {
        closeServiceBookingModal();
    }
    if (e.target === mediaPackageModal) {
        closeMediaPackageModal();
    }
});

/**
 * Active Navigation Link Highlight
 */
function initActiveNavHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', function() {
        let current = '';
        const headerHeight = document.querySelector('.header').offsetHeight;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 100;
            const sectionBottom = sectionTop + section.offsetHeight;

            if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionBottom) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Initialize active nav highlight
initActiveNavHighlight();

/**
 * Registration Modal
 */
function openRegistrationModal(campType) {
    const modal = document.getElementById('registrationModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Pre-select camp type if specified
        if (campType === '5-day') {
            document.querySelector('input[name="camp"][value="5-day"]').checked = true;
        } else if (campType === '3-day') {
            document.querySelector('input[name="camp"][value="3-day"]').checked = true;
        }
        updateCampSelection();
    }
}

function closeRegistrationModal() {
    const modal = document.getElementById('registrationModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function updateCampSelection() {
    const selectedCamp = document.querySelector('input[name="camp"]:checked');
    const infoEl = document.getElementById('selectedCampInfo');

    if (selectedCamp && infoEl) {
        if (selectedCamp.value === '5-day') {
            infoEl.textContent = '5-Day Intensive Camp — €800';
        } else {
            infoEl.textContent = '3-Day Weekend Camp — €400';
        }
    }
}

// Close registration modal on escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeRegistrationModal();
    }
});

// Close registration modal on backdrop click
document.addEventListener('click', function(e) {
    const modal = document.getElementById('registrationModal');
    if (e.target === modal) {
        closeRegistrationModal();
    }
});

// Registration form submission
document.addEventListener('DOMContentLoaded', function() {
    const registrationForm = document.getElementById('registrationForm');

    if (registrationForm) {
        registrationForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Validate at least one goal is selected
            const goals = document.querySelectorAll('input[name="goals"]:checked');
            if (goals.length === 0) {
                alert('Please select at least one goal for the camp.');
                return;
            }

            // Collect form data
            const formData = new FormData(this);
            const data = {
                type: 'camp',
                camp: formData.get('camp'),
                fullName: formData.get('fullName'),
                phone: formData.get('phone'),
                email: formData.get('email'),
                level: formData.get('level'),
                goals: Array.from(goals).map(g => g.value),
                skills: formData.get('skills'),
                tshirt: formData.get('tshirt'),
                consent: formData.get('consent') ? true : false,
                lang: document.documentElement.lang || 'en'
            };

            console.log('Registration data:', data);

            // Отправляем данные в Google Sheets + Telegram
            sendToGoogleSheets(data).catch(err => console.log('Send error:', err));

            // Track registration event
            const priceNum = data.camp === '5-day' ? 800 : 400;
            if (typeof trackRegistration === 'function') {
                trackRegistration({ type: 'camp_registration', camp: data.camp, value: priceNum });
            }

            // Create payment details
            const campName = data.camp === '5-day' ? '5-Day Intensive Camp (April 13-17)' : '3-Day Weekend Camp (April 17-19)';
            const qrImage = data.camp === '5-day' ? 'assets/qr/qr-payment-5day.jpeg' : 'assets/qr/qr-payment-3day.jpeg';
            const stripeLink = data.camp === '5-day' ? 'https://buy.stripe.com/14A8wRctp9Jh4mdbhOcEw01' : 'https://buy.stripe.com/14A14pbpl6x56ul4TqcEw02';

            // Show payment details screen
            const modalContent = document.querySelector('.registration-modal-content');
            modalContent.innerHTML = `
                <button class="registration-modal-close" onclick="closeRegistrationModal()">&times;</button>
                <div class="payment-success">
                    <div class="payment-success-icon">✓</div>
                    <h2>Registration Submitted!</h2>
                    <p class="payment-success-subtitle">Thank you, ${data.fullName}!</p>

                    <div class="payment-details-box">
                        <h3>Complete Your Payment</h3>
                        <p class="payment-amount">Amount: <strong>€${priceNum}</strong></p>
                        <p class="payment-camp">${campName}</p>

                        <div class="payment-options">
                            <div class="payment-option">
                                <h4>Option 1: Pay Online with Stripe</h4>
                                <p class="payment-option-desc">Secure online payment with card</p>
                                <a href="${stripeLink}" target="_blank" class="btn btn-primary btn-block">
                                    💳 Pay with Stripe
                                </a>
                            </div>

                            <div class="payment-divider">OR</div>

                            <div class="payment-option">
                                <h4>Option 2: Bank Transfer</h4>
                                <p class="payment-option-desc">Scan QR code for payment details</p>
                                <div class="qr-code-container">
                                    <img src="${qrImage}" alt="Payment QR Code" class="qr-code">
                                </div>
                            </div>
                        </div>

                        <div class="payment-note">
                            <strong>Important:</strong> After payment, please confirm via WhatsApp
                        </div>
                    </div>

                    <div class="payment-actions">
                        <a href="https://wa.me/35797497756?text=${encodeURIComponent('Hi! I have completed the payment for ' + campName + '. Name: ' + data.fullName)}" target="_blank" class="btn btn-whatsapp btn-block">
                            Confirm Payment via WhatsApp
                        </a>
                    </div>
                </div>
            `;
        });
    }

    // Update booking buttons to open modal
    const bookLimassol = document.getElementById('bookLimassol');
    const bookLarnaca = document.getElementById('bookLarnaca');

    if (bookLimassol) {
        bookLimassol.addEventListener('click', function(e) {
            e.preventDefault();
            openRegistrationModal('5-day');
        });
    }

    if (bookLarnaca) {
        bookLarnaca.addEventListener('click', function(e) {
            e.preventDefault();
            openRegistrationModal('3-day');
        });
    }

    // Hero CTA buttons
    const heroCta = document.querySelector('.hero-cta a[href="#pricing"]');
    if (heroCta) {
        heroCta.addEventListener('click', function(e) {
            e.preventDefault();
            openRegistrationModal('5-day');
        });
    }

    // Service Booking Form Submission
    const serviceBookingForm = document.getElementById('serviceBookingForm');
    if (serviceBookingForm) {
        serviceBookingForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Collect form data
            const formData = new FormData(this);
            const data = {
                type: 'service',
                service: formData.get('serviceName'),
                price: formData.get('servicePrice'),
                name: formData.get('serviceBookingName'),
                phone: formData.get('serviceBookingPhone'),
                email: formData.get('serviceBookingEmail'),
                notes: formData.get('serviceBookingNotes'),
                lang: document.documentElement.lang || 'en'
            };

            console.log('Service booking data:', data);

            // Отправляем данные в Google Sheets + Telegram
            sendToGoogleSheets(data).catch(err => console.log('Send error:', err));

            // Track service booking event
            if (typeof trackBooking === 'function') {
                trackBooking(data.service, parseFloat(data.price) || 0);
            }

            // Determine language
            const isRussian = document.documentElement.lang === 'ru';

            const priceText = data.service.includes('hour') || data.service.includes('час')
                ? `€${data.price} / ${isRussian ? 'час' : 'hour'}`
                : `€${data.price}`;

            // Show success message
            const modalContent = document.querySelector('#serviceBookingModal .massage-booking-modal-content');
            modalContent.innerHTML = `
                <button class="massage-modal-close" onclick="closeServiceBookingModal()">&times;</button>
                <div class="payment-success">
                    <div class="payment-success-icon">✓</div>
                    <h2>${isRussian ? 'Запрос отправлен!' : 'Booking Request Submitted!'}</h2>
                    <p class="payment-success-subtitle">${isRussian ? 'Спасибо' : 'Thank you'}, ${data.name}!</p>

                    <div class="payment-details-box">
                        <h3>${isRussian ? 'Что дальше?' : 'What\'s Next?'}</h3>
                        <p class="payment-camp">${data.service} — ${priceText}</p>

                        <div class="massage-booking-success-info">
                            <p>${isRussian
                                ? 'Мы свяжемся с вами в ближайшее время для подтверждения бронирования.'
                                : 'We will contact you shortly to confirm your booking.'}</p>
                            <p><strong>${isRussian ? 'Мы свяжемся с вами по:' : 'We will contact you at:'}</strong></p>
                            <p>📞 ${data.phone}<br>✉️ ${data.email}</p>
                        </div>

                        <div class="payment-note">
                            ${isRussian
                                ? '<strong>Примечание:</strong> Оплата будет произведена после подтверждения.'
                                : '<strong>Note:</strong> Payment will be arranged after confirmation.'}
                        </div>
                    </div>

                    <button onclick="closeServiceBookingModal()" class="btn btn-primary btn-block">
                        ${isRussian ? 'Закрыть' : 'Close'}
                    </button>
                </div>
            `;
        });
    }

    // Massage Booking Form Submission
    const massageBookingForm = document.getElementById('massageBookingForm');
    if (massageBookingForm) {
        massageBookingForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Collect form data
            const formData = new FormData(this);
            const data = {
                type: 'massage',
                duration: formData.get('massageDuration'),
                price: formData.get('massagePrice'),
                name: formData.get('massageName'),
                phone: formData.get('massagePhone'),
                email: formData.get('massageEmail'),
                notes: formData.get('massageNotes'),
                lang: document.documentElement.lang || 'en'
            };

            console.log('Massage booking data:', data);

            // Отправляем данные в Google Sheets + Telegram
            sendToGoogleSheets(data).catch(err => console.log('Send error:', err));

            // Track massage booking event
            if (typeof trackBooking === 'function') {
                trackBooking('massage_' + data.duration, parseFloat(data.price) || 0);
            }

            // Determine language
            const isRussian = document.documentElement.lang === 'ru';

            // Select Stripe link and QR based on price
            let stripeLink, qrImage;
            if (data.price === '75') {
                stripeLink = 'https://buy.stripe.com/14AeVfeBx2gPaKBclScEw07';
                qrImage = 'assets/qr/massage-75-qr.jpeg';
            } else if (data.price === '60') {
                stripeLink = 'https://buy.stripe.com/4gMcN79hdaNlaKB1HecEw08';
                qrImage = 'assets/qr/massage-60-qr.jpeg';
            } else {
                // Default to €45 link for 30 min
                stripeLink = 'https://buy.stripe.com/6oU5kF2SP08H05X71ycEw09';
                qrImage = 'assets/qr/massage-qr.jpeg';
            }

            // Show payment options
            const modalContent = document.querySelector('#massageBookingModal .massage-booking-modal-content');
            modalContent.innerHTML = `
                <button class="massage-modal-close" onclick="closeMassageBookingModal()">&times;</button>
                <div class="payment-success">
                    <div class="payment-success-icon">✓</div>
                    <h2>${isRussian ? 'Спасибо' : 'Thank you'}, ${data.name}!</h2>
                    <p class="payment-success-subtitle">${isRussian ? 'Массаж' : 'Massage'} ${data.duration} ${isRussian ? 'мин' : 'min'} — €${data.price}</p>

                    <div class="payment-details-box">
                        <h3>${isRussian ? 'Выберите способ оплаты' : 'Choose Payment Method'}</h3>

                        <div class="payment-options">
                            <div class="payment-option">
                                <h4>${isRussian ? 'Вариант 1: Оплата онлайн' : 'Option 1: Pay Online'}</h4>
                                <p class="payment-option-desc">${isRussian ? 'Безопасная оплата картой' : 'Secure card payment'}</p>
                                <a href="${stripeLink}" target="_blank" class="btn btn-primary btn-block">
                                    💳 ${isRussian ? 'Оплатить через Stripe' : 'Pay with Stripe'}
                                </a>
                            </div>

                            <div class="payment-divider">${isRussian ? 'ИЛИ' : 'OR'}</div>

                            <div class="payment-option">
                                <h4>${isRussian ? 'Вариант 2: Банковский перевод' : 'Option 2: Bank Transfer'}</h4>
                                <p class="payment-option-desc">${isRussian ? 'Отсканируйте QR-код' : 'Scan QR code for details'}</p>
                                <div class="qr-code-container">
                                    <img src="${qrImage}" alt="Payment QR Code" class="qr-code">
                                </div>
                            </div>
                        </div>

                        <div class="payment-note">
                            <strong>${isRussian ? 'Важно:' : 'Important:'}</strong> ${isRussian ? 'После оплаты подтвердите через WhatsApp' : 'After payment, please confirm via WhatsApp'}
                        </div>
                    </div>

                    <div class="payment-actions" style="margin-top: 20px;">
                        <a href="https://wa.me/35797497756?text=${encodeURIComponent((isRussian ? 'Привет! Я оплатил(а) массаж (' + data.duration + ' мин, €' + data.price + '). Имя: ' : 'Hi! I have paid for massage (' + data.duration + ' min, €' + data.price + '). Name: ') + data.name)}" target="_blank" class="btn btn-whatsapp btn-block">
                            ${isRussian ? 'Подтвердить оплату через WhatsApp' : 'Confirm Payment via WhatsApp'}
                        </a>
                    </div>
                </div>
            `;
        });
    }

    // Media Package Form Submission
    const mediaPackageForm = document.getElementById('mediaPackageForm');
    if (mediaPackageForm) {
        mediaPackageForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Collect form data
            const formData = new FormData(this);
            const data = {
                type: 'media',
                name: formData.get('mediaPackageName'),
                phone: formData.get('mediaPackagePhone'),
                email: formData.get('mediaPackageEmail'),
                notes: formData.get('mediaPackageNotes'),
                lang: document.documentElement.lang || 'en'
            };

            console.log('Media Package booking data:', data);

            // Отправляем данные в Google Sheets + Telegram
            sendToGoogleSheets(data).catch(err => console.log('Send error:', err));

            // Track media package booking event
            if (typeof trackBooking === 'function') {
                trackBooking('media_package', 150);
            }

            // Determine language
            const isRussian = document.documentElement.lang === 'ru';

            // Show payment options
            const modalContent = document.querySelector('#mediaPackageModal .massage-booking-modal-content');
            modalContent.innerHTML = `
                <button class="massage-modal-close" onclick="closeMediaPackageModal()">&times;</button>
                <div class="payment-success">
                    <div class="payment-success-icon">✓</div>
                    <h2>${isRussian ? 'Спасибо' : 'Thank you'}, ${data.name}!</h2>
                    <p class="payment-success-subtitle">${isRussian ? 'Медиапакет «На память» — €130' : 'Media Package — €130'}</p>

                    <div class="payment-details-box">
                        <h3>${isRussian ? 'Выберите способ оплаты' : 'Choose Payment Method'}</h3>

                        <div class="payment-options">
                            <div class="payment-option">
                                <h4>${isRussian ? 'Вариант 1: Оплата онлайн' : 'Option 1: Pay Online'}</h4>
                                <p class="payment-option-desc">${isRussian ? 'Безопасная оплата картой' : 'Secure card payment'}</p>
                                <a href="https://buy.stripe.com/9B65kF8d9bRpbOFclScEw0a" target="_blank" class="btn btn-primary btn-block">
                                    💳 ${isRussian ? 'Оплатить через Stripe' : 'Pay with Stripe'}
                                </a>
                            </div>

                            <div class="payment-divider">${isRussian ? 'ИЛИ' : 'OR'}</div>

                            <div class="payment-option">
                                <h4>${isRussian ? 'Вариант 2: Банковский перевод' : 'Option 2: Bank Transfer'}</h4>
                                <p class="payment-option-desc">${isRussian ? 'Отсканируйте QR-код' : 'Scan QR code for details'}</p>
                                <div class="qr-code-container">
                                    <img src="assets/qr/media-package-qr.jpeg" alt="Payment QR Code" class="qr-code">
                                </div>
                            </div>
                        </div>

                        <div class="payment-note">
                            <strong>${isRussian ? 'Важно:' : 'Important:'}</strong> ${isRussian ? 'После оплаты подтвердите через WhatsApp' : 'After payment, please confirm via WhatsApp'}
                        </div>
                    </div>

                    <div class="payment-actions" style="margin-top: 20px;">
                        <a href="https://wa.me/35797497756?text=${encodeURIComponent((isRussian ? 'Привет! Я оплатил(а) медиапакет (€130). Имя: ' : 'Hi! I have paid for Media Package (€130). Name: ') + data.name)}" target="_blank" class="btn btn-whatsapp btn-block">
                            ${isRussian ? 'Подтвердить оплату через WhatsApp' : 'Confirm Payment via WhatsApp'}
                        </a>
                    </div>
                </div>
            `;
        });
    }
});

/**
 * Download Payment Details PDF
 */
function downloadPaymentDetails(fullName, campName, amount) {
    // Download the bank details PDF certificate
    const link = document.createElement('a');
    link.href = 'assets/Padel_Camp_Bank_Details.pdf';
    link.download = 'Padel_Camp_Bank_Details.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
