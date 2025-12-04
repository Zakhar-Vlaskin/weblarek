// src/components/Models/Buyer.ts
import { IBuyer, TPayment, IBuyerValidationResult } from '../../types';
import { IEvents } from '../base/Events';

export class Buyer {
  private payment: TPayment;
  private address: string;
  private phone: string;
  private email: string;

  constructor(
    private events: IEvents,
    data?: Partial<IBuyer>
  ) {
    this.payment = data?.payment || '';
    this.address = data?.address || '';
    this.phone = data?.phone || '';
    this.email = data?.email || '';
  }

  // Сохранение данных покупателя, с генерацией события только при реальном изменении
  setData(data: Partial<IBuyer>) {
    let changed = false;

    if (data.payment !== undefined && data.payment !== this.payment) {
      this.payment = data.payment;
      changed = true;
    }

    if (data.address !== undefined && data.address !== this.address) {
      this.address = data.address;
      changed = true;
    }

    if (data.phone !== undefined && data.phone !== this.phone) {
      this.phone = data.phone;
      changed = true;
    }

    if (data.email !== undefined && data.email !== this.email) {
      this.email = data.email;
      changed = true;
    }

    if (changed) {
      this.events.emit('buyer:changed', {});
    }
  }

  // Получить все данные покупателя
  getData(): IBuyer {
    return {
      payment: this.payment,
      address: this.address,
      phone: this.phone,
      email: this.email,
    };
  }

  // Очистка всех данных (после успешного заказа)
  clear() {
    this.payment = '';
    this.address = '';
    this.phone = '';
    this.email = '';

    this.events.emit('buyer:changed', {});
  }

  // Валидация данных покупателя
  validate(): IBuyerValidationResult {
    const errors: IBuyerValidationResult = {};

    if (!this.payment) {
      errors.payment = 'Не выбран вид оплаты';
    }
    if (!this.email.trim()) {
      errors.email = 'Укажите email';
    }
    if (!this.phone.trim()) {
      errors.phone = 'Укажите номер телефона';
    }
    if (!this.address.trim()) {
      errors.address = 'Необходимо указать адрес';
    }

    return errors;
  }
}
