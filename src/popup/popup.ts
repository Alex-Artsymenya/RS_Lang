import { AuthUser } from "../auth/auth";
import { IAuthError } from "../type";
import "./popup.css";

export class PopUp {
  drawPopUpd(create = true): void {
    const popupHTML = `
                <div class="popup_inner">
                    <div class="close-popup" id="close-popup"><span></span></div>
                    <div class="popup-material" id="popup-material">
                        ${create ? "<h3>Create User</h3>" : "<h3>Sign In</h3>"}
                        <p class="popup-error"></p>
                        <div class="popup-description">
                        ${
                          create
                            ? '<label for="user-name">Please, enter your Name</label><input type="text" id="user-name" name="user-name" value="" placeholder="Name">'
                            : ""
                        }
                            <label for="user-email">Please, enter your email</label>
                            <input type="email" id="user-email" name="user-email" value="" placeholder="e-mail">
                            <label for="user-pass">Please, enter your password</label>
                            <input type="password" id="user-pass" name="user-pass" value="" placeholder="enter your password">
                        </div>
                        <label for="check-login">
                            <input type="checkbox" id="check-login" name="check-login" ${
                              create ? "checked" : ""
                            }>
                            <span class="slider round"></span>
                        </label>
                        ${
                          create
                            ? '<input type="button" title="Create user" value="Create" id="submit-btn" class="button authorization-button create-btn">'
                            : '<input type="button" title="Sign in" value="Sign in" id="submit-btn" class="button authorization-button login-btn">'
                        }
                    </div>
                </div>`;
    if (!(<HTMLElement>document.querySelector("#popup_background"))) {
      const body = document.querySelector("body");
      const divPopUp = document.createElement("div");
      const divFadeIn = document.createElement("div");
      divFadeIn.className = "popup fade-in";
      divFadeIn.id = "popup";
      divPopUp.className = "popup_background";
      divPopUp.id = "popup_background";
      divFadeIn.innerHTML = popupHTML;
      divPopUp.appendChild(divFadeIn);
      body?.appendChild(divPopUp);
    } else {
      (<HTMLElement>document.querySelector("#popup")).innerHTML = popupHTML;
    }
  }

  closePopupButtonFunc(): void {
    (<HTMLElement>document.querySelector("#popup_background")).classList.toggle(
      "active"
    );
    (<HTMLElement>document.querySelector("#popup")).classList.toggle("active");
    (<HTMLElement>document.querySelector("#close-popup")).removeEventListener(
      "click",
      () => this.closePopupButtonFunc
    );
    (<HTMLElement>document.querySelector("#popup_background")).remove();
  }

  popUpBgFunc(e: Event): void {
    if (
      <HTMLElement>e.target ==
        <HTMLElement>document.querySelector("#popup_background") ||
      (<HTMLElement>e.target).className == "popup_inner"
    ) {
      (<HTMLElement>(
        document.querySelector("#popup_background")
      )).classList.toggle("active");
      (<HTMLElement>document.querySelector("#popup")).classList.toggle(
        "active"
      );
      (<HTMLElement>(
        document.querySelector("#popup_background")
      )).removeEventListener("click", () => this.popUpBgFunc);
      (<HTMLElement>document.querySelector("#popup_background")).remove();
    }
  }

  addListeners() {
    (<HTMLElement>document.querySelector("#close-popup")).addEventListener(
      "click",
      this.closePopupButtonFunc
    );
    (<HTMLElement>document.querySelector("#popup_background")).addEventListener(
      "click",
      this.popUpBgFunc
    );
    (<HTMLElement>document.querySelector("#check-login")).addEventListener(
      "change",
      () => this.turnLoginCreate()
    );
    (<HTMLElement>document.querySelector("#submit-btn")).addEventListener(
      "click",
      async (event) => {
        const user = new AuthUser();
        switch (true) {
          // case (<HTMLElement>event.target).classList.contains('login-btn'): {
          //     console.log('LOGIN');
          //     const respBody = await user.loginUser({
          //         email: (<HTMLInputElement>document.getElementById('user-email')).value,
          //         password: (<HTMLInputElement>document.getElementById('user-pass')).value
          //     });
          //     if (respBody?.error) {
          //         this.handleError(respBody.error.errors);
          //     }
          //     if (respBody.message === 'Authenticated') {
          //         this.closePopupButtonFunc();
          //     }
          //     break;
          // }
          // case (<HTMLElement>event.target).classList.contains('create-btn'): {
          //     console.log('CREATE');
          //     const respBody = await user.createUser({
          //         name: (<HTMLInputElement>document.getElementById('user-name')).value,
          //         email: (<HTMLInputElement>document.getElementById('user-email')).value,
          //         password: (<HTMLInputElement>document.getElementById('user-pass')).value
          //     });
          //     if (respBody?.error) {
          //         this.handleError(respBody.error.errors);
          //     }
          //     break;
          // }
          default: {
            console.log("something else");
          }
        }
      }
    );
  }

  async run(create = true) {
    this.drawPopUpd(create);
    if (
      !(<HTMLElement>(
        document.querySelector("#popup_background")
      )).classList.contains("active")
    ) {
      (<HTMLElement>document.querySelector("#popup_background")).classList.add(
        "active"
      );
      (<HTMLElement>document.querySelector("#popup")).classList.add("active");
    }
    this.addListeners();
  }

  handleError(arrError: IAuthError[]) {
    const errorMsg = <HTMLElement>document.querySelector(".popup-error");
    errorMsg.innerText = "";
    arrError.forEach((el) => {
      errorMsg.innerText += `${el.message}\n`;
    });
  }

  turnLoginCreate() {
    if ((<HTMLInputElement>document.querySelector("#check-login")).checked) {
      this.run();
    } else {
      this.run(false);
    }
  }
}
