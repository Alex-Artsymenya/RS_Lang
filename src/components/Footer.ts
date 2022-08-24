import Component from "./common/Component";
import "../scss/layout/_footer.scss";

class Footer implements Component {
  private class: string;

  public constructor(options: { class: string }) {
    this.class = options.class;
  }

  public async render(): Promise<string> {
    const view = `
    <div class="wrapper footer__wrapper ${this.class ? this.class : ""}">
      <a class="link rs-logo" href="https://rs.school/">
        <div class="rs-logo__img"></div>
      </a>
        <div>2022</div>
      </div>
    </div>
    `;
    return view;
  }

  public async after_render(): Promise<void> {
    return;
  }
}

export default Footer;
