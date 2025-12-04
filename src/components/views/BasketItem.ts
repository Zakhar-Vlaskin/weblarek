// src/components/Views/BasketItem.ts
import { ensureElement } from '../../utils/utils';
import { BaseCard, IBaseCardView } from './BaseCard';

export interface IBasketItemView extends IBaseCardView {
  index: number;
}

export type TBasketItemActions = {
  onRemove?: () => void;
};

/**
 * Строка товара в корзине.
 */
export class BasketItem extends BaseCard<IBasketItemView> {
  protected indexElement: HTMLElement;
  protected deleteButton: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    private actions?: TBasketItemActions
  ) {
    super(container);

    this.indexElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
    this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

    if (this.actions?.onRemove) {
      this.deleteButton.addEventListener('click', (event) => {
        event.stopPropagation();
        this.actions?.onRemove && this.actions.onRemove();
      });
    }
  }

  render(data?: Partial<IBasketItemView>): HTMLElement {
    // Общая часть: title + price
    super.render(data);

    if (data?.index !== undefined) {
      this.indexElement.textContent = String(data.index);
    }

    return this.container;
  }
}
