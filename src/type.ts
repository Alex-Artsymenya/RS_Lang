export interface IAuthUser {
    name: string;
    email: string;
    password: string;
}

export interface IAuthError {
    path: string[];
    message: string;
}