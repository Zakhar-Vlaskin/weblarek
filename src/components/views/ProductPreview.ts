import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import { BaseCard, IBaseCardView } from './BaseCard';

export interface IProductPreviewView extends IBaseCardView {
  description: string;
  inCart?: boolean;
}

export class ProductPreview extends BaseCard<IProductPreviewView> {
  protected descriptionElement: HTMLElement;
  protected buttonElement: HTMLButtonElement;

  constructor(
    protected events: IEvents,
    container: HTMLElement
  ) {
    super(container);

    this.descriptionElement = ensureElement<HTMLElement>('.card__text', this.container);
    this.buttonElement = ensureElement<HTMLButtonElement>('.card__button', this.container);


    this.buttonElement.addEventListener('click', () => {
      const id = this.container.dataset.id;
      if (!id) return;
      this.events.emit('product:add-to-cart', { id });
    });
  }

  render(data?: Partial<IProductPreviewView>): HTMLElement {
    super.render(data);

    if (!data) return this.container;


    if (data.description !== undefined) {
      this.descriptionElement.textContent = data.description;
    }


    if (data.price === null) {
      this.buttonElement.textContent = 'Недоступно';
      this.buttonElement.disabled = true;
      return this.container; // Никакого inCart логики в этом случае
    }


    if (data.inCart !== undefined) {
      if (data.inCart) {
        this.buttonElement.textContent = 'Удалить из корзины';
        this.buttonElement.disabled = false;
      } else {
        this.buttonElement.textContent = 'В корзину';
        this.buttonElement.disabled = false;
      }
    }

    return this.container;
  }
}
