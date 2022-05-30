/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./public/src/modules/api.js":
/*!***********************************!*\
  !*** ./public/src/modules/api.js ***!
  \***********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\nconst state = {\n    baseApiEndpoint: '/wp-json/cbl-better-reviews/v1'\n};\n\nasync function postData(url = '', data = {}) {\n    const response = await fetch(url, {\n        method: 'POST',\n        mode: 'same-origin',\n        cache: 'no-cache',\n        credentials: 'same-origin',\n        headers: {\n            'Content-Type': 'application/json'\n        },\n        redirect: 'follow',\n        body: JSON.stringify(data) // body data type must match \"Content-Type\" header\n    });\n\n    return response.json(); // parses JSON response into native JavaScript objects\n}\n\nasync function getData(url = '') {\n    const response = await fetch(url, {\n        method: 'GET',\n        mode: 'same-origin',\n        cache: 'no-cache',\n        credentials: 'same-origin',\n        headers: {\n            'Content-Type': 'application/json'\n        },\n        redirect: 'follow'\n    });\n\n    return response.json(); // parses JSON response into native JavaScript objects\n}\n\nconst api = {\n    like: (idsToLike) => {\n        postData(\n            `${state.baseApiEndpoint}/like`,\n            Array.isArray(idsToLike) ? idsToLike : [idsToLike]\n        );\n    },\n    unlike: (idsToLike) => {\n        postData(\n            `${state.baseApiEndpoint}/unlike`,\n            Array.isArray(idsToLike) ? idsToLike : [idsToLike]\n        );\n    },\n    load_liked: (ids) => {\n        return getData(\n            `${state.baseApiEndpoint}/liked/${ids}`\n        );\n    },\n    review: (id, data, successCallback, errorCallback) => {\n        postData(\n            `${state.baseApiEndpoint}/review/${id}`,\n            data\n        )\n        .then(successCallback, errorCallback);\n    },\n    load_reviews: (ids, successCallback, errorCallback) => {\n        getData(\n            `${state.baseApiEndpoint}/reviews/${ids}`\n        )\n        .then(successCallback, errorCallback);\n    }\n};\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (api);\n\n\n//# sourceURL=webpack://cbl-better-reviews/./public/src/modules/api.js?");

/***/ }),

/***/ "./public/src/modules/review-modal.js":
/*!********************************************!*\
  !*** ./public/src/modules/review-modal.js ***!
  \********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _storage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./storage */ \"./public/src/modules/storage.js\");\n/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./api */ \"./public/src/modules/api.js\");\n\n\n\nconst state = {\n    localStorageKey: 'better-reviews-my-reviews',\n    dataAttributes: {\n        modalToggle: 'data-better-reviews-modal-toggle',\n        reviewContainer: 'data-better-reviews-review-id',\n        openModalContainer: 'data-better-reviews-modal-review-id'\n    },\n    classNames: {\n        modalIsOpenBodyClass: 'better-reviews__modal-is-open',\n        hasPersonallyLiked: 'better-reviews__has-personally-reviewed'\n    }\n};\n\nfunction init() {\n    addEventListeners(document);\n}\n\nfunction addEventListeners(container) {\n    // open/close toggle\n    container\n        .querySelectorAll(`[${state.dataAttributes.modalToggle}]`)\n        .forEach((toggleElement) => {\n            toggleElement.addEventListener('click', toggleModal, { passive: true });\n        })\n    ;\n\n    // on submit handler\n    container\n        .querySelectorAll(`[${state.dataAttributes.openModalContainer}] form`)\n        .forEach((formElement) => {\n            formElement.addEventListener('submit', submitForm);\n        })\n    ;\n}\n\nfunction toggleModal(event) {\n    console.log('toggling modal');\n    const openOrClose = event.target.getAttribute(state.dataAttributes.modalToggle);\n    \n    switch (openOrClose) {\n        case 'close': {\n            closeModal();\n            return;\n        }\n        \n        case 'open': {\n            openModal(event);\n            return;\n        }\n\n        default: {\n            console.error(' -- Unknown toggleModal value');\n        }\n    }\n}\n\nfunction closeModal() {\n    document.body.classList.remove(state.classNames.modalIsOpenBodyClass);\n    document\n        .querySelectorAll(`[${state.dataAttributes.openModalContainer}]`)\n        .forEach((modalElement) => {\n            modalElement.parentNode.removeChild(modalElement);\n        })\n    ;\n}\n\nfunction openModal(event) {\n    // clone the template and add it to the body\n    const template = event.target.closest(`[${state.dataAttributes.reviewContainer}]`).querySelector('template');\n    if (!template) {\n        console.error(' -- No modal template found.');\n        return;\n    }\n\n    const modalElement = template.content.cloneNode(true);\n    addEventListeners(modalElement);\n    document.body.prepend(modalElement);\n    document.body.classList.add(state.classNames.modalIsOpenBodyClass);\n}\n\nfunction submitForm(event) {\n    event.preventDefault();\n\n    const formData = Object.fromEntries(new FormData(event.target));\n    const postId = event.target\n        .closest(`[${state.dataAttributes.openModalContainer}]`)\n        .getAttribute(state.dataAttributes.openModalContainer)\n    ;\n\n    _api__WEBPACK_IMPORTED_MODULE_1__[\"default\"].review(\n        postId,\n        formData,\n        (response) => {\n            const event = new CustomEvent('better-reviews:reviews-loaded', { detail: response });\n            document.dispatchEvent(event);\n        },\n        (error) => {\n            console.log('Error!!', error);\n        }\n    );\n}\n\nconst reviews = {\n    init: init\n};\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (reviews);\n\n\n//# sourceURL=webpack://cbl-better-reviews/./public/src/modules/review-modal.js?");

