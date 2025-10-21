import {HttpUtils} from "../utils/http-utils";
import {LocalStorageUtils} from "../utils/localStorage-utils";

export class EditCosts {
    url = '/categories/expense';
    pageTitle = "Редактирование категории расхода";

    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.pageTitleElement = document.getElementById("page-title");

        if (!this.pageTitleElement) {
            console.error('Page title element not found!');
            return;
        }

        this.pageTitleElement.innerText = this.pageTitle;
        this.inputNameCategory = document.getElementById("input-name-category");
        this.buttonSave = document.getElementById("button-save");

        if (!this.inputNameCategory || !this.buttonSave) {
            console.error('Required elements not found!');
            return;
        }

        this.initCategory().then();
        this.buttonSave.addEventListener('click', this.editCategory.bind(this));
    }

    async initCategory() {
        this.editCategoryExpense = await LocalStorageUtils.getCategory();

        if (this.editCategoryExpense && this.editCategoryExpense.title) {
            this.inputNameCategory.placeholder = this.editCategoryExpense.title;
            this.inputNameCategory.value = this.editCategoryExpense.title;
        } else {
            console.error('No category data found in localStorage');
        }
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
            if (!this.editCategoryExpense || !this.editCategoryExpense.id) {
                console.error('No category ID found for editing');
                alert('Ошибка: не найден ID категории для редактирования');
                return;
            }

            this.buttonSave.disabled = true;
            this.buttonSave.textContent = 'Сохранение...';

            try {
                const result = await HttpUtils.request(this.url + '/' + this.editCategoryExpense.id, 'PUT', true, {
                    title: this.inputNameCategory.value.trim()
                });


                if (result.error || !result.response) {
                    const inputErrorElement = document.getElementById("input-name-category-error");
                    if (inputErrorElement) {
                        inputErrorElement.innerText = 'Ошибка: ' + (result.response?.message || result.message || 'Неизвестная ошибка');
                        inputErrorElement.style.display = 'block';
                    }
                    this.inputNameCategory.classList.add('is-invalid');
                } else {
                    this.inputNameCategory.classList.remove('is-invalid');

                    LocalStorageUtils.removeCategory();
                    this.openNewRoute('/costs');
                }
            } catch (error) {
                alert('Ошибка при обновлении категории');
            } finally {
                this.buttonSave.disabled = false;
                this.buttonSave.textContent = 'Сохранить';
            }
        } else {
            console.log('Form validation failed');
        }
    }
}