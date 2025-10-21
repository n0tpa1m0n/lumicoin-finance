import { Chart, registerables } from 'chart.js';
import { HttpUtils } from "../utils/http-utils";
import { Layout } from "./layout";

Chart.register(...registerables);

export class Dashboard {
    url = '/operations';
    balanceUrl = '/balance';

    colors = [
        "#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#F0FF33",
        "#33FFF5", "#FF8C33", "#B833FF", "#581845", "#338CFF",
        "#FFC300", "#DAF7A6", "#C70039", "#900C3F", "#FFC0CB",
        "#A52A2A", "#D2691E", "#20B2AA", "#FF4500", "#2E8B57",
        "#6A5ACD", "#FFD700", "#ADFF2F", "#FF6347", "#00FA9A",
        "#7B68EE", "#DDA0DD", "#F08080", "#33FF8C",
    ];

    constructor() {
        this.chartIncome = null;
        this.chartExpenses = null;

        const canvasIncomeElement = document.getElementById('canvas-inc');
        const canvasExpensesElement = document.getElementById('canvas-exp');

        if (!canvasIncomeElement || !canvasExpensesElement) {
            return;
        }

        this.canvasIncomeElement = canvasIncomeElement;
        this.canvasExpensesElement = canvasExpensesElement;

        this.canvasIncome = canvasIncomeElement.getContext('2d');
        this.canvasExpenses = canvasExpensesElement.getContext('2d');

        this.initEventListeners();

        this.getOperations('all').then();
        this.updateBalance();
    }

