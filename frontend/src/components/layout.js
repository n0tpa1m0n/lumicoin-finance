import { AuthUtils } from "../utils/auth-utils";

export class Layout {
    constructor() {
        this.init();
        this.updateUserInfo();
    }

    init() {
        this.setupActiveState();
        this.setupDropdownBehavior();
        this.updateUserInfo();
    }

    updateUserInfo() {
        const userInfo = AuthUtils.getAuthInfo(AuthUtils.userInfoTokenKey);
        const userNameElement = document.querySelector('.user-name');

        if (userInfo && userNameElement) {
            try {
                const userData = JSON.parse(userInfo);
                if (userData.name && userData.lastName) {
                    userNameElement.textContent = `${userData.name} ${userData.lastName}`;
                }
            } catch (e) {
                console.error('Error parsing user info:', e);
            }
        }

        this.updateBalance();
    }

    async updateBalance() {
        try {
            const result = await fetch('http://localhost:3000/api/balance', {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                    'x-auth-token': AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)
                }
            });

            if (result.ok) {
                const data = await result.json();
                const balanceElement = document.getElementById('balance-amount');
                if (balanceElement && data.balance !== undefined) {
                    balanceElement.textContent = data.balance + '$';
                }
            }
        } catch (error) {
            console.error('Balance update error:', error);
        }
    }

    setupActiveState() {
        this.updateActiveNavItem(window.location.pathname);

        document.addEventListener('routeChanged', (e) => {
            this.updateActiveNavItem(e.detail.route);
        });
    }

    updateActiveNavItem(activeRoute) {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });

        let activeLink = document.querySelector(`a[href="${activeRoute}"]`);

        if (activeLink) {
            activeLink.classList.add('active');

            if (activeLink.classList.contains('sub-item')) {
                const dropdownCheckbox = document.getElementById('categories-toggle');
                if (dropdownCheckbox) {
                    dropdownCheckbox.checked = true;
                }
            }
        }
    }

    setupDropdownBehavior() {
        document.addEventListener('click', (e) => {
            const dropdown = document.querySelector('.dropdown');
            const checkbox = document.getElementById('categories-toggle');

            if (dropdown && checkbox && !dropdown.contains(e.target)) {
                checkbox.checked = false;
            }
        });

        const dropdownList = document.querySelector('.dropdown-list');
        if (dropdownList) {
            dropdownList.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }
    }

    static async setBalance() {
        const layout = new Layout();
        await layout.updateBalance();
    }
}