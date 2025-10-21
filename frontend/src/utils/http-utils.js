import {config} from "./config";
import {AuthUtils} from "./auth-utils";

export class HttpUtils {
    static async request(url, method = 'GET', useAuth = true, body = null) {
        const result = {
            error: false,
            response: null
        }

        const accessToken = AuthUtils.getAuthInfo(AuthUtils.accessTokenKey);
        const refreshToken = AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey);

        const params = {
            method: method,
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
            },
        };

        if (useAuth) {
            if (accessToken) {
                params.headers['x-auth-token'] = accessToken;
            } else {
                console.log('No access token - request may fail');
            }
        }

        if (body) {
            params.body = JSON.stringify(body);
        }

        let response = null;
        try {
            response = await fetch(config.api + url, params);

            result.response = await response.json();

        } catch (e) {
            result.error = true;
            return result;
        }

        if (response.status < 200 || response.status >= 300) {
            result.error = true;

            if (useAuth && response.status === 401) {
                if (!accessToken) {
                    result.redirect = '/login';
                } else {
                    const updateTokenResult = await AuthUtils.updateRefreshToken();
                    if (updateTokenResult) {
                        return this.request(url, method, useAuth, body);
                    } else {
                        result.redirect = '/login';
                    }
                }
            }
        }

        return result;
    }
}