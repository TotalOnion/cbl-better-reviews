import storage from './storage';
import api from './api';

const state = {
    localStorageKey: 'better-reviews-my-reviews',
    dataAttributes: {
        modalToggle: 'data-better-reviews-modal-toggle',
        reviewContainer: 'data-better-reviews-review-id'
    },
    classNames: {
        modalIsOpenBodyClass: 'better-reviews__modal-is-open',
        hasPersonallyLiked: 'better-reviews__has-personally-reviewed'
    },
};

function init() {
    console.log(' -- starting reviews js');
    document
        .querySelectorAll(`[${state.dataAttributes.modalToggle}]`)
        .forEach((toggleElement) => {
            toggleElement.addEventListener('click', toggleModal, { passive: true });
        })
    ;
}

function toggleModal(event) {
    console.log('toggling modal');
    const openOrClose = event.target.getAttribute(state.dataAttributes.modalToggle);
    
    switch (openOrClose) {
        case 'close': {
            closeModal(event);
            return;
        }
        
        case 'open': {
            openModal(event);
            return;
        }

        default: {
            console.error(' -- Unknown toggleModal value');
        }
    }


    
}

function closeModal(event) {
    document.body.classList.remove(state.classNames.modalIsOpenBodyClass);
}

function openModal(event) {
    // clone the template and add it to the body
    const template = event.target.closest(`[${state.dataAttributes.reviewContainer}]`).querySelector('template');
    if (!template) {
        console.error(' -- No modal template found.');
        return;
    }
    document.body.prepend(template.content.firstElementChild);
    document.body.classList.add(state.classNames.modalIsOpenBodyClass);

    // Add a class to the body so we know the modal is open

    window.test = template;
    console.log(template);
}

const reviews = {
    init: init
};

export default reviews;
