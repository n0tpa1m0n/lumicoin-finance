import {CardElement} from "../components/card-element"
import {HttpUtils} from "../utils/http-utils";
import {LocalStorageUtils as LocalStorageUtil} from "../utils/localStorage-utils";

export class Costs {
    url = '/categories/expense';
    pageTitle = "Расходы";

    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.pageTitleElement = document.getElementById('page-title');
        this.cardsElement = document.getElementById('cards');
        this.cardAddElement = document.createElement('div');
        this.cardAddElement.classList.add('col');
        this.cardAddElement.setAttribute('id', 'cardAdd');
        this.alertPopupElement = document.getElementById('alert-popup-block');
        this.buttonYesAlertPopupElement = document.getElementById('button-yes');
        this.buttonNoAlertPopupElement = document.getElementById('button-no');

        this.showCategoriesExpense().then();
    }

    async showCategoriesExpense() {
        this.pageTitleElement.innerText = this.pageTitle;
        this.expenses = await this.getCategoriesExpense();
        this.expenses.forEach(element => {
            const card = CardElement.cardElementForIncomeOrExpense(element.title);

            const cardTitle = card.querySelector('.card-title');
            cardTitle.innerHTML = element.title;

            const buttonDelete = card.querySelector('.delete-button');
            buttonDelete.addEventListener('click', (event) => {
                this.showAlertPopup(element);
            });
            const buttonEdit = card.querySelector('.edit-button');
            buttonEdit.addEventListener('click', (event) => {
                this.editExpense(element);
            })
            this.cardsElement.appendChild(card);
        });
        this.cardAddElement.innerHTML = '<div class="card d-flex justify-content-center align-items-center p-0">'
            + '<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">'
            + ' <path d="M14.5469 6.08984V9.05664H0.902344V6.08984H14.5469ZM9.32422 0.511719V15.0039H6.13867V0.511719H9.32422Z" fill="#CED4DA"/>'
            + ' </svg>'
            + ' </div>';
        this.cardsElement.appendChild(this.cardAddElement);

        this.cardAdd = document.getElementById('cardAdd');
        this.cardAdd.addEventListener('click', () => {
            this.goCreateCategoryExpense();
        })
    }

    async getCategoriesExpense() {
        const result = await HttpUtils.request(this.url);
        console.log(result);
        if (result.error) {
            console.log(result.message)
            return [];
        }
        return result.response;
    }

    showAlertPopup(element) {
        this.alertPopupElement.style.display = 'block';
        this.buttonYesAlertPopupElement.addEventListener('click', (event) => {
            this.alertPopupElement.style.display = 'none';
            this.deleteCategoryExpense(element);
        });
        this.buttonNoAlertPopupElement.addEventListener('click', (event) => {
            this.alertPopupElement.style.display = 'none';
        });
    }

    async deleteCategoryExpense(element) {
        await HttpUtils.request((this.url + '/' + element.id), 'DELETE');
        this.openNewRoute('/costs');
    }

    editExpense(element) {
        if (LocalStorageUtil.getCategory()) {
            LocalStorageUtil.removeCategory()
        }
        LocalStorageUtil.setCategory(element);
        this.openNewRoute('/edit-costs');
    }

    goCreateCategoryExpense() {
        this.openNewRoute('/create-costs');
    }
}