import storage from './storage';

const state = {
    localStorageKey: 'better-reviews',
};

function get() {
    const personalReviews = storage.get(state.localStorageKey);
    return personalReviews ? personalReviews.split(',') : [];
}

function set(personalReviews) {
    storage.set(
        state.localStorageKey,
        personalReviews.filter((v, i, a) => a.indexOf(v) === i)
    );
}

function add(id) {
    const personalReviews = get();
    if(personalReviews.indexOf(id) < 0) {
        personalReviews.push(id);
        set(personalReviews);
    }

    return personalReviews;
}

const reviewStorage = {
    get: get,
    add: add
};

export default reviewStorage;
