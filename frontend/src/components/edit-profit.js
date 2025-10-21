import {HttpUtils} from "../utils/http-utils";
import {LocalStorageUtils} from "../utils/localStorage-utils";

export class EditProfit {
    url = '/categories/income';
    pageTitle = "Редактирование категории дохода";

    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.pageTitleElement = document.getElementById("page-title");
        this.pageTitleElement.innerText = this.pageTitle;
        this.inputNameCategory = document.getElementById("input-name-category");
        this.buttonSave = document.getElementById("button-save");

        this.initCategory().then();
        this.buttonSave.addEventListener('click', this.editCategory.bind(this));
    }

    async initCategory() {
        this.editCategoryIncome = await LocalStorageUtils.getCategory();
        this.inputNameCategory.placeholder = this.editCategoryIncome.title;
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

    async editCategory() {
        if (this.validateInput()) {
            const result = await HttpUtils.request(this.url + '/' + this.editCategoryIncome.id, 'PUT', true,
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