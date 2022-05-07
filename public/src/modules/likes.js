import storage from './storage';
import api from './api';

const state = {
    dataAttributeKey: 'data-better-reviews-like',
    hasPersonallyLikedClassname: 'better-reviews_has-personally-liked',
    localStorageKey: 'better-reviews-likes',
};

export default function likes() {
    // Add the click handler to likeable items, and set whether they have been Liked by the current user
    setupLikeableElements();
}

function setupLikeableElements() {
    document
        .querySelectorAll(`[${state.dataAttributeKey}]`)
        .forEach((likeElement) => {
            const idToLike = likeElement.getAttribute(state.dataAttributeKey);
            if(!idToLike) {
                console.warn(`better-reviews-like: id is missing from the ${state.dataAttributeKey} attribute`);
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
        .querySelectorAll(`[${state.dataAttributeKey}="${id}"]`)
        .forEach((likeElement) => {
            likeElement
                .classList
                .add(state.hasPersonallyLikedClassname)
            ;
        })
    ;
}

function removeAsPersonallyLiked(id) {
    document
        .querySelectorAll(`[${state.dataAttributeKey}="${id}"]`)
        .forEach((likeElement) => {
            likeElement
                .classList
                .remove(state.hasPersonallyLikedClassname)
            ;
        })
    ;
}

function togglePersonalLike(event) {
    const likeElement = event.target.closest(`[${state.dataAttributeKey}]`);
    const idToLike = likeElement.getAttribute(state.dataAttributeKey);
    console.log('Toggling like on ', idToLike);

    if(hasPersonallyLiked(idToLike)) {
        removeLike(idToLike);
        console.log('removed like');
    } else {
        addLike(idToLike);
        console.log('added like');
    }

    console.log(getPersonalLikes);
}
