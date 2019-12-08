import {getCurrentUser} from './store.js';

const getPostBtn = document.querySelector('#get-user-posts'),
    postsContainer = document.querySelector('#posts');

getPostBtn.addEventListener('click', function() {
    const user = getCurrentUser();

    if (user) {
        getUserPosts( user.id )
            .then(function( posts ) {
                renderPosts(posts);
            });
    }
});

function getUserPosts( userId ) {
    return fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`)
        .then(function(response) {
            return response.json();
        });
}

function getPostComments( postId, pageNum = 1, count = 5 ) {
    return fetch(`https://jsonplaceholder.typicode.com/posts/${postId}/comments?_page=${pageNum}&_limit=${count}`)
        .then(function(response) {
            return response.json()
        });
}

function getAndRenderPostComments(commentsContainer, commentBtn, moreCommentsBtn) {
    const {id, commentPageNum} = this,
        post = this,
        commentsLimit = 5;

    commentBtn.hidden = true;
    moreCommentsBtn.hidden = true;

    if (commentPageNum === 1) {
        commentsContainer.innerText = '';
    }

    getPostComments(id, commentPageNum, commentsLimit)
        .then(function(comments) {
            if (comments.length !== 0) {
                commentsContainer.append(
                    ...comments.map(renderComment)
                );

                moreCommentsBtn.hidden = comments.length !== commentsLimit;
                post.commentPageNum += 1;
            }
        });
}

function renderPosts( posts ) {
    const container = document.createElement('ul');

    container.append(
        ...posts.map(renderPost)
    );

    postsContainer.innerText = '';
    postsContainer.append(container);
}

function renderPost( post ) {
    const {title, body, id} = post,
        container = document.createElement('li'),
        headerEl = document.createElement('h2'),
        commentBtn = document.createElement('button'),
        commentsContainer = document.createElement('ul'),
        moreCommentsBtn = document.createElement('button');

    headerEl.innerText = title;
    commentBtn.innerText = 'Get comments';
    moreCommentsBtn.innerText = 'More comments';
    moreCommentsBtn.hidden = true;

    container.classList.add('post');
    container.append(headerEl);
    container.append(
        ...body.split('\n').map(function(line) {
            const pEl = document.createElement('p');

            pEl.innerText = line;

            return pEl;
        })
    );

    post.commentPageNum = 1;

    container.append(commentBtn, commentsContainer, moreCommentsBtn);

    commentBtn.addEventListener('click', getAndRenderPostComments.bind(post, commentsContainer, commentBtn, moreCommentsBtn));
    moreCommentsBtn.addEventListener('click', getAndRenderPostComments.bind(post, commentsContainer, commentBtn, moreCommentsBtn));

    window.addEventListener('scroll', function() {
        if (!moreCommentsBtn.hidden) {
            const rect = moreCommentsBtn.getBoundingClientRect();

            if (0.8*window.innerHeight > rect.bottom) {
                getAndRenderPostComments.call(post, commentsContainer, commentBtn, moreCommentsBtn);
            }
        }
    });

    return container;
}

function renderComment( comment ) {
    const {body, email, name} = comment,
        container = document.createElement('li'),
        bodyEl = document.createElement('p'),
        authorContainer = document.createElement('div'),
        authorLink = document.createElement('a');

    container.classList.add('comment');
    bodyEl.innerText = body;
    container.append(bodyEl, authorContainer);
    authorContainer.append(authorLink);

    authorLink.href = `mailto:${email}`;
    authorLink.innerText = name;

    return container;
}
