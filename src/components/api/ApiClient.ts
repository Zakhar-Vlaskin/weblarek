import { IApi, IProduct, IOrderData, IOrderResult } from '../../types';

export class ApiClient {
  private _api: IApi;

  constructor(api: IApi) {
    this._api = api;
  }

  async getProductList(): Promise<IProduct[]> {
    const response = await this._api.get<{ total: number; items: IProduct[] }>('/product/');
    return response.items;
  }

  async submitOrder(orderData: IOrderData): Promise<IOrderResult> {
    const response = await this._api.post<IOrderResult>('/order/', orderData);
    return response;
  }
}