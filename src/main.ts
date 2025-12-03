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

// ---------- ИНИЦИАЛИЗАЦИЯ ----------

const events = new EventEmitter();
const api = new Api(API_URL);
const apiClient = new ApiClient(api);

const productList = new ProductList(events);
const cart = new Cart(events);
const buyer = new Buyer(events);

// ---------- DOM ----------

const headerElement = ensureElement<HTMLElement>('.header');
const catalogElement = ensureElement<HTMLElement>('.gallery');
const modalElement = ensureElement<HTMLElement>('.modal');

// ---------- ШАБЛОНЫ ----------

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderPaymentTemplate = ensureElement<HTMLTemplateElement>('#order');
const orderContactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const basketItemTemplate = ensureElement<HTMLTemplateElement>('#card-basket');

// ---------- VIEW ----------

const header = new Header(events, headerElement);
const catalogView = new Catalog(catalogElement);
const modal = new Modal(events, modalElement);

const productPreviewView = new ProductPreview(events, cloneTemplate<HTMLElement>(cardPreviewTemplate));
const basketView = new Basket(events, cloneTemplate<HTMLElement>(basketTemplate));
const orderPaymentView = new OrderPaymentForm(events, cloneTemplate<HTMLElement>(orderPaymentTemplate));
const orderContactsView = new OrderContactsForm(events, cloneTemplate<HTMLElement>(orderContactsTemplate));
const successView = new Success(events, cloneTemplate<HTMLElement>(successTemplate));

// ---------- HELPERS ПРЕЗЕНТЕРА ----------

// Определяем, открыто ли сейчас превью товара в модалке
function isProductPreviewOpen(): boolean {
  const content = modalElement.querySelector('.modal__content');
  if (!content) return false;
  return Boolean(content.querySelector('.card.card_full'));
}

// Создать карточку каталога
function createCatalogCard(product: IProduct): HTMLElement {
  const card = new ProductCard(
    cloneTemplate<HTMLElement>(cardCatalogTemplate),
    (id: string) => {
      events.emit('product:select', { id });
    }
  );

  return card.render({
    id: product.id,
    title: product.title,
    price: product.price,
    category: product.category,
    image: product.image,
    inCart: cart.contains(product.id)
  });
}

// Создать строку товара в корзине
function createBasketItem(product: IProduct, index: number): HTMLElement {
  const item = new BasketItem(events, cloneTemplate<HTMLElement>(basketItemTemplate));
  return item.render({
    id: product.id,
    index,
    title: product.title,
    price: product.price
  });
}

// Отрисовать каталог
function renderCatalog() {
  const items = productList.getItems();
  const cards = items.map((product) => createCatalogCard(product));
  catalogView.items = cards;
}

// Отрисовать корзину
function renderCart() {
  const items = cart.getItems();
  const views = items.map((product, index) => createBasketItem(product, index + 1));

  basketView.items = views;
  basketView.total = cart.getTotalPrice();

  header.counter = cart.getTotalCount();
}

// Отрисовать форму оплаты
function renderPaymentForm() {
  const data = buyer.getData();
  const errors = buyer.validate();

  orderPaymentView.render({
    payment: data.payment,
    address: data.address,
    errors,
    valid: !errors.payment && !errors.address
  });
}

// Отрисовать форму контактов
function renderContactsForm() {
  const data = buyer.getData();
  const errors = buyer.validate();

  orderContactsView.render({
    email: data.email,
    phone: data.phone,
    errors,
    valid: !errors.email && !errors.phone
  });
}

// ---------- СОБЫТИЯ МОДЕЛЕЙ ----------

// Каталог обновился
events.on('catalog:changed', () => {
  renderCatalog();
});

// Выбран товар
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
    inCart: cart.contains(product.id)
  });

  modal.open(view);
});

// Корзина изменилась
events.on('cart:changed', () => {
  // Обновляем корзину
  renderCart();

  // Обновляем превью, если оно открыто
  const selected = productList.getSelectedItem();
  if (selected && isProductPreviewOpen()) {
    const view = productPreviewView.render({
      id: selected.id,
      title: selected.title,
      price: selected.price,
      category: selected.category,
      image: selected.image,
      description: selected.description,
      inCart: cart.contains(selected.id)
    });

    modal.setContent(view);
  }
});

// Данные покупателя изменились
events.on('buyer:changed', () => {
  renderPaymentForm();
  renderContactsForm();
});

// ---------- СОБЫТИЯ ПРЕДСТАВЛЕНИЙ ----------

// Открыть корзину
events.on('basket:open', () => {
  modal.open(basketView.render());
});

// Клик по карточке в каталоге
events.on<{ id: string }>('product:select', (data) => {
  const product = productList.getItem(data.id);
  if (!product) return;
  productList.setSelectedItem(product);
});

// Клик по кнопке в превью («В корзину» / «Удалить из корзины»)
events.on<{ id: string }>('product:add-to-cart', (data) => {
  const product = productList.getItem(data.id);
  if (!product) return;
  if (product.price === null) return;

  if (cart.contains(product.id)) {
    cart.removeById(product.id);
  } else {
    cart.addItem(product);
  }
});

// Удаление товара из корзины
events.on<{ id: string }>('basket:item-remove', (data) => {
  cart.removeById(data.id);
});

// Открыть форму оплаты
events.on('order:open-payment', () => {
  renderPaymentForm();
  modal.open(orderPaymentView.render());
});

// Изменение полей формы оплаты
events.on<{ field: 'address' | 'payment'; value: string }>(
  'order:payment-change',
  (data) => {
    buyer.setData({ [data.field]: data.value });
  }
);

// Сабмит формы оплаты — просто переход ко второй форме
events.on('order:payment-submit', () => {
  renderContactsForm();
  modal.open(orderContactsView.render());
});

// Изменение полей формы контактов
events.on<{ field: 'email' | 'phone'; value: string }>(
  'order:contacts-change',
  (data) => {
    buyer.setData({ [data.field]: data.value });
  }
);

// Сабмит формы контактов — оформление заказа
events.on('order:contacts-submit', async () => {
  const buyerData = buyer.getData();
  const items = cart.getItems();

  const orderData: IOrderData = {
    payment: buyerData.payment,
    email: buyerData.email,
    phone: buyerData.phone,
    address: buyerData.address,
    items: items.map((p) => p.id),
    total: cart.getTotalPrice()
  };

  try {
    const result = await apiClient.submitOrder(orderData);

    cart.clear();
    buyer.clear();

    const view = successView.render({ total: result.total });
    modal.open(view);
  } catch (error) {
    console.error('Ошибка оформления заказа', error);
  }
});

// Закрыть окно успеха
events.on('order:success-close', () => {
  modal.close();
});

// ---------- СТАРТ ПРИЛОЖЕНИЯ ----------

apiClient
  .getProductList()
  .then((products) => {
    productList.setItems(products);
  })
  .catch((error) => {
    console.error('Ошибка загрузки каталога', error);
  });
