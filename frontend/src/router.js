import {Layout} from "./components/layout";
import {CalendarUtils} from "./utils/calendar-utils";

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
                requiresAuth:true,
                load: async () => {
                    new Layout();
                    const { Dashboard } = await import('./components/dashboard');
                    new Dashboard(this.openNewRoute.bind(this));
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
                requiresAuth:true,
                load: async () => {
                    new Layout();
                    const { Costs } = await import('./components/costs');
                    new Costs(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/profit',
                title: 'Доходы',
                filePathTemplate: '/templates/profit.html',
                useLayout: '/templates/layout.html',
                requiresAuth:true,
                load: async () => {
                    new Layout();
                    const { Profit } = await import('./components/profit');
                    new Profit(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/transactions',
                title: 'Доходы и расходы',
                filePathTemplate: '/templates/transactions.html',
                useLayout: '/templates/layout.html',
                requiresAuth:true,
                load: async () => {
                    const { Transactions } = await import('./components/transactions');
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
                route: '/transactions/create-transaction',
                title: 'Создать транзакцию',
                filePathTemplate: '/templates/create-transaction.html',
                useLayout: '/templates/layout.html',
                requiresAuth:true,
                load: async () => {
                    new Layout();
                    const { CreateTransaction } = await import('./components/create-transaction');
                    new CreateTransaction(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/transactions/edit-transactions',
                title: 'Редактировать транзакцию',
                filePathTemplate: '/templates/edit-transactions.html',
                useLayout: '/templates/layout.html',
                requiresAuth:true,
                load: async () => {
                    new Layout();
                    const { EditTransactions } = await import('./components/edit-transactions');
                    new EditTransactions(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/profit/create-profit',
                title: 'Создать доход',
                filePathTemplate: '/templates/create-profit.html',
                useLayout: '/templates/layout.html',
                requiresAuth:true,
                load: async () => {
                    new Layout();
                    const { CreateProfit } = await import('./components/create-profit');
                    new CreateProfit(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/profit/edit-profit',
                title: 'Редактировать доход',
                filePathTemplate: '/templates/edit-profit.html',
                useLayout: '/templates/layout.html',
                requiresAuth:true,
                load: async () => {
                    new Layout();
                    const { EditProfit } = await import('./components/edit-profit');
                    new EditProfit(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/costs/create-costs',
                title: 'Создать расход',
                filePathTemplate: '/templates/create-costs.html',
                useLayout: '/templates/layout.html',
                requiresAuth:true,
                load: async () => {
                    new Layout();
                    const { CreateCosts } = await import('./components/create-costs');
                    new CreateCosts(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/costs/edit-costs',
                title: 'Редактировать расход',
                filePathTemplate: '/templates/edit-costs.html',
                useLayout: '/templates/layout.html',
                requiresAuth:true,
                load: async () => {
                    new Layout();
                    const { EditCosts } = await import('./components/edit-costs');
                    new EditCosts(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/404',
                title: 'Страница не найдена',
                useLayout: false,
                requiresAuth:false,
                filePathTemplate: '/templates/404.html',
            },
            {
                route: '/login',
                title: 'Авторизация',
                filePathTemplate: '/templates/login.html',
                requiresAuth:false,
                load: async () => {
                    const { Login } = await import('./components/login');
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
                requiresAuth:false,
                load: async () => {
                    const { Register } = await import('./components/register');
                    new Register(this.openNewRoute.bind(this));
                },
                unload:()=>{
                    document.body.style.height = 'auto';
                },
                styles: ['icheck-bootstrap.min.css']
            },
            {
                route: '/logout',
                requiresAuth:false,
                load: async () => {
                    const { Logout } = await import('./components/logout');
                    new Logout(this.openNewRoute.bind(this));
                },
            },
        ]

        this.routeAliases = {
            '/create-transaction': '/transactions/create-transaction',
            '/edit-transactions': '/transactions/edit-transactions',
            '/create-profit': '/profit/create-profit',
            '/edit-profit': '/profit/edit-profit',
            '/create-costs': '/costs/create-costs',
            '/edit-costs': '/costs/edit-costs'
        };
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

    clickHandler(e) {
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
            this.activateRoute(null,currentRoute);
        }
    }

    resolveRouteAlias(route) {
        return this.routeAliases[route] || route;
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

        let urlRoute = window.location.pathname;

        const resolvedRoute = this.resolveRouteAlias(urlRoute);
        if (resolvedRoute !== urlRoute) {
            history.replaceState({}, '', resolvedRoute);
            urlRoute = resolvedRoute;
        }

        const currentRoute = this.routes.find(item => item.route === urlRoute);

        if (currentRoute) {
            if (currentRoute.requiresAuth && !this.isAuthenticated()) {
                console.log('Требуется авторизация!');
                this.openNewRoute('/login');
                return;
            }
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
                await currentRoute.load();
            }

            this.updateActiveNavItem(urlRoute);

        } else {
            console.log('No route found for:', urlRoute);
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

    isAuthenticated(){
        const accessToken = localStorage.getItem('accessToken');
        return !!accessToken;
    }

    updateActiveNavItem(activeRoute) {
        const navItems = document.querySelectorAll('.nav-item');
        if (navItems.length === 0) {
            return;
        }

        navItems.forEach(item => {
            item.classList.remove('active');
        });

        let routeToActivate = activeRoute;
        if (activeRoute.includes('/create-') || activeRoute.includes('/edit-')) {
            const parts = activeRoute.split('/');
            routeToActivate = '/' + parts[1];
        }

        let activeLink = document.querySelector(`a[href="${routeToActivate}"]`);

        if (!activeLink && routeToActivate === '/') {
            activeLink = document.querySelector('a[href="/"]');
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
            console.log('No matching link found for route:', routeToActivate);
        }
    }
}