import {LocalStorageUtils} from "../utils/localStorage-utils";
import {HttpUtils} from "../utils/http-utils";

export class EditTransactions {
    urlEdit = '/operations';
    urlIncome = '/categories/income';
    urlExpense = '/categories/expense';

    pageTitle = "Редактирование дохода/расхода"
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.editOperation = LocalStorageUtils.getOperation();
        console.log(this.editOperation);
        this.pageTitleElement = document.getElementById('page-title');
        this.pageTitleElement.innerText = this.pageTitle;
        this.typeSelectElement = document.getElementById('type');
        this.typeSelectElement.value = this.editOperation.type;
        this.typeSelectElement.addEventListener('change', (event) => {
            this.typeOperation = event.target.value;
            this.getCategory().then();
        });
        this.categorySelectElement = document.getElementById('type-category');
        this.amountInputElement = document.getElementById('amount');
        this.dateInputElement = document.getElementById('date');
        this.commentInputElement = document.getElementById('comment');
        this.buttonCreateElement = document.getElementById('button-create');
        this.buttonCreateElement.innerText = 'Сохранить';
        this.selectCategoryTitle = document.getElementById('title-category');
        this.selectCategoryTitle.removeAttribute('selected');
        this.typeOperation = this.editOperation.type;
        this.buttonCreateElement.addEventListener('click', this.editIncomeExpense.bind(this));
        this.selectIncomeElement = document.getElementById('select-inc');
        this.selectExpenseElement = document.getElementById('select-exp');
        this.typeSelectElement.addEventListener('change', (e) => {
            console.log(e.target.value);
            if (this.typeOperation === 'income') {
                this.selectExpenseElement.removeAttribute('selected');
                this.selectIncomeElement.setAttribute('selected', 'selected');
            } else {
                this.selectIncomeElement.removeAttribute('selected');
                this.selectExpenseElement.setAttribute('selected', 'selected');
            }


        })

        this.getCategory().then();

    }

    showCategory(categories) {
        this.categorySelectElement.innerHTML = '';
        if (categories && this.editOperation) {
            categories.forEach(category => {
                const optionElement = document.createElement('option');
                if (category.title === this.editOperation.category) {
                    optionElement.setAttribute('selected', 'selected');
                }
                optionElement.setAttribute('value', category.id);
                optionElement.innerText = category.title;

                this.categorySelectElement.appendChild(optionElement);
            })
            this.amountInputElement.value = this.editOperation.amount;
            this.dateInputElement.value = this.editOperation.date;
            this.commentInputElement.value = this.editOperation.comment;
        }
    }

    async editIncomeExpense() {
        if (this.validateForm()) {
            const result = await HttpUtils.request(this.urlEdit + '/' + this.editOperation.id, 'PUT', true, {
                type: this.typeSelectElement.value,
                amount: parseInt(this.amountInputElement.value),
                date: this.dateInputElement.value,
                comment: this.commentInputElement.value,
                category_id: parseInt(this.categorySelectElement.value),
            })
            if (result) {
                this.openNewRoute('/transactions');
            }

        }
    }

    validateForm() {
        let isValid = true;
        if (this.categorySelectElement.value.trim() !== 'Категория') {
            this.categorySelectElement.classList.remove('is-invalid');
        } else {
            this.categorySelectElement.classList.add('is-invalid');
            isValid = false;
        }
        if (this.amountInputElement.value.trim()) {
            this.amountInputElement.classList.remove('is-invalid');
        } else {
            this.amountInputElement.classList.add('is-invalid');
            isValid = false;
        }
        if (this.dateInputElement.value.trim()) {
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

    async getCategory() {
        let url = this.urlExpense;
        if (this.typeOperation === 'income') {
            url = this.urlIncome;
        }
        const result = await HttpUtils.request(url);

        if (result.error) {
            console.log(result.message)
            return [];
        }

        this.showCategory(result.response);
    }

}