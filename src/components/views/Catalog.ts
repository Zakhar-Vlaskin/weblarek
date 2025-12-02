import { Component } from "../base/Component";

export interface ICatalogView {
  items: HTMLElement[];
}

export class Catalog extends Component<ICatalogView> {
  constructor(container: HTMLElement) {
    super(container);
  }

  render(data?: Partial<ICatalogView>): HTMLElement {
    if (data?.items) {
      this.container.innerHTML = '';
      data.items.forEach((item) => this.container.append(item));
    }
    return this.container;
  }
}
