// src/components/Models/ProductList.ts
import { IProduct } from '../../types';
import { IEvents } from '../base/Events';

export class ProductList {
  private items: IProduct[];
  private selectedItem: IProduct | null;

  constructor(
    private events: IEvents,
    products?: IProduct[]
  ) {
    this.items = products ?? [];
    this.selectedItem = null;
  }

  // Метод сохранения массива товаров
  setItems(items: IProduct[]) {
    this.items = items;
    // Сообщаем презентеру: каталог изменился
    this.events.emit('catalog:changed', {});
  }

  // Получить массив товаров
  getItems(): IProduct[] {
    return this.items;
  }

  // Получить товар по id
  getItem(id: string): IProduct | undefined {
    return this.items.find((item) => item.id === id);
  }

  // Сохранить выбранный товар для подробного просмотра
  setSelectedItem(item: IProduct) {
    this.selectedItem = item;
    // Сообщаем презентеру: выбран товар
    this.events.emit('product:selected', { id: item.id });
  }

  // Получить выбранный товар
  getSelectedItem(): IProduct | null {
    return this.selectedItem;
  }
}
