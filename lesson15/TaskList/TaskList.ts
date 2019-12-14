import {Task, ITaskProps} from './Task';

interface ITaskListProps {
    selector: string;
    tasks?: ITaskProps[];
    onTaskChange?: (task:Task) => void;
}

export class TaskList {
    _container: HTMLElement;
    _tasks: Task[];
    _onTaskChange?: (task: Task) => void;

    constructor(props: ITaskListProps) {
        const {selector, tasks = [], onTaskChange} = props;

        this._tasks = tasks.map(task => new Task({
            ...task,
            onChange: onTaskChange
        }));

        this._onTaskChange = onTaskChange;
        this._container = document.querySelector(selector);
        this.render();
    }

    addTask(taskText: string, completed: boolean = false, id: number = Date.now()) {
        const task = new Task({
            text: taskText,
            completed: completed,
            id: id,
            onChange: this._onTaskChange
        });

        this._tasks.push(task);

        this._container.append(task.render());
    }

    setAllTasksCompleted(completed: boolean) {
        this._tasks.forEach(task => task.setCompleted(completed));
    }

    isAllTaskCompleted() {
        return this._tasks.every(task => task.isCompleted());
    }

    render() {
        this._container.innerText = '';
        this._container.append(
            ...this._tasks.map(task => task.render()) // function(task) { return task.render(); }
        );
    }
}
