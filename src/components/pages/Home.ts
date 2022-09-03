import { coloborations } from "../common/coloborations";
import Page from "./Page";

class HomePage implements Page {
  public async render(): Promise<string> {
    let view = `
      <section class="main-title">
        <h1>The World is Yours with RS Lang!</h1>
        <p>RS Lang — it is an effective service for the exciting practice of languages. Development of a strong theoretical base and emancipation in communication in a foreign language. Join now!</p>
      </section>
      <section class="our-team">
        <h2>Our team:</h2>`;
    coloborations.forEach((item) => {
      view += `
        <div class="item-team">
          <a class="coloboration-info" href="${item.github}">
            <h3>${item.name}</h3>
            <img class="img-github" src="./assets/svg/github.svg" alt="github logo">
          </a>
          <p>Create:</p>`;
      item.create.forEach((itemCreate) => {
        view += `<li>${itemCreate}</li>`;
      });
      view += `</ul></div>`;
    });

    view += `</section>`;
    return view;
  }

  public async after_render(): Promise<void> {
    return;
  }
}

export default HomePage;
