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
const ageButtons = document.querySelectorAll('.age-buttons button');
const ageGroupInput = document.getElementById('age-group-input');

ageButtons.forEach(button => {
    button.addEventListener('click', () => {
        ageButtons.forEach(btn => btn.classList.remove('selected'));
        button.classList.add('selected');
        ageGroupInput.value = button.dataset.value;
    });
});

const feedbackForm = document.getElementById('feedback-form');
const downloadModal = document.getElementById('download-modal');
const closeModalBtn = document.getElementById('close-modal');

feedbackForm.addEventListener('submit', (e) => {
    const googleFormUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSdDZPpFLxXBxxQQ10dFXYGEAEA0lGbij3I597Dt-seBYr626Q/formResponse';
    feedbackForm.action = googleFormUrl;

    // Give the form a moment to submit in the background
    setTimeout(() => {
        // Show the download modal
        downloadModal.style.display = 'flex';
        
        feedbackForm.reset();
        ageButtons.forEach(btn => btn.classList.remove('selected'));
    }, 500); // 0.5-second delay
});

// Logic to close the modal
function closeModal() {
    downloadModal.style.display = 'none';
}

closeModalBtn.addEventListener('click', closeModal);

// Also close modal if user clicks on the background overlay
downloadModal.addEventListener('click', (e) => {
    if (e.target === downloadModal) {
        closeModal();
    }
});
