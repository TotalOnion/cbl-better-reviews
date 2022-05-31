import reviewStorage from './review-storage';
import api from './api';

const state = {
    localStorageKey: 'better-reviews-my-reviews',
    dataAttributes: {
        reviewContainer:                 'data-better-reviews-review-id',
        averageContainer:                'data-better-reviews-review-average',
        averageStarsContainer:           'data-better-reviews-review-average-stars',
        averageReviewCount:              'data-better-reviews-average-review-count',
        criteriaContainer:               'data-better-reviews-criteria-id',
        criteriaScoreContainer:          'data-better-reviews-criteria-score',
        criteriaStarsContainer:          'data-better-reviews-criteria-stars',
        criteriaReviewCount:             'data-better-reviews-criteria-review-count',
        averageScoreContainer:           'data-better-reviews-review-average-score',
        criteriaNotYetReviewedLabel:     'data-better-reviews-review-criteria-not-yet-reviewed-label',
        criteriaNotYetReviewedLabelText: 'data-better-reviews-criteria-not-yet-reviewed-label'

    },
    classNames: {
        hasNoReviews:                'better-reviews__has-no-reviews',
        notPersonallyReviewed:       'better-reviews__not-personally-reviewed',
        hasPersonallyReviewed:       'better-reviews__has-personally-reviewed',
        criteriaNotYetReviewed:      'better-reviews__criteria-not-yet-reviewed',
        criteriaNotYetReviewedLabel: 'better-reviews__criteria-not-yet-reviewed-label',
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
        betterReviewsConfig.currentPageId
        && reviewStorage.get().indexOf(betterReviewsConfig.currentPageId) >= 0
    ) {
        document.body.classList.add(state.classNames.hasPersonallyReviewed);
        document.body.classList.remove(state.classNames.notPersonallyReviewed);
    } else {
        document.body.classList.add(state.classNames.notPersonallyReviewed);
        document.body.classList.remove(state.classNames.hasPersonallyReviewed);
    }
}

function renderReview(reviewElement, data, id) {
    // Add a class to say it's not been reviewed yet at all
    if (data['totals'].count == 0) {
        reviewElement.classList.add(state.classNames.hasNoReviews);
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

    renderCriterias(reviewElement, data);
    renderAverage(reviewElement, data);
}

function renderCriterias(reviewElement, data) {
    reviewElement
        .querySelectorAll(`[${state.dataAttributes.criteriaContainer}]`)
        .forEach((criteriaElement) => {
            const criteriaKey = criteriaElement.getAttribute(state.dataAttributes.criteriaContainer);
            renderCriteria(
                criteriaElement,
                data[criteriaKey]
            );
        })
    ;
}

function renderCriteria(criteriaElement, data) {
    // Add or remove an element if this criteria has yet to be rated
    if (!data.count) {
        const notYetReviewedLabel = document.createElement('p');
        notYetReviewedLabel.classList.add(state.classNames.criteriaNotYetReviewedLabel);
        notYetReviewedLabel.innerText = criteriaElement.getAttribute(state.dataAttributes.criteriaNotYetReviewedLabelText);
        notYetReviewedLabel.setAttribute(state.dataAttributes.criteriaNotYetReviewedLabel, true);
        criteriaElement.appendChild(notYetReviewedLabel);
        criteriaElement.classList.add(state.classNames.criteriaNotYetReviewed);
        return;
    } else {
        criteriaElement.classList.remove(state.classNames.criteriaNotYetReviewed);
        criteriaElement
            .querySelectorAll(`[${state.dataAttributes.criteriaNotYetReviewedLabel}]`)
            .forEach(notYetReviewedLabel => notYetReviewedLabel.parentNode.removeChild(notYetReviewedLabel))
        ;
    }

    // Score
    criteriaElement
        .querySelectorAll(`[${state.dataAttributes.criteriaScoreContainer}]`)
        .forEach((scoreElement) => renderScore(scoreElement, data.total, data.count))
    ;

    // Stars
    criteriaElement
        .querySelectorAll(`[${state.dataAttributes.criteriaStarsContainer}]`)
        .forEach((starsElement) => renderStars(starsElement, data.total, data.count))
    ;

    // Vote count
    criteriaElement
        .querySelectorAll(`[${state.dataAttributes.criteriaReviewCount}]`)
        .forEach((countElement) => renderCount(countElement, data.count))
    ;
}

function renderAverage(reviewElement, data) {
    const averageContainerElement = reviewElement.querySelector(`[${state.dataAttributes.averageContainer}]`);
    if (!averageContainerElement) {
        return;
    }

    // Add or remove an element if this criteria has yet to be rated
    if (!data['totals'].count) {
        const notYetReviewedLabel = document.createElement('p');
        notYetReviewedLabel.classList.add(state.classNames.criteriaNotYetReviewedLabel);
        notYetReviewedLabel.innerText = averageContainerElement.getAttribute(state.dataAttributes.criteriaNotYetReviewedLabelText);
        notYetReviewedLabel.setAttribute(state.dataAttributes.criteriaNotYetReviewedLabel, true);
        averageContainerElement.appendChild(notYetReviewedLabel);
        averageContainerElement.classList.add(state.classNames.criteriaNotYetReviewed);
        return;
    } else {
        averageContainerElement.classList.remove(state.classNames.criteriaNotYetReviewed);
        averageContainerElement
            .querySelectorAll(`[${state.dataAttributes.criteriaNotYetReviewedLabel}]`)
            .forEach(notYetReviewedLabel => notYetReviewedLabel.parentNode.removeChild(notYetReviewedLabel))
        ;
    }

    // Score
    averageContainerElement
        .querySelectorAll(`[${state.dataAttributes.averageScoreContainer}]`)
        .forEach((scoreElement) => renderScore(scoreElement, data['totals'].total, data['totals'].count))
    ;

    // Stars
    averageContainerElement
        .querySelectorAll(`[${state.dataAttributes.averageStarsContainer}]`)
        .forEach((starsElement) => renderStars(starsElement, data['totals'].total, data['totals'].count))
    ;

    // Vote count
    averageContainerElement
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
