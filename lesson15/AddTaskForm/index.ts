type TOnAddTask = (text: string, completed?: boolean) => void;

interface AddTaskFormProps {
    selector: string;
    onAddTask: TOnAddTask;
    onCompleteAll?: (completed: boolean) => void;
}

export class AddTaskForm {
    formElement: HTMLFormElement;
    addTaskTextElement: HTMLInputElement;
    completeTaskElement: HTMLInputElement;
    onAddTask: TOnAddTask;
    _onCompleteAll?: (completed: boolean) => void;

    constructor(props: AddTaskFormProps) {
        const { selector, onAddTask, onCompleteAll } = props;

        this.formElement = document.querySelector(selector);
        this.addTaskTextElement = this.formElement.querySelector('.add-task__text');
        this.completeTaskElement = this.formElement.querySelector('.add-task__complete-all');
        this._onCompleteAll = onCompleteAll;

        this.formElement.addEventListener('submit', this.submitForm.bind(this));
        this.completeTaskElement.addEventListener('change', this.onCompleteAll.bind(this));
        this.onAddTask = onAddTask;
    }

    submitForm(event: Event) {
        event.preventDefault();

        const {addTaskTextElement, completeTaskElement} = this,
            taskText = addTaskTextElement.value;

        if (taskText) {
            const a = this.onAddTask(taskText, completeTaskElement.checked);

            addTaskTextElement.value = '';
        }
    }

    onCompleteAll() {
        const {_onCompleteAll, completeTaskElement} = this;

        if (_onCompleteAll) {
            _onCompleteAll(completeTaskElement.checked);
        }
    }

    setCompleteElement(complete: boolean) {
        this.completeTaskElement.checked = complete;
    }
}
