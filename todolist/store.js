const store = {
    currentUser: null
};

export function addUsers( users ) {
    store.users = users;
}

export function getUsers() {
    return store.users;
}

export function setCurrentUser( userId ) {
    if (store.users) {
        const user = store.users.find(function(u) {
            return u.id === userId;
        });

        if (user) {
            store.currentUser = {...user};
        } else {
            store.currentUser = null;
        }
    }

    return getCurrentUser();
}

export function getCurrentUser() {
    return store.currentUser;
}
