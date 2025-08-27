// --- PRELOADER LOGIC ---
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.classList.add('hidden');
    }
});

// --- JAVASCRIPT LOGIC TO SCROLL TO TOP ON PAGE LOAD ---
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
}
window.addEventListener('load', () => {
    window.scrollTo(0, 0);
});


// --- JAVASCRIPT LOGIC FOR HEADER SCROLL ---
const header = document.querySelector('.main-header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});


// --- JAVASCRIPT LOGIC FOR SMOOTH SCROLL WITHOUT FOCUS ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});


// --- JAVASCRIPT LOGIC FOR SCROLL ANIMATIONS ---
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        }
    });
});

const hiddenElements = document.querySelectorAll('.hidden');
hiddenElements.forEach((el) => observer.observe(el));


// --- JAVASCRIPT LOGIC FOR FEEDBACK FORM ---
const feedbackForm = document.getElementById('feedback-form');
const ageButtons = feedbackForm.querySelectorAll('.age-buttons button');
const ageGroupInput = document.getElementById('age-group-input');
const interestButtons = feedbackForm.querySelectorAll('.interest-buttons button');
const interestInput = document.getElementById('interest-input');
const radioOptions = feedbackForm.querySelectorAll('input[name="entry.310060750"]');
const feedbackTextarea = document.getElementById('feedback-textarea');
const submitButton = feedbackForm.querySelector('.cta-button');
const downloadModal = document.getElementById('download-modal');
const closeModalBtn = document.getElementById('close-modal');

function validateForm() {
    const ageSelected = ageGroupInput.value !== '';
    const interestSelected = interestInput.value !== '';
    const frequencySelected = feedbackForm.querySelector('input[name="entry.310060750"]:checked') !== null;
    const feedbackEntered = feedbackTextarea.value.trim() !== '';

    if (ageSelected && interestSelected && frequencySelected && feedbackEntered) {
        submitButton.disabled = false;
    } else {
        submitButton.disabled = true;
    }
}

ageButtons.forEach(button => {
    button.addEventListener('click', () => {
        ageButtons.forEach(btn => btn.classList.remove('selected'));
        button.classList.add('selected');
        ageGroupInput.value = button.dataset.value;
        validateForm();
    });
});

interestButtons.forEach(button => {
    button.addEventListener('click', () => {
        interestButtons.forEach(btn => btn.classList.remove('selected'));
        button.classList.add('selected');
        interestInput.value = button.dataset.value;
        validateForm();
    });
});

radioOptions.forEach(radio => {
    radio.addEventListener('change', validateForm);
});

feedbackTextarea.addEventListener('input', validateForm);

feedbackForm.addEventListener('submit', (e) => {
    const googleFormUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSdDZPpFLxXBxxQQ10dFXYGEAEA0lGbij3I597Dt-seBYr626Q/formResponse';
    feedbackForm.action = googleFormUrl;

    setTimeout(() => {
        downloadModal.style.display = 'flex';
        feedbackForm.reset();
        ageButtons.forEach(btn => btn.classList.remove('selected'));
        interestButtons.forEach(btn => btn.classList.remove('selected'));
        submitButton.disabled = true;
    }, 500);
});

function closeModal() {
    downloadModal.style.display = 'none';
}

closeModalBtn.addEventListener('click', closeModal);
downloadModal.addEventListener('click', (e) => {
    if (e.target === downloadModal) {
        closeModal();
    }
});


// --- JAVASCRIPT LOGIC FOR "READ MORE" AND INTERACTIVE PANELS ---
document.addEventListener('DOMContentLoaded', () => {
    
    const categoryItems = document.querySelectorAll('.category-item');
    categoryItems.forEach(item => {
        const p = item.querySelector('p');
        if (p && p.scrollHeight > (3.2 * 16)) {
            p.classList.add('collapsed');
            const readMoreBtn = document.createElement('span');
            readMoreBtn.className = 'read-more-btn';
            readMoreBtn.textContent = 'Read More';
            item.appendChild(readMoreBtn);
            readMoreBtn.addEventListener('click', () => {
                p.classList.toggle('collapsed');
                readMoreBtn.textContent = p.classList.contains('collapsed') ? 'Read More' : 'Read Less';
            });
        }
    });

    // --- INTERACTIVE PANELS LOGIC ---
    const featureSection = document.getElementById('feature-one');
    if (!featureSection) return; 

    const panels = featureSection.querySelectorAll('.panel');
    const panelsContainer = featureSection.querySelector('.interactive-panels');
    const demoVideo = document.getElementById('demoVideo');
    const howItWorksVideo = document.getElementById('howItWorksVideo');
    let isFeatureSectionVisible = false;
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

    function setActivePanel(panelToActivate) {
        // Pause all videos first to ensure only one plays.
        if (demoVideo) demoVideo.pause();
        if (howItWorksVideo) howItWorksVideo.pause();

        // Find the video in the panel we want to activate.
        const videoToPlay = panelToActivate.querySelector('.panel-video');
        if (videoToPlay) {
            // This direct play() call is required by mobile browsers on user interaction.
            videoToPlay.play().catch(error => {
                console.error("Video play failed:", error);
            });
        }

        // Handle the visual change.
        panels.forEach(p => p.classList.remove('active'));
        panelToActivate.classList.add('active');
    }
    
    function resetPanels() {
        if (demoVideo) demoVideo.pause();
        if (howItWorksVideo) howItWorksVideo.pause();
        panels.forEach(p => p.classList.remove('active'));
    }

    // CLICK logic for touch devices (mobile)
    if (isTouchDevice) {
        panels.forEach(panel => {
            panel.addEventListener('click', () => {
                if (!isFeatureSectionVisible) return;
                
                if (panel.classList.contains('active')) {
                    resetPanels();
                } else {
                    setActivePanel(panel);
                }
            });
        });
    } else { // HOVER logic for non-touch devices (desktop)
        panels.forEach(panel => {
            panel.addEventListener('mouseenter', () => {
                if (isFeatureSectionVisible) setActivePanel(panel);
            });
        });
        if (panelsContainer) {
            panelsContainer.addEventListener('mouseleave', () => {
                if (isFeatureSectionVisible) resetPanels();
            });
        }
    }

    const featureSectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                isFeatureSectionVisible = true;
                // On desktop, we want continuous playback. Setting a default active panel achieves this.
                if (!isTouchDevice && panels.length > 0) {
                   setActivePanel(panels[0]); // Autoplay the first video on desktop
                }
            } else {
                isFeatureSectionVisible = false;
                resetPanels();
            }
        });
    }, { threshold: 0.75 });

    featureSectionObserver.observe(featureSection);
});