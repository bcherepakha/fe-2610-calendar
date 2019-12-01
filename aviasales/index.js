const transplantForm = document.querySelector('.transplant'),
    allTransplantsItems = transplantForm.querySelector('[name="transplant_all"]'),
    ticketsSwitcherForm = document.querySelector('.tickets-switcher');

transplantForm.addEventListener('change', function(event) {
    const currentInputEl = event.target,
        transplats = [];

    if (currentInputEl === allTransplantsItems) {
        for (let i=1; i < transplantForm.elements.length; i++) {
            const inputEl = transplantForm.elements[i];

            inputEl.checked = currentInputEl.checked;

            if (currentInputEl.checked) {
                transplats.push(inputEl.dataset.value);
            }
        }
    } else {
        for (let i=0; i < transplantForm.elements.length; i++) {
            const inputEl = transplantForm.elements[i];

            if (inputEl !== allTransplantsItems && inputEl.checked) {
                transplats.push(inputEl.dataset.value);
            }
        }

        allTransplantsItems.checked = transplats.length === 4;
    }

    console.log({transplats});
});

ticketsSwitcherForm.addEventListener('change', function() {
    const data = new FormData(ticketsSwitcherForm),
        ticketFiltter = data.get('ticket-filtter');

    for (let i=0; i < ticketsSwitcherForm.elements.length; i++) {
        const inputEl = ticketsSwitcherForm.elements[i],
            labelEl = inputEl.closest('.tickets-switcher__item');

        if (inputEl.checked) {
            labelEl.classList.add('tickets-switcher__item--active');
        } else {
            labelEl.classList.remove('tickets-switcher__item--active');
        }
    }

    console.log({ticketFiltter});
});
