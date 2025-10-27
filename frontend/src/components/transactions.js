import {CardElement} from "../components/card-element"
import {LocalStorageUtils} from "../utils/localStorage-utils";
import {HttpUtils} from "../utils/http-utils";
import {Layout} from "../components/layout";

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
        this.buttonIntervalElement = document.getElementById('button-interval');

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
                this.setActiveButton(this.buttonTodayElement);
                this.getOperations('today').then();
            });
        }
        if (this.buttonWeekElement) {
            this.buttonWeekElement.addEventListener('click', () => {
                this.setActiveButton(this.buttonWeekElement);
                this.getOperations('week').then();
            });
        }
        if (this.buttonMonthElement) {
            this.buttonMonthElement.addEventListener('click', () => {
                this.setActiveButton(this.buttonMonthElement);
                this.getOperations('month').then();
            });
        }
        if (this.buttonYearElement) {
            this.buttonYearElement.addEventListener('click', () => {
                this.setActiveButton(this.buttonYearElement);
                this.getOperations('year').then();
            });
        }
        if (this.buttonAllElement) {
            this.buttonAllElement.addEventListener('click', () => {
                this.setActiveButton(this.buttonAllElement);
                this.getOperations('all').then();
            });
        }
        if (this.buttonIntervalElement) {
            this.buttonIntervalElement.addEventListener('click', () => {
                this.setActiveButton(this.buttonIntervalElement);
                this.selectDateRange();
            });
        }

        this.setActiveButton(this.buttonAllElement);
        this.getOperations('all').then();
    }

    setActiveButton(activeButton) {
        const buttons = document.querySelectorAll('.btn-outline-secondary');
        buttons.forEach(btn => {
            btn.classList.remove('active');
        });
        if (activeButton) {
            activeButton.classList.add('active');
        }
    }

    selectDateRange() {
        const startDate = prompt("Выберите дату начала (YYYY-MM-DD):");
        if (!startDate) {
            return;
        }

        const endDate = prompt("Выберите дату окончания (YYYY-MM-DD):");
        if (!endDate) {
            return;
        }

        if (!this.isValidDate(startDate) || !this.isValidDate(endDate)) {
            alert('Неверный формат даты! Используйте YYYY-MM-DD');
            return;
        }

        if (startDate > endDate) {
            alert('Дата начала не может быть позже даты окончания!');
            return;
        }

        const startDateLink = document.getElementById('link-interval-start');
        const endDateLink = document.getElementById('link-interval-end');

        if (startDateLink) startDateLink.textContent = startDate;
        if (endDateLink) endDateLink.textContent = endDate;

        this.getOperations('interval', startDate, endDate);
        this.hideCalendar();
    }

    hideCalendar() {
        const calendarElements = document.querySelectorAll('.vanilla-calendar');
        calendarElements.forEach(element => {
            element.style.display = 'none';
        });
    }

    isValidDate(dateString) {
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        if (!regex.test(dateString)) return false;

        const date = new Date(dateString);
        return date instanceof Date && !isNaN(date);
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

        if (period && period !== 'interval') {
            queryParams.append('period', period);
        }

        if (dateFrom) {
            queryParams.append('dateFrom', dateFrom);
        }
        if (dateTo) {
            queryParams.append('dateTo', dateTo);
        }

        const queryString = queryParams.toString();
        const url = queryString ? this.url + '?' + queryString : this.url;

        const result = await HttpUtils.request(url);

        if (result.error) {
            alert('Ошибка при загрузке операций: ' + result.message);
            return [];
        }

        this.showIncomeExpense(result.response);
    }
}