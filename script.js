
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

    // const questionsByName = {
    //     Llara: [
    //         "Pwede bang sa amin muna ang 'yong sabado?",
    //         "What's something you like to order but is always sold out?",
    //         "What is usufruct? State your legal basis.",
    //         "Any special message for us? (keri long message)"
    //     ],

    //     Rizia: [
    //         "Pwede bang sa amin muna ang 'yong sabado?",
    //         "Question for Rizia 1",
    //         "Any special message for us? (keri long message)"
    //     ]
    // };


    const questionsByName = {
        Llara: [
            {
                text: "Pwede bang sa amin muna ang 'yong sabado?",
                type: "text"
            },
            {
                text: "What's something you like to order but is always sold out?",
                type: "text"
            },
            {
                text: "What is usufruct? State your legal basis.",
                type: "text"
            },
            {
                text: "On a scale of 1-10, gaano mo na kami kamiss/how excited are you to see us?",
                type: "text"
            },
            {
                text: "If our friend group were a reality show/sitcom, what would its title be?",
                type: "text"
            },
            {
                text: "If you had to remove one person from our group chat, who would it be? (hint: si Karl nag-suggest nitong tanong)",
                type: "text"
            },
            {
                text: "Any special message for us? Why should we grant you access to this exclusive birthday celebration?",
                type: "textarea"
            }
        ],

        Rizia: [
            {
                text: "Pwede bang sa amin muna ang 'yong sabado?",
                type: "text"
            },
            {
                text: "Best hojicha recommendation and order",
                type: "text"
            },
            {
                text: "As a gift giver whats something you gave that you also wanted to receive?",
                type: "text"
            },
            {
                text: "On a scale of 1-10, gaano mo na kami kamiss/how excited are you to see us?",
                type: "text"
            },
            {
                text: "If our friend group were a reality show/sitcom, what would its title be?",
                type: "text"
            },
            {
                text: "If you had to remove one person from our group chat, who would it be? (hint: si Karl nag-suggest nitong tanong)",
                type: "text"
            },
            {
                text: "Any special message for us? Why should we grant you access to this exclusive birthday celebration?",
                type: "textarea"
            }
        ]
    };

    const submit = document.getElementById('submit-btn');

    let firstQuestionAnswer = null;

    const renderQuestions = (celebrant) => {
        const container = document.getElementById('questions-container');

        container.innerHTML = '';

        const questions = questionsByName[celebrant];

        firstQuestionAnswer = null;
        submit.disabled = true;

        questions.forEach((question, index) => {
            const number = index + 1;

            const wrapper = document.createElement('div');
            wrapper.className = 'question';

            const label = document.createElement('label');
            label.id = `label-q${number}`;
            label.htmlFor = `q${number}`;
            label.textContent = question.text;

            const field = document.createElement(
                question.type === 'textarea' ? 'textarea' : 'input'
            );

            if (question.type !== 'textarea') {
                field.type = question.type;
            }

            field.id = `q${number}`;
            field.name = `question_${number}`;
            field.required = true;
            field.maxLength = question.type === 'textarea' ? 1200 : 500;
            field.placeholder = 'Your answer here...';

            // wrapper.append(label, field);
            // container.appendChild(wrapper);

            wrapper.appendChild(label);

            // YES / NO buttons below Question 1
            if (number === 1) {
                const choices = document.createElement('div');
                choices.className = 'yes-no-choices';

                const yesButton = document.createElement('button');
                yesButton.type = 'button';
                yesButton.textContent = 'Yes';

                const noButton = document.createElement('button');
                noButton.type = 'button';
                noButton.textContent = 'No';

                const noMessages = [
                    'Namali ka ata ng pindot beh. \'Wag mo na lang pindutin ito ulit.',
                    'Okay lang talaga, last na \'yun, ok?',
                    'Na para bang wala tayong pinagsamahan?',
                    'Sigurado ka diyan?',
                    'Sige, isa pa! Isa pa talaga!',
                    'Kung hindi mo na-gets, wala kang choice, sapilitan ito!',
                    'Kung pumunta ka, sasambahin ka ni Karl!'
                ];

                let noCount = 0;

                yesButton.addEventListener('click', () => {
                    firstQuestionAnswer = 'Yes';

                    yesButton.classList.add('selected');
                    noButton.classList.remove('selected');

                    submit.disabled = false;
                    noButton.textContent = 'No';
                    noCount = 0;
                });

                noButton.addEventListener('click', () => {
                    firstQuestionAnswer = 'No';

                    noButton.classList.add('selected');
                    yesButton.classList.remove('selected');

                    noButton.textContent =
                        noMessages[noCount % noMessages.length];

                    noCount++;

                    submit.disabled = true;
                });

                choices.append(yesButton, noButton);
                wrapper.appendChild(choices);
            } else {
                wrapper.appendChild(field);
            }

            container.appendChild(wrapper);
        });
    };



    // document.querySelectorAll('[data-name]').forEach(button => {
    //     button.addEventListener('click', () => {
    //         celebrant = button.dataset.name;

    //         document.getElementById('selected-name').textContent = celebrant;

    //         const questions = questionsByName[celebrant];

    //         document.getElementById('label-q1').textContent = questions[0];
    //         document.getElementById('label-q2').textContent = questions[1];
    //         document.getElementById('label-q3').textContent = questions[2];

    //         document.getElementById('rsvp-form').reset();

    //         document.getElementById('form-status').textContent = '';

    //         show('questions');
    //     });
    // });

    // ==========================================
    // RSVP FORM
    // ==========================================


    document.querySelectorAll('[data-name]').forEach(button => {
        button.addEventListener('click', () => {
            celebrant = button.dataset.name;

            document.getElementById('selected-name').textContent = celebrant;

            document.getElementById('rsvp-form').reset();
            document.getElementById('form-status').textContent = '';

            firstQuestionAnswer = null;

            submit.disabled = true;

            renderQuestions(celebrant);

            show('questions');
        });
    });


    const form = document.getElementById('rsvp-form');

    form.addEventListener('submit', async e => {
        e.preventDefault();

        const status = document.getElementById('form-status');
        // const submit = document.getElementById('submit-btn');
        const emailInput = document.getElementById('guest-email');

        status.textContent = '';
        status.className = 'status';

        if (!celebrant) {
            show('choose');
            return;
        }

        if (!form.reportValidity()) return;

        if (firstQuestionAnswer !== 'Yes') {
            status.textContent = 'Gusto mo ng RSVP pero hindi pwede sa sabado?';
            return;
        }

        if (document.getElementById('honeypot').value) return;

        const guestEmail = emailInput.value.trim();

        // ======================================
        // COLLECT RSVP INFORMATION
        // ======================================

        const questions = questionsByName[celebrant];

        const payload = {
            celebrant: celebrant,
            guest_email: guestEmail,

            event: 'Llara & Rizia\'s Birthday Celebration',
            date: 'Saturday, November 21, 2026',
            time: '8:00 PM',
            location: 'Rockstar Glorietta',

            answers: questions.map((question, index) => ({
                question: question.text,
                answer: index === 0
                    ? firstQuestionAnswer
                    : document.getElementById(`q${index + 1}`).value.trim()
            })),

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
                'Yay, ' + celebrant + '! RSVP sent!';

            const note = document.querySelector('#complete .note');

            if (note) {
                note.textContent =
                    'Your confirmation email should be in your inbox ('+ guestEmail +') 🫶 check your spam too; sorry hindi pa legit na legit ang resident programmer 😵‍💫. Mark as "not spam" on my behalf pleaseee thank you <3 (digital souvenir na rin)';
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
