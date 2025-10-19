import {AuthUtils} from "../utils/auth-utils";
import {HttpUtils} from "../utils/http-utils";

export class Login {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return this.openNewRoute('/')
        }
        this.emailElement = document.getElementById('email');
        this.passwordElement = document.getElementById('password');
        this.rememberMeElement = document.getElementById('remember-me');
        this.commonErrorElement = document.getElementById('common-error');
        this.processButton = document.getElementById('process-button');

        if (!this.emailElement || !this.passwordElement || !this.rememberMeElement ||
            !this.commonErrorElement || !this.processButton) {
            console.error('One or more login form elements not found');
            return;
        }

        this.processButton.addEventListener('click', this.login.bind(this));
    }

    validateForm() {
        let isValid = true;

        if (this.emailElement && this.emailElement.value) {
            this.emailElement.classList.remove('is-invalid');
        } else {
            this.emailElement?.classList.add('is-invalid');
            isValid = false;
        }

        if (this.passwordElement && this.passwordElement.value) {
            this.passwordElement.classList.remove('is-invalid');
        } else {
            this.passwordElement?.classList.add('is-invalid');
            isValid = false;
        }

        return isValid;
    }

    async login() {

        if (this.commonErrorElement) {
            this.commonErrorElement.style.display = 'none';
        }

        if (this.validateForm()) {
            try {
                const result = await HttpUtils.request('/login', 'POST', false, { // исправлено 'false' на false
                    email: this.emailElement.value,
                    password: this.passwordElement.value,
                    rememberMe: this.rememberMeElement.checked
                });


                if (result.error || !result.response || !result.response.tokens?.accessToken || !result.response.tokens?.refreshToken
                    || !result.response.user?.name || !result.response.user?.lastName || !result.response.user?.id) {
                    if (this.commonErrorElement) {
                        this.commonErrorElement.style.display = 'block';
                    }
                    return;
                }

                AuthUtils.setAuthInfo(result.response.tokens.accessToken, result.response.tokens.refreshToken, {
                    id: result.response.user.id,
                    name: result.response.user.name,
                    lastName: result.response.user.lastName,
                });

                this.openNewRoute('/');
            } catch (error) {
                console.error('Ошибка входа:', error);
                if (this.commonErrorElement) {
                    this.commonErrorElement.style.display = 'block';
                }
            }
        }
    }
}