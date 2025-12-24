document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // CONFIGURATION
    // Change true to false to CLOSE registration
    // Change false to true to OPEN registration
    // ==========================================
    const isRegistrationOpen = false;

    // Tournament ID - Change this to reset registration for a new event (e.g., 'event_2026')
    const TOURNAMENT_ID = 'chess_event_2025_01';
    // ==========================================

    const form = document.getElementById('chessForm');
    const closedMessage = document.getElementById('closedMessage');
    const alreadyRegisteredMessage = document.getElementById('alreadyRegisteredMessage');

    // Dynamic Redirect URL: Ensures user comes back to the same site (localhost or production)
    const nextInput = document.querySelector('input[name="_next"]');
    if (nextInput) {
        // Construct distinct URL for return
        const currentUrl = window.location.href.split('?')[0];
        nextInput.value = currentUrl + (currentUrl.endsWith('/') ? '' : '/') + '?success=true';
    }

    // 1. Check for Duplicate Registration
    if (localStorage.getItem(TOURNAMENT_ID) === 'true') {
        if (form) form.style.display = 'none';
        if (alreadyRegisteredMessage) {
            alreadyRegisteredMessage.style.display = 'block';
            alreadyRegisteredMessage.style.animation = 'slideUpFade 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards';
        }
        return; // Stop execution
    }

    // 2. Check if Registration is Closed
    if (!isRegistrationOpen) {
        if (form) form.style.display = 'none';
        if (closedMessage) {
            closedMessage.style.display = 'block';
            closedMessage.style.animation = 'slideUpFade 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards';
        }
        return; // Stop execution
    }

    // Add staggered animation delay to form groups
    const formGroups = document.querySelectorAll('.form-group');
    formGroups.forEach((group, index) => {
        group.style.opacity = '0';
        group.style.animation = `slideUpFade 0.5s ease forwards ${0.3 + (index * 0.1)}s`;
    });

    const btn = document.querySelector('.submit-btn');
    if (btn) {
        btn.style.opacity = '0';
        btn.style.animation = `slideUpFade 0.5s ease forwards ${0.3 + (formGroups.length * 0.1)}s`;
    }

    const inputs = document.querySelectorAll('.form-control');
    // Input focus effects for better UX
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.parentElement.classList.add('focused');
        });
        input.addEventListener('blur', () => {
            input.parentElement.parentElement.classList.remove('focused');
        });
    });

    // Check for success query parameter
    // Check for success query parameter
    // Form Submission with Razorpay
    // Check for success query parameter
    // Form Submission with Razorpay
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            // Validate form fields (Basic validation)
            const name = document.getElementById('name').value;
            const username = document.getElementById('username').value;
            const rating = document.getElementById('rating').value;

            if (!name || !username || !rating) {
                alert('Please fill in all fields');
                return;
            }

            // Razorpay Options
            var options = {
                "key": "YOUR_RAZORPAY_KEY_ID", // Enter the Key ID generated from the Dashboard
                "amount": "4900", // Amount is in currency subunits. Default currency is INR. Hence, 4900 refers to 4900 paise
                "currency": "INR",
                "name": "Chess Tournament",
                "description": "Registration Fee",
                "image": "https://bhautikkk.github.io/chessform/assets/logo.png", // Optional: Add a logo URL
                "handler": function (response) {
                    // Payment Successful
                    document.getElementById('razorpay_payment_id').value = response.razorpay_payment_id;

                    // Show success overlay immediately or submit form?
                    // Submit form to formsubmit.co
                    form.submit();
                },
                "prefill": {
                    "name": name,
                    "email": "", // We don't have email field in form, can add if needed
                    "contact": "" // We don't have contact field
                },
                "theme": {
                    "color": "#3399cc"
                }
            };

            var rzp1 = new Razorpay(options);
            rzp1.on('payment.failed', function (response) {
                alert("Payment Failed: " + response.error.description);
            });

            rzp1.open();
        });
    }

    // Check for success query param (legacy logic seems to be okay to keep or merge)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
        // Mark as registered in LocalStorage
        localStorage.setItem(TOURNAMENT_ID, 'true');

        const successOverlay = document.querySelector('.success-overlay');
        if (successOverlay) {
            successOverlay.classList.add('active');

            // Hide form to prevent re-submission immediately
            if (form) form.style.display = 'none';
            if (alreadyRegisteredMessage) {
                // We don't necessarily need to show the message immediately behind the overlay, 
                // but it sets the state correctly for when they click "OK" or reload.
                alreadyRegisteredMessage.style.display = 'block';
                alreadyRegisteredMessage.style.opacity = '1'; // Ensure it's visible if overlay closes
            }

            // Optional: Clean up the URL
            window.history.replaceState({}, document.title, window.location.pathname);

            // Manual close is now required via button, so we don't auto-close
        }
    }
});
