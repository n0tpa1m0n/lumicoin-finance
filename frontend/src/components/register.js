import {AuthUtils} from "../utils/auth-utils";
import {HttpUtils} from "../utils/http-utils";

export class Register {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return this.openNewRoute('/')
        }

        this.nameElement = document.getElementById('name'); // поле для имени
        this.lastNameElement = document.getElementById('last-name'); // поле для фамилии
        this.emailElement = document.getElementById('email');
        this.passwordElement = document.getElementById('password');
        this.passwordRepeatElement = document.getElementById('password-repeat');
        this.commonErrorElement = document.getElementById('common-error');

        document.getElementById('process-button').addEventListener('click', this.signUp.bind(this));
    }

    validateForm() {
        let isValid = true;

        if (this.nameElement.value.trim()) {
            this.nameElement.classList.remove('is-invalid');
        } else {
            this.nameElement.classList.add('is-invalid');
            isValid = false;
        }

        if (this.lastNameElement.value.trim()) {
            this.lastNameElement.classList.remove('is-invalid');
        } else {
            this.lastNameElement.classList.add('is-invalid');
            isValid = false;
        }

        if (this.emailElement.value && this.emailElement.value.match(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/)) {
            this.emailElement.classList.remove('is-invalid');
        } else {
            this.emailElement.classList.add('is-invalid');
            isValid = false;
        }

        if (this.passwordElement.value && this.passwordElement.value.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)) {
            this.passwordElement.classList.remove('is-invalid');
        } else {
            this.passwordElement.classList.add('is-invalid');
            isValid = false;
        }

        if (this.passwordRepeatElement.value && this.passwordElement.value === this.passwordRepeatElement.value) {
            this.passwordRepeatElement.classList.remove('is-invalid');
        } else {
            this.passwordRepeatElement.classList.add('is-invalid');
            isValid = false;
        }

        return isValid;
    }

    async signUp() {
        this.commonErrorElement.style.display = 'none';
        if (this.validateForm()) {

            const requestData = {
                name: this.nameElement.value.trim(),
                lastName: this.lastNameElement.value.trim(),
                email: this.emailElement.value.trim(),
                password: this.passwordElement.value,
                passwordRepeat: this.passwordRepeatElement.value,
            };


            const result = await HttpUtils.request('/signup', 'POST', false, requestData);



            if (result.response && result.response.validation) {
                console.log('❌ Ошибки валидации:', result.response.validation);
                result.response.validation.forEach(error => {
                    console.log('   - Поле:', error.field, 'Ошибка:', error.message);
                });
            }

            if (result.error || !result.response || (result.response && (!result.response.user || !result.response.user.id))) {
                console.log('❌ Ошибка регистрации:', result);
                this.commonErrorElement.style.display = 'block';
                return;
            }

            this.openNewRoute('/login');
        }
    }
}