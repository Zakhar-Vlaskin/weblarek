import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import { BaseCard, IBaseCardView } from './BaseCard';
import { CDN_URL, categoryMap } from '../../utils/constants';

export interface IProductPreviewView extends IBaseCardView {
  id: string;
  category: string;
  image: string;
  description: string;
  inCart?: boolean;
}

/**
 * Превью товара в модальном окне.
 * Наследует общее отображение названия и цены из BaseCard.
 */
export class ProductPreview extends BaseCard<IProductPreviewView> {
  protected id?: string;
  protected descriptionElement: HTMLElement;
  protected categoryElement: HTMLElement;
  protected imageElement: HTMLImageElement;
  protected buttonElement: HTMLButtonElement;

  constructor(
    protected events: IEvents,
    container: HTMLElement
  ) {
    super(container);

    this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
    this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
    this.descriptionElement = ensureElement<HTMLElement>('.card__text', this.container);
    this.buttonElement = ensureElement<HTMLButtonElement>('.card__button', this.container);

    this.buttonElement.addEventListener('click', () => {
      if (!this.id) {
        return;
      }
      this.events.emit('product:add-to-cart', { id: this.id });
    });
  }

  render(data?: Partial<IProductPreviewView>): HTMLElement {
    // Общая часть: title + price
    super.render(data);

    if (!data) {
      return this.container;
    }

    // Служебный id — только в поле, не в разметке
    if (data.id !== undefined) {
      this.id = data.id;
    }

    // Категория + модификатор фона
    if (data.category !== undefined) {
      this.categoryElement.textContent = data.category;
      this.categoryElement.classList.remove(...Object.values(categoryMap));

      const modifier = categoryMap[data.category as keyof typeof categoryMap];
      if (modifier) {
        this.categoryElement.classList.add(modifier);
      }
    }

    // Картинка
    if (data.image !== undefined) {
      this.setImage(this.imageElement, CDN_URL + data.image, data.title);
    }

    // Описание
    if (data.description !== undefined) {
      this.descriptionElement.textContent = data.description;
    }

    // Товар без цены — «Недоступно», кнопка неактивна
    if (data.price === null) {
      this.buttonElement.textContent = 'Недоступно';
      this.buttonElement.disabled = true;
      return this.container;
    }

    // Состояние «в корзине» / «не в корзине»
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
