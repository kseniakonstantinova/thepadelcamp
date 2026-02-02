/**
 * Padel Camp Cyprus - Main JavaScript
 * ===================================
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initMobileMenu();
    initSmoothScroll();
    initCountdown();
    initProgramTabs();
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
    const navLinks = document.querySelectorAll('.nav-link');

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
    const modal = document.getElementById('venueModal');
    if (e.target === modal) {
        closeVenueModal();
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
                camp: formData.get('camp'),
                fullName: formData.get('fullName'),
                phone: formData.get('phone'),
                email: formData.get('email'),
                level: formData.get('level'),
                goals: Array.from(goals).map(g => g.value),
                skills: formData.get('skills'),
                tshirt: formData.get('tshirt'),
                consent: formData.get('consent') ? true : false
            };

            console.log('Registration data:', data);

            // Create WhatsApp message with form data
            const campName = data.camp === '5-day' ? '5-Day Intensive Camp (April 13-17)' : '3-Day Weekend Camp (April 17-19)';
            const price = data.camp === '5-day' ? '€800' : '€400';
            const priceNum = data.camp === '5-day' ? 800 : 400;
            const goalsText = data.goals.join('; ');

            // Show payment details screen
            const modalContent = document.querySelector('.registration-modal-content');
            modalContent.innerHTML = `
                <button class="registration-modal-close" onclick="closeRegistrationModal()">&times;</button>
                <div class="payment-success">
                    <div class="payment-success-icon">✓</div>
                    <h2>Registration Submitted!</h2>
                    <p class="payment-success-subtitle">Thank you, ${data.fullName}!</p>

                    <div class="payment-details-box">
                        <h3>Payment Details</h3>
                        <p class="payment-amount">Amount: <strong>€${priceNum}</strong></p>
                        <p class="payment-camp">${campName}</p>

                        <div class="bank-details">
                            <div class="bank-detail-row">
                                <span class="bank-label">Account Name:</span>
                                <span class="bank-value">ANDREOU ANDREAS</span>
                            </div>
                            <div class="bank-detail-row">
                                <span class="bank-label">IBAN:</span>
                                <span class="bank-value iban">CY19 0050 0109 0001 0910 5071 8000</span>
                            </div>
                            <div class="bank-detail-row">
                                <span class="bank-label">SWIFT/BIC:</span>
                                <span class="bank-value">HEBACY2N</span>
                            </div>
                            <div class="bank-detail-row">
                                <span class="bank-label">Bank:</span>
                                <span class="bank-value">Eurobank Cyprus</span>
                            </div>
                        </div>

                        <div class="payment-note">
                            <strong>Important:</strong> Please include your full name in the payment reference.
                        </div>
                    </div>

                    <p class="payment-confirm-text">After completing the transfer, please confirm your payment via WhatsApp:</p>

                    <div class="payment-actions">
                        <button onclick="downloadPaymentDetails('${data.fullName}', '${campName}', ${priceNum})" class="btn btn-download btn-block">
                            📥 Download Payment Details
                        </button>

                        <a href="https://wa.me/35799123456?text=${encodeURIComponent('Hi! I have completed the payment for ' + campName + '. Name: ' + data.fullName)}" target="_blank" class="btn btn-whatsapp btn-block">
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
