document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();

            // Get the target element (section) using the href attribute
            const targetId = this.getAttribute('href').substring(1); // Remove the '#' symbol
            const targetElement = document.getElementById(targetId);
            console.log(targetElement);
            // Check if the target element exists
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70, // Adjust offset for fixed navbar
                    behavior: 'smooth'
                });
            }
        });
    });

    // Form validation with real-time feedback and error messages
    const form = document.getElementById('contactForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const submitButton = form.querySelector('button[type="submit"]');
    const charCounter = document.createElement('div');

    charCounter.id = 'charCounter';
    charCounter.classList.add('text-muted', 'text-right');
    messageInput.parentNode.appendChild(charCounter);

    messageInput.addEventListener('input', () => {
        const remaining = 500 - messageInput.value.length;
        charCounter.textContent = `${remaining} characters remaining`;
    });

    function validateForm() {
        let isValid = true;

        if (nameInput.value.trim() === '') {
            nameInput.classList.add('is-invalid');
            showError(nameInput, "Name is required.");
            isValid = false;
        } else {
            nameInput.classList.remove('is-invalid');
            removeError(nameInput);
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(emailInput.value.trim())) {
            emailInput.classList.add('is-invalid');
            showError(emailInput, "Please enter a valid email.");
            isValid = false;
        } else {
            emailInput.classList.remove('is-invalid');
            removeError(emailInput);
        }

        if (messageInput.value.trim() === '') {
            messageInput.classList.add('is-invalid');
            showError(messageInput, "Message cannot be empty.");
            isValid = false;
        } else {
            messageInput.classList.remove('is-invalid');
            removeError(messageInput);
        }

        return isValid;
    }

    function showError(inputElement, message) {
        let errorElement = inputElement.nextElementSibling;
        if (!errorElement || !errorElement.classList.contains('invalid-feedback')) {
            errorElement = document.createElement('div');
            errorElement.classList.add('invalid-feedback');
            inputElement.parentNode.insertBefore(errorElement, inputElement.nextSibling);
        }
        errorElement.textContent = message;
    }

    function removeError(inputElement) {
        let errorElement = inputElement.nextElementSibling;
        if (errorElement && errorElement.classList.contains('invalid-feedback')) {
            errorElement.remove();
        }
    }

    form.addEventListener('input', () => validateForm());

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        if (validateForm()) {
            alert('Message sent successfully!');
            form.reset();
            charCounter.textContent = '500 characters remaining';
        } else {
            alert('Please fill out all fields correctly.');
        }
    });

    // Highlight active section in the navigation
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 70; // Adjust offset for fixed navbar
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });

    // Back to Top Button with smooth transition
    const backToTop = document.createElement('button');
    backToTop.textContent = '↑';
    backToTop.classList.add('btn', 'btn-primary', 'back-to-top');
    document.body.appendChild(backToTop);

    backToTop.style.display = 'none';
    backToTop.style.position = 'fixed';
    backToTop.style.bottom = '20px';
    backToTop.style.right = '20px';
    backToTop.style.borderRadius = '50%';
    backToTop.style.transition = 'opacity 0.3s';

    window.addEventListener('scroll', () => {
        if (window.scrollY > 200) {
            backToTop.style.opacity = '1';
            backToTop.style.display = 'block';
        } else {
            backToTop.style.opacity = '0';
            setTimeout(() => { backToTop.style.display = 'none'; }, 300);
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Dark Mode Toggle with persistence
    const darkModeToggle = document.createElement('button');
    darkModeToggle.textContent = 'Dark Mode';
    darkModeToggle.classList.add('btn', 'btn-secondary', 'ml-3');
    document.querySelector('.navbar').appendChild(darkModeToggle);

    // Load dark mode preference from localStorage
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        darkModeToggle.textContent = 'Light Mode';
    }

    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        if (document.body.classList.contains('dark-mode')) {
            darkModeToggle.textContent = 'Light Mode';
            localStorage.setItem('darkMode', 'true');
        } else {
            darkModeToggle.textContent = 'Dark Mode';
            localStorage.setItem('darkMode', 'false');
        }
    });

    // Apply dark mode styles
    const darkModeStyles = document.createElement('style');
    darkModeStyles.textContent = `
        .dark-mode {
            background-color: #121212;
            color: #ffffff;
        }
        .dark-mode .navbar, .dark-mode footer {
            background-color: #1e1e1e;
        }
        .dark-mode .btn-primary {
            background-color: #bb86fc;
            border-color: #bb86fc;
        }
    `;
    document.head.appendChild(darkModeStyles);
});