    initEventListeners() {
        const todayBtn = document.getElementById('button-today');
        const weekBtn = document.getElementById('button-week');
        const monthBtn = document.getElementById('button-month');
        const yearBtn = document.getElementById('button-year');
        const allBtn = document.getElementById('button-all');
        const intervalBtn = document.getElementById('button-interval');
        const startDateLink = document.getElementById('startDateLink');
        const endDateLink = document.getElementById('endDateLink');

        if (todayBtn) {
            todayBtn.addEventListener('click', () => {
                this.setActiveButton(todayBtn);
                this.getOperations('today');
            });
        }

        if (weekBtn) {
            weekBtn.addEventListener('click', () => {
                this.setActiveButton(weekBtn);
                this.getOperations('week');
            });
        }

        if (monthBtn) {
            monthBtn.addEventListener('click', () => {
                this.setActiveButton(monthBtn);
                this.getOperations('month');
            });
        }

        if (yearBtn) {
            yearBtn.addEventListener('click', () => {
                this.setActiveButton(yearBtn);
                this.getOperations('year');
            });
        }

        if (allBtn) {
            allBtn.addEventListener('click', () => {
                this.setActiveButton(allBtn);
                this.getOperations('all');
            });
        }

        if (intervalBtn) {
            intervalBtn.addEventListener('click', () => {
                this.setActiveButton(intervalBtn);
                this.selectDateRange();
            });
        }

        if (startDateLink) {
            startDateLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.selectStartDate();
            });
        }

        if (endDateLink) {
            endDateLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.selectEndDate();
            });
        }

        this.setActiveButton(allBtn);
    }

    async updateBalance() {
        try {
            const result = await HttpUtils.request(this.balanceUrl);

            if (result.error) {
                return;
            }

            if (result.response && result.response.balance !== undefined) {
                const balanceElement = document.getElementById('balance-amount');
                if (balanceElement) {
                    balanceElement.textContent = result.response.balance + '$';
                    console.log('✅ Balance updated:', result.response.balance + '$');
                } else {
                    console.log('Balance element not found');
                }
            }
        } catch (error) {
            console.error('Balance update error:', error);
        }
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

        document.getElementById('startDateLink').textContent = startDate;
        document.getElementById('endDateLink').textContent = endDate;

        this.startDate = startDate;
        this.endDate = endDate;

        this.getOperations('interval', this.startDate, this.endDate);
    }

    selectStartDate() {
        const selectedDate = prompt("Выберите дату начала (YYYY-MM-DD):");
        if (selectedDate) {
            document.getElementById('startDateLink').textContent = selectedDate;
            this.startDate = selectedDate;
        }
    }

    selectEndDate() {
        const selectedDate = prompt("Выберите дату окончания (YYYY-MM-DD):");
        if (selectedDate) {
            document.getElementById('endDateLink').textContent = selectedDate;
            this.endDate = selectedDate;
        }
    }

    createData(operations = null) {
        if (!operations || operations.length === 0) {
            this.showEmptyCharts();
            return;
        }

        const expenses = operations.filter(item => item.type === 'expense');
        const incomes = operations.filter(item => item.type === 'income');

        const aggregatedExpenses = this.aggregateByCategory(expenses);
        const aggregatedIncomes = this.aggregateByCategory(incomes);


        this.updateCharts(aggregatedIncomes, aggregatedExpenses);
    }

    showEmptyCharts() {
        this.destroyCharts();

        const emptyData = {
            labels: ['Нет данных'],
            datasets: [{
                data: [1],
                backgroundColor: ['#e9ecef'],
                borderColor: ['#dee2e6'],
                borderWidth: 1
            }]
        };

        const emptyConfig = this.getConfig(emptyData, 'Нет данных');
        emptyConfig.options.plugins.tooltip = {
            callbacks: {
                label: function(context) {
                    return 'Нет данных для отображения';
                }
            }
        };

        if (this.isCanvasAvailable(this.canvasIncomeElement)) {
            this.chartIncome = new Chart(this.canvasIncome, emptyConfig);
        }

        if (this.isCanvasAvailable(this.canvasExpensesElement)) {
            this.chartExpenses = new Chart(this.canvasExpenses, emptyConfig);
        }

    }

    isCanvasAvailable(canvasElement) {
        if (!canvasElement) return false;

        const existingChart = Chart.getChart(canvasElement);
        if (existingChart) {
            existingChart.destroy();
        }

        return true;
    }

    destroyCharts() {
        if (this.canvasIncomeElement) {
            const existingIncomeChart = Chart.getChart(this.canvasIncomeElement);
            if (existingIncomeChart) {
                existingIncomeChart.destroy();
            }
        }

        if (this.canvasExpensesElement) {
            const existingExpenseChart = Chart.getChart(this.canvasExpensesElement);
            if (existingExpenseChart) {
                existingExpenseChart.destroy();
            }
        }

        if (this.chartIncome) {
            this.chartIncome.destroy();
            this.chartIncome = null;
        }

        if (this.chartExpenses) {
            this.chartExpenses.destroy();
            this.chartExpenses = null;
        }
    }

    aggregateByCategory(items) {
        if (!items || items.length === 0) {
            return {};
        }

        return items.reduce((accumulator, current) => {
            const category = current.category;
            const amount = current.amount;

            if (!accumulator[category]) {
                accumulator[category] = { category: category, total: 0 };
            }

            accumulator[category].total += amount;
            return accumulator;
        }, {});
    }

    updateCharts(aggregatedIncomes, aggregatedExpenses) {
        this.destroyCharts();

        const incomeLabels = Object.keys(aggregatedIncomes);
        const expenseLabels = Object.keys(aggregatedExpenses);

        const incomeData = {
            labels: incomeLabels,
            datasets: [{
                data: Object.values(aggregatedIncomes).map(item => item.total),
                backgroundColor: this.colors.slice(0, incomeLabels.length),
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        };

        const expenseData = {
            labels: expenseLabels,
            datasets: [{
                data: Object.values(aggregatedExpenses).map(item => item.total),
                backgroundColor: this.colors.slice(0, expenseLabels.length),
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        };

        if (incomeLabels.length > 0 && this.isCanvasAvailable(this.canvasIncomeElement)) {
            this.chartIncome = new Chart(this.canvasIncome, this.getConfig(incomeData, 'Доходы'));
        } else if (this.isCanvasAvailable(this.canvasIncomeElement)) {
            this.showEmptyChart(this.canvasIncome, 'Доходы');
        }

        if (expenseLabels.length > 0 && this.isCanvasAvailable(this.canvasExpensesElement)) {
            this.chartExpenses = new Chart(this.canvasExpenses, this.getConfig(expenseData, 'Расходы'));
        } else if (this.isCanvasAvailable(this.canvasExpensesElement)) {
            this.showEmptyChart(this.canvasExpenses, 'Расходы');
        }

    }

    showEmptyChart(canvasContext, title) {
        const emptyData = {
            labels: ['Нет данных'],
            datasets: [{
                data: [1],
                backgroundColor: ['#e9ecef']
            }]
        };

        const config = this.getConfig(emptyData, title);
        config.options.plugins.tooltip = {
            callbacks: {
                label: function(context) {
                    return `Нет данных по ${title.toLowerCase()}`;
                }
            }
        };

        return new Chart(canvasContext, config);
    }

    async getOperations(period = 'all', dateFrom = null, dateTo = null) {

        const queryParams = new URLSearchParams();
        if (period && period !== 'interval') queryParams.append('period', period);
        if (dateFrom) queryParams.append('dateFrom', dateFrom);
        if (dateTo) queryParams.append('dateTo', dateTo);

        const queryString = queryParams.toString();
        const url = queryString ? this.url + '?' + queryString : this.url;

        const result = await HttpUtils.request(url);

        if (result.error) {
            this.showEmptyCharts();
            return [];
        }

        this.createData(result.response);

        this.updateBalance();

        return result.response;
    }

    getConfig(data, title = '') {
        return {
            type: 'pie',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            padding: 15,
                            usePointStyle: true,
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                                return `${label}: ${value}$ (${percentage}%)`;
                            }
                        }
                    }
                }
            },
        };
    }

    static async updateDiag(period = '', dateFrom = null, dateTo = null) {
        const dashboardInstance = new Dashboard();
        await dashboardInstance.getOperations(period, dateFrom, dateTo);
    }

    destroy() {
        this.destroyCharts();
    }
}