/***/ }),

/***/ "./public/src/modules/reviews.js":
/*!***************************************!*\
  !*** ./public/src/modules/reviews.js ***!
  \***************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _storage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./storage */ \"./public/src/modules/storage.js\");\n/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./api */ \"./public/src/modules/api.js\");\n\n\n\nconst state = {\n    localStorageKey: 'better-reviews-my-reviews',\n    dataAttributes: {\n        reviewContainer:           'data-better-reviews-review-id',\n        averageStarsContainer:     'data-better-reviews-review-average-stars',\n        averageReviewCount:        'data-better-reviews-average-review-count',\n        subcriteriaContainer:      'data-better-reviews-subcriteria-id',\n        subcriteriaScoreContainer: 'data-better-reviews-subcriteria-score',\n        subcriteriaStarsContainer: 'data-better-reviews-subcriteria-stars',\n        subcriteriaReviewCount:    'data-better-reviews-subcriteria-review-count',\n        averageScoreContainer:     'data-better-reviews-review-average-score'\n    },\n    classNames: {\n        notYetReviewed: 'better-reviews__not-yet-reviewed',\n        hasPersonallyLiked: 'better-reviews__has-personally-reviewed'\n    },\n    starClassnames: [\n        'better-reviews__star_05',\n        'better-reviews__star_10',\n        'better-reviews__star_15',\n        'better-reviews__star_20',\n        'better-reviews__star_25',\n        'better-reviews__star_30',\n        'better-reviews__star_35',\n        'better-reviews__star_40',\n        'better-reviews__star_45',\n        'better-reviews__star_50',\n    ]\n};\n\nfunction init() {\n    addEventListeners(document);\n    loadReviews();\n}\n\nfunction addEventListeners(container) {\n    document\n        .addEventListener(\n            'better-reviews:reviews-loaded',\n            (event) => {\n                renderReviews(event.detail);\n            }\n        )\n    ;\n}\n\nfunction loadReviews() {\n    const idsOnPage = [];\n    document\n        .querySelectorAll(`[${state.dataAttributes.reviewContainer}]`)\n        .forEach((reviewElement) => {\n            const id = reviewElement.getAttribute(state.dataAttributes.reviewContainer);\n            if (id) {\n                idsOnPage.push(id);\n            }\n        })\n    ;\n\n    if (!idsOnPage.length) {\n        console.warn('The better reviews js has been loaded, but there are no valid IDs on the page to fetch');\n        return;\n    }\n\n    _api__WEBPACK_IMPORTED_MODULE_1__[\"default\"].load_reviews(\n            idsOnPage,\n            (response) => {\n                const event = new CustomEvent('better-reviews:reviews-loaded', { detail: response });\n                document.dispatchEvent(event);\n            },\n            (a,b,c,d) => {\n                console.error('Fail!!', a, b, c, d);\n            },\n        )\n    ;\n}\n\nfunction renderReviews(data) {\n    document\n        .querySelectorAll(`[${state.dataAttributes.reviewContainer}]`)\n        .forEach((reviewElement) => {\n            const id = reviewElement.getAttribute(state.dataAttributes.reviewContainer);\n\n            renderReview(\n                reviewElement,\n                data[id]\n            );\n        })\n    ;\n}\n\nfunction renderReview(reviewElement, data) {\n    // Only render scores if we have some, otherwise add a class to say it's not been reviewed yet\n    if (data['totals'].count == 0) {\n        reviewElement.classList.add(state.classNames.notYetReviewed);\n        return;\n    } else {\n        reviewElement.classList.remove(state.classNames.notYetReviewed);\n    }\n\n    renderSubcriterias(reviewElement, data);\n    renderAverage(reviewElement, data);\n}\n\nfunction renderSubcriterias(reviewElement, data) {\n    reviewElement\n        .querySelectorAll(`[${state.dataAttributes.subcriteriaContainer}]`)\n        .forEach((subcriteriaElement) => {\n            const subcriteriaKey = subcriteriaElement.getAttribute(state.dataAttributes.subcriteriaContainer);\n            renderSubcriteria(\n                subcriteriaElement,\n                data[subcriteriaKey]\n            );\n        })\n    ;\n}\n\nfunction renderSubcriteria(subcriteriaElement, data) {\n    // Score\n    subcriteriaElement\n        .querySelectorAll(`[${state.dataAttributes.subcriteriaScoreContainer}]`)\n        .forEach((scoreElement) => renderScore(scoreElement, data.total, data.count))\n    ;\n\n    // Stars\n    subcriteriaElement\n        .querySelectorAll(`[${state.dataAttributes.subcriteriaStarsContainer}]`)\n        .forEach((starsElement) => renderStars(starsElement, data.total, data.count))\n    ;\n\n    // Vote count\n    subcriteriaElement\n        .querySelectorAll(`[${state.dataAttributes.subcriteriaReviewCount}]`)\n        .forEach((countElement) => renderCount(countElement, data.count))\n    ;\n}\n\nfunction renderAverage(reviewElement, data) {\n    // Score\n    reviewElement\n        .querySelectorAll(`[${state.dataAttributes.averageScoreContainer}]`)\n        .forEach((scoreElement) => renderScore(scoreElement, data['totals'].total, data['totals'].count))\n    ;\n\n    // Stars\n    reviewElement\n        .querySelectorAll(`[${state.dataAttributes.averageStarsContainer}]`)\n        .forEach((starsElement) => renderStars(starsElement, data['totals'].total, data['totals'].count))\n    ;\n\n    // Vote count\n    reviewElement\n        .querySelectorAll(`[${state.dataAttributes.averageReviewCount}]`)\n        .forEach((countElement) => renderCount(countElement, data['totals'].count))\n    ;\n}\n\nfunction renderScore(scoreElement, total, count) {\n    scoreElement.innerText  = (total / count).toFixed(1);\n}\n\nfunction renderStars(starsElement, total, count) {\n    // remove any old star classnames\n    state.starClassnames.forEach(starClassname => starsElement.classList.remove(starClassname));\n\n    // add the new star classname\n    const roundedToNearestHalf = Math.round((total/count) / 0.5) * 0.5;\n    const className = 'better-reviews__star_' + (String(roundedToNearestHalf).replace('.','')+'0').substring(0,2);\n    starsElement.classList.add(className);\n}\n\nfunction renderCount(countElement, count) {\n    let countString = '';\n    if (count > Math.pow(10,6)) {\n        countString = (count / Math.pow(10,6)).toFixed(1)+'M'; \n    } else if (count > Math.pow(10,3)) {\n        countString = (count / Math.pow(10,3)).toFixed(1)+'K'; \n    } else {\n        countString = count;\n    }\n\n    countElement.innerText  = countString;\n}\n\nconst reviews = {\n    init: init\n};\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (reviews);\n\n\n//# sourceURL=webpack://cbl-better-reviews/./public/src/modules/reviews.js?");

