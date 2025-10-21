import {HttpUtils} from "../utils/http-utils";

export class CreateTransaction {
    urlCreate = '/operations';
    urlIncome = '/categories/income';
    urlExpense = '/categories/expense';

    pageTitle = "Создание дохода/расхода"

    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        this.pageTitleElement = document.getElementById('page-title');
        this.pageTitleElement.innerText = this.pageTitle;
        this.typeSelectElement = document.getElementById('type');
        this.categorySelectElement = document.getElementById('type-category');
        this.amountInputElement = document.getElementById('amount');
        this.dateInputElement = document.getElementById('date');
        this.commentInputElement = document.getElementById('comment');
        this.buttonCreateElement = document.getElementById('button-create');
        this.buttonCreateElement.addEventListener('click', this.setIncomeExpense.bind(this));

        this.typeSelectElement.addEventListener('change', () => {
            this.updateCategories();
        });

        this.selectIncomeElement = document.getElementById('select-inc');
        this.selectExpenseElement = document.getElementById('select-exp');
        this.typeOperation = sessionStorage.getItem('type');

        if (this.typeOperation) {
            this.typeSelectElement.value = this.typeOperation;
        }

        if (this.typeOperation === 'expense') {
            this.selectExpenseElement.selected = true;
            this.selectIncomeElement.selected = false;
        } else {
            this.selectIncomeElement.selected = true;
            this.selectExpenseElement.selected = false;
        }

        this.showCategory().then();
    }

    async showCategory() {

        this.categorySelectElement.innerHTML = '<option value="" selected disabled>Категория</option>';

        this.categoryList = await this.getCategory();

        if (this.categoryList && this.categoryList.length > 0) {
            this.categoryList.forEach(category => {
                const optionElement = document.createElement('option');
                optionElement.setAttribute('value', category.id);
                optionElement.innerText = category.title;
                this.categorySelectElement.appendChild(optionElement);
            });
        } else {
            const noCategoryOption = document.createElement('option');
            noCategoryOption.disabled = true;
            noCategoryOption.innerText = 'Нет доступных категорий';
            this.categorySelectElement.appendChild(noCategoryOption);
        }
    }

    async updateCategories() {
        this.typeOperation = this.typeSelectElement.value;
        await this.showCategory();
    }

    validateForm() {
        let isValid = true;

        if (this.typeSelectElement.value) {
            this.typeSelectElement.classList.remove('is-invalid');
        } else {
            this.typeSelectElement.classList.add('is-invalid');
            isValid = false;
        }

        if (this.categorySelectElement.value && this.categorySelectElement.value !== '') {
            this.categorySelectElement.classList.remove('is-invalid');
        } else {
            this.categorySelectElement.classList.add('is-invalid');
            isValid = false;
        }

        if (this.amountInputElement.value && this.amountInputElement.value > 0) {
            this.amountInputElement.classList.remove('is-invalid');
        } else {
            this.amountInputElement.classList.add('is-invalid');
            isValid = false;
        }

        if (this.dateInputElement.value) {
            this.dateInputElement.classList.remove('is-invalid');
        } else {
            this.dateInputElement.classList.add('is-invalid');
            isValid = false;
        }

        if (this.commentInputElement.value.trim()) {
            this.commentInputElement.classList.remove('is-invalid');
        } else {
            this.commentInputElement.classList.add('is-invalid');
            isValid = false;
        }

        return isValid;
    }

    async setIncomeExpense() {

        if (this.validateForm()) {
            const requestData = {
                type: this.typeSelectElement.value,
                amount: parseInt(this.amountInputElement.value),
                date: this.dateInputElement.value,
                comment: this.commentInputElement.value,
                category_id: parseInt(this.categorySelectElement.value) // ✅ ПРАВИЛЬНОЕ ПОЛЕ
            };

            this.buttonCreateElement.disabled = true;
            this.buttonCreateElement.textContent = 'Создание...';

            try {
                const result = await HttpUtils.request(this.urlCreate, 'POST', true, requestData);

                if (result.error || !result.response) {
                    const errorMessage = result.response?.message || result.message || 'Неизвестная ошибка';
                    alert('Ошибка при создании операции: ' + errorMessage);

                    const inputErrorElement = document.getElementById("input-name-category-error");
                    if (inputErrorElement) {
                        inputErrorElement.innerText = 'Ошибка: ' + errorMessage;
                        inputErrorElement.style.display = 'block';
                    }
                } else {
                    sessionStorage.removeItem('type');
                    this.openNewRoute('/transactions');
                }
            } catch (error) {
                alert('Ошибка сети при создании операции');
            } finally {
                this.buttonCreateElement.disabled = false;
                this.buttonCreateElement.textContent = 'Создать';
            }
        } else {
            console.log('Form validation failed');
        }
    }

    async getCategory() {
        let url = this.urlIncome;
        if (this.typeOperation === 'expense') {
            url = this.urlExpense;
        }

        const result = await HttpUtils.request(url);

        if (result.error) {
            return [];
        }

        return result.response;
    }
}