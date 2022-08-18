import { AuthUser } from '../auth/auth';
import { IAuthError } from '../type';
import './popup.css';

export class PopUp {
    drawPopUpd;
    constructor() {
        this.drawPopUpd = () => {
            const popupHTML = `
                <div class="popup fade-in" id="popup">
                    <div class="popup_inner">
                        <div class="close-popup" id="close-popup"><span></span></div>
                        <div class="popup-material" id="popup-material">
                            <h3>Create User</h3>
                            <p class="popup-error"></p>
                            <div class="popup-description">
                                <label for="user-name">Please, enter your Name</label>
                                <input type="text" id="user-name" name="user-name" value="" placeholder="Name">
                                <label for="user-email">Please, enter your email</label>
                                <input type="email" id="user-email" name="user-email" value="" placeholder="e-mail">
                                <label for="user-pass">Please, enter your password</label>
                                <input type="password" id="user-pass" name="user-pass" value="" placeholder="enter your password">
                            </div>
                            <input type="button" title="Create user" value="Create" id="submit-btn">
                        </div>
                    </div>
                </div>`;
            if (!(<HTMLElement>document.querySelector('#popup_background'))) {
                const body = document.querySelector('body');
                const div = document.createElement('div');
                div.className = 'popup_background';
                div.id = 'popup_background';
                div.innerHTML = popupHTML;
                body?.appendChild(div);
            }
        };
    }

    closePopupButtonFunc(): void {
        (<HTMLElement>document.querySelector('#popup_background')).classList.toggle('active');
        (<HTMLElement>document.querySelector('#popup')).classList.toggle('active');
        (<HTMLElement>document.querySelector('#close-popup')).removeEventListener(
            'click',
            () => this.closePopupButtonFunc
        );
        (<HTMLElement>document.querySelector('#popup_background')).remove();
    }
    popUpBgFunc(e: Event): void {
        if (
            <HTMLElement>e.target == <HTMLElement>document.querySelector('#popup_background') ||
            (<HTMLElement>e.target).className == 'popup_inner'
        ) {
            (<HTMLElement>document.querySelector('#popup_background')).classList.toggle('active');
            (<HTMLElement>document.querySelector('#popup')).classList.toggle('active');
            (<HTMLElement>document.querySelector('#popup_background')).removeEventListener(
                'click',
                () => this.popUpBgFunc
            );
            (<HTMLElement>document.querySelector('#popup_background')).remove();
        }
    }

    async run() {
        this.drawPopUpd();
        (<HTMLElement>document.querySelector('#popup_background')).classList.add('active');
        (<HTMLElement>document.querySelector('#popup')).classList.add('active');
        (<HTMLElement>document.querySelector('#close-popup')).addEventListener('click', this.closePopupButtonFunc);
        (<HTMLElement>document.querySelector('#popup_background')).addEventListener('click', this.popUpBgFunc);
        (<HTMLElement>document.querySelector('#submit-btn')).addEventListener('click', async () => {
            const user = new AuthUser();
            const respBody = await user.createUser({
                name: (<HTMLInputElement>document.getElementById('user-name')).value,
                email: (<HTMLInputElement>document.getElementById('user-email')).value,
                password: (<HTMLInputElement>document.getElementById('user-pass')).value
            });
            if (respBody?.error) {
                this.handleError(respBody.error.errors);
            }
        });
    }
    handleError(arrError: IAuthError[]) {
        const errorMsg = <HTMLElement>document.querySelector('.popup-error');
        errorMsg.innerText = '';
        arrError.forEach((el) => {
            errorMsg.innerText += `${el.message}\n`;
        });
    }
}
