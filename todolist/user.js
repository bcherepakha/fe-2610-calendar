import {addUsers, getUsers, setCurrentUser} from './store.js';

const userSelectEl = document.querySelector('#user'),
    selectUserForm = document.querySelector('#select-user'),
    userInfoContainer = document.querySelector('#user-info'),
    userControls = document.querySelector('#user-controls');

fetch('https://jsonplaceholder.typicode.com/users')
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        addUsers(data);
        fillUserSelect( getUsers() );
    })
    .catch(function(error) {
        console.log(error);
    });

function renderUserOption(user) {
    const optionEl = document.createElement('option');

    optionEl.value = user.id;
    optionEl.innerText = user.name;

    return optionEl;
}

function fillUserSelect( users ) {
    userSelectEl.innerText = '';
    userSelectEl.append(
        ...users.map(renderUserOption)
    );
}

function fillUserInfo( user ) {
    userInfoContainer.innerHTML = `
        <h2>${user.name}</h2>
        <table>
            <tbody>
                <tr>
                    <td>phone</td>
                    <td>${user.phone}</td>
                </tr>
                <tr>
                    <td>email</td>
                    <td>${user.email}</td>
                </tr>
                <tr>
                    <td>username</td>
                    <td>${user.username}</td>
                </tr>
                <tr>
                    <td>website</td>
                    <td>${user.website}</td>
                </tr>
            </tbody>
        </table>
    `;
}

selectUserForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const userId = +userSelectEl.value,
        user = setCurrentUser(userId);

    if (user) {
        fillUserInfo(user);
        userControls.hidden = false;
    } else {
        userInfoContainer.innerText = '';
        userControls.hidden = true;
    }
});
