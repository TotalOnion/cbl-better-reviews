import storage from './storage';
import api from './api';

const state = {
    localStorageKey: 'better-reviews-my-reviews',
    dataAttributes: {
        modalToggle: 'data-better-reviews-modal-toggle',
        reviewContainer: 'data-better-reviews-review-id',
        openModalContainer: 'data-better-reviews-modal-review-id'
    },
    classNames: {
        modalIsOpenBodyClass: 'better-reviews__modal-is-open',
        hasPersonallyLiked: 'better-reviews__has-personally-reviewed'
    }
};

function init() {
    console.log(' -- starting reviews js');
    addEventListeners(document);
    window.test = state;
}

function addEventListeners(container) {
    // open/close toggle
    container
        .querySelectorAll(`[${state.dataAttributes.modalToggle}]`)
        .forEach((toggleElement) => {
            toggleElement.addEventListener('click', toggleModal, { passive: true });
        })
    ;

    // on submit handler
    container
        .querySelectorAll(`[${state.dataAttributes.openModalContainer}] form`)
        .forEach((formElement) => {
            formElement.addEventListener('submit', submitForm);
        })
    ;
}

function toggleModal(event) {
    console.log('toggling modal');
    const openOrClose = event.target.getAttribute(state.dataAttributes.modalToggle);
    
    switch (openOrClose) {
        case 'close': {
            closeModal();
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

function closeModal() {
    document.body.classList.remove(state.classNames.modalIsOpenBodyClass);
    document
        .querySelectorAll(`[${state.dataAttributes.openModalContainer}]`)
        .forEach((modalElement) => {
            modalElement.parentNode.removeChild(modalElement);
        })
    ;
}

function openModal(event) {
    // clone the template and add it to the body
    const template = event.target.closest(`[${state.dataAttributes.reviewContainer}]`).querySelector('template');
    if (!template) {
        console.error(' -- No modal template found.');
        return;
    }

    const modalElement = template.content.cloneNode(true);
    addEventListeners(modalElement);
    document.body.prepend(modalElement);
    document.body.classList.add(state.classNames.modalIsOpenBodyClass);
}

function submitForm(event) {
    event.preventDefault();

    const formData = Object.fromEntries(new FormData(event.target));
    const postId = event.target
        .closest(`[${state.dataAttributes.openModalContainer}]`)
        .getAttribute(state.dataAttributes.openModalContainer)
    ;

    console.log(formData);
    api.review(
        postId,
        formData,
        (response) => {
            console.log('Success!!', response);
        },
        (a,b,c) => {
            console.log('Error!!', a, b, c);
        }
    );
}

const reviews = {
    init: init
};

export default reviews;
