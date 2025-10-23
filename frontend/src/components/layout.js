import { AuthUtils } from "../utils/auth-utils";

export class Layout {
    constructor() {
        this.isUserMenuOpen = false;
        this.init();
        this.updateUserInfo();
    }

    init() {
        this.setupActiveState();
        this.setupDropdownBehavior();
        this.updateUserInfo();
        this.setupUserDropdown();
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

    setupUserDropdown() {
        const userDropdown = document.getElementById('userDropdown');
        const userDropdownMenu = document.getElementById('userDropdownMenu');

        if (userDropdown && userDropdownMenu) {
            userDropdown.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleUserMenu();
            });

            document.addEventListener('click', (e) => {
                if (!userDropdown.contains(e.target) && !userDropdownMenu.contains(e.target)) {
                    this.closeUserMenu();
                }
            });

            userDropdownMenu.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }
    }

    toggleUserMenu() {
        const userDropdownMenu = document.getElementById('userDropdownMenu');
        if (userDropdownMenu) {
            if (this.isUserMenuOpen) {
                this.closeUserMenu();
            } else {
                this.openUserMenu();
            }
        }
    }

    openUserMenu() {
        const userDropdownMenu = document.getElementById('userDropdownMenu');
        if (userDropdownMenu) {
            userDropdownMenu.style.display = 'block';
            this.isUserMenuOpen = true;
        }
    }

    closeUserMenu() {
        const userDropdownMenu = document.getElementById('userDropdownMenu');
        if (userDropdownMenu) {
            userDropdownMenu.style.display = 'none';
            this.isUserMenuOpen = false;
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
            this.updateNavItemIcons(item, false);
        });

        let activeLink = document.querySelector(`a[href="${activeRoute}"]`);

        if (activeLink) {
            activeLink.classList.add('active');
            this.updateNavItemIcons(activeLink, true);

            if (activeLink.classList.contains('sub-item')) {
                const dropdownCheckbox = document.getElementById('categories-toggle');
                if (dropdownCheckbox) {
                    dropdownCheckbox.checked = true;
                }
            }
        }
    }

    updateNavItemIcons(navItem, isActive) {
        const navItemIcon = navItem.querySelector('.nav-item-icon');
        if (navItemIcon) {
            const normalIcon = navItemIcon.querySelector('.normal-icon');
            const activeIcon = navItemIcon.querySelector('.active-icon');

            if (normalIcon && activeIcon) {
                if (isActive) {
                    normalIcon.classList.remove('d-block');
                    normalIcon.classList.add('d-none');
                    activeIcon.classList.remove('d-none');
                    activeIcon.classList.add('d-block');
                } else {
                    normalIcon.classList.remove('d-none');
                    normalIcon.classList.add('d-block');
                    activeIcon.classList.remove('d-block');
                    activeIcon.classList.add('d-none');
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