const transplantForm = document.querySelector('.transplant'),
    allTransplatsItems = transplantForm.querySelector('[name="transplant_all"]'),
    ticketsSwitcherForm = document.querySelector('.tickets-switcher');

transplantForm.addEventListener('change', function(event) {
    const currentInputEl = event.target,
        transplats = [],
        {tickets} = ticketsData;

    if (currentInputEl === allTransplatsItems) {
        for (let i=1; i < transplantForm.elements.length; i++) {
            const inputEl = transplantForm.elements[i];

            inputEl.checked = currentInputEl.checked;

            if (currentInputEl.checked) {
                transplats.push(+inputEl.dataset.value);
            }
        }
    } else {
        for (let i=0; i < transplantForm.elements.length; i++) {
            const inputEl = transplantForm.elements[i];

            if (inputEl !== allTransplatsItems && inputEl.checked) {
                transplats.push(+inputEl.dataset.value);
            }
        }

        allTransplatsItems.checked = transplats.length === 4;
    }

    ticketsData.transplats = transplats;

    renderTcikets();
});

ticketsSwitcherForm.addEventListener('change', function() {
    const data = new FormData(ticketsSwitcherForm),
        ticketFiltter = data.get('ticket-filtter'),
        {tickets} = ticketsData;

    for (let i=0; i < ticketsSwitcherForm.elements.length; i++) {
        const inputEl = ticketsSwitcherForm.elements[i],
            labelEl = inputEl.closest('.tickets-switcher__item');

        if (inputEl.checked) {
            labelEl.classList.add('tickets-switcher__item--active');
        } else {
            labelEl.classList.remove('tickets-switcher__item--active');
        }
    }

    ticketsData.ticketFiltter = ticketFiltter;

    renderTcikets();
});

const ticketsData = {
        tickets: [],
        transplats: [0, 1, 2, 3],
        ticketFiltter: 'cheap'
    },
    ticketsContainer = document.querySelector('.tickets-list');

function getSearchId() {
    return fetch('https://front-test.beta.aviasales.ru/search')
        .then(function(res) {
            return res.json();
        })
        .then(function(data) {
            ticketsData.searchId = data.searchId;

            return data.searchId;
        })
        .catch(function(error) {
            console.log(error);
        });
}

function getTickets(searchId = ticketsData.searchId) {
    return fetch(`https://front-test.beta.aviasales.ru/tickets?searchId=${searchId}`)
        .then(function(response) {
            return response.json();
        });
}

function getTicketDuration(ticket) {
    return ticket.segments.reduce(
        function(sum, segment) {
            return sum + segment.duration;
        },
        0
    )
}

function filterTicketsByTransplatsCount(tickets, transplats) {
    return tickets.filter(function(ticket) {
        const transplatsBySegments = ticket.segments.map(segment => segment.stops.length);

        return transplatsBySegments.every(function(tCount) {
            return transplats.includes(tCount);
        });
    });
}

function sortTickets(tickets, ticketFiltter) {
    tickets.sort(function(ticket1, ticket2) {
        switch (ticketFiltter) {
            case 'cheap':
                return ticket1.price - ticket2.price;
            default:
                return getTicketDuration(ticket1) - getTicketDuration(ticket2);
        }
    });

    return tickets;
}

function renderTicketListItem(ticket) {
    const listItem = document.createElement('li');

    listItem.classList.add('tickets-list__item');

    listItem.append( renderTicket(ticket) );

    return listItem;
}

function renderTicket(ticket) {
    const {price, carrier, segments} = ticket,
        container = document.createElement('div'),
        priceContainer = document.createElement('div'),
        logoContainer = document.createElement('div'),
        logoImage = document.createElement('img'),
        segmentsContainer = document.createElement('ul');

    container.classList.add('ticket');

    container.append(priceContainer, logoContainer, segmentsContainer);

    priceContainer.classList.add('ticket__price');
    priceContainer.innerText = `${price} Р`;

    logoContainer.classList.add('ticket__avia-logo');
    logoContainer.append(logoImage);
    logoImage.classList.add('ticket__avia-logo-img');
    logoImage.alt = carrier;
    logoImage.src = `//pics.avs.io/99/36/${carrier}.png`;

    segmentsContainer.classList.add('ticket__variants');
    segmentsContainer.append(
        ...segments.map(renderSegment)
    );

    return container;
}

function renderSegment(segment) {
    const {origin, destination, date, stops, duration} = segment,
        container = document.createElement('li'),
        destinationContainer = document.createElement('div'),
        roadContainer = document.createElement('div'),
        stopsContainer = document.createElement('div');

    container.classList.add('ticket__variant');

    destinationContainer.classList.add('ticket__variant-item');
    roadContainer.classList.add('ticket__variant-item');
    stopsContainer.classList.add('ticket__variant-item');

    destinationContainer.innerHTML = `
        <div class="ticket__variant-item-label">
            ${origin} – ${destination}
        </div>
        <div class="ticket__variant-item-value">
            ${getTime(date)} – ${getTime(date, duration)}
        </div>
    `;

    roadContainer.innerHTML = `
        <div class="ticket__variant-item-label">
            В пути
        </div>
        <div class="ticket__variant-item-value">
            ${renderDuration(duration)}
        </div>
    `;

    stopsContainer.innerHTML = `
        <div class="ticket__variant-item-label">
            ${renderTransplantCount(stops.length)}
        </div>
        <div class="ticket__variant-item-value">
            ${stops.join(', ')}
        </div>
    `;

    container.append(destinationContainer, roadContainer, stopsContainer);

    return container;
}

function renderTransplantCount( transplatCount ) {
    switch (transplatCount) {
        case 0:
            return `Без пересадок`;
        case 1:
            return `1 пересадка`;
        default:
            return `${transplatCount} пересадки`;
    }
}

function renderDuration( duration ) {
    const hours = Math.floor(duration / 60),
        minutes = duration % 60,
        days = Math.floor(hours / 24),
        leftHours = hours % 24,
        result = [];

    if (days) {
        result.push(`${days}д`);
    }

    if (leftHours) {
        result.push(`${leftHours}ч`);
    }

    result.push(`${minutes}м`);

    return result.join(' ');
}

function getTime(d, timeShift = 0) {
    const date = new Date(d);

    if (timeShift) {
        date.setMinutes( date.getMinutes() + timeShift );
    }

    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
}

function renderTcikets() {
    const data = filterTicketsByTransplatsCount(ticketsData.tickets, ticketsData.transplats);

    sortTickets(data, ticketsData.ticketFiltter);

    ticketsContainer.innerText = '';
    ticketsContainer.append(
        ...data.map(renderTicketListItem)
    );
}

getSearchId()
    .then(getTickets)
    .then(function(data) {
        ticketsData.tickets = data.tickets;
        renderTcikets();
    });
