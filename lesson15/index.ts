import {AddTaskForm} from './AddTaskForm';
import {TaskList} from './TaskList/TaskList';
import {Filter, FILTER_ALL, FILTER_COMPLETED, FILTER_UNCOMPLETETED} from './Filter';
import { Task } from './TaskList/Task';

const addTaskForm = new AddTaskForm({
        selector: '.add-task',
        onAddTask: onAddTask,
        onCompleteAll: toggleCompleteAllTasks
    }),
    taskList = new TaskList({
        selector: '.task-list',
        tasks: [],
        onTaskChange: onTaskChange,
        onTaskDelete: onTaskDelete
    }),
    filter = new Filter({
        selector: '.filter-task',
        onFilterChange: onFilterChange
    }),
    loadingEl = document.querySelector('.loading') as HTMLDivElement;

loadTasks();
loadFilter();

function onAddTask(taskText: string, completed?: boolean) {
    taskList.addTask(taskText);
    onTaskChange();
    // onFilterChange();
    filter.setFilter(FILTER_ALL);
}

function toggleCompleteAllTasks(completed: boolean) {
    taskList.setAllTasksCompleted(completed);
}

function onTaskChange() {
    addTaskForm.setCompleteElement(taskList.isAllTaskCompleted());
    saveTasks();
}

function onTaskDelete() {
    onTaskChange();
}

function onFilterChange() {
    switch (filter.value) {
        case FILTER_COMPLETED:
            taskList.setFilter(filterTasks.bind(null, true));
            break;
        case FILTER_UNCOMPLETETED:
            taskList.setFilter(filterTasks.bind(null, false));
            break;
        default:
            taskList.setFilter();
            break;
    }

    saveFilter();
}

function filterTasks(completed: boolean, task: Task) {
    return task.isCompleted() === completed;
}

function saveTasks() {
    window.localStorage.tasks = taskList.toString();
}

// function loadTasks() {
//     try {
//         return JSON.parse(window.localStorage.tasks);
//     } catch(ex) {
//         console.error(ex);
//         return [];
//     }
// }

function saveFilter() {
    window.localStorage.filter = filter.value;
}

function loadFilter() {
    const filterSaved = +window.localStorage.filter,
        filterValue = isNaN(filterSaved) ? FILTER_ALL : filterSaved;

    filter.setFilter(filterValue);
}

function loadTasks() {
    loadingEl.hidden = false;

    fetch('https://jsonplaceholder.typicode.com/todos?userId=1')
        .then(response => response.json())
        .then(data => {
            return data.map(task => ({
                id: task.id,
                completed: task.completed,
                text: task.title
            }));
        })
        .then(data => {
            loadingEl.hidden = true;

            taskList.loadTasks(data)
        });
}
