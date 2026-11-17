
(() => {
    // ==========================================
    // EMAILJS CONFIGURATION
    // ==========================================
    // service id service_391ddwq
    // organizer template_inum5ju
    // guest template_s7n3z3b
    const EMAILJS_PUBLIC_KEY = 'W-20e4t6CN89bDde3';
    const EMAILJS_SERVICE_ID = 'service_otpy355';

    const ORGANIZER_TEMPLATE_ID = 'template_inum5ju';
    const GUEST_TEMPLATE_ID = 'template_s7n3z3b';

    // ==========================================
    // INITIALIZATION
    // ==========================================

    if (typeof emailjs === 'undefined') {
        console.error('EmailJS library failed to load.');
        return;
    }

    emailjs.init({
        publicKey: EMAILJS_PUBLIC_KEY
    });

    let celebrant = null;
    let organizerEmailSent = false;

    const screens = Array.from(document.querySelectorAll('.screen'));

    const show = (id) => {
        screens.forEach(s => {
            s.classList.toggle('active', s.id === id);
            s.setAttribute('aria-hidden', s.id === id ? 'false' : 'true');
        });

        window.scrollTo({ top: 0, behavior: 'instant' });
    };

    // ==========================================
    // NAVIGATION
    // ==========================================

    document.querySelectorAll('[data-next]').forEach(button =>
        button.addEventListener('click', () => show(button.dataset.next))
    );

    // document.querySelectorAll('[data-name]').forEach(button =>
    //     button.addEventListener('click', () => {
    //         celebrant = button.dataset.name;

    //         document.getElementById('selected-name').textContent = celebrant;

    //         show('questions');
    //     })
    // );

    const questionsByName = {
        Llara: [
            "Question for Llara 1",
            "Question for Llara 2",
            "Question for Llara 3"
        ],

        Rizia: [
            "Question for Rizia 1",
            "Question for Rizia 2",
            "Question for Rizia 3"
        ]
    };

    document.querySelectorAll('[data-name]').forEach(button => {
        button.addEventListener('click', () => {
            celebrant = button.dataset.name;

            document.getElementById('selected-name').textContent = celebrant;

            const questions = questionsByName[celebrant];

            document.getElementById('label-q1').textContent = questions[0];
            document.getElementById('label-q2').textContent = questions[1];
            document.getElementById('label-q3').textContent = questions[2];

            document.getElementById('rsvp-form').reset();

            document.getElementById('form-status').textContent = '';

            show('questions');
        });
    });

    // ==========================================
    // RSVP FORM
    // ==========================================

    const form = document.getElementById('rsvp-form');

    form.addEventListener('submit', async e => {
        e.preventDefault();

        const status = document.getElementById('form-status');
        const submit = document.getElementById('submit-btn');
        const emailInput = document.getElementById('guest-email');

        status.textContent = '';
        status.className = 'status';

        if (!celebrant) {
            show('choose');
            return;
        }

        if (!form.reportValidity()) return;

        if (document.getElementById('honeypot').value) return;

        const guestEmail = emailInput.value.trim();

        // ======================================
        // COLLECT RSVP INFORMATION
        // ======================================

        const payload = {
            celebrant: celebrant,
            guest_email: guestEmail,

            event: 'Llara & Rizia Advanced Birthday Celebration',
            date: 'Saturday, November 21, 2026',
            time: '8:00 PM',
            location: 'Rockstar Glorietta',

            question_1: document.getElementById('q1').value.trim(),
            question_2: document.getElementById('q2').value.trim(),
            question_3: document.getElementById('q3').value.trim(),

            to_email: guestEmail
        };

        submit.disabled = true;
        submit.textContent = 'Sending your RSVP…';

        status.textContent = 'Please wait while we send your RSVP.';

        try {
            // ======================================
            // EMAIL 1: ORGANIZER NOTIFICATION
            // ======================================

            if (!organizerEmailSent) {
                await emailjs.send(
                    EMAILJS_SERVICE_ID,
                    ORGANIZER_TEMPLATE_ID,
                    payload
                );

                organizerEmailSent = true;
            }

            // ======================================
            // EMAIL 2: GUEST CONFIRMATION
            // ======================================

            await emailjs.send(
                EMAILJS_SERVICE_ID,
                GUEST_TEMPLATE_ID,
                payload
            );

            // ======================================
            // SUCCESS
            // ======================================

            document.getElementById('final-greeting').textContent =
                'Yay, ' + celebrant + '! Your RSVP is in.';

            const note = document.querySelector('#complete .note');

            if (note) {
                note.textContent =
                    'Your RSVP has been sent successfully. A confirmation email is on its way to ' +
                    guestEmail + '.';
            }

            form.reset();
            organizerEmailSent = false;

            show('complete');

        } catch (error) {
            console.error('Birthday RSVP submission error:', error);

            if (organizerEmailSent) {
                status.textContent =
                    'Your RSVP reached the organizers, but the confirmation email could not be sent. Please try again.';
            } else {
                status.textContent =
                    'We couldn’t send your RSVP. Please check your connection and try again. Your answers are still here.';
            }

        } finally {
            submit.disabled = false;

            submit.innerHTML =
                'Send my RSVP <span class="button-arrow" aria-hidden="true">♡</span>';
        }
    });
})();
