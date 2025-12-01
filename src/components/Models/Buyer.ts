import { IBuyer, TPayment, IBuyerValidationResult } from "../../types";
import { EventEmitter } from "../base/Events";

export class Buyer {
  private _payment: TPayment;
  private _address: string;
  private _phone: string;
  private _email: string;

  constructor(private events: EventEmitter, data?: Partial<IBuyer>) {
    this._payment = data?.payment || '';
    this._address = data?.address || '';
    this._phone = data?.phone || '';
    this._email = data?.email || '';
  }

  setData(data: Partial<IBuyer>) {
    if (data.payment !== undefined) this._payment = data.payment;
    if (data.address !== undefined) this._address = data.address;
    if (data.phone !== undefined) this._phone = data.phone;
    if (data.email !== undefined) this._email = data.email;
    
    this.events.emit('buyer:changed');
  }

  getData(): IBuyer {
    return {
      payment: this._payment,
      address: this._address,
      phone: this._phone,
      email: this._email,
    };
  }

  clear() {
    this._payment = '';
    this._address = '';
    this._phone = '';
    this._email = '';
    this.events.emit('buyer:changed');
  }

  validate(): IBuyerValidationResult {
    const errors: IBuyerValidationResult = {};
    if (!this._payment) errors.payment = 'Не выбран вид оплаты';
    if (!this._email.trim()) errors.email = 'Укажите email';
    if (!this._phone.trim()) errors.phone = 'Укажите номер телефона';
    if (!this._address.trim()) errors.address = 'Укажите адрес доставки';
    return errors;
  }
}