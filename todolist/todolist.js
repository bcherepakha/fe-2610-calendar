import {getCurrentUser} from './store.js';

const getTodoListBtn = document.querySelector('#get-user-todo'),
    todolistContainer = document.querySelector('#todolist');

// `https://jsonplaceholder.typicode.com/todos?userId=${id}`
