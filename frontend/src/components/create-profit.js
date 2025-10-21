import {HttpUtils} from "../utils/http-utils"
import {LocalStorageUtils} from "../utils/localStorage-utils";

export class CreateProfit {
    url = '/categories/income';
    pageTitle = "Создание категории дохода";

    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.pageTitleElement = document.getElementById("page-title");
        this.pageTitleElement.innerText = this.pageTitle;
        this.inputNameCategory = document.getElementById("input-name-category");
        this.buttonEditCategory = document.getElementById("button-edit-category");
        this.buttonSave = document.getElementById("button-save");

        this.buttonSave.addEventListener('click', this.createCategory.bind(this));
    }

    validateInput() {
        let isValid = true;

        if (this.inputNameCategory.value.trim()) {
            this.inputNameCategory.classList.remove('is-invalid');
        } else {
            this.inputNameCategory.classList.add('is-invalid');
            isValid = false;
        }
        return isValid;
    }

    async createCategory() {
        if (this.validateInput()) {
            const result = await HttpUtils.request(this.url, 'POST', true,
                {
                    title: this.inputNameCategory.value.trim()
                });
            if (result.error || !result.response) {
                const inputErrorElement = document.getElementById("input-name-category-error");
                inputErrorElement.innerText = 'Ошибка: ' + '(' + result.message + ')';
                this.inputNameCategory.classList.add('is-invalid');
            } else {
                this.inputNameCategory.classList.remove('is-invalid');
                this.openNewRoute('/profit');
            }
        }
    }
}