/***/ }),

/***/ "./public/src/modules/storage.js":
/*!***************************************!*\
  !*** ./public/src/modules/storage.js ***!
  \***************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\nconst storage = {\n    get: (key) => {\n        if(typeof localStorage == 'object') {\n            return localStorage.getItem(key);\n        } else {\n            const match = document.cookie.match(new RegExp('(^| )' + key + '=([^;]+)'));\n            return match ? match[2] : null;\n        }\n    },\n    set: (key, value) => {\n        if(typeof localStorage == 'object') {\n            return localStorage.setItem(key, value);\n        } else {\n            document.cookie = key + '=' + value;\n        }\n    }\n};\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (storage);\n\n\n//# sourceURL=webpack://cbl-better-reviews/./public/src/modules/storage.js?");

/***/ }),

/***/ "./public/src/reviews.js":
/*!*******************************!*\
  !*** ./public/src/reviews.js ***!
  \*******************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _modules_reviews__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modules/reviews */ \"./public/src/modules/reviews.js\");\n/* harmony import */ var _modules_review_modal__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modules/review-modal */ \"./public/src/modules/review-modal.js\");\n\n\n\nwindow.addEventListener('DOMContentLoaded', () => {\n\t_modules_review_modal__WEBPACK_IMPORTED_MODULE_1__[\"default\"].init();\n\t_modules_reviews__WEBPACK_IMPORTED_MODULE_0__[\"default\"].init();\n});\n\n\n//# sourceURL=webpack://cbl-better-reviews/./public/src/reviews.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./public/src/reviews.js");
/******/ 	
/******/ })()
;