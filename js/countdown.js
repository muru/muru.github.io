function getTimeRemaining(endtime) {
	var t = Date.parse(endtime) - Date.parse(new Date());
	var seconds = Math.floor((t / 1000) % 60);
	var minutes = Math.floor((t / 1000 / 60) % 60);
	var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
	var days = Math.floor(t / (1000 * 60 * 60 * 24));
	return {
		'total': t,
		'days': days,
		'hours': hours,
		'minutes': minutes,
		'seconds': seconds
	};
}

function updateArc(id, value, max) {
	// From Paul LeBeau, https://stackoverflow.com/a/37781274/2072269
	var elem = document.getElementById(id);
	// Get the radius ("r" attribute)
	var radius = elem.r.baseVal.value;
	// Calculate the circumference of the circle
	var circumference = radius * 2 * Math.PI;
	// How long the bar has to be
	var barLength = value * circumference / max;

	// Set a dash pattern for the stroke.
	// The dash pattern consists of a dash of the right length,
	// followed by a gap big enough to ensure that we don't see the next dash.
	elem.setAttribute("stroke-dasharray", barLength + " " + circumference);
}

function initializeClock(id, endtime) {
	var clock = document.getElementById(id);
	var daysElem = clock.querySelector('#days');
	var hoursElem = clock.querySelector('#hours');
	var minutesElem = clock.querySelector('#minutes');

	function plural(n, w, wp) {
		if (n == 1) {
			return n + ' ' + w;
		}
		return n + ' ' + wp;
	}

	function updateClock() {
		var t = getTimeRemaining(endtime);

		daysElem.innerHTML = plural(t.days, 'day', 'days');
		hoursElem.innerHTML = plural(t.hours, 'hour', 'hours');
		minutesElem.innerHTML = ('0' + t.minutes).slice(-2) + ':' + ('0' + t.seconds).slice(-2);

		minLength = t.minutes + t.seconds/60;
		hrLength = t.hours + minLength/60;
		dayLength = t.days + hrLength/24;

		updateArc("dayarc", dayLength, 365);
		updateArc("hourarc", hrLength, 24);
		updateArc("minarc", minLength, 60);

		if (t.total <= 0) {
			clearInterval(timeinterval);
		}
	}

	updateClock();
	var timeinterval = setInterval(updateClock, 1000);
}

var deadline = new Date('2019-12-22 09:00 +5:30');
document.addEventListener("DOMContentLoaded", function(event) {
	initializeClock('countdown', deadline);
});
