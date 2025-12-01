// src/components/views/Catalog.ts
import { Component } from "../base/Component";

interface ICatalog {
  items: HTMLElement[];
}

export class Catalog extends Component<ICatalog> {
  protected _list: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this._list = container;
  }

  set items(items: HTMLElement[]) {
    
    if (items.length > 0) {
      this._list.replaceChildren(...items);
    } else {
      this._list.innerHTML = '<p>Товары не найдены</p>';
    }
  }
}