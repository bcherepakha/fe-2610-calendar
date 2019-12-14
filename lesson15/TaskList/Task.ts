export interface ITaskProps {
    text: string;
    completed: boolean;
    id: number;
    onChange?: (task: Task) => void;
}

export class Task {
    _id: number;
    _completed: boolean;
    _text: string;
    _container: HTMLLIElement;
    _completeElement: HTMLInputElement;
    _onChange: (task: Task) => void;

    constructor(props: ITaskProps) {
        const {text, completed, id, onChange} = props;

        this._id = id;
        this._completed = completed;
        this._text = text;

        this._onChange = onChange;

        this.createElement();
    }

    createElement() {
        const {_completed, _text} = this,
            container = document.createElement('li'),
            completeElement = document.createElement('input'),
            textElement = document.createElement('span'),
            deleteBtn = document.createElement('button');

        container.classList.add('task');
        container.append(completeElement, textElement, deleteBtn);

        deleteBtn.innerText = 'Delete';
        deleteBtn.className = 'task__delete';

        textElement.innerText = _text;
        textElement.className = 'task__text';

        completeElement.type = 'checkbox';
        completeElement.className = 'task__complete';
        completeElement.checked = _completed;

        completeElement.addEventListener('change', this.onChange.bind(this));

        this._container = container;
        this._completeElement = completeElement;
    }

    setCompleted(completed: boolean) {
        this._completed = completed;
        this._completeElement.checked = this._completed;

        if (this._onChange) {
            this._onChange(this);
        }
    }

    toggleCompleted() {
        this.setCompleted(!this._completed);
    }

    onChange() {
        this.setCompleted(this._completeElement.checked);
    }

    isCompleted() {
        return this._completed;
    }

    render() {
        return this._container;
    }
}
