import { Component } from "../base/Component";

export interface ICatalogView {
  items: HTMLElement[];
}

/**
 * Представление каталога товаров.
 * Отвечает за вывод карточек каталога на страницу.
 */
export class Catalog extends Component<ICatalogView> {
  constructor(container: HTMLElement) {
    super(container);
  }

  set items(items: HTMLElement[]) {
    this.container.replaceChildren(...items);
  }
}
