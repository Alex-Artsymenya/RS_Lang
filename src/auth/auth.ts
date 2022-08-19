import { LINK } from "../state";
import { ICreateUser, ILoginUser } from "../type";

export class AuthUser {
    async createUser(data: ICreateUser) {
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
                return {error: {errors: [{ path: [''], message: 'This email already used, try another, or Log in'}]}}
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
    async loginUser(data: ILoginUser) {
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
                return body
            }
            if (response.status == 404) {
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