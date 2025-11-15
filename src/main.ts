import './scss/styles.scss';

// Импортируем все классы
import { Api } from './components/base/Api';
import { ApiClient } from './components/base/ApiClient';
import { ProductList } from './components/base/Models/ProductList';
import { Cart } from './components/base/Models/Cart';
import { Buyer } from './components/base/Models/Buyer';

async function main() {
  // Адрес сервера из Postman
  const API_BASE_URL = import.meta.env.VITE_API_ORIGIN;

  // 1. СОЗДАЕМ ВСЕ КЛАССЫ    
  const api = new Api(API_BASE_URL);
  const apiClient = new ApiClient(api);
  const productList = new ProductList();
  const cart = new Cart();
  const buyer = new Buyer();

  console.log("=== Тестирование всех методов моделей данных ===");
  console.log("=== 1 - ProductList ===");
  const serverProducts = await apiClient.getProductList(); // Получаем товары с сервера

  // 1) Сохраняем товары в наш экземпляр класса
  productList.setItems(serverProducts);
  console.log(`1) Кол-во товаров которые мы храним: ${productList.getItems().length}`) // Проверяю что товары действительно сохранились

  // 2) Метод получения товаров из массива
  console.log("2) Массив товаров из каталога: ", productList.getItems()) 

  // 3) Метод получение одного товара по его id
  console.log("3) Полученный товар по id: ", productList.getItem("854cef69-976d-4c2a-a18c-2aa45046c390"));

  // 4) Метод сохранение товара для подробного отображения и 5) Метод получение товара для подробного отображения

  productList.setSelectedItem(serverProducts[0]);
  console.log("4) и 5) Проверка сохранился ли товар", productList.getSelectedItem());



  console.log("=== 2 - Cart ===");

  // 1) Метод добавление товара, который был получен в параметре, в массив корзины
  cart.addItem(serverProducts[2]);
  console.log("Количество товаров в корзине = ", cart.getTotalCount());
  cart.addItem(serverProducts[1]);

  // 2) Метод получение массива товаров, которые находятся в корзине
  console.log("Товары хранящиеся в корзине: ", cart.getItems());

  // 3) Метод удаление товара, полученного в параметре из массива корзины
  console.log("количество товаров в корзине до удаления одного из них = ", cart.getTotalCount());
  cart.removeItem(serverProducts[1]);
  console.log("количество товаров в корзине после = ", cart.getTotalCount());

  // 4) Метод очистка корзины
  cart.clear();
  console.log("количество товаров в корзине после полной отчистки = ", cart.getTotalCount());


  // 5) Метод получение стоимости всех товаров в корзине
  // Сначало добавим товары чтобы там хоть чтото было
  cart.addItem(serverProducts[2]);
  cart.addItem(serverProducts[1]);
  cart.addItem(serverProducts[5]);
  console.log("Общая стоимость товаров лежащих в корзине = ", cart.getTotalPrice());

  // 6) Метод получение количества товаров в корзине
  console.log("Количество товаров лежащих в корзине = ", cart.getTotalCount());

  // 7) Метод проверка наличия товара в корзине по его id, полученного в параметр метода
  console.log("Есть ли в корзине товар с id = 1: ", cart.contains('1'));


  console.log("=== 3 - buyer ===");

  // 1) Метод сохранение данных в модели и 2) Метод получение всех данных покупателя
  buyer.setData ({
    payment: 'Card',
    email: 'wfwefwefwef@mail.ru',
    phone: '+7912352235789',
    address: 'Казань'
  });

  console.log("Данные по заказу: ",  buyer.getData());

  // Проверяем сохранит ли если ввести только часть данных
  buyer.setData ({
    payment: 'Cash',
    address: 'Москва'
  });

  console.log("Данные по заказу после измениния: ",  buyer.getData());


  // 3) Метод очистка данных покупателя
  buyer.clear();
  console.log("Данные по заказу после удаления: ",  buyer.getData());
}


main();