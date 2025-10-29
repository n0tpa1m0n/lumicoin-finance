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

        if (!this.pageTitleElement || !this.cardsElement) {
            return;
        }

        this.cardAddElement = document.createElement('div');
        this.cardAddElement.classList.add('col-xl-4', 'col-lg-4', 'col-md-6', 'col-sm-12', 'mb-4');
        this.cardAddElement.setAttribute('id', 'cardAdd');

        this.alertPopupElement = document.getElementById('alert-popup-block');
        this.buttonYesAlertPopupElement = document.getElementById('button-yes');
        this.buttonNoAlertPopupElement = document.getElementById('button-no');

        this.currentDeleteElement = null;

        this.showCategoriesExpense().then();
    }

    async showCategoriesExpense() {

        if (this.pageTitleElement) {
            this.pageTitleElement.innerText = this.pageTitle;
        }

        this.cardsElement.innerHTML = '';

        this.expenses = await this.getCategoriesExpense();

        if (this.expenses && this.expenses.length > 0) {
            this.expenses.forEach(element => {
                const colElement = document.createElement('div');
                colElement.classList.add('col-xl-4', 'col-lg-4', 'col-md-6', 'col-sm-12', 'mb-4');

                const card = CardElement.cardElementForIncomeOrExpense(element.title);
                const cardTitle = card.querySelector('.card-text');

                if (cardTitle) {
                    cardTitle.innerHTML = element.title;
                }

                const buttonDelete = card.querySelector('.delete-button');
                if (buttonDelete) {
                    buttonDelete.addEventListener('click', (event) => {
                        this.showAlertPopup(element);
                    });
                }

                const buttonEdit = card.querySelector('.edit-button');
                if (buttonEdit) {
                    buttonEdit.addEventListener('click', (event) => {
                        this.editExpense(element);
                    });
                }

                colElement.appendChild(card);
                this.cardsElement.appendChild(colElement);
            });
        }

        this.addCreateCard();
    }

    addCreateCard() {
        if (this.cardAddElement && this.cardsElement) {
            this.cardAddElement.innerHTML = '<div class="card d-flex justify-content-center align-items-center p-0">'
                + '<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">'
                + ' <path d="M14.5469 6.08984V9.05664H0.902344V6.08984H14.5469ZM9.32422 0.511719V15.0039H6.13867V0.511719H9.32422Z" fill="#CED4DA"/>'
                + ' </svg>'
                + ' </div>';
            this.cardsElement.appendChild(this.cardAddElement);

            const cardAdd = document.getElementById('cardAdd');
            if (cardAdd) {
                cardAdd.addEventListener('click', () => {
                    this.goCreateCategoryExpense();
                });
            }
        }
    }

    async getCategoriesExpense() {
        const result = await HttpUtils.request(this.url);

        if (result.error) {
            return [];
        }

        return result.response;
    }

    showAlertPopup(element) {
        if (!this.alertPopupElement || !this.buttonYesAlertPopupElement || !this.buttonNoAlertPopupElement) {
            return;
        }

        this.currentDeleteElement = element;
        this.alertPopupElement.style.display = 'flex';

        const yesHandler = () => {
            this.alertPopupElement.style.display = 'none';
            if (this.currentDeleteElement) {
                this.deleteCategoryExpense(this.currentDeleteElement);
            }
            this.buttonYesAlertPopupElement.removeEventListener('click', yesHandler);
            this.buttonNoAlertPopupElement.removeEventListener('click', noHandler);
        };

        const noHandler = () => {
            this.alertPopupElement.style.display = 'none';
            this.currentDeleteElement = null;
            this.buttonYesAlertPopupElement.removeEventListener('click', yesHandler);
            this.buttonNoAlertPopupElement.removeEventListener('click', noHandler);
        };

        this.buttonYesAlertPopupElement.onclick = yesHandler;
        this.buttonNoAlertPopupElement.onclick = noHandler;
    }

    async deleteCategoryExpense(element) {
        const result = await HttpUtils.request((this.url + '/' + element.id), 'DELETE');
        if (!result.error) {
            this.openNewRoute('/costs');
        } else {
            alert('Ошибка при удалении категории: ' + result.message);
        }
    }

    editExpense(element) {
        if (LocalStorageUtil.getCategory()) {
            LocalStorageUtil.removeCategory();
        }
        LocalStorageUtil.setCategory(element);
        this.openNewRoute(`/categories?type=edit&category=expense&id=${element.id}`);
    }

    goCreateCategoryExpense() {
        this.openNewRoute('/categories?type=create&category=expense');
    }
}