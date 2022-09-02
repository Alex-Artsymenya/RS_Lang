import Component from "../common/Component";
import Page from "../pages/Page";

class Drawer {
  static renderComponentStack: Component[] = [];

  static async drawComponent(
    componentClass: new (options: any) => Component,
    options = {}
  ) {
    const component: Component = new componentClass(options);
    this.renderComponentStack.push(component);
    const result = await component.render();
    // console.log("component render DRAWER --> ", this.renderComponentStack);
    // console.log("result DRAWER -->", result);
    return result;
  }

  static async drawPage(page: Page) {
    const content: HTMLElement = document.getElementById(
      "page_container"
    ) as HTMLElement;
    content.innerHTML = await page.render();
    while (this.renderComponentStack.length) {
      const componentFromStack = this.renderComponentStack.pop();
      if (componentFromStack) {
        // console.log("component", componentFromStack);
        await componentFromStack.after_render();
      }
    }
    await page.after_render();
  }
  static async reDrawComponents(component: Component, id: string) {
    const content: HTMLElement = document.getElementById(id) as HTMLElement;
    // console.log("content", content);
    content.innerHTML = "";
    content.innerHTML += await component.render();
    await component.after_render();
    // while (this.renderComponentStack.length) {
    //   const componentFromStack = this.renderComponentStack.pop();
    //   if (componentFromStack) {
    //     console.log("component", componentFromStack);
    //     content.innerHTML += await componentFromStack.render();
    //     await componentFromStack.after_render();
    //   }
    // }
  }
}

export default Drawer;
