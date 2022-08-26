import { LINK } from "../state";
import { ICreateUser, ILoginUser } from "../type";

export class AuthUser {
    static async createUser(data: ICreateUser) {
        try {
            const response = await fetch(`${LINK.url}/${LINK.users}`, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
            });
            console.log('response', response);
            if (response.status == 417) {
                return {error: {errors: [{ path: ['email'], message: 'This email already used, try another, or Log in'}]}}
            }
            const body = await response.json();
            console.log('body-create-auth-->', body);
            return body;
        } catch (error) {
            console.log('error-create-auth-->', error);
            if (error instanceof SyntaxError) {
                console.log(JSON.stringify(error.message));
            }
        }
    }
    static async loginUser(data: ILoginUser) {
        try {
            const response = await fetch(`${LINK.url}/${LINK.signin}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
            });
            console.log('response', response);
            if (response.status == 200) {
                const body = await response.json();
                localStorage.setItem('token', body.token);
                localStorage.setItem('name', body.name);
                localStorage.setItem('userId', body.userId);
                localStorage.setItem('userInfo', JSON.stringify(body));
                console.log(body);
                return body
            }
            if (response.status == 404) {
                return {error: {errors: [{ path: [''], message: 'Please, check your email or password'}]}}
            }
            if (response.status == 403) {
                return {error: {errors: [{ path: [''], message: 'Please, check your email or password'}]}}
            }
            const body = await response.json();
            console.log(body);
            return body;
        } catch (error) {
            console.log(error);
            if (error instanceof SyntaxError) {
                console.log(JSON.stringify(error.message));
            }
        }
    }
}

export default AuthUser;