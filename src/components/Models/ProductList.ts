import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class ProductList {
  private _items: IProduct[];
  private _selectedItem: IProduct | null;
  private events: IEvents;
  
  constructor(events: IEvents, products?: IProduct[]) {
    this.events = events;
    this._items = products || []; // массив всех товаров в каталоге
    this._selectedItem = null; // текущий выбранный товар
  }

  // Метод сохранения массива товаров
  setItems(items: IProduct[]) {
    this._items = items;
    this.events.emit('catalog:changed', {});
  }

  // Метод получения массива товаров из модели
  getItems(): IProduct[] {
    return this._items;
  }

  // Метод получение одного товара по его id
  getItem(id: string): IProduct | undefined {
    return this._items.find(item => item.id === id);
  }

  // Метод сохранения товара для подробного отображения
  setSelectedItem(item: IProduct | null) {
    this._selectedItem = item;
    this.events.emit('product:selected', {});
  }

  // Метод получения товара для подробного отображения
  getSelectedItem(): IProduct | null {
    return this._selectedItem;
  }
}
