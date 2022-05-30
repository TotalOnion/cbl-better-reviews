/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./admin/src/admin.js":
/*!****************************!*\
  !*** ./admin/src/admin.js ***!
  \****************************/
/***/ (function() {

eval("window.addEventListener('DOMContentLoaded', () => {\n    const adminPanel = document.querySelector('[data-better-review-settings]');\n    if (!adminPanel) {\n        return;\n    }\n\n    adminPanel\n        .querySelectorAll('.nav-tab')\n        .forEach((tabElement) => {\n            tabElement.addEventListener('click', (event) => {\n                event.preventDefault();\n\n                if (event.target.classList.contains('nav-tab-active')) {\n                    return;\n                }\n\n                const containerElement = event.target.closest('form');\n                const targetIndex = [...event.target.parentElement.children].indexOf(event.target) + 1;\n\n                // remove the active class from the nav tabs, and add it to this one\n                containerElement.querySelectorAll('.nav-tab-active').forEach(tabElement => tabElement.classList.remove('nav-tab-active'));\n                event.target.classList.add('nav-tab-active');\n\n                // Hide all the tabs and unhide the one we want to now show\n                containerElement.querySelectorAll('.tab-content').forEach(tabElement => tabElement.classList.add('hidden'));\n                containerElement.querySelector(`.tab-content:nth-of-type(${targetIndex})`).classList.remove('hidden');\n            });\n        })\n\t;\n});\n\n\n//# sourceURL=webpack://cbl-better-reviews/./admin/src/admin.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./admin/src/admin.js"]();
/******/ 	
/******/ })()
;