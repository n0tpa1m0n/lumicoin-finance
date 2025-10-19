import {Dashboard} from "./components/dashboard";
import {Login} from "./components/login";
import {Register} from "./components/register";
import {Logout} from "./components/logout";

export class Router {
    constructor() {
//чтобы много раз элемент по странице не искался, сохраняем элемент в памяти, в роутере в отдельную переменную
        this.titlePageElement = document.getElementById('title');
        this.contentPageElement = document.getElementById('content');
        this.adminLteStyleElement = document.getElementById('adminlte_style');


        this.initEvents();
        this.routes = [
            {
                route: '/',
                title: 'Дашборд',
                //кусочек контента соответствующий текущему роуту\
                filePathTemplate: '/templates/dashboard.html',
                useLayout: '/templates/layout.html',
                //запускаем создание экземпляра
                load: () => {
                    new Dashboard();
                }
            },
            {
                //функция не нужна для статического контента
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
//делаем так , чтобы при переходе на другие страницы не было перезагрузки и пересобирания
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
            if (currentRoute.styles && currentRoute.styles.length > 0) {
                currentRoute.styles.forEach(style => {
                    document.querySelector(`link[href='/css/${style}']`).remove();
                });
            }
            if (currentRoute.unload && typeof currentRoute.unload === 'function') {
                currentRoute.load();
            }
        }
        //какой сейчас открыт роут (для работы с url адресами window.location)
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
                    document.body.classList.add('sidebar-mini')
                    document.body.classList.add('layout-fixed')
                } else {
                    document.body.classList.remove('sidebar-mini')
                    document.body.classList.remove('layout-fixed')
                }
                contentBlock.innerHTML = await fetch(currentRoute.filePathTemplate).then(response => response.text());

            }

            if (currentRoute.load && typeof currentRoute.load === 'function') {
                currentRoute.load();
            }
        } else {
//после перевода на др страницу нельзя совершать никакх действий (можно юзать ретурн)
            console.log('No route found');
            history.pushState({}, '', '/404');
            await this.activateRoute();
            window.location = '/404';
        }
    }
}