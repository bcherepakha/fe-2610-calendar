interface IFilterProps {
    selector: string;
    onFilterChange: () => void;
}

export const FILTER_ALL = 2;
export const FILTER_COMPLETED = 1;
export const FILTER_UNCOMPLETETED = 0;
export const FILTERS = [FILTER_ALL, FILTER_COMPLETED, FILTER_UNCOMPLETETED];

export class Filter {
    _container: HTMLFormElement;
    _filter: number;
    _onFilterChange: () => void;

    constructor({selector, onFilterChange}: IFilterProps) {
        this._onFilterChange = onFilterChange;
        this._container = document.querySelector(selector);

        for (let i=0; i < this._container.elements.length; i++) {
            const inputEl = this._container.elements[i] as HTMLInputElement;

            if (inputEl.checked && FILTERS.includes(+inputEl.value)) {
                this._filter = +inputEl.value;
            }
        }

        if (!FILTERS.includes(this._filter)) {
            this.setFilter(FILTER_ALL, false);
        }

        this._container.addEventListener('change', this.onChange.bind(this));
    }

    setFilter(filter: number, propagateEvent: boolean = true) {
        const inputEl = this._container.querySelector(`[name="filter"][value="${filter}"]`) as HTMLInputElement;

        if (FILTERS.includes(filter) && inputEl) {
            inputEl.checked = true;
            this._filter = +inputEl.value;
        }

        if (propagateEvent) {
            this._onFilterChange();
        }
    }

    onChange(event: Event) {
        const {value} = event.target as HTMLInputElement;

        this.setFilter(+value);
    }

    get value() {
        return this._filter;
    }
}
