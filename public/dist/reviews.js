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

eval("__webpack_require__.r(__webpack_exports__);\nconst state = {\n    baseApiEndpoint: '/wp-json/cbl-better-reviews/v1'\n};\n\nasync function postData(url = '', data = {}) {\n    // Default options are marked with *\n    const response = await fetch(url, {\n        method: 'POST',\n        mode: 'same-origin',\n        cache: 'no-cache',\n        credentials: 'same-origin',\n        headers: {\n            'Content-Type': 'application/json'\n        },\n        redirect: 'follow',\n        body: JSON.stringify(data) // body data type must match \"Content-Type\" header\n    });\n\n    return response.json(); // parses JSON response into native JavaScript objects\n}\n\nconst api = {\n    like: (idsToLike) => {\n        postData(\n            `${state.baseApiEndpoint}/like`,\n            Array.isArray(idsToLike) ? idsToLike : [idsToLike]\n        );\n    },\n    unlike: (idsToLike) => {\n        postData(\n            `${state.baseApiEndpoint}/unlike`,\n            Array.isArray(idsToLike) ? idsToLike : [idsToLike]\n        );\n    }\n};\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (api);\n\n\n//# sourceURL=webpack://cbl-better-reviews/./public/src/modules/api.js?");

/***/ }),

/***/ "./public/src/modules/review-modal.js":
/*!********************************************!*\
  !*** ./public/src/modules/review-modal.js ***!
  \********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _storage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./storage */ \"./public/src/modules/storage.js\");\n/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./api */ \"./public/src/modules/api.js\");\n\n\n\nconst state = {\n    localStorageKey: 'better-reviews-my-reviews',\n    dataAttributes: {\n        modalToggle: 'data-better-reviews-modal-toggle',\n        reviewContainer: 'data-better-reviews-review-id'\n    },\n    classNames: {\n        modalIsOpenBodyClass: 'better-reviews__modal-is-open',\n        hasPersonallyLiked: 'better-reviews__has-personally-reviewed'\n    },\n};\n\nfunction init() {\n    console.log(' -- starting reviews js');\n    document\n        .querySelectorAll(`[${state.dataAttributes.modalToggle}]`)\n        .forEach((toggleElement) => {\n            toggleElement.addEventListener('click', toggleModal, { passive: true });\n        })\n    ;\n}\n\nfunction toggleModal(event) {\n    console.log('toggling modal');\n    const openOrClose = event.target.getAttribute(state.dataAttributes.modalToggle);\n    \n    switch (openOrClose) {\n        case 'close': {\n            closeModal(event);\n            return;\n        }\n        \n        case 'open': {\n            openModal(event);\n            return;\n        }\n\n        default: {\n            console.error(' -- Unknown toggleModal value');\n        }\n    }\n\n\n    \n}\n\nfunction closeModal(event) {\n    document.body.classList.remove(state.classNames.modalIsOpenBodyClass);\n}\n\nfunction openModal(event) {\n    // clone the template and add it to the body\n    const template = event.target.closest(`[${state.dataAttributes.reviewContainer}]`).querySelector('template');\n    if (!template) {\n        console.error(' -- No modal template found.');\n        return;\n    }\n    document.body.prepend(template.content.firstElementChild);\n    document.body.classList.add(state.classNames.modalIsOpenBodyClass);\n\n    // Add a class to the body so we know the modal is open\n\n    window.test = template;\n    console.log(template);\n}\n\nconst reviews = {\n    init: init\n};\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (reviews);\n\n\n//# sourceURL=webpack://cbl-better-reviews/./public/src/modules/review-modal.js?");

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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _modules_review_modal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modules/review-modal */ \"./public/src/modules/review-modal.js\");\n\n\nwindow.addEventListener('DOMContentLoaded', () => {\n\t_modules_review_modal__WEBPACK_IMPORTED_MODULE_0__[\"default\"].init();\n});\n\n\n//# sourceURL=webpack://cbl-better-reviews/./public/src/reviews.js?");

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