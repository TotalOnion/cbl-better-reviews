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

/***/ "./public/src/likes.js":
/*!*****************************!*\
  !*** ./public/src/likes.js ***!
  \*****************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _modules_likes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modules/likes */ \"./public/src/modules/likes.js\");\n\n\nwindow.addEventListener('DOMContentLoaded', () => {\n\t_modules_likes__WEBPACK_IMPORTED_MODULE_0__[\"default\"].init();\n});\n\n\n//# sourceURL=webpack://cbl-better-reviews/./public/src/likes.js?");

/***/ }),

/***/ "./public/src/modules/api.js":
/*!***********************************!*\
  !*** ./public/src/modules/api.js ***!
  \***********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\nconst state = {\n    baseApiEndpoint: '/wp-json/cbl-better-reviews/v1'\n};\n\nasync function postData(url = '', data = {}) {\n    // Default options are marked with *\n    const response = await fetch(url, {\n        method: 'POST',\n        mode: 'same-origin',\n        cache: 'no-cache',\n        credentials: 'same-origin',\n        headers: {\n            'Content-Type': 'application/json'\n        },\n        redirect: 'follow',\n        body: JSON.stringify(data) // body data type must match \"Content-Type\" header\n    });\n\n    return response.json(); // parses JSON response into native JavaScript objects\n}\n\nconst api = {\n    like: (idsToLike) => {\n        postData(\n            `${state.baseApiEndpoint}/like`,\n            Array.isArray(idsToLike) ? idsToLike : [idsToLike]\n        );\n    },\n    unlike: (idsToLike) => {\n        postData(\n            `${state.baseApiEndpoint}/unlike`,\n            Array.isArray(idsToLike) ? idsToLike : [idsToLike]\n        );\n    },\n    review: (id, data, successCallback, errorCallback) => {\n        postData(\n            `${state.baseApiEndpoint}/review/${id}`,\n            data\n        )\n        .then(successCallback, errorCallback);\n    }\n};\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (api);\n\n\n//# sourceURL=webpack://cbl-better-reviews/./public/src/modules/api.js?");

/***/ }),

