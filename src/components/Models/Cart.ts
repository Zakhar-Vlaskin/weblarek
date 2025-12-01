import { IProduct } from "../../types";
import { EventEmitter } from "../base/Events";

export class Cart {
  private _items: IProduct[];

  constructor(private events: EventEmitter, items?: IProduct[]) {
    this._items = items || [];
  }

  getItems(): IProduct[] {
    return this._items;
  }

  addItem(item: IProduct) {
    this._items.push(item);
    this.events.emit('cart:changed');
  }

  removeItem(item: IProduct) {
    const index = this._items.findIndex(cartItem => cartItem.id === item.id);
    if (index !== -1) {
      this._items.splice(index, 1);
      this.events.emit('cart:changed');
    }
  }

  clear() {
    this._items = [];
    this.events.emit('cart:changed');
  }

  getTotalPrice(): number {
    return this._items.reduce((total, item) => total + (item.price || 0), 0);
  }

  getTotalCount(): number {
    return this._items.length;
  }

  contains(id: string): boolean {
    return this._items.some(item => item.id === id);
  }
}