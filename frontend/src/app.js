import "./styles/styles.scss";
import {Router} from "./router";

class App{
    constructor() {
        this.init();
        new Router();
    }

    init() {
        this.setupDropdown();
        this.setupMobileMenu();
        this.setupActiveStates();
    }

    setupDropdown() {
        const dropdownHeader = document.querySelector('.dropdown-header');
        if (dropdownHeader) {
            dropdownHeader.addEventListener('click', () => {
                dropdownHeader.classList.toggle('open');
                const dropdownList = document.querySelector('.dropdown-list');
                dropdownList.classList.toggle('open');
            });
        }
    }

    setupActiveStates() {

        const navItems = document.querySelectorAll('.nav-item:not(.sub-item)');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                if (!item.classList.contains('dropdown-header')) {
                    // Убираем активный класс у всех
                    navItems.forEach(navItem => {
                        navItem.classList.remove('active');
                    });

                    item.classList.add('active');
                }
            });
        });
    }

    setupMobileMenu() {
        window.toggleMobileMenu = () => {
            const sidebar = document.querySelector('.sidebar');
            sidebar.classList.toggle('mobile-open');
        }

        this.addMobileMenuButton();
        window.addEventListener('resize', () => this.addMobileMenuButton());

        document.addEventListener('click', (event) => {
            if (window.innerWidth <= 768) {
                const sidebar = document.querySelector('.sidebar');
                const menuBtn = document.querySelector('.mobile-menu-btn');

                if (sidebar.classList.contains('mobile-open') &&
                    !sidebar.contains(event.target) &&
                    (!menuBtn || !menuBtn.contains(event.target))) {
                    sidebar.classList.remove('mobile-open');
                }
            }
        });
    }

    addMobileMenuButton() {
        if (window.innerWidth <= 768) {
            const existingBtn = document.querySelector('.mobile-menu-btn');
            if (!existingBtn) {
                const menuBtn = document.createElement('button');
                menuBtn.className = 'mobile-menu-btn';
                menuBtn.innerHTML = '☰';
                menuBtn.onclick = window.toggleMobileMenu;
                document.body.appendChild(menuBtn);
            }
        } else {
            const menuBtn = document.querySelector('.mobile-menu-btn');
            if (menuBtn) {
                menuBtn.remove();
            }
        }
    }
}


window.updateBalance = function(amount) {
    const balanceElement = document.getElementById('balance-amount');
    if (balanceElement) {
        balanceElement.textContent = amount + '$';
    }
}

new App();