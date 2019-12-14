import {AddTaskForm} from './AddTaskForm';
import {TaskList} from './TaskList/TaskList';

const addTaskForm = new AddTaskForm({
        selector: '.add-task',
        onAddTask: onAddTask,
        onCompleteAll: toggleCompleteAllTasks
    }),
    taskList = new TaskList({
        selector: '.task-list',
        tasks: [
            {
                id: 1,
                text: 'First task',
                completed: false
            }
        ],
        onTaskChange: onTaskChange
    });

function onAddTask(taskText: string) {
    taskList.addTask(taskText);
}

function toggleCompleteAllTasks(completed: boolean) {
    taskList.setAllTasksCompleted(completed);
}

function onTaskChange() {
    addTaskForm.setCompleteElement(taskList.isAllTaskCompleted());
}
