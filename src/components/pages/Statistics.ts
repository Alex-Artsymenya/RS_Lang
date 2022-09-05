import Page from "./Page";

class Statistics implements Page {
  public async render(): Promise<string> {
    const view = `
      <section class="section">
          <h1>Statistics</h1>
          <h3>Temperary unavailable</h3>
      </section>
    `;
    return view;
  }

  public async after_render(): Promise<void> {
    return;
  }
}

export default Statistics;
