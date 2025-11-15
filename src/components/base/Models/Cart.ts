import { IProduct } from "../../../types";

export class Cart {
  private _items: IProduct[];

  constructor(items?: IProduct[]) {
    this._items = items || [];
  }

  // Метод получение массива товаров, которые находятся в корзине
  getItems(): IProduct[] {
    return this._items;
  }

  // Метод добавление товара, который был получен в параметре, в массив корзины
  addItem(item: IProduct) {
    this._items.push(item);
  }

  // Метод удаление товара, полученного в параметре из массива корзины
  removeItem(item: IProduct) {
    const index = this._items.findIndex(cartItem => cartItem.id === item.id)
    if(index !== -1) {
      this._items.splice(index, 1);
    }
  }

  //Метод очистка корзины
  clear() {
    this._items = [];
  }

  // Метод получение стоимости всех товаров в корзине
  getTotalPrice(): number {
    return this._items.reduce((total, item) => {
      return total + (item.price || 0); 
    },0)
  }
  
  // Метод получение количества товаров в корзине
  getTotalCount(): number {
    return this._items.length;
  }

  // Метод проверка наличия товара в корзине по его id, полученного в параметр метода
  contains(id: string): boolean {
    return this._items.some(item => item.id === id);
  }
}