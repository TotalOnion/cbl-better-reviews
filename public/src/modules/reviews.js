import reviewStorage from './review-storage';
import api from './api';

const state = {
    localStorageKey: 'better-reviews-my-reviews',
    dataAttributes: {
        reviewContainer:           'data-better-reviews-review-id',
        averageStarsContainer:     'data-better-reviews-review-average-stars',
        averageReviewCount:        'data-better-reviews-average-review-count',
        subcriteriaContainer:      'data-better-reviews-subcriteria-id',
        subcriteriaScoreContainer: 'data-better-reviews-subcriteria-score',
        subcriteriaStarsContainer: 'data-better-reviews-subcriteria-stars',
        subcriteriaReviewCount:    'data-better-reviews-subcriteria-review-count',
        averageScoreContainer:     'data-better-reviews-review-average-score'
    },
    classNames: {
        hasNoReviews: 'better-reviews__has-no-reviews',
        notPersonallyReviewed: 'better-reviews__not-personally-reviewed',
        hasPersonallyReviewed: 'better-reviews__has-personally-reviewed'
    },
    starClassnames: [
        'better-reviews__star_05',
        'better-reviews__star_10',
        'better-reviews__star_15',
        'better-reviews__star_20',
        'better-reviews__star_25',
        'better-reviews__star_30',
        'better-reviews__star_35',
        'better-reviews__star_40',
        'better-reviews__star_45',
        'better-reviews__star_50',
    ]
};

function init() {
    window.test = reviewStorage;
    addEventListeners(document);
    loadReviews();
}

function addEventListeners(container) {
    document
        .addEventListener(
            'better-reviews:reviews-loaded',
            (event) => {
                renderReviews(event.detail);
            }
        )
    ;
}

function loadReviews() {
    let idsOnPage = [];
    document
        .querySelectorAll(`[${state.dataAttributes.reviewContainer}]`)
        .forEach((reviewElement) => {
            const id = reviewElement.getAttribute(state.dataAttributes.reviewContainer);
            if (id) {
                idsOnPage.push(id);
            }
        })
    ;
    idsOnPage = idsOnPage.filter((v, i, a) => a.indexOf(v) === i);

    if (!idsOnPage.length) {
        console.warn(' - Better Reviews: js has been loaded, but there are no valid IDs on the page to fetch');
        return;
    }

    api
        .load_reviews(idsOnPage)
        .then(
            (response) => {
                const event = new CustomEvent('better-reviews:reviews-loaded', { detail: response });
                document.dispatchEvent(event);
            },
            (error) => {
                console.error(' - Better Reviews: load reviews failed with:', error);
            }
        )
    ;
}

function renderReviews(data) {
    document
        .querySelectorAll(`[${state.dataAttributes.reviewContainer}]`)
        .forEach((reviewElement) => {
            const id = reviewElement.getAttribute(state.dataAttributes.reviewContainer);

            renderReview(
                reviewElement,
                data[id],
                id
            );
        })
    ;

    // add or remove the body class to say if a user has reviewed the current page
    if (
        better_reviews_config.current_page_id
        && reviewStorage.get().indexOf(better_reviews_config.current_page_id) >= 0
    ) {
        document.body.classList.add(state.classNames.hasPersonallyReviewed);
        document.body.classList.remove(state.classNames.notPersonallyReviewed);
    } else {
        document.body.classList.add(state.classNames.notPersonallyReviewed);
        document.body.classList.remove(state.classNames.hasPersonallyReviewed);
    }
}

function renderReview(reviewElement, data, id) {
    // Only render scores if we have some, otherwise add a class to say it's not been reviewed yet
    if (data['totals'].count == 0) {
        reviewElement.classList.add(state.classNames.hasNoReviews);
        return;
    } else {
        reviewElement.classList.remove(state.classNames.hasNoReviews);
    }

    // Add a class to say if this item has been personally reviewed or not
    if (reviewStorage.get().indexOf(id) >= 0) {
        reviewElement.classList.add(state.classNames.hasPersonallyReviewed);
        reviewElement.classList.remove(state.classNames.notPersonallyReviewed);
    } else {
        reviewElement.classList.add(state.classNames.notPersonallyReviewed);
        reviewElement.classList.remove(state.classNames.hasPersonallyReviewed);
    }

    renderSubcriterias(reviewElement, data);
    renderAverage(reviewElement, data);
}

function renderSubcriterias(reviewElement, data) {
    reviewElement
        .querySelectorAll(`[${state.dataAttributes.subcriteriaContainer}]`)
        .forEach((subcriteriaElement) => {
            const subcriteriaKey = subcriteriaElement.getAttribute(state.dataAttributes.subcriteriaContainer);
            renderSubcriteria(
                subcriteriaElement,
                data[subcriteriaKey]
            );
        })
    ;
}

function renderSubcriteria(subcriteriaElement, data) {
    // Score
    subcriteriaElement
        .querySelectorAll(`[${state.dataAttributes.subcriteriaScoreContainer}]`)
        .forEach((scoreElement) => renderScore(scoreElement, data.total, data.count))
    ;

    // Stars
    subcriteriaElement
        .querySelectorAll(`[${state.dataAttributes.subcriteriaStarsContainer}]`)
        .forEach((starsElement) => renderStars(starsElement, data.total, data.count))
    ;

    // Vote count
    subcriteriaElement
        .querySelectorAll(`[${state.dataAttributes.subcriteriaReviewCount}]`)
        .forEach((countElement) => renderCount(countElement, data.count))
    ;
}

function renderAverage(reviewElement, data) {
    // Score
    reviewElement
        .querySelectorAll(`[${state.dataAttributes.averageScoreContainer}]`)
        .forEach((scoreElement) => renderScore(scoreElement, data['totals'].total, data['totals'].count))
    ;

    // Stars
    reviewElement
        .querySelectorAll(`[${state.dataAttributes.averageStarsContainer}]`)
        .forEach((starsElement) => renderStars(starsElement, data['totals'].total, data['totals'].count))
    ;

    // Vote count
    reviewElement
        .querySelectorAll(`[${state.dataAttributes.averageReviewCount}]`)
        .forEach((countElement) => renderCount(countElement, data['totals'].count))
    ;
}

function renderScore(scoreElement, total, count) {
    scoreElement.innerText  = (total / count).toFixed(1);
}

function renderStars(starsElement, total, count) {
    // remove any old star classnames
    state.starClassnames.forEach(starClassname => starsElement.classList.remove(starClassname));

    // add the new star classname
    const roundedToNearestHalf = Math.round((total/count) / 0.5) * 0.5;
    const className = 'better-reviews__star_' + (String(roundedToNearestHalf).replace('.','')+'0').substring(0,2);
    starsElement.classList.add(className);
}

function renderCount(countElement, count) {
    let countString = '';
    if (count > Math.pow(10,6)) {
        countString = (count / Math.pow(10,6)).toFixed(1)+'M'; 
    } else if (count > Math.pow(10,3)) {
        countString = (count / Math.pow(10,3)).toFixed(1)+'K'; 
    } else {
        countString = count;
    }

    countElement.innerText  = countString;
}

const reviews = {
    init: init
};

export default reviews;
