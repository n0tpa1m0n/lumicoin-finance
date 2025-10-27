"use strict";
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunkfrontend"] = self["webpackChunkfrontend"] || []).push([["src_components_logout_js"],{

/***/ "./src/components/logout.js":
/*!**********************************!*\
  !*** ./src/components/logout.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Logout: () => (/* binding */ Logout)\n/* harmony export */ });\n/* harmony import */ var _utils_auth_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/auth-utils */ \"./src/utils/auth-utils.js\");\n/* harmony import */ var _utils_http_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/http-utils */ \"./src/utils/http-utils.js\");\n\r\n\r\n\r\nclass Logout {\r\n    constructor(openNewRoute) {\r\n        this.openNewRoute = openNewRoute;\r\n\r\n        if (!_utils_auth_utils__WEBPACK_IMPORTED_MODULE_0__.AuthUtils.getAuthInfo(_utils_auth_utils__WEBPACK_IMPORTED_MODULE_0__.AuthUtils.accessTokenKey) || !_utils_auth_utils__WEBPACK_IMPORTED_MODULE_0__.AuthUtils.getAuthInfo(_utils_auth_utils__WEBPACK_IMPORTED_MODULE_0__.AuthUtils.refreshTokenKey)) {\r\n            return this.openNewRoute('/login');\r\n        }\r\n\r\n        this.logout().then();\r\n\r\n    }\r\n\r\n    async logout() {\r\n        await _utils_http_utils__WEBPACK_IMPORTED_MODULE_1__.HttpUtils.request('/logout', 'POST', 'false', {\r\n            refreshToken: _utils_auth_utils__WEBPACK_IMPORTED_MODULE_0__.AuthUtils.getAuthInfo(_utils_auth_utils__WEBPACK_IMPORTED_MODULE_0__.AuthUtils.refreshTokenKey)\r\n        });\r\n\r\n        _utils_auth_utils__WEBPACK_IMPORTED_MODULE_0__.AuthUtils.removeAuthInfo();\r\n        this.openNewRoute('/login');\r\n    }\r\n\r\n}\n\n//# sourceURL=webpack://frontend/./src/components/logout.js?\n}");

/***/ })

}]);