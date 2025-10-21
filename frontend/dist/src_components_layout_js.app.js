"use strict";
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunkfrontend"] = self["webpackChunkfrontend"] || []).push([["src_components_layout_js"],{

/***/ "./src/components/layout.js":
/*!**********************************!*\
  !*** ./src/components/layout.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Layout: () => (/* binding */ Layout)\n/* harmony export */ });\nclass Layout {\r\n    constructor() {\r\n        this.init();\r\n    }\r\n\r\n    init() {\r\n        this.setupActiveState();\r\n        this.setupDropdownBehavior();\r\n    }\r\n\r\n    setupActiveState() {\r\n        // Обновляем активное состояние при загрузке\r\n        this.updateActiveNavItem(window.location.pathname);\r\n\r\n        // Слушаем изменения роута\r\n        document.addEventListener('routeChanged', (e) => {\r\n            this.updateActiveNavItem(e.detail.route);\r\n        });\r\n    }\r\n\r\n    updateActiveNavItem(activeRoute) {\r\n        console.log('🔄 Updating active nav for:', activeRoute);\r\n\r\n        // Убираем активный класс у всех пунктов меню\r\n        document.querySelectorAll('.nav-item').forEach(item => {\r\n            item.classList.remove('active');\r\n        });\r\n\r\n        // Находим активную ссылку\r\n        let activeLink = document.querySelector(`a[href=\"${activeRoute}\"]`);\r\n\r\n        if (activeLink) {\r\n            console.log('✅ Activating link:', activeLink.getAttribute('href'));\r\n            activeLink.classList.add('active');\r\n\r\n            // Если это подпункт из выпадающего списка, открываем список\r\n            if (activeLink.classList.contains('sub-item')) {\r\n                const dropdownCheckbox = document.getElementById('categories-toggle');\r\n                if (dropdownCheckbox) {\r\n                    dropdownCheckbox.checked = true;\r\n                }\r\n            }\r\n        }\r\n    }\r\n\r\n    setupDropdownBehavior() {\r\n        // Закрываем выпадающий список при клике вне его\r\n        document.addEventListener('click', (e) => {\r\n            const dropdown = document.querySelector('.dropdown');\r\n            const checkbox = document.getElementById('categories-toggle');\r\n\r\n            if (dropdown && checkbox && !dropdown.contains(e.target)) {\r\n                checkbox.checked = false;\r\n            }\r\n        });\r\n\r\n        // Не закрываем при клике внутри списка\r\n        const dropdownList = document.querySelector('.dropdown-list');\r\n        if (dropdownList) {\r\n            dropdownList.addEventListener('click', (e) => {\r\n                e.stopPropagation();\r\n            });\r\n        }\r\n    }\r\n}\n\n//# sourceURL=webpack://frontend/./src/components/layout.js?\n}");

/***/ })

}]);