import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { CDN_URL, categoryMap } from '../../utils/constants';

export interface IBaseCardView {
  id: string;
  title: string;
  price: number | null;
  category: string;
  image: string;
}

export class BaseCard<T extends IBaseCardView> extends Component<T> {
  protected titleElement: HTMLElement;
  protected priceElement: HTMLElement;
  protected categoryElement: HTMLElement;
  protected imageElement: HTMLImageElement;

  constructor(container: HTMLElement) {
    super(container);

    this.titleElement = ensureElement<HTMLElement>('.card__title', this.container);
    this.priceElement = ensureElement<HTMLElement>('.card__price', this.container);
    this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
    this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
  }

  render(data?: Partial<T>): HTMLElement {
    if (data) {
      if (data.id !== undefined) {
        this.container.dataset.id = data.id;
      }

      if (data.title !== undefined) {
        this.titleElement.textContent = data.title;
      }

      if (data.price !== undefined) {
        this.priceElement.textContent =
          data.price === null ? 'Бесценно' : `${data.price} синапсов`;
      }

      if (data.category !== undefined) {
        this.categoryElement.textContent = data.category;
        this.categoryElement.classList.remove(...Object.values(categoryMap));

        const modifier = categoryMap[data.category as keyof typeof categoryMap];
        if (modifier) this.categoryElement.classList.add(modifier);
      }

      if (data.image !== undefined) {
        this.setImage(this.imageElement, CDN_URL + data.image, data.title);
      }
    }

    return this.container;
  }
}
