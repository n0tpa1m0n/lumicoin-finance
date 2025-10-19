import { Chart, registerables } from "chart.js";

export class Dashboard {
    constructor() {
        console.log("Dashboard init");
        this.COLORS = ["#FF0000", "#FFA500", "#FFFF00", "#00C49F", "#0088FE"];

        this.renderCharts();
    }

    renderCharts() {
        const incomeData = {
            labels: ["Red", "Orange", "Yellow", "Green", "Blue"],
            datasets: [{
                data: [400, 600, 300, 200, 150],
                backgroundColor: this.COLORS,
                hoverOffset: 4
            }]
        };

        const expenseData = {
            labels: ["Red", "Orange", "Yellow", "Green", "Blue"],
            datasets: [{
                data: [100, 200, 400, 500, 300],
                backgroundColor: this.COLORS,
                hoverOffset: 4
            }]
        };

        const incomeCanvas = document.getElementById("incomeChart");
        const expenseCanvas = document.getElementById("expenseChart");

        if (!incomeCanvas || !expenseCanvas) {
            console.warn("Canvas для графиков ещё не найден!");
            return;
        }

        Chart.register(...registerables);

        new Chart(incomeCanvas, {
            type: "pie",
            data: incomeData,
            options: {}
        });

        new Chart(expenseCanvas, {
            type: "pie",
            data: expenseData,
            options: {}
        });
    }
}
