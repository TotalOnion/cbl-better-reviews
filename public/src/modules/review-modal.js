import reviewStorage from './review-storage';
import api from './api';

const state = {
    localStorageKey: 'better-reviews-my-reviews',
    dataAttributes: {
        modalToggle: 'data-better-reviews-modal-toggle',
        reviewContainer: 'data-better-reviews-review-id',
        openModalContainer: 'data-better-reviews-modal-review-id',
        submitButton: 'data-better-reviews-modal-submit',
        starRatingInput: 'data-better-reviews-modal-star-rating-input'
    },
    classNames: {
        modalIsOpenBodyClass: 'better-reviews__modal-is-open',
        modalSubmittedOk: 'better-reviews__modal-succeeded',
        modalSubmissionFailed: 'better-reviews__modal-failed',
        hasPersonallyLiked: 'better-reviews__has-personally-reviewed',
        reviewModalIsInvalid: 'better-reviews__modal-invalid'
    },
    constants: {

    }
};

const BUTTON_DISABLED = 'BUTTON_DISABLED';
const BUTTON_ENABLED  = 'BUTTON_ENABLED';

function init() {
    addEventListeners(document);
}

function toggleSubmitButtonState(container, newButtonState) {
    container
        .querySelectorAll(`[${state.dataAttributes.submitButton}]`)
        .forEach((submitButton) => {
            switch (newButtonState) {
                case BUTTON_DISABLED:
                    submitButton.setAttribute('disabled', true);
                    break;
                
                case BUTTON_ENABLED:
                    submitButton.removeAttribute('disabled');
                    break;
            }
        })
    ;
}

function addEventListeners(container) {
    // open/close toggle
    container
        .querySelectorAll(`[${state.dataAttributes.modalToggle}]`)
        .forEach((toggleElement) => {
            toggleElement.addEventListener('click', toggleModal, { passive: true });
        })
    ;

    // whenever a rating is changed
    container
        .querySelectorAll(`[${state.dataAttributes.starRatingInput}]`)
        .forEach((starRatingInput) => {
            starRatingInput.addEventListener('change', starRatingVoteChanged, { passive: true });
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
    console.log('Closing modal');
    document.body.classList.remove(state.classNames.modalIsOpenBodyClass);
    document.body.classList.remove(state.classNames.modalSubmissionFailed);
    document.body.classList.remove(state.classNames.modalSubmittedOk);
    document
        .querySelectorAll(`[${state.dataAttributes.openModalContainer}]`)
        .forEach((modalElement) => {
            console.log('ll',modalElement);
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

    api.review(
        postId,
        formData
    ).then(
        (response) => {
            document.body.classList.remove(state.classNames.modalSubmissionFailed);
            document.body.classList.add(state.classNames.modalSubmittedOk);
            reviewStorage.add(postId);
            const event = new CustomEvent('better-reviews:reviews-loaded', { detail: response });
            document.dispatchEvent(event);
        },
        (error) => {
            document.body.classList.remove(state.classNames.modalSubmittedOk);
            document.body.classList.add(state.classNames.modalSubmissionFailed);
            console.log('Error!!', error);
        }
    );
}

function starRatingVoteChanged(event) {
    const formElement = event.target.closest('form');
    const formData = Object.fromEntries(new FormData(formElement));
    
    if (Object.keys(formData).length === 0) {
        // no form data. Invalid form.
        formElement.classList.add(state.classNames.reviewModalIsInvalid);
        toggleSubmitButtonState(formElement, BUTTON_DISABLED);
    } else {
        // valid form
        formElement.classList.remove(state.classNames.reviewModalIsInvalid);
        toggleSubmitButtonState(formElement, BUTTON_ENABLED);
    }
    
}

const reviews = {
    init: init
};

export default reviews;