/***/ "./public/src/modules/likes.js":
/*!*************************************!*\
  !*** ./public/src/modules/likes.js ***!
  \*************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _storage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./storage */ \"./public/src/modules/storage.js\");\n/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./api */ \"./public/src/modules/api.js\");\n\n\n\nconst state = {\n    localStorageKey: 'better-reviews-likes',\n    dataAttributes: {\n        likeableElement: 'data-better-reviews-like',\n        personalLikesIcon: 'data-better-reviews-personal-likes',\n        personalLikesTotal: 'data-better-reviews-personal-likes-total',\n    },\n    classNames: {\n        hasPersonallyLiked: 'better-reviews__has-personally-liked',\n        hasPersonalLikes: 'better-reviews__has-personal-likes'\n    },\n};\n\nfunction init() {\n    // Add the click handler to likeable items, and set whether they have been Liked by the current user\n    setupLikeableElements();\n\n    // Add the total to the personal likes icon, and add the associated listeners for when likes changes\n    renderPersonalLikesElements();\n    document\n        .addEventListener(\n            'better-reviews:personal-like-total-changed',\n            renderPersonalLikesElements\n        )\n    ;\n}\n\nfunction renderPersonalLikesElements() {\n    const hasLikes = hasPersonalLikes();\n    const totalLikes = getPersonalLikes().length;\n\n    document\n        .querySelectorAll(`[${state.dataAttributes.personalLikesIcon}]`)\n        .forEach((personalLikesElement) => {\n            if (hasLikes) {\n                personalLikesElement.classList.add(state.classNames.hasPersonalLikes);\n            } else {\n                personalLikesElement.classList.remove(state.classNames.hasPersonalLikes);\n            }\n        })\n    ;\n\n    document\n        .querySelectorAll(`[${state.dataAttributes.personalLikesTotal}]`)\n        .forEach((personalLikesTotalElement) => {\n            personalLikesTotalElement.innerText = totalLikes;\n        })\n    ;\n}\n\nfunction setupLikeableElements() {\n    document\n        .querySelectorAll(`[${state.dataAttributes.likeableElement}]`)\n        .forEach((likeElement) => {\n            const idToLike = likeElement.getAttribute(state.dataAttributes.likeableElement);\n            if(!idToLike) {\n                console.warn(`better-reviews-like: id is missing from the ${state.dataAttributes.likeableElement} attribute`);\n                return;\n            }\n\n            likeElement.addEventListener('click', togglePersonalLike, { passive: true });\n            if(hasPersonallyLiked(idToLike)) {\n                showAsPersonallyLiked(idToLike);\n            }\n        })\n    ;\n}\n\nfunction getPersonalLikes() {\n    let personalLikes = _storage__WEBPACK_IMPORTED_MODULE_0__[\"default\"].get(state.localStorageKey);\n    return personalLikes ? personalLikes.split(',') : [];\n}\n\nfunction hasPersonalLikes() {\n    return getPersonalLikes().length ? true : false;\n}\n\nfunction setPersonalLikes(personalLikes) {\n    _storage__WEBPACK_IMPORTED_MODULE_0__[\"default\"].set(state.localStorageKey, personalLikes);\n}\n\nfunction hasPersonallyLiked(id) {\n    const personalLikes = getPersonalLikes();\n    return personalLikes.includes(id);\n}\n\nfunction addLike(id) {\n    const personalLikes = getPersonalLikes();\n    personalLikes.push(id);\n    setPersonalLikes(personalLikes);\n    showAsPersonallyLiked(id);\n    _api__WEBPACK_IMPORTED_MODULE_1__[\"default\"].like(id);\n}\n\nfunction removeLike(id) {\n    const personalLikes = getPersonalLikes();\n    setPersonalLikes(personalLikes.filter(likedId => likedId != id));\n    removeAsPersonallyLiked(id);\n    _api__WEBPACK_IMPORTED_MODULE_1__[\"default\"].unlike(id);\n}\n\nfunction showAsPersonallyLiked(id) {\n    document\n        .querySelectorAll(`[${state.dataAttributes.likeableElement}=\"${id}\"]`)\n        .forEach((likeElement) => {\n            likeElement\n                .classList\n                .add(state.classNames.hasPersonallyLiked)\n            ;\n        })\n    ;\n}\n\nfunction removeAsPersonallyLiked(id) {\n    document\n        .querySelectorAll(`[${state.dataAttributes.likeableElement}=\"${id}\"]`)\n        .forEach((likeElement) => {\n            likeElement\n                .classList\n                .remove(state.classNames.hasPersonallyLiked)\n            ;\n        })\n    ;\n}\n\nfunction togglePersonalLike(event) {\n    const likeElement = event.target.closest(`[${state.dataAttributes.likeableElement}]`);\n    const idToLike = likeElement.getAttribute(state.dataAttributes.likeableElement);\n\n    if(hasPersonallyLiked(idToLike)) {\n        removeLike(idToLike);\n    } else {\n        addLike(idToLike);\n    }\n\n    document.dispatchEvent(new CustomEvent('better-reviews:personal-like-total-changed'));\n}\n\nconst likes = {\n    init: init\n};\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (likes);\n\n\n//# sourceURL=webpack://cbl-better-reviews/./public/src/modules/likes.js?");

/***/ }),

/***/ "./public/src/modules/storage.js":
/*!***************************************!*\
  !*** ./public/src/modules/storage.js ***!
  \***************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\nconst storage = {\n    get: (key) => {\n        if(typeof localStorage == 'object') {\n            return localStorage.getItem(key);\n        } else {\n            const match = document.cookie.match(new RegExp('(^| )' + key + '=([^;]+)'));\n            return match ? match[2] : null;\n        }\n    },\n    set: (key, value) => {\n        if(typeof localStorage == 'object') {\n            return localStorage.setItem(key, value);\n        } else {\n            document.cookie = key + '=' + value;\n        }\n    }\n};\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (storage);\n\n\n//# sourceURL=webpack://cbl-better-reviews/./public/src/modules/storage.js?");

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
/******/ 	var __webpack_exports__ = __webpack_require__("./public/src/likes.js");
/******/ 	
/******/ })()
;