import './scss/styles.scss';

import { API_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';

import { ApiClient } from './components/api/ApiClient';

import { ProductList } from './components/Models/ProductList';
import { Cart } from './components/Models/Cart';
import { Buyer } from './components/Models/Buyer';

import { Header } from './components/Views/Header';
import { Catalog } from './components/Views/Catalog';
import { ProductCard } from './components/Views/ProductCard';
import { ProductPreview } from './components/Views/ProductPreview';
import { Basket } from './components/Views/Basket';
import { BasketItem } from './components/Views/BasketItem';
import { Modal } from './components/Views/Modal';
import { OrderPaymentForm } from './components/Views/OrderPaymentForm';
import { OrderContactsForm } from './components/Views/OrderContactsForm';
import { Success } from './components/Views/Success';

import { IProduct, IOrderData } from './types';

// ---------- Инициализация инфраструктуры ----------

const events = new EventEmitter();

const api = new Api(API_URL);
const apiClient = new ApiClient(api);

// ---------- Модели ----------

const productList = new ProductList(events);
const cart = new Cart(events);
const buyer = new Buyer(events);

// Флаг: открыто ли сейчас превью товара в модалке
let isPreviewOpen = false;

// ---------- DOM-элементы и представления ----------

// Корневые элементы
const headerElement = ensureElement<HTMLElement>('.header');
const catalogElement = ensureElement<HTMLElement>('.gallery');
const modalElement = ensureElement<HTMLElement>('.modal');

// Шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderPaymentTemplate = ensureElement<HTMLTemplateElement>('#order');
const orderContactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const basketItemTemplate = ensureElement<HTMLTemplateElement>('#card-basket');

// Представления
const header = new Header(events, headerElement);
const catalogView = new Catalog(catalogElement);
const modal = new Modal(events, modalElement);

const productPreviewView = new ProductPreview(events, cloneTemplate<HTMLElement>(cardPreviewTemplate));
const basketView = new Basket(events, cloneTemplate<HTMLElement>(basketTemplate));
const orderPaymentView = new OrderPaymentForm(events, cloneTemplate<HTMLElement>(orderPaymentTemplate));
const orderContactsView = new OrderContactsForm(events, cloneTemplate<HTMLElement>(orderContactsTemplate));
const successView = new Success(events, cloneTemplate<HTMLElement>(successTemplate));

// ---------- Хелперы презентера ----------

// Создать карточку товара для каталога
function createCatalogCard(product: IProduct): HTMLElement {
  const card = new ProductCard(events, cloneTemplate<HTMLElement>(cardCatalogTemplate));
  return card.render({
    id: product.id,
    title: product.title,
    price: product.price,
    category: product.category,
    image: product.image,
    inCart: cart.contains(product.id),
  });
}

// Создать элемент строки в корзине
function createBasketItem(product: IProduct, index: number): HTMLElement {
  const item = new BasketItem(events, cloneTemplate<HTMLElement>(basketItemTemplate));
  return item.render({
    id: product.id,
    index,
    title: product.title,
    price: product.price,
  });
}

// Отрисовать каталог по данным модели
function renderCatalog() {
  const items = productList.getItems();
  const cards = items.map((product) => createCatalogCard(product));
  catalogView.render({ items: cards });
}

// Отрисовать корзину по данным модели
function renderCart() {
  const items = cart.getItems();
  const views = items.map((product, index) => createBasketItem(product, index + 1));

  basketView.render({
    items: views,
    total: cart.getTotalPrice(),
    emptyText: 'Корзина пуста',
  });

  header.counter = cart.getTotalCount();
}

// Отрисовать форму оплаты/адреса по модели покупателя
function renderPaymentForm() {
  const data = buyer.getData();
  const errors = buyer.validate();

  orderPaymentView.render({
    payment: data.payment,
    address: data.address,
    errors: {
      payment: errors.payment,
      address: errors.address,
    },
    valid: !errors.payment && !errors.address,
  });
}

// Отрисовать форму контактов по модели покупателя
function renderContactsForm() {
  const data = buyer.getData();
  const errors = buyer.validate();

  orderContactsView.render({
    email: data.email,
    phone: data.phone,
    errors: {
      email: errors.email,
      phone: errors.phone,
    },
    valid: !errors.email && !errors.phone,
  });
}

// ---------- Обработка событий МОДЕЛЕЙ ----------

// Изменение каталога товаров
events.on('catalog:changed', () => {
  renderCatalog();
});

// Изменение выбранного товара для просмотра
events.on('product:selected', () => {
  const product = productList.getSelectedItem();
  if (!product) return;

  const view = productPreviewView.render({
    id: product.id,
    title: product.title,
    price: product.price,
    category: product.category,
    image: product.image,
    description: product.description,
    inCart: cart.contains(product.id),
  });

  modal.open(view);
  isPreviewOpen = true;
});

// Изменение содержимого корзины
events.on('cart:changed', () => {
  // Перерисовать корзину
  renderCart();

  // Перерисовать каталог — чтобы карточки учитывали состояние "в корзине"
  renderCatalog();

  // Перерисовать превью, ТОЛЬКО если оно реально открыто
  const selected = productList.getSelectedItem();
  if (isPreviewOpen && selected) {
    const view = productPreviewView.render({
      id: selected.id,
      title: selected.title,
      price: selected.price,
      category: selected.category,
      image: selected.image,
      description: selected.description,
      inCart: cart.contains(selected.id),
    });

    modal.setContent(view);
  }

  // Обновить счётчик в хедере (на случай, если где-то ещё будет использоваться)
  header.counter = cart.getTotalCount();
});

// Изменение данных покупателя
events.on('buyer:changed', () => {
  renderPaymentForm();
  renderContactsForm();
});

// ---------- Обработка событий ПРЕДСТАВЛЕНИЙ ----------

// Заголовок — открыть корзину
events.on('basket:open', () => {
  renderCart();
  modal.open(basketView.render());
  isPreviewOpen = false;
});

// Клик по карточке в каталоге — выбор товара для просмотра
events.on<{ id: string }>('product:select', (data) => {
  const product = productList.getItem(data.id);
  if (!product) return;
  productList.setSelectedItem(product);
});

// Нажатие на кнопку в превью ("В корзину" / "Удалить из корзины")
events.on<{ id: string }>('product:add-to-cart', (data) => {
  const product = productList.getItem(data.id);
  if (!product) return;

  // Товары без цены недоступны для покупки
  if (product.price === null) return;

  // Переключатель: если товар уже в корзине — удаляем, иначе добавляем
  if (cart.contains(product.id)) {
    cart.removeItem(product);
  } else {
    cart.addItem(product);
  }
});

// Удаление товара из корзины (кнопка в строке корзины)
events.on<{ id: string }>('basket:item-remove', (data) => {
  const product = cart.getItems().find((item) => item.id === data.id);
  if (!product) return;
  cart.removeItem(product);
});

// Нажатие "Оформить" в корзине — открыть форму оплаты
events.on('order:open-payment', () => {
  renderPaymentForm();
  modal.open(orderPaymentView.render());
  isPreviewOpen = false;
});

// Изменение полей формы оплаты (адрес/способ)
events.on<{ field: 'address' | 'payment'; value: string }>(
  'order:payment-change',
  (data) => {
    buyer.setData({ [data.field]: data.value } as any);
  }
);

// Сабмит формы оплаты
events.on('order:payment-submit', () => {
  const errors = buyer.validate();
  if (errors.payment || errors.address) {
    renderPaymentForm();
    return;
  }

  renderContactsForm();
  modal.open(orderContactsView.render());
  isPreviewOpen = false;
});

// Изменение полей формы контактов
events.on<{ field: 'email' | 'phone'; value: string }>(
  'order:contacts-change',
  (data) => {
    buyer.setData({ [data.field]: data.value } as any);
  }
);

// Сабмит формы контактов — отправка заказа
events.on('order:contacts-submit', async () => {
  const errors = buyer.validate();
  if (errors.email || errors.phone) {
    renderContactsForm();
    return;
  }

  const buyerData = buyer.getData();
  const items = cart.getItems();

  const orderData: IOrderData = {
    payment: buyerData.payment,
    email: buyerData.email,
    phone: buyerData.phone,
    address: buyerData.address,
    items: items.map((item) => item.id),
    total: cart.getTotalPrice(),
  };

  try {
    const result = await apiClient.submitOrder(orderData);

    // Очищаем корзину и покупателя
    cart.clear();
    buyer.clear();

    const view = successView.render({ total: result.total });
    modal.open(view);
    isPreviewOpen = false;
  } catch (error) {
    console.error('Ошибка при оформлении заказа', error);
  }
});

// Закрытие модалки успеха
events.on('order:success-close', () => {
  modal.close();
  isPreviewOpen = false;
});

// ---------- Старт приложения: загрузка каталога ----------

apiClient
  .getProductList()
  .then((products) => {
    productList.setItems(products);
  })
  .catch((error) => {
    console.error('Ошибка при загрузке каталога', error);
  });
