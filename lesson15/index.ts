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
        tasks: loadTasks(),
        onTaskChange: onTaskChange,
        onTaskDelete: onTaskDelete
    }),
    filter = new Filter({
        selector: '.filter-task',
        onFilterChange: onFilterChange
    });

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
}

function filterTasks(completed: boolean, task: Task) {
    return task.isCompleted() === completed;
}

function saveTasks() {
    window.localStorage.tasks = taskList.toString();
}

function loadTasks() {
    try {
        return JSON.parse(window.localStorage.tasks);
    } catch(ex) {
        console.error(ex);
        return [];
    }
}
