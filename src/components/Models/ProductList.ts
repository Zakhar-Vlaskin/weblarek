import { IProduct } from "../../types";
import { EventEmitter } from "../base/Events";

export class ProductList {
  private _items: IProduct[];
  private _selectedItem: IProduct | null;
  
  constructor(private events: EventEmitter, products?: IProduct[]) {
    this._items = products || [];
    this._selectedItem = null;
  }

  setItems(item: IProduct[]) {
    this._items = item;
    this.events.emit('productlist:changed');
  }

  getItems(): IProduct[] {
    return this._items;
  }

  getItem(id: string): IProduct | undefined {
    return this._items.find(item => item.id === id);
  }

  setSelectedItem(item: IProduct) {
    this._selectedItem = item;
  }

  getSelectedItem(): IProduct | null {
    return this._selectedItem;
  }
}