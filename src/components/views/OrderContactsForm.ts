import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import { Form } from './Form';

export interface IOrderContactsFormView {
  email: string;
  phone: string;
  errors?: {
    email?: string;
    phone?: string;
  };
  valid?: boolean;
}

/**
 * Форма контактных данных (email и телефон).
 * Наследует общий функционал от базового класса Form.
 */
export class OrderContactsForm extends Form<IOrderContactsFormView> {
  protected emailInput: HTMLInputElement;
  protected phoneInput: HTMLInputElement;

  constructor(
    events: IEvents,
    container: HTMLElement
  ) {
    super(events, container, 'order:contacts-submit');

    this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.formElement);
    this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.formElement);

    this.emailInput.addEventListener('input', () => {
      this.events.emit('order:contacts-change', {
        field: 'email',
        value: this.emailInput.value,
      });
    });

    this.phoneInput.addEventListener('input', () => {
      this.events.emit('order:contacts-change', {
        field: 'phone',
        value: this.phoneInput.value,
      });
    });
  }

  render(data?: Partial<IOrderContactsFormView>): HTMLElement {
    if (data) {
      if (data.email !== undefined) {
        this.emailInput.value = data.email;
      }

      if (data.phone !== undefined) {
        this.phoneInput.value = data.phone;
      }

      if (data.errors) {
        this.setErrors([
          data.errors.email,
          data.errors.phone,
        ]);
      }

      if (data.valid !== undefined) {
        this.setValid(data.valid);
      }
    }

    return this.container;
  }
}
