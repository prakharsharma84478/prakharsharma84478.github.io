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

    // Helper functions for playback and visuals
    function playVideo(video) {
        if (video) video.play().catch(e => console.error("Video play failed:", e));
    }

    function pauseVideo(video) {
        if (video) video.pause();
    }
    
    function setActivePanel(panelToActivate) {
        panels.forEach(p => p.classList.remove('active'));
        panelToActivate.classList.add('active');
    }
    
    function resetPanels() {
        panels.forEach(p => p.classList.remove('active'));
    }

    // --- Event Listeners for Mobile vs Desktop ---

    if (isTouchDevice) {
        // MOBILE: Click to expand/collapse and play/pause
        panels.forEach(panel => {
            panel.addEventListener('click', () => {
                if (!isFeatureSectionVisible) return;

                const isActive = panel.classList.contains('active');
                const video = panel.querySelector('.panel-video');

                if (isActive) {
                    resetPanels();
                    pauseVideo(video);
                } else {
                    pauseVideo(demoVideo);
                    pauseVideo(howItWorksVideo);
                    setActivePanel(panel);
                    playVideo(video);
                }
            });
        });
    } else {
        // DESKTOP: Hover to play and expand
        panels.forEach(panel => {
            panel.addEventListener('mouseenter', () => {
                if (isFeatureSectionVisible) {
                    setActivePanel(panel);
                    const videoToPlay = panel.querySelector('.panel-video');
                    playVideo(videoToPlay);
                }
            });
        });
        
        if (panelsContainer) {
            panelsContainer.addEventListener('mouseleave', () => {
                if (isFeatureSectionVisible) {
                    resetPanels();
                    // Pause both videos when mouse leaves the container
                    pauseVideo(demoVideo);
                    pauseVideo(howItWorksVideo);
                }
            });
        }
    }

    // --- Master Observer for Visibility ---
    const featureSectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                isFeatureSectionVisible = true;
                // Videos are now only played on hover/tap, not on scroll
            } else {
                isFeatureSectionVisible = false;
                // When not visible, pause everything and reset visuals.
                pauseVideo(demoVideo);
                pauseVideo(howItWorksVideo);
                resetPanels();
            }
        });
    }, { threshold: 0.75 });

    featureSectionObserver.observe(featureSection);
});