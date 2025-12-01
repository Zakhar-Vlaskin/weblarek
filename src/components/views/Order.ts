import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IOrder {
  address: string;
  payment: string;
  valid: boolean;
  errors: string;
}

export class Order extends Component<IOrder> {
  protected addressInput: HTMLInputElement;
  protected cardButton: HTMLButtonElement;
  protected cashButton: HTMLButtonElement;
  protected submitButton: HTMLButtonElement;
  protected errorsElement: HTMLElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);

    this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', container);
    this.cardButton = ensureElement<HTMLButtonElement>('button[name="card"]', container);
    this.cashButton = ensureElement<HTMLButtonElement>('button[name="cash"]', container);
    this.submitButton = ensureElement<HTMLButtonElement>('.order__button', container);
    this.errorsElement = ensureElement<HTMLElement>('.form__errors', container);

    // Обработчики выбора способа оплаты
    this.cardButton.addEventListener('click', () => {
      this.payment = 'card';
      events.emit('order.payment:changed', { payment: 'card' });
    });

    this.cashButton.addEventListener('click', () => {
      this.payment = 'cash';
      events.emit('order.payment:changed', { payment: 'cash' });
    });

    // Обработчик изменения адреса
    this.addressInput.addEventListener('input', () => {
      events.emit('order.address:change', { value: this.addressInput.value });
    });

    // Обработчик отправки формы
    this.container.addEventListener('submit', (event) => {
      event.preventDefault();
      events.emit('order:submit');
    });
  }

  set address(value: string) {
    this.addressInput.value = value;
  }

  set payment(value: string) {
    if (value === 'card') {
      this.cardButton.classList.add('button_alt-active');
      this.cashButton.classList.remove('button_alt-active');
    } else if (value === 'cash') {
      this.cashButton.classList.add('button_alt-active');
      this.cardButton.classList.remove('button_alt-active');
    }
  }

  set valid(value: boolean) {
    this.submitButton.disabled = !value;
  }

  set errors(value: string) {
    this.setText(this.errorsElement, value);
  }

  protected setText(element: HTMLElement, value: string) {
    if (element) {
      element.textContent = value;
    }
  }
}