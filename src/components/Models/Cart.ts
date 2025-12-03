// src/components/Models/Cart.ts
import { IProduct } from '../../types';
import { IEvents } from '../base/Events';

export class Cart {
  private items: IProduct[];

  constructor(
    private events: IEvents,
    items?: IProduct[]
  ) {
    this.items = items ?? [];
  }

  // Массив товаров в корзине
  getItems(): IProduct[] {
    return this.items;
  }

  // Добавить товар в корзину
  addItem(item: IProduct) {
    this.items.push(item);
    this.events.emit('cart:changed', {});
  }

  // Удалить товар из корзины
  removeItem(item: IProduct) {
    const index = this.items.findIndex((cartItem) => cartItem.id === item.id);
    if (index !== -1) {
      this.items.splice(index, 1);
      this.events.emit('cart:changed', {});
    }
  }

  // Очистить корзину целиком
  clear() {
    if (this.items.length === 0) return;
    this.items = [];
    this.events.emit('cart:changed', {});
  }

  // Общая стоимость всех товаров
  getTotalPrice(): number {
    return this.items.reduce((total, item) => total + (item.price || 0), 0);
  }


  removeById(id: string): void {
  const index = this.items.findIndex((item) => item.id === id);
    if (index !== -1) {
      this.items.splice(index, 1);
      this.events.emit('cart:changed', {});
    }
  }


  // Количество товаров
  getTotalCount(): number {
    return this.items.length;
  }

  // Есть ли товар с таким id в корзине
  contains(id: string): boolean {
    return this.items.some((item) => item.id === id);
  }
}
