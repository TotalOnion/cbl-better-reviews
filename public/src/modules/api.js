const state = {
    baseApiEndpoint: '/wp-json/cbl-better-reviews/v1'
};

async function postData(url = '', data = {}) {
    const response = await fetch(url, {
        method: 'POST',
        mode: 'same-origin',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        redirect: 'follow',
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    });

    return response.json(); // parses JSON response into native JavaScript objects
}

async function getData(url = '') {
    const response = await fetch(url, {
        method: 'GET',
        mode: 'same-origin',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        redirect: 'follow'
    });

    return response.json(); // parses JSON response into native JavaScript objects
}

const api = {
    like: (idsToLike) => {
        postData(
            `${state.baseApiEndpoint}/like`,
            Array.isArray(idsToLike) ? idsToLike : [idsToLike]
        );
    },
    unlike: (idsToLike) => {
        postData(
            `${state.baseApiEndpoint}/unlike`,
            Array.isArray(idsToLike) ? idsToLike : [idsToLike]
        );
    },
    load_liked: (ids) => {
        return getData(
            `${state.baseApiEndpoint}/liked/${ids}`
        );
    },
    review: (id, data, successCallback, errorCallback) => {
        postData(
            `${state.baseApiEndpoint}/review/${id}`,
            data
        )
        .then(successCallback, errorCallback);
    },
    load_reviews: (ids, successCallback, errorCallback) => {
        getData(
            `${state.baseApiEndpoint}/reviews/${ids}`
        )
        .then(successCallback, errorCallback);
    }
};

export default api;
