import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import { BaseCard, IBaseCardView } from './BaseCard';

export interface IBasketItemView extends IBaseCardView {
  id: string;
  index: number;
}

/**
 * Представление строки товара в корзине.
 * Наследуется от BaseCard и использует общий функционал
 * отображения названия и цены.
 */
export class BasketItem extends BaseCard<IBasketItemView> {
  protected indexElement: HTMLElement;
  protected deleteButton: HTMLButtonElement;

  protected id?: string;

  constructor(
    protected events: IEvents,
    container: HTMLElement
  ) {
    super(container);

    this.indexElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
    this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

    this.deleteButton.addEventListener('click', (e) => {
      e.stopPropagation();

      if (!this.id) return;

      this.events.emit('basket:item-remove', { id: this.id });
    });
  }

  render(data?: Partial<IBasketItemView>): HTMLElement {

    super.render(data);

    if (data) {

      if (data.id !== undefined) {
        this.id = data.id;
      }


      if (data.index !== undefined) {
        this.indexElement.textContent = String(data.index);
      }
    }

    return this.container;
  }
}
