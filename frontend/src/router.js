import {Dashboard} from "./components/dashboard";
import {Login} from "./components/login";
import {Register} from "./components/register";
import {Logout} from "./components/logout";
import {Transactions} from "./components/transactions";
import {Costs} from "./components/costs";
import {Profit} from "./components/profit";
import {EditProfit} from "./components/edit-profit";
import {EditCosts} from "./components/edit-costs";
import {CreateCosts} from "./components/create-costs";
import {CreateTransaction} from "./components/create-transaction";
import {Layout} from "./components/layout";
import {CalendarUtils} from "./utils/calendar-utils";
import {CreateProfit} from "./components/create-profit";
import {EditTransactions} from "./components/edit-transactions";

export class Router {
    constructor() {
        this.titlePageElement = document.getElementById('title');
        this.contentPageElement = document.getElementById('content');
        this.adminLteStyleElement = document.getElementById('adminlte_style');
        this.layout = null;

        this.initEvents();
        this.routes = [
            {
                route: '/',
                title: 'Дашборд',
                filePathTemplate: '/templates/dashboard.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new Dashboard(this.openNewRoute.bind(this));
                    new Layout();
                    this.calendar = new CalendarUtils().calendar;
                    new Dashboard(this.calendar);

                },
                unload: () => {
                    if (this.calendar) {
                        this.calendar.destroy();
                    }
                },
            },
            {
                route: '/costs',
                title: 'Расходы',
                filePathTemplate: '/templates/costs.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new Layout();
                    new Costs(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/profit',
                title: 'Доходы',
                filePathTemplate: '/templates/profit.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new Layout();
                    new Profit(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/transactions',
                title: 'Доходы и расходы',
                filePathTemplate: '/templates/transactions.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new Transactions(this.openNewRoute.bind(this));
                    new Layout();
                    this.calendar = new CalendarUtils().calendar;
                    new Transactions(this.calendar);
                },
                unload: () => {
                    if (this.calendar) {
                        this.calendar.destroy();
                    }
                },
            },
            {
                route: '/create-transaction',
                title: 'Создать доход',
                filePathTemplate: '/templates/create-transaction.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new Layout();
                    new CreateTransaction(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/create-profit',
                title: 'Создать доход',
                filePathTemplate: '/templates/create-profit.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new Layout();
                    new CreateProfit(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/create-costs',
                title: 'Создать расход',
                filePathTemplate: '/templates/create-costs.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new Layout();
                    new CreateCosts(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/edit-profit',
                title: 'Редактировать доход',
                filePathTemplate: '/templates/edit-profit.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new Layout();
                    new EditProfit(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/edit-costs',
                title: 'Редактировать расход',
                filePathTemplate: '/templates/edit-costs.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new Layout();
                    new EditCosts(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/edit-transactions',
                title: 'Редактировать транзакцию',
                filePathTemplate: '/templates/edit-transactions.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new Layout();
                    new EditTransactions(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/404',
                title: 'Страница не найдена',
                useLayout: false,
                filePathTemplate: '/templates/404.html',
            },
            {
                route: '/login',
                title: 'Авторизация',
                filePathTemplate: '/templates/login.html',
                load: () => {
                    new Login(this.openNewRoute.bind(this));
                },
                unload:()=>{
                    document.body.style.height = 'auto';
                },
                styles: ['icheck-bootstrap.min.css']
            },
            {
                route: '/register',
                title: 'Регистрация',
                filePathTemplate: '/templates/register.html',
                load: () => {
                    new Register(this.openNewRoute.bind(this));
                },
                unload:()=>{
                    document.body.style.height = 'auto';
                },
                styles: ['icheck-bootstrap.min.css']
            },
            {
                route: '/logout',
                load: () => {
                    new Logout(this.openNewRoute.bind(this));
                },
            },
        ]
    }

    initEvents() {
        window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this));
        window.addEventListener('popstate', this.activateRoute.bind(this));
        document.addEventListener('click', this.clickHandler.bind(this))
    }

    async openNewRoute(url){
        const currentRoute = window.location.pathname;
        history.pushState({}, '', url);
        await this.activateRoute(null,currentRoute);
    }

    async clickHandler(e) {
        let element = null;
        if (e.target.nodeName === 'A') {
            element = e.target;
        } else if (e.target.parentNode.nodeName === 'A') {
            element = e.target.parentNode;
        }
        if (element) {
            e.preventDefault();
            const url = element.href.replace(window.location.origin, '');
            if (!url || url === '/#' || url.startsWith('javascript:void(0)')) {
                return;
            }

            const currentRoute = window.location.pathname;
            history.pushState({}, '', url);
            await this.activateRoute(null,currentRoute);
        }
    }

    async activateRoute(e,oldRoute = null) {
        if(oldRoute){
            const currentRoute = this.routes.find(item => item.route === oldRoute);
            if (currentRoute && currentRoute.styles && currentRoute.styles.length > 0) {
                currentRoute.styles.forEach(style => {
                    const styleElement = document.querySelector(`link[href='/css/${style}']`);
                    if (styleElement) {
                        styleElement.remove();
                    }
                });
            }
            if (currentRoute && currentRoute.unload && typeof currentRoute.unload === 'function') {
                currentRoute.unload();
            }
        }

        const urlRoute = window.location.pathname;
        const currentRoute = this.routes.find(item => item.route === urlRoute);

        if (currentRoute) {
            if (currentRoute.styles && currentRoute.styles.length > 0) {
                currentRoute.styles.forEach(style => {
                    const link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.href = '/css/' + style;
                    document.head.insertBefore(link, this.adminLteStyleElement)
                });
            }
            if (currentRoute.title) {
                this.titlePageElement.innerText = currentRoute.title + '| Lumincoin Finance';
            }
            if (currentRoute.filePathTemplate) {
                let contentBlock = this.contentPageElement;
                if (currentRoute.useLayout) {
                    this.contentPageElement.innerHTML = await fetch(currentRoute.useLayout).then(response => response.text());
                    contentBlock = document.getElementById('content-layout');
                    document.body.classList.add('sidebar-mini', 'layout-fixed');

                    setTimeout(() => {
                        this.initLayout();
                    }, 50);
                } else {
                    document.body.classList.remove('sidebar-mini', 'layout-fixed');
                }
                contentBlock.innerHTML = await fetch(currentRoute.filePathTemplate).then(response => response.text());
            }

            if (currentRoute.load && typeof currentRoute.load === 'function') {
                currentRoute.load();
            }


            this.updateActiveNavItem(urlRoute);

        } else {
            console.log('No route found');
            history.pushState({}, '', '/404');
            await this.activateRoute();
        }
    }

    async initLayout() {
        try {

            const { Layout } = await import('./components/layout');
            this.layout = new Layout();
        } catch (error) {
            console.error('Failed to load Layout:', error);
        }
    }

    updateActiveNavItem(activeRoute) {
        console.log('🔄 Updating active nav for:', activeRoute);


        const navItems = document.querySelectorAll('.nav-item');
        if (navItems.length === 0) {

            return;
        }

        navItems.forEach(item => {
            item.classList.remove('active');
        });


        let activeLink = document.querySelector(`a[href="${activeRoute}"]`);

        if (!activeLink) {

            if (activeRoute === '/') {
                activeLink = document.querySelector('a[href="/"]');
            }
        }

        if (activeLink) {
            activeLink.classList.add('active');

            if (activeLink.classList.contains('sub-item')) {
                const dropdownCheckbox = document.getElementById('categories-toggle');
                if (dropdownCheckbox) {
                    dropdownCheckbox.checked = true;
                }
            }
        } else {
            console.log('No matching link found for route:', activeRoute);
        }
    }
}