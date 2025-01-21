const tasks = [];
let time = 0;
let timer = null;
let timerBreak = null;
let current = null;

const bAdd = document.querySelector('#bAdd');
const itTask = document.querySelector('#iTask');
const form = document.querySelector('#form');
const taskName = document.querySelector('#time #taskName');

renderTime();
renderTask();

form.addEventListener('submit', e => {
    e.preventDefault();
    if (itTask.value !== '') {
        createTask(itTask.value);
        itTask.value = '';
        renderTask();
    }
});

function createTask(value) {
    const newTask = {
        id: (Math.random() * 100).toString(36).slice(3),
        title: value,
        completed: false,
    };
    tasks.unshift(newTask);
}

function renderTask() {
    const html = tasks.map(task => {
        return `
            <div class="task">
                <div class="completed">${task.completed ? `<span class="done"> Done </span>` : `<button class="start-button" data-id="${task.id}"> Start </button>`} </div>
                <div class="title">${task.title}</div>
            </div>
        `;
    });
    const tasksContainer = document.querySelector('#tasks');
    tasksContainer.innerHTML = html.join("");

    const startButtons = document.querySelectorAll('.task .start-button');

    startButtons.forEach(button => {
        button.addEventListener('click', e => {
            if (!timer && !timerBreak && current === null) {  // Verifica que no haya temporizadores activos ni otra tarea en ejecución
                const id = button.getAttribute('data-id');
                startButtonHandler(id, button);
            }
        });
    });
}

function startButtonHandler(id, button) {
    time = 20 * 60  // Tiempo inicial para la tarea (ajustable)
    current = id;  // Guardar la tarea actual
    const taskIndex = tasks.findIndex(task => task.id === id); 
    taskName.textContent = tasks[taskIndex].title;

    // Iniciar el temporizador de la tarea
    timer = setInterval(() => {
        timeHandler(id, button);
    }, 1000);
    button.textContent = 'In Progress .... ';
}

function timeHandler(id, button) {
    time--;
    renderTime();

    if (time === 0) {
        clearInterval(timer);
        markCompleted(id);
        renderTask();
        startBreak();
    }
}

function startBreak() {
    time = 5;
    taskName.textContent = 'Break Time';
    clearInterval(timer);
    timerBreak = setInterval(() => {
        timerBreakHandler();
    }, 1000);
}

function timerBreakHandler() {
    time--;
    renderTime();

    if (time === 0) {
        clearInterval(timerBreak);
        taskName.textContent = '';
        renderTask();
        current = null;
        timerBreak = null;
    }
}

function renderTime() {
    const timeDiv = document.querySelector('#time #value');
    const minutes = parseInt(time / 60);
    const seconds = parseInt(time % 60);
    timeDiv.textContent = `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
}

function markCompleted(id) {
    const taskIndex = tasks.findIndex(task => task.id === id);
    tasks[taskIndex].completed = true;
    renderTask();
}
