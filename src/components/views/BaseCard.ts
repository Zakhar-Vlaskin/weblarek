import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

export interface IBaseCardView {
  title: string;
  price: number | null;
}

/**
 * Базовый класс карточки.
 * Содержит только общий функционал:
 * - отображение названия
 * - отображение цены
 */
export class BaseCard<T extends IBaseCardView> extends Component<T> {
  protected titleElement: HTMLElement;
  protected priceElement: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    this.titleElement = ensureElement<HTMLElement>('.card__title', this.container);
    this.priceElement = ensureElement<HTMLElement>('.card__price', this.container);
  }

  render(data?: Partial<T>): HTMLElement {
    if (data) {

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
