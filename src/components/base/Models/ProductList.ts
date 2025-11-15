import { IProduct } from "../../../types";

export class ProductList {
  private _items: IProduct[];
  private _selectedItem: IProduct | null;
  
  constructor(products?: IProduct[]) {
    this._items = products || []; // массив всех товаров в каталоге
    this._selectedItem = null; // Текущий выбранный товар для просмотра деталей
  }

  // Метод сохранения массива товаров
  setItems(item: IProduct[]) {
    this._items = item;
  }

  // Метод получение массива товаров из модели
  getItems(): IProduct[] {
    return this._items;
  }

  // Метод получение одного товара по его id
  getItem(id: string): IProduct | undefined {
    return this._items.find(item => item.id === id)
  }

  // Метод сохранение товара для подробного отображения
  setSelectedItem(item: IProduct) {
    this._selectedItem = item;
  }

  // Метод получение товара для подробного отображения
  getSelectedItem(): IProduct | null {
    return this._selectedItem;
  }
}