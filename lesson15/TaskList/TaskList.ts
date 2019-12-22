import {Task, ITaskProps} from './Task';

interface ITaskListProps {
    selector: string;
    tasks?: ITaskProps[];
    onTaskChange?: (task:Task) => void;
    onTaskDelete?: () => void;
}

export class TaskList {
    _container: HTMLElement;
    _tasks: Task[];
    _onTaskChange?: (task: Task) => void;
    _onTaskDelete?: () => void;
    _filter: (task: Task) => boolean;

    constructor(props: ITaskListProps) {
        const {selector, tasks = [], onTaskChange, onTaskDelete} = props;

        this._tasks = tasks.map(task => new Task({
            ...task,
            onChange: onTaskChange,
            onDelete: this.deleteTask.bind(this, task.id)
        }));

        this._filter = this.defaultFilter;

        this._onTaskChange = onTaskChange;
        this._onTaskDelete = onTaskDelete;
        this._container = document.querySelector(selector);
        this.render();
    }

    addTask(taskText: string, completed: boolean = false, id: number = Date.now()) {
        const task = new Task({
            text: taskText,
            completed: completed,
            id: id,
            onChange: this._onTaskChange,
            onDelete: this.deleteTask.bind(this, id)
        });

        this._tasks.push(task);

        this._container.append(task.render());
    }

    deleteTask(id:number) {
        this._tasks = this._tasks.filter(function(task) {
            return task.getId() !== id;
        });

        this._onTaskDelete();
    }

    setAllTasksCompleted(completed: boolean) {
        this._tasks.forEach(task => task.setCompleted(completed));
    }

    isAllTaskCompleted() {
        return this._tasks.every(task => task.isCompleted());
    }

    defaultFilter() {
        return true;
    }

    setFilter(fn?: (task: Task) => boolean) {
        if (fn) {
            this._filter = fn;
        } else {
            this._filter = this.defaultFilter;
        }

        this.render();
    }

    toSerialized() {
        return this._tasks.map(task => task.toSerialized());
    }

    toString() {
        return JSON.stringify(this.toSerialized());
    }

    render() {
        this._container.innerText = '';
        this._container.append(
            ...this._tasks
                .filter(this._filter)
                .map(task => task.render()) // function(task) { return task.render(); }
        );
    }
}
