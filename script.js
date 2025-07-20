// Force a fresh page load (optional in dev)
if (performance.navigation.type === 1) {
	// Reloaded via refresh; no action needed
} else {
	// Add a random query string to bust cache if needed
	if (!window.location.href.includes("nocache")) {
		window.location.href = window.location.href + (window.location.href.includes('?') ? '&' : '?') + 'nocache=' + new Date().getTime();
	}
}

const calendar = document.getElementById('calendar');
const monthYear = document.getElementById('monthYear');
const referenceDate = '2025-05-12';
const officeDays = [0, 2, 4, 8, 10, 11];
const weekend = [5, 6, 12, 13];

let currentDate = new Date();

function renderCalendar(date) {
	const year = date.getFullYear();
	const month = date.getMonth();

	calendar.innerHTML = '';

	const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
		'July', 'August', 'September', 'October', 'November', 'December'
	];
	monthYear.textContent = `${monthNames[month]} ${year}`;

	const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
	for (let day of dayNames) {
		const dayCell = document.createElement('div');
		dayCell.className = 'day-name';
		dayCell.textContent = day;
		calendar.appendChild(dayCell);
	}

	const firstDay = new Date(year, month, 1).getDay();
	const daysInMonth = new Date(year, month + 1, 0).getDate();

	for (let i = 0; i < firstDay; i++) {
		const emptyCell = document.createElement('div');
		calendar.appendChild(emptyCell);
	}

	for (let day = 1; day <= daysInMonth; day++) {
		const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
		const dayCell = document.createElement('div');
		dayCell.textContent = day;

		const modDate = dateDiff(referenceDate, dateStr);
		if (officeDays.includes(modDate)) {
			dayCell.classList.add('highlight');
		} else if (weekend.includes(modDate)) {
			dayCell.classList.add('highlight-weekend');
		} else {
			dayCell.classList.add('highlight-wfh');
		}

		const today = new Date();
		if (
			year === today.getFullYear() &&
			month === today.getMonth() &&
			day === today.getDate()
		) {
			dayCell.classList.add('today');
		}

		calendar.appendChild(dayCell);
	}

}

function changeMonth(offset) {
	currentDate.setMonth(currentDate.getMonth() + offset);
	renderCalendar(currentDate);
}

function dateDiff(start, end) {
	const startDate = new Date(start);
	const endDate = new Date(end);
	startDate.setHours(0, 0, 0, 0);
	endDate.setHours(0, 0, 0, 0);
	const diffTime = Math.abs(endDate - startDate);
	const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
	return diffDays % 14;
}

renderCalendar(currentDate);