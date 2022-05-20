import storage from './storage';
import api from './api';

const state = {
    localStorageKey: 'better-reviews-likes',
    dataAttributes: {
        likeableElement: 'data-better-reviews-like',
        personalLikesIcon: 'data-better-reviews-personal-likes',
        personalLikesTotal: 'data-better-reviews-personal-likes-total',
    },
    classNames: {
        hasPersonallyLiked: 'better-reviews__has-personally-liked',
        hasPersonalLikes: 'better-reviews__has-personal-likes'
    },
};

function init() {
    // Add the click handler to likeable items, and set whether they have been Liked by the current user
    setupLikeableElements();

    // Add the total to the personal likes icon, and add the associated listeners for when likes changes
    renderPersonalLikesElements();
    document
        .addEventListener(
            'better-reviews:personal-like-total-changed',
            renderPersonalLikesElements
        )
    ;

    const event = new CustomEvent('better-reviews:likes-ready');
    document.dispatchEvent(event);
}

function renderPersonalLikesElements() {
    const hasLikes = hasPersonalLikes();
    const totalLikes = getPersonalLikes().length;

    document
        .querySelectorAll(`[${state.dataAttributes.personalLikesIcon}]`)
        .forEach((personalLikesElement) => {
            if (hasLikes) {
                personalLikesElement.classList.add(state.classNames.hasPersonalLikes);
            } else {
                personalLikesElement.classList.remove(state.classNames.hasPersonalLikes);
            }
        })
    ;

    document
        .querySelectorAll(`[${state.dataAttributes.personalLikesTotal}]`)
        .forEach((personalLikesTotalElement) => {
            personalLikesTotalElement.innerText = totalLikes;
        })
    ;
}

function setupLikeableElements() {
    document
        .querySelectorAll(`[${state.dataAttributes.likeableElement}]`)
        .forEach((likeElement) => {
            const idToLike = likeElement.getAttribute(state.dataAttributes.likeableElement);
            if(!idToLike) {
                console.warn(`better-reviews-like: id is missing from the ${state.dataAttributes.likeableElement} attribute`);
                return;
            }

            likeElement.addEventListener('click', togglePersonalLike, { passive: true });
            if(hasPersonallyLiked(idToLike)) {
                showAsPersonallyLiked(idToLike);
            }
        })
    ;
}

function getPersonalLikes() {
    let personalLikes = storage.get(state.localStorageKey);
    return personalLikes ? personalLikes.split(',') : [];
}

function hasPersonalLikes() {
    return getPersonalLikes().length ? true : false;
}

function setPersonalLikes(personalLikes) {
    storage.set(state.localStorageKey, personalLikes);
}

function hasPersonallyLiked(id) {
    const personalLikes = getPersonalLikes();
    return personalLikes.includes(id);
}

function addLike(id) {
    const personalLikes = getPersonalLikes();
    personalLikes.push(id);
    setPersonalLikes(personalLikes);
    showAsPersonallyLiked(id);
    api.like(id);
}

function removeLike(id) {
    const personalLikes = getPersonalLikes();
    setPersonalLikes(personalLikes.filter(likedId => likedId != id));
    removeAsPersonallyLiked(id);
    api.unlike(id);
}

function showAsPersonallyLiked(id) {
    document
        .querySelectorAll(`[${state.dataAttributes.likeableElement}="${id}"]`)
        .forEach((likeElement) => {
            likeElement
                .classList
                .add(state.classNames.hasPersonallyLiked)
            ;
        })
    ;
}

function removeAsPersonallyLiked(id) {
    document
        .querySelectorAll(`[${state.dataAttributes.likeableElement}="${id}"]`)
        .forEach((likeElement) => {
            likeElement
                .classList
                .remove(state.classNames.hasPersonallyLiked)
            ;
        })
    ;
}

function togglePersonalLike(event) {
    const likeElement = event.target.closest(`[${state.dataAttributes.likeableElement}]`);
    const idToLike = likeElement.getAttribute(state.dataAttributes.likeableElement);

    if(hasPersonallyLiked(idToLike)) {
        removeLike(idToLike);
    } else {
        addLike(idToLike);
    }

    document.dispatchEvent(new CustomEvent('better-reviews:personal-like-total-changed'));
}

function getPersonalLikedObjects() {
    const personalLikes = getPersonalLikes();
    return api.load_liked(personalLikes);
}

const likes = {
    init: init,
    getPersonalLikes: getPersonalLikes,
    getPersonalLikedObjects: getPersonalLikedObjects
};

export default likes;
