import { IEvents } from '../base/Events';
import { BaseCard, IBaseCardView } from './BaseCard';

export interface IProductCardView extends IBaseCardView {
  inCart?: boolean;
}

export class ProductCard extends BaseCard<IProductCardView> {
  constructor(
    protected events: IEvents,
    container: HTMLElement
  ) {
    super(container);

    // Клик по карточке — открыть предпросмотр
    this.container.addEventListener('click', () => {
      const id = this.container.dataset.id;
      if (id) this.events.emit('product:select', { id });
    });
  }

  render(data?: Partial<IProductCardView>): HTMLElement {
    super.render(data);

    if (!data) return this.container;

    // Если цена отсутствует — товар недоступен
    if (data.price === null) {
      this.container.classList.add('card_unavailable');
    } else {
      this.container.classList.remove('card_unavailable');
    }

    // Пометка "в корзине"
    if (data.inCart !== undefined) {
      this.container.classList.toggle('card_in-cart', data.inCart);
    }

    return this.container;
  }
}
