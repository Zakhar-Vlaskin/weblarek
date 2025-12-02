import { IBuyer, TPayment, IBuyerValidationResult } from "../../types";
import { IEvents } from "../base/Events";

export class Buyer {
  private _payment: TPayment;
  private _address: string;
  private _phone: string;
  private _email: string;
  private events: IEvents;

  constructor(events: IEvents, data?: Partial<IBuyer>) {
    this.events = events;
    this._payment = data?.payment || '';
    this._address = data?.address || '';
    this._phone = data?.phone || '';
    this._email = data?.email || '';
  }

  private emitChange() {
    this.events.emit('buyer:changed', {
      buyer: this.getData(),
      errors: this.validate()
    });
  }

  // Метод сохранения данных в модели
  setData(data: Partial<IBuyer>) {
    if (data.payment !== undefined) this._payment = data.payment;
    if (data.address !== undefined) this._address = data.address;
    if (data.phone !== undefined) this._phone = data.phone;
    if (data.email !== undefined) this._email = data.email; 

    this.emitChange();
  }

  // Метод получение всех данных покупателя
  getData(): IBuyer {
    return {
      payment: this._payment,
      address: this._address,
      phone: this._phone,
      email: this._email,
    };
  }

  // Метод очистки данных покупателя
  clear() {
    this._payment = '';
    this._address = '';
    this._phone = '';
    this._email = '';
    this.emitChange();
  }

  // Валидация данных покупателя
  validate(): IBuyerValidationResult {
    const errors: IBuyerValidationResult = {};

    if (!this._payment) {
      errors.payment = 'Не выбран вид оплаты';
    }

    if (!this._email.trim()) {
      errors.email = 'Укажите email';
    }
    
    if (!this._phone.trim()) {
      errors.phone = 'Укажите номер телефона';
    }

    if (!this._address.trim()) {
      errors.address = 'Укажите адрес доставки';
    }

    return errors;
  }
}
