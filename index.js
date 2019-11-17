const MONTHES = [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь'
];

function createCalendar() {
    const currentDay = new Date(),
        currentYear = currentDay.getFullYear(),
        currentMonth = currentDay.getMonth(),
        calendarState = {
            month: currentMonth,
            year: currentYear
        },
        prevMonthBtn = document.querySelector('.calendar__change-month--prev'),
        nextMonthBtn = document.querySelector('.calendar__change-month--next'),
        currentMonthBtn = document.querySelector('.calendar__change-month--current');

    function shiftMonth(shift) {
        const {month, year} = calendarState,
            thisMonthDay = new Date(year, month);

        thisMonthDay.setMonth( month + shift);

        calendarState.month = thisMonthDay.getMonth();
        calendarState.year = thisMonthDay.getFullYear();

        renderCalendar(calendarState.month, calendarState.year);
    }

    function prevMonth() {
        shiftMonth(-1);
    }

    function nextMonth() {
        shiftMonth(1);
    }

    prevMonthBtn.addEventListener('click', prevMonth);
    nextMonthBtn.addEventListener('click', nextMonth);
    currentMonthBtn.addEventListener('click', function() {
        const currentDay = new Date(),
            currentYear = currentDay.getFullYear(),
            currentMonth = currentDay.getMonth();

        calendarState.month = currentMonth;
        calendarState.year = currentYear;

        renderCalendar(calendarState.month, calendarState.year);
    });

    renderCalendar(calendarState.month, calendarState.year);
}

function renderCalendar(diasplayMonth, displayYear) {
    const currentDay = new Date(),
        currentYear = currentDay.getFullYear(),
        currentMonth = currentDay.getMonth(),
        currentDate = currentDay.getDate(),
        firstDayOfMonth = new Date(displayYear, diasplayMonth, 1),
        lastDayOfMonth = new Date(displayYear, diasplayMonth + 1, 0),
        firstDayShift = (firstDayOfMonth.getDay() + 6) % 7,
        firstDisplayDay = new Date(displayYear, diasplayMonth, 1 - firstDayShift),
        lastDayShift = (7 - lastDayOfMonth.getDay()) % 7,
        lastDisplayDay = new Date(displayYear, diasplayMonth + 1, lastDayShift),
        daysForDisplay = [],
        daysContainer = document.querySelector('.calendar__days'),
        headerContainer = document.querySelector('.calendar__header');

    for(let day = new Date(firstDisplayDay); day <= lastDisplayDay; day.setDate( day.getDate() + 1) ) {
        const cDay = new Date(day),
            cMonth = cDay.getMonth();

        daysForDisplay.push(
            renderDay({
                day: cDay,
                notInMonth: cMonth !== diasplayMonth,
                isCurrentDay: currentMonth === cMonth && currentDate === cDay.getDate() && cDay.getFullYear() === currentYear
            })
        );
    }

    headerContainer.innerText = `${MONTHES[diasplayMonth]} ${displayYear}`
    daysContainer.innerText = '';
    daysContainer.append(...daysForDisplay);
}

function renderDay(dayObj) {
    const {day, notInMonth, isCurrentDay} = dayObj,
        dayContainer = document.createElement('li');

    dayContainer.innerText = day.getDate();

    dayContainer.classList.add('calendar__day');

    if (notInMonth) {
        dayContainer.classList.add('calendar__day--not-in-month');
    }

    if (isCurrentDay) {
        dayContainer.classList.add('calendar__day--current');
    }

    return dayContainer;
}

createCalendar();
