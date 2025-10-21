import { Transactions } from "../components/transactions";
import { Dashboard } from "../components/dashboard";
import { Calendar } from "vanilla-calendar-pro";

export class CalendarUtils {
    constructor() {
        this.buttonInterval = document.getElementById('button-interval');
        this.calendar = this.init();
    }

    init() {
        let calendar;
        if (this.buttonInterval) {
            calendar = new Calendar(this.buttonInterval, {
                inputMode: true,
                selectionDatesMode: 'multiple-ranged',
                locale: 'ru-RU',
                onClickDate: (self) => {
                    const arrDate = self.context.selectedDates;
                    if (arrDate && arrDate.length === 2) {
                        if (arrDate[0] > arrDate[1]) {
                            [arrDate[0], arrDate[1]] = [arrDate[1], arrDate[0]];
                        }
                        document.getElementById('link-interval-start').innerText = arrDate[0];
                        document.getElementById('link-interval-end').innerText = arrDate[1];

                        const page = window.location.href.split('/').pop();
                        if (page === 'transactions') {
                            Transactions.updateTable('interval', arrDate[0], arrDate[1]).then();
                        } else {
                            Dashboard.updateDiag('interval', arrDate[0], arrDate[1]).then();
                        }
                    }
                },
            });

            calendar.init();
        }

        return calendar;
    }
}