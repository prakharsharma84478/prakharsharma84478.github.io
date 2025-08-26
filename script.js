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
        e.preventDefault(); // Prevent the default link behavior (and focus)

        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            // Manually scroll to the element
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

// Logic to close the modal
function closeModal() {
    downloadModal.style.display = 'none';
}

closeModalBtn.addEventListener('click', closeModal);

downloadModal.addEventListener('click', (e) => {
    if (e.target === downloadModal) {
        closeModal();
    }
});


// --- JAVASCRIPT LOGIC FOR "READ MORE" ---
document.addEventListener('DOMContentLoaded', () => {
    const categoryItems = document.querySelectorAll('.category-item');
    const collapsedHeight = 3.2 * 16; // Corresponds to 3.2em, assuming 1em = 16px

    categoryItems.forEach(item => {
        const p = item.querySelector('p');
        
        if (p && p.scrollHeight > collapsedHeight) {
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
});


// --- JAVASCRIPT LOGIC FOR INTERACTIVE PANELS (Mobile Friendly) ---
document.addEventListener('DOMContentLoaded', () => {
    const featureSection = document.getElementById('feature-one');
    if (!featureSection) return; 

    const panels = featureSection.querySelectorAll('.panel');
    const panelsContainer = featureSection.querySelector('.interactive-panels');
    const demoVideo = featureSection.querySelector('.panel-video');
    const motionAnimation = document.getElementById('motion-animation');
    let isFeatureSectionVisible = false;

    function setActivePanel(panelToActivate) {
        panels.forEach(p => p.classList.remove('active'));
        panelToActivate.classList.add('active');

        if (panelToActivate.id === 'panel-video') {
            if (demoVideo) demoVideo.play();
            if (motionAnimation) motionAnimation.pause();
        } else {
            if (demoVideo) demoVideo.pause();
            if (motionAnimation) motionAnimation.play();
        }
    }
    
    function resetPanels() {
        panels.forEach(p => p.classList.remove('active'));
        if(demoVideo) demoVideo.pause();
        if(motionAnimation) motionAnimation.pause();
    }

    panels.forEach(panel => {
        // For DESKTOP: Hover to expand
        panel.addEventListener('mouseenter', () => {
            if (window.innerWidth > 768 && isFeatureSectionVisible) {
                setActivePanel(panel);
            }
        });

        // For MOBILE/TOUCH: Tap to expand/collapse
        panel.addEventListener('click', () => {
            if (window.innerWidth <= 768 && isFeatureSectionVisible) {
                if (panel.classList.contains('active')) {
                    resetPanels();
                } else {
                    setActivePanel(panel);
                }
            }
        });
    });

    // For DESKTOP: Mouse leaving the container resets it
    if (panelsContainer) {
        panelsContainer.addEventListener('mouseleave', () => {
             if (window.innerWidth > 768 && isFeatureSectionVisible) {
                resetPanels();
             }
        });
    }

    const featureSectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                isFeatureSectionVisible = true;
                const defaultPanel = document.getElementById('panel-animation');
                // Set a default active panel only on desktop
                if (window.innerWidth > 768 && defaultPanel) {
                   setActivePanel(defaultPanel);
                }
            } else {
                isFeatureSectionVisible = false;
                resetPanels();
            }
        });
    }, { threshold: 0.75 });

    featureSectionObserver.observe(featureSection);
});