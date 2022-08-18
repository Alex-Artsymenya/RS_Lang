import { LINK } from "../state";
import { IAuthUser } from "../type";

export class AuthUser {
    async createUser(data: IAuthUser) {
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
}