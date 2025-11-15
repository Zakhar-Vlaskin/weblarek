export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export type TPayment = 'Card' | 'Cash' | ''; // Тип оплаты

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

//Для учета товаров используемых в приложении
export interface IProduct {
  id: string; //Уникальный идентификатор товара
  description: string; // Подробное описание товара
  image: string; //Ссылка на изображение товара
  title: string; //Нахвание товара
  category: string; // Категория товара
  price: number | null; // Цена товара(товар может не иметь цену)
}

//Для учета покупателей/пользователей использующих приложение
export interface IBuyer {
  payment: TPayment; // Способ оплаты 
  email: string; // Адрес почты 
  phone: string; // Номер телефона
  address: string; // Адрес доставки
}

export interface IBuyerValidationResult {
    payment?: string;
    email?: string;
    phone?: string;
    address?: string;
}

// Типы для работы с API
export interface IOrderData {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
  items: string[]; // массив ID товаров
  total: number;   // общая стоимость заказа
}

export interface IOrderResult {
  id: string;      // ID созданного заказа
  total: number;   // общая стоимость заказа
}