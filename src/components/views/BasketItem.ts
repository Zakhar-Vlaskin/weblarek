import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export interface IBasketItemView {
  id: string;
  index: number;
  title: string;
  price: number | null;
}

export class BasketItem extends Component<IBasketItemView> {
  protected indexElement: HTMLElement;
  protected titleElement: HTMLElement;
  protected priceElement: HTMLElement;
  protected deleteButton: HTMLButtonElement;

  constructor(
    protected events: IEvents,
    container: HTMLElement
  ) {
    super(container);

    this.indexElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
    this.titleElement = ensureElement<HTMLElement>('.card__title', this.container);
    this.priceElement = ensureElement<HTMLElement>('.card__price', this.container);
    this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

    this.deleteButton.addEventListener('click', (e) => {
      // ВАЖНО: чтобы клик по кнопке удаления не всплывал до .card
      e.stopPropagation();

      const id = this.container.dataset.id;
      if (!id) return;

      this.events.emit('basket:item-remove', { id });
    });
  }

  render(data?: Partial<IBasketItemView>): HTMLElement {
    if (data) {
      if (data.id) {
        this.container.dataset.id = data.id;
      }

      if (data.index !== undefined) {
        this.indexElement.textContent = String(data.index);
      }

      if (data.title !== undefined) {
        this.titleElement.textContent = data.title;
      }

      if (data.price !== undefined) {
        this.priceElement.textContent =
          data.price === null ? 'Бесценно' : `${data.price} синапсов`;
      }
    }

    return this.container;
  }
}
