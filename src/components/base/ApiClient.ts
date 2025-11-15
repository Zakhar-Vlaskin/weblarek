import { IApi, IProduct, IOrderData, IOrderResult } from '../../types';

export class ApiClient {
  private _api: IApi;

  constructor(api: IApi) {
    this._api = api;
  }

  // Получает список товаров с сервера
  async getProductList(): Promise<IProduct[]> {
    const response = await this._api.get('/api/weblarek/product/');
        
    if ('items' in response && Array.isArray(response.items)) {
      return response.items as IProduct[];
    }
        
    throw new Error('Неверный формат данных от сервера');
  }

  async submitOrder(orderData: IOrderData): Promise<IOrderResult> {
  const response = await this._api.post('/order/', orderData);
        
  if ('id' in response && 'total' in response) {
    return response as IOrderResult;
  }
        
  throw new Error('Неверный формат данных от сервера');
  }
}