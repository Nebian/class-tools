const timeElm = document.getElementById('time');
const doc = document.documentElement;
const { clientWidth, clientHeight } = doc;

const pad = val => val < 10 ? `0${val}` : val;

// Observador del cursor para la animación
const animationFrame$ = Rx.Observable.interval(0, Rx.Scheduler.animationFrame);

const time$ = Rx.Observable.
interval(1000).
map(() => {
  const time = new Date();

  return {
    hours: time.getHours(),
    minutes: time.getMinutes(),
    seconds: time.getSeconds() };

}).
subscribe(({ hours, minutes, seconds }) => {
  timeElm.setAttribute('data-hours', pad(hours));
  timeElm.setAttribute('data-minutes', pad(minutes));
  timeElm.setAttribute('data-seconds', pad(seconds));
});

const mouse$ = Rx.Observable.
fromEvent(document, 'mousemove').
map(({ clientX, clientY }) => ({
  x: (clientWidth / 2 - clientX) / clientWidth,
  y: (clientHeight / 2 - clientY) / clientHeight }));


const smoothMouse$ = animationFrame$.
withLatestFrom(mouse$, (_, m) => m).
scan(RxCSS.lerp(0.1));

RxCSS({
  mouse: smoothMouse$ },
timeElm);

// Mostramos el formulario para configurar la alarma
function showForm() {
  var formContainer = document.getElementById('formContainer');
  formContainer.style.display = 'block';
}

// Función para configurar la alarma
function setAlarm() {
  var hourInput = document.getElementById('hourInput');
  var minuteInput = document.getElementById('minuteInput');
  var timer = document.getElementById('timer');

  var hour = parseInt(hourInput.value);
  var minute = parseInt(minuteInput.value);

  // Validamos el input
  if (isNaN(hour) || isNaN(minute) || hour < 0 || hour > 23 || minute < 0 || minute > 59) {
    alert('Invalid time format. Please enter a valid hour (0-23) and minute (0-59).');
    return;
  }

  // Configuramos la alarma
  var now = new Date();
  var alarmTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute);

  // Cálculo del tiempo restante
  var timeRemaining = alarmTime.getTime() - now.getTime();
  if (timeRemaining < 0) {
    alert('The specified time has already passed.');
    return;
  }

  // Actualizamos el temporizador cada segundo
  var intervalId = setInterval(function() {
    // Cálculo del tiempo restante en horas, minutos y segundos
    var hours = Math.floor(timeRemaining / (1000 * 60 * 60));
    var minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

    // Mostramos el tiempo restante
    timer.textContent = 'Time Remaining: ' + pad(hours) + ':' + pad(minutes) + ':' + pad(seconds);
    timeRemaining -= 1000;

    // Comprobamos si la alarma debe sonar
    if (timeRemaining < 0) {
      var audioAlarm = new Audio('sounds/better_alarm.mp3');
      audioAlarm.play();
      clearInterval(intervalId);
    }
  }, 1000);
}


