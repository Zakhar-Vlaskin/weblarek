import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import { TPayment } from '../../types';
import { Form } from './Form';

export interface IOrderPaymentFormView {
  payment: TPayment;
  address: string;
  errors?: {
    payment?: string;
    address?: string;
  };
  valid?: boolean;
}

/**
 * Форма выбора способа оплаты и ввода адреса доставки.
 * Наследует общий функционал от базового класса Form.
 */
export class OrderPaymentForm extends Form<IOrderPaymentFormView> {
  protected addressInput: HTMLInputElement;
  protected cardButton: HTMLButtonElement;
  protected cashButton: HTMLButtonElement;

  constructor(
    events: IEvents,
    container: HTMLElement
  ) {
    // 'order:payment-submit' — событие сабмита формы
    super(events, container, 'order:payment-submit');

    this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', this.formElement);
    this.cardButton = ensureElement<HTMLButtonElement>('button[name="card"]', this.formElement);
    this.cashButton = ensureElement<HTMLButtonElement>('button[name="cash"]', this.formElement);

    // Изменение адреса — только уведомляем презентер
    this.addressInput.addEventListener('input', () => {
      this.events.emit('order:payment-change', {
        field: 'address',
        value: this.addressInput.value
      });
    });

    // Выбор "Онлайн" — только уведомляем презентер
    this.cardButton.addEventListener('click', (event) => {
      event.preventDefault();
      this.events.emit('order:payment-change', {
        field: 'payment',
        value: 'Card'
      });
    });

    // Выбор "При получении" — только уведомляем презентер
    this.cashButton.addEventListener('click', (event) => {
      event.preventDefault();
      this.events.emit('order:payment-change', {
        field: 'payment',
        value: 'Cash'
      });
    });
  }

  /**
   * Визуально выделяет выбранный способ оплаты
   * (вызывается только из render(), т.е. только по данным из модели)
   */
  protected setPayment(payment: TPayment) {
    this.cardButton.classList.remove('button_alt-active');
    this.cashButton.classList.remove('button_alt-active');

    if (payment === 'Card') {
      this.cardButton.classList.add('button_alt-active');
    } else if (payment === 'Cash') {
      this.cashButton.classList.add('button_alt-active');
    }
  }

  render(data?: Partial<IOrderPaymentFormView>): HTMLElement {
    if (data) {
      if (data.address !== undefined) {
        this.addressInput.value = data.address;
      }

      // Подсветка способа оплаты — только по данным из модели Buyer
      if (data.payment !== undefined) {
        this.setPayment(data.payment);
      }

      if (data.errors) {
        this.setErrors([
          data.errors.payment,
          data.errors.address,
        ]);
      }

      if (data.valid !== undefined) {
        this.setValid(data.valid);
      }
    }

    return this.container;
  }
}
