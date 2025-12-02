import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export interface IBasketView {
  items: HTMLElement[];
  total: number;
  emptyText?: string;
}

export class Basket extends Component<IBasketView> {
  protected listElement: HTMLElement;
  protected totalElement: HTMLElement;
  protected orderButton: HTMLButtonElement;

  constructor(
    protected events: IEvents,
    container: HTMLElement
  ) {
    super(container);

    this.listElement = ensureElement<HTMLElement>('.basket__list', this.container);
    this.totalElement = ensureElement<HTMLElement>('.basket__price', this.container);
    this.orderButton = ensureElement<HTMLButtonElement>('.basket__button', this.container);

    this.orderButton.addEventListener('click', () => {
      this.events.emit('order:open-payment', {});
    });
  }

  render(data?: Partial<IBasketView>): HTMLElement {
    if (data) {
      if (data.items) {
        this.listElement.innerHTML = '';
        data.items.forEach((item) => this.listElement.append(item));

        const isEmpty = data.items.length === 0;
        this.orderButton.disabled = isEmpty;
      }

      if (data.total !== undefined) {
        this.totalElement.textContent = `${data.total} синапсов`;
      }
    }

    return this.container;
  }
}
