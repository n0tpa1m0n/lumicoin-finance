import {CardElement} from "../components/card-element"
import {LocalStorageUtils} from "../utils/localStorage-utils";
import {HttpUtils} from "../utils/http-utils";
import {Layout} from "../components/layout";
import {CalendarUtils} from "../utils/calendar-utils";
import {config} from "../utils/config";

export class Transactions {
    url = '/operations'

    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        this.tableTbodyElement = document.getElementById('table-tbody');
        this.buttonsBlockElement = document.querySelectorAll('.btn-outline-secondary');
        this.alertPopupElement = document.getElementById('alert-popup-block');
        this.buttonYesElement = document.getElementById('button-yes');
        this.buttonNoElement = document.getElementById('button-no');
        this.buttonCreateIncome = document.getElementById('create-income');
        this.buttonCreateExpense = document.getElementById('create-expense');

        if (!this.tableTbodyElement) {
            return;
        }

        this.buttonCreateIncome.addEventListener('click', () => {
            sessionStorage.setItem('type', 'income');
        });
        this.buttonCreateExpense.addEventListener('click', () => {
            sessionStorage.setItem('type', 'expense');
        });

        this.buttonsBlockElement.forEach(button => {
            button.addEventListener('click', () => {
                this.buttonsBlockElement.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            });
        });

        this.buttonTodayElement = document.getElementById('button-today');
        this.buttonWeekElement = document.getElementById('button-week');
        this.buttonMonthElement = document.getElementById('button-month');
        this.buttonYearElement = document.getElementById('button-year');
        this.buttonAllElement = document.getElementById('button-all');

        if (this.buttonTodayElement) {
            this.buttonTodayElement.addEventListener('click', () => {
                this.getOperations('').then();
            });
        }
        if (this.buttonWeekElement) {
            this.buttonWeekElement.addEventListener('click', () => {
                this.getOperations('week').then();
            });
        }
        if (this.buttonMonthElement) {
            this.buttonMonthElement.addEventListener('click', () => {
                this.getOperations('month').then();
            });
        }
        if (this.buttonYearElement) {
            this.buttonYearElement.addEventListener('click', () => {
                this.getOperations('year').then();
            });
        }
        if (this.buttonAllElement) {
            this.buttonAllElement.addEventListener('click', () => {
                this.getOperations('all').then();
            });
        }

        this.getOperations('all').then();

        setTimeout(() => {
            this.calendar = new CalendarUtils().calendar;
        }, 100);
    }

    showIncomeExpense(operations = null) {

        if (!this.tableTbodyElement) {
            return;
        }

        this.tableTbodyElement.innerHTML = '';

        if (operations && operations.length > 0) {

            operations.forEach(operation => {
                const row = CardElement.createTable(operation);

                const trashIcon = row.querySelector('.trash');
                if (trashIcon) {
                    trashIcon.addEventListener('click', (event) => {
                        event.stopPropagation();
                        this.showAlertPopup(operation);
                    });
                }

                const pencilIcon = row.querySelector('.pencil');
                if (pencilIcon) {
                    pencilIcon.addEventListener('click', (event) => {
                        event.stopPropagation();
                        this.editOperation(operation);
                    });
                }

                this.tableTbodyElement.appendChild(row);
            });
        } else {
            const emptyRow = document.createElement('tr');
            emptyRow.innerHTML = `
                <td colspan="7" class="text-center py-4 text-muted">
                    Нет операций для отображения
                </td>
            `;
            this.tableTbodyElement.appendChild(emptyRow);
        }
    }

    editOperation(operation) {
        if (LocalStorageUtils.getOperation()) {
            LocalStorageUtils.removeOperation();
        }
        LocalStorageUtils.setOperation(operation);
        this.openNewRoute('/edit-transaction');
    }

    async deleteOperation(operation) {
        const result = await HttpUtils.request(this.url + '/' + operation.id, 'DELETE');
        if (result.error) {
            alert('Ошибка при удалении операции: ' + result.message);
            return;
        }
        this.tableTbodyElement.innerHTML = '';
        await this.getOperations('all');

        if (typeof Layout !== 'undefined' && Layout.setBalance) {
            await Layout.setBalance();
        }
    }

    showAlertPopup(operation = null) {
        if (!this.alertPopupElement || !this.buttonYesElement || !this.buttonNoElement) {
            return;
        }

        this.alertPopupElement.style.display = 'flex';

        const yesHandler = () => {
            this.alertPopupElement.style.display = 'none';
            this.deleteOperation(operation);
            this.buttonYesElement.removeEventListener('click', yesHandler);
            this.buttonNoElement.removeEventListener('click', noHandler);
        };

        const noHandler = () => {
            this.alertPopupElement.style.display = 'none';
            this.buttonYesElement.removeEventListener('click', yesHandler);
            this.buttonNoElement.removeEventListener('click', noHandler);
        };

        this.buttonYesElement.onclick = yesHandler;
        this.buttonNoElement.onclick = noHandler;
    }

    async getOperations(period = '', dateFrom = null, dateTo = null) {

        const queryParams = new URLSearchParams();
        if (period) queryParams.append('period', period);
        if (dateFrom) queryParams.append('dateFrom', dateFrom);
        if (dateTo) queryParams.append('dateTo', dateTo);

        const queryString = queryParams.toString();
        const url = queryString ? this.url + '?' + queryString : this.url;


        const result = await HttpUtils.request(url);


        if (result.error) {
            alert('Ошибка при загрузке операций: ' + result.message);
            return [];
        }

        this.showIncomeExpense(result.response);
    }

    static async updateTable(period = '', dateFrom = null, dateTo = null) {
        console.log('Static updateTable called');
    }
}