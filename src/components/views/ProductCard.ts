// src/components/Views/ProductCard.ts
import { BaseCard, IBaseCardView } from './BaseCard';
import { ensureElement } from '../../utils/utils';
import { CDN_URL, categoryMap } from '../../utils/constants';

export interface IProductCardView extends IBaseCardView {
  id: string;
  category: string;
  image: string;
  inCart?: boolean;
}

/**
 * Карточка товара в каталоге.
 * Наследует общее отображение названия и цены из BaseCard,
 * добавляет отображение категории и картинки.
 */
export class ProductCard extends BaseCard<IProductCardView> {
  protected id?: string;
  protected categoryElement: HTMLElement;
  protected imageElement: HTMLImageElement;

  constructor(
    container: HTMLElement,
    protected onSelect: (id: string) => void
  ) {
    super(container);

    this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
    this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);

    this.container.addEventListener('click', () => {
      if (this.id) {
        this.onSelect(this.id);
      }
    });
  }

  render(data?: Partial<IProductCardView>): HTMLElement {
    // Общая часть: title + price
    super.render(data);

    if (!data) {
      return this.container;
    }

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
    return this.container;
  }
}
