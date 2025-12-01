import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IBasket {
  items: HTMLElement[];
  total: number;
  selected: string[];
}

export class Basket extends Component<IBasket> {
  protected listElement: HTMLElement;
  protected totalElement: HTMLElement;
  protected buttonElement: HTMLButtonElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);

    this.listElement = ensureElement<HTMLElement>('.basket__list', this.container);
    this.totalElement = ensureElement<HTMLElement>('.basket__price', this.container);
    this.buttonElement = ensureElement<HTMLButtonElement>('.basket__button', this.container);

    this.buttonElement.addEventListener('click', () => {
      events.emit('order:open');
    });
  }

  set items(items: HTMLElement[]) {
    if (items.length) {
      this.listElement.replaceChildren(...items);
    } else {
      this.listElement.innerHTML = '<p>Корзина пуста</p>';
    }
  }

  set total(total: number) {
    this.totalElement.textContent = `${total} синапсов`;
  }

  set selected(items: string[]) {
    this.buttonElement.disabled = items.length === 0;
  }
}