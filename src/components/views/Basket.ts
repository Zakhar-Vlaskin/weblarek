import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export interface IBasketView {
  items: HTMLElement[];
  total: number;
}

/**
 * Представление корзины.
 * Отвечает только за отображение:
 * - списка элементов корзины
 * - общей суммы
 * - доступности кнопки "Оформить"
 */
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

  /**
   * Устанавливает элементы корзины.
   * Используется базовым render() через Object.assign(this, data).
   */
  set items(items: HTMLElement[]) {
    // Меняем весь список за одну операцию
    this.listElement.replaceChildren(...items);
    // Блокируем кнопку "Оформить", если корзина пустая
    this.orderButton.disabled = items.length === 0;
  }

  /**
   * Устанавливает общую сумму заказа.
   */
  set total(value: number) {
    this.totalElement.textContent = `${value} синапсов`;
  }
}
