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
    console.log(' -- starting reviews js');
}

const reviews = {
    init: init
};

export default reviews;
