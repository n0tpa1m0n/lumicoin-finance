import {HttpUtils} from "../utils/http-utils"

export class CreateCategory {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.pageTitle = document.getElementById("page-title");
        this.sendButton = document.getElementById("send-button");
        this.canselButton = document.getElementById("cansel-button");
        this.categoryInput = document.getElementById('input-name-category');

        this.urlParams = new URLSearchParams(window.location.search);

        if (!this.pageTitle || !this.sendButton || !this.categoryInput) {
            return;
        }

        if (this.canselButton) {
            this.canselButton.addEventListener('click', this.cancel.bind(this));
        }

        this.sendButton.addEventListener('click', this.handleSubmit.bind(this));

        this.initPage().then();
    }

    async initPage(){
        const category = this.urlParams.get('category');
        const type = this.urlParams.get('type');
        const id = this.urlParams.get('id');

        console.log('Params:', { category, type, id });

        this.apiUrl = category === 'income' ? '/categories/income' : '/categories/expense';

        if (type === 'edit') {
            this.pageTitle.innerText = 'Редактирование категории';
            await this.loadCategoryData(id);
        } else if (type === 'create') {
            this.pageTitle.innerText = 'Создание категории';
        } else {
            throw new Error('Неизвестный тип операции');
        }
    }

    async loadCategoryData(id) {
        try {
            const result = await HttpUtils.request(`${this.apiUrl}/${id}`, 'GET');

            if (result.error) {
                alert('Ошибка загрузки категории: ' + result.message);
                return;
            }

            if (result.response) {
                this.categoryInput.value = result.response.title;
                this.currentCategoryId = id;
            }
        } catch (error) {
            console.error('Error loading category:', error);
            alert('Ошибка при загрузке данных категории');
        }
    }

    async handleSubmit() {
        if (this.validateInput()) {
            const type = this.urlParams.get('type');

            if (type === 'create') {
                await this.createCategory();
            } else if (type === 'edit') {
                await this.editCategory();
            }
        }
    }

    validateInput() {
        if (this.categoryInput.value.trim()) {
            this.categoryInput.classList.remove('is-invalid');
            return true;
        } else {
            this.categoryInput.classList.remove('is-invalid');
            this.categoryInput.classList.add('is-invalid');
            return false;
        }
    }

    async createCategory() {
        this.sendButton.disabled = true;
        this.sendButton.textContent = 'Создание...';

        try {
            const result = await HttpUtils.request(this.apiUrl, 'POST', true, {
                title: this.categoryInput.value.trim()
            });

            if (result.error || !result.response) {
                this.showError(result.message || 'Ошибка создания категории');
            } else {
                this.redirectBack();
            }
        } catch (error) {
            this.showError('Ошибка сети при создании категории');
        } finally {
            this.sendButton.disabled = false;
            this.sendButton.textContent = 'Сохранить';
        }
    }

    async editCategory() {
        this.sendButton.disabled = true;
        this.sendButton.textContent = 'Сохранение...';

        try {
            const result = await HttpUtils.request(`${this.apiUrl}/${this.currentCategoryId}`, 'PUT', true, {
                title: this.categoryInput.value.trim()
            });

            if (result.error || !result.response) {
                this.showError(result.message || 'Ошибка сохранения категории');
            } else {
                this.redirectBack();
            }
        } catch (error) {
            this.showError('Ошибка сети при сохранении категории');
        } finally {
            this.sendButton.disabled = false;
            this.sendButton.textContent = 'Сохранить';
        }
    }

    showError(message) {
        const errorElement = document.getElementById("input-name-category-error");
        if (errorElement) {
            errorElement.innerText = 'Ошибка: ' + message;
            errorElement.style.display = 'block';
        }
        this.categoryInput.classList.add('is-invalid');
    }

    redirectBack() {
        const category = this.urlParams.get('category');
        if (category === 'income') {
            this.openNewRoute('/profit');
        } else {
            this.openNewRoute('/costs');
        }
    }

    cancel() {
        this.redirectBack();
    }
}