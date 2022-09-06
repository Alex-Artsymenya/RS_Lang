import Component from "./Component";
import Drawer from "../drawer/Drawer";
import Button from "./Button";
// import Request from "../../services/Requests";
import "../../scss/components/_authorization-form.scss";
import { AuthUser } from "../../auth/auth";
import { IAuthError } from "../../type";

type authorizationType = {
  message: string;
  name: string;
  refreshToken: string;
  token: string;
  userId: string;
};
export type authorizationFormType = {
  class: string;
  id: string;
};

class AuthorizationForm implements Component {
  private class: string;
  private id: string;
  private type: "Sign in" | "Sign up";
  private action;

  public constructor(options: authorizationFormType) {
    this.class = options.class;
    this.id = options.id;
    this.type = "Sign in";
    this.action = this.loginUser ? this.loginUser : this.createUser;
  }

  static isAuthorized = false;
  static authorizationInfo: authorizationType;

  private text = {
    "Sign in": ["Sign in", "Don't have an account?", "Log in"],
    "Sign up": ["Sign up", "Already have an account?", "Create an account"],
  };

  public async render(): Promise<string> {
    this.getLocalStorage();
    const authorizationButton = await Drawer.drawComponent(Button, {
      id: "authorization-form-button",
      class: "login__button",
      text: `${this.text[this.type][2]}`,
    });
    const view = `
    <div id="${this.id ? this.id : ""}" class="${this.class ? this.class : ""}">
      <div class="login__body">
        <form class="login__form" novalidate>
          <div class="login__close"></div>
          <h1>${this.type}</h1>
          <div class="login__content">
          <p class="error login__error-text" id="name-error"></p>
            <input
              id="email"
              name="email"
              placeholder="email"
              type="email"/>
            <p class="error login__error-text" id="email-error"></p>
            <input
              id="password"
              name="password"
              placeholder="password"
              type="password"/>
            <p class="error login__error-text" id="password-error"></p>
              <p class="login__text link">
                ${this.text[this.type][1]}
              </p>
            ${authorizationButton}
          </div>
        </form>
      </div>
    </div>
    `;
    return view;
  }

  private setLocalStorage(): void {
    localStorage.setItem(
      "userInfo",
      JSON.stringify(AuthorizationForm.authorizationInfo)
    );
  }

  private getLocalStorage(): void {
    const userInfo: string | null = localStorage.getItem("userInfo");
    if (userInfo) {
      AuthorizationForm.authorizationInfo = JSON.parse(userInfo);
      AuthorizationForm.isAuthorized = true;
    }
  }

  static clearLocalStorage(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("userId");
    localStorage.removeItem("userInfo");
  }

  private showErrorMessage(id: string, errorText: string) {
    const errorElement = document.getElementById(id) as HTMLElement;
    errorElement.innerHTML = errorText;
    const input = errorElement.previousElementSibling;
    if (input?.tagName === "INPUT") {
      input.classList.add("error");
    }
  }

  private changeForm() {
    if (this.type === "Sign in") {
      this.type = "Sign up";
      this.action = this.createUser;
    } else {
      this.type = "Sign in";
      this.action = this.loginUser;
    }
  }

  private async loginUser(
    email: string,
    password: string
    // name: string
  ): Promise<void> {
    try {
      const res = await AuthUser.loginUser({
        email: email,
        password: password,
      });
      // console.log("res-->", res);
      if (res?.error) {
        this.showErrorMessage("email-error", `${res.error.errors[0].message}`);
        this.showErrorMessage(
          "password-error",
          `${res.error.errors[0].message}`
        );
      }
      if (res.message === "Authenticated") {
        AuthorizationForm.isAuthorized = true;
        AuthorizationForm.authorizationInfo = res;
        this.setLocalStorage();
      }
    } catch (error) {
      if (error == "SyntaxError: Unexpected token F in JSON at position 0") {
        this.showErrorMessage("password-error", "Wrong password");
      }
      if (error == "SyntaxError: Unexpected token C in JSON at position 0") {
        this.showErrorMessage(
          "email-error",
          `account with this email doesn't exist.`
        );
      }
    }
  }
  errorHandler(errors: IAuthError[]) {
    errors.forEach((el) => {
      this.showErrorMessage(`${el.path[0]}-error`, `${el.message}`);
      // el.path[0]
    });
  }
  private async createUser(
    email: string,
    password: string,
    name: string
  ): Promise<void> {
    try {
      const respBody = await AuthUser.createUser({
        name: name,
        email: email,
        password: password,
      });
      // console.log("respBody", respBody);
      if (respBody?.error) {
        this.errorHandler(respBody.error.errors);
      }
      if (respBody.status === 200) {
        await this.loginUser(email, password);
      }
    } catch (error) {
      if (error == "SyntaxError: Unexpected token F in JSON at position 0") {
        this.showErrorMessage("password-error", "Wrong password");
      }
      if (error == "SyntaxError: Unexpected token C in JSON at position 0") {
        this.showErrorMessage(
          "email-error",
          `account with this email doesn't exist.`
        );
      }
    }
  }

  static async refreshToken() {
    // AuthorizationForm.authorizationInfo.refreshToken;
    try {
      const respBody = await AuthUser.refreshToken();
      // console.log('REFRESH TOKEN --> respBody', respBody);
    } catch {
      return;
    }
  }

  public async after_render(): Promise<void> {
    const formPopup = document.getElementById(this.id) as HTMLElement;
    const form = formPopup.querySelector("form") as HTMLFormElement;
    const switchForm = form.querySelector(".login__text") as HTMLElement;
    const title = form.querySelector("H1") as HTMLElement;
    const inputs = formPopup.querySelectorAll(
      "input"
    ) as NodeListOf<HTMLInputElement>;
    const button = document.getElementById(
      "authorization-form-button"
    ) as HTMLButtonElement;

    const closeForm = () => {
      formPopup.classList.remove("active");
    };

    formPopup.addEventListener("click", (ev: MouseEvent) => {
      const el = ev.target as HTMLElement;
      if (
        !el.closest(".login__form") ||
        el.classList.contains("login__close")
      ) {
        closeForm();
      }
    });

    button.addEventListener("click", async (event: MouseEvent) => {
      event.preventDefault();
      const name: string = (<HTMLInputElement>document.getElementById("name"))
        ?.value;
      const email: string = (<HTMLInputElement>document.getElementById("email"))
        .value;
      // console.log("email", email);
      const password: string = (<HTMLInputElement>(
        document.getElementById("password")
      )).value;
      // console.log("pass", password);
      await this.action(email, password, name);
      if (AuthorizationForm.isAuthorized) {
        const button = document.getElementById(
          "authorization-button"
        ) as HTMLElement;
        button.innerHTML = `Log out: ${localStorage.getItem("name")}`;
        closeForm();
      }
    });

    switchForm.addEventListener("click", () => {
      const name = document.createElement("input");
      name.id = "name";
      name.name = "name";
      name.placeholder = "name";
      name.type = "text";
      const mistText = document.getElementById("name-error");
      this.changeForm();
      if (this.type == "Sign up") {
        mistText?.before(name);
      } else {
        (<HTMLElement>document.getElementById("name")).remove();
      }
      inputs[1].focus();
      inputs[0].focus();
      title.innerHTML = this.type;
      switchForm.innerHTML = this.text[this.type][1];
      button.innerHTML = this.text[this.type][2];
    });

    inputs.forEach((input) => {
      input.addEventListener("focus", () => {
        input.classList.remove("error");
        if (input.nextElementSibling) input.nextElementSibling.innerHTML = "";
      });
    });
  }
}

export default AuthorizationForm;
