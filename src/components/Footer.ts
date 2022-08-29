import Component from "./common/Component";
import "../scss/layout/_footer.scss";
import { coloborations } from "./common/coloborations";

class Footer implements Component {
  private class: string;

  public constructor(options: { class: string }) {
    this.class = options.class;
  }

  public async render(): Promise<string> {
    let creatersInfo = ''
    coloborations.forEach(item => {
      creatersInfo += `
      <a class="coloboration-info" href="${item.github}">
        <h4>${item.name}</h4>
        <img class="img-github" src="./assets/svg/github.svg" alt="github logo">
      </a>
      `
    })
    const view = `
    <div class="wrapper footer__wrapper ${this.class ? this.class : ""}">
      <a class="link rs-logo" href="https://rs.school/">
        <div class="rs-logo__img"></div>
      </a>
        <div>${creatersInfo}</div>
        <div>2022</div>
    </div>
    `;
    return view;
  }

  public async after_render(): Promise<void> {
    return;
  }
}

export default Footer;
