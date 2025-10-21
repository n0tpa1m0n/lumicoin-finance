export class Layout {
    constructor() {
        this.init();
    }

    init() {
        this.setupActiveState();
        this.setupDropdownBehavior();
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
}