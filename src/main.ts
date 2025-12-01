import './scss/styles.scss';

import { Api } from './components/base/Api';
import { ApiClient } from './components/api/ApiClient';
import { EventEmitter } from './components/base/Events';
import { ProductList } from './components/Models/ProductList';
import { Cart } from './components/Models/Cart';
import { Buyer } from './components/Models/Buyer';

import { Header } from './components/views/Header';
import { Catalog } from './components/views/Catalog';
import { Modal } from './components/views/Modal';
import { Card } from './components/views/Card';
import { Basket } from './components/views/Basket';
import { Order } from './components/views/Order';
import { Contacts } from './components/views/Contacts';
import { Success } from './components/views/Success';

import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

import { IProduct, IOrderData, TPayment } from './types';

// ========== ИНИЦИАЛИЗАЦИЯ ==========

const events = new EventEmitter();

// Модели с EventEmitter
const productModel = new ProductList(events);
const cartModel = new Cart(events);
const buyerModel = new Buyer(events);

const api = new Api(API_URL);
const apiClient = new ApiClient(api);

let header: Header;
let catalog: Catalog;
let modal: Modal;

let cardCatalogTemplate: HTMLTemplateElement;
let cardPreviewTemplate: HTMLTemplateElement;
let cardBasketTemplate: HTMLTemplateElement;
let basketTemplate: HTMLTemplateElement;
let orderTemplate: HTMLTemplateElement;
let contactsTemplate: HTMLTemplateElement;
let successTemplate: HTMLTemplateElement;

// ========== ОБРАБОТЧИКИ СОБЫТИЙ ==========

function handleProductListChanged() {
  const products = productModel.getItems();
  const cards = products.map(createCatalogCard);
  
  if (catalog) {
    catalog.items = cards;
  }
}

function createCatalogCard(product: IProduct): HTMLElement {
  const cardElement = cloneTemplate<HTMLElement>(cardCatalogTemplate);
  const card = new Card(cardElement, {
    onClick: () => events.emit('card:select', { id: product.id })
  });

  const button = cardElement.querySelector('.card__button');
  if (button) {
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      events.emit('card:add', { id: product.id });
    });
  }

  card.render({
    id: product.id,
    title: product.title,
    image: CDN_URL + product.image,
    category: product.category,
    price: product.price
  });

  return cardElement;
}

function handleCardSelect(data: { id: string }) {
  const product = productModel.getItem(data.id);
  if (!product) return;

  productModel.setSelectedItem(product);
  
  const previewElement = cloneTemplate<HTMLElement>(cardPreviewTemplate);
  const previewCard = new Card(previewElement, {
    onClick: () => events.emit('card:add', { id: product.id })
  });

  const isInCart = cartModel.contains(product.id);
  
  previewCard.render({
    id: product.id,
    title: product.title,
    image: CDN_URL + product.image,
    category: product.category,
    price: product.price,
    description: product.description,
    buttonText: isInCart ? 'Уже в корзине' : 'В корзину',
    buttonDisabled: isInCart
  });

  modal.content = previewCard.render();
  modal.open();
}

function handleCardAdd(data: { id: string }) {
  const product = productModel.getItem(data.id);
  if (!product || cartModel.contains(product.id)) return;

  cartModel.addItem(product);
  // cartModel сам вызовет events.emit('cart:changed')
}

function handleCartChanged() {
  if (header) {
    header.counter = cartModel.getTotalCount();
  }
}

function handleBasketOpen() {
  const basketElement = cloneTemplate<HTMLElement>(basketTemplate);
  const basket = new Basket(events, basketElement);
  
  const items = cartModel.getItems();
  const basketItems = items.map((item, index) => {
    const cardElement = cloneTemplate<HTMLElement>(cardBasketTemplate);
    
    const title = cardElement.querySelector('.card__title');
    const price = cardElement.querySelector('.card__price');
    const indexEl = cardElement.querySelector('.basket__item-index');
    const deleteButton = cardElement.querySelector('.basket__item-delete');
    
    if (title) title.textContent = item.title;
    if (price) price.textContent = item.price ? `${item.price} синапсов` : 'Бесценно';
    if (indexEl) indexEl.textContent = String(index + 1);
    
    if (deleteButton) {
      deleteButton.addEventListener('click', () => {
        events.emit('card:remove', { id: item.id });
      });
    }
    
    return cardElement;
  });
  
  basket.render({
    items: basketItems,
    total: cartModel.getTotalPrice(),
    selected: items.map(item => item.id)
  });
  
  modal.content = basket.render();
  modal.open();
}

function handleCardRemove(data: { id: string }) {
  const product = cartModel.getItems().find(p => p.id === data.id);
  if (!product) return;

  cartModel.removeItem(product);
  // cartModel сам вызовет events.emit('cart:changed')
}

function handleOrderOpen() {
  const orderElement = cloneTemplate<HTMLElement>(orderTemplate);
  const order = new Order(events, orderElement);
  
  const buyerData = buyerModel.getData();
  
  order.render({
    address: buyerData.address || '',
    payment: buyerData.payment || '',
    valid: false,
    errors: ''
  });
  
  modal.content = order.render();
  modal.open();
}

function handlePaymentChanged(data: { payment: TPayment }) {
  buyerModel.setData({ payment: data.payment });
  // buyerModel сам вызовет events.emit('buyer:changed')
}

function handleAddressChange(data: { value: string }) {
  buyerModel.setData({ address: data.value });
}

function handleOrderSubmit() {
  const contactsElement = cloneTemplate<HTMLElement>(contactsTemplate);
  const contacts = new Contacts(events, contactsElement);
  
  const buyerData = buyerModel.getData();
  
  contacts.render({
    email: buyerData.email || '',
    phone: buyerData.phone || '',
    valid: false,
    errors: ''
  });
  
  modal.content = contacts.render();
  modal.open();
}

function handleEmailChange(data: { value: string }) {
  buyerModel.setData({ email: data.value });
}

function handlePhoneChange(data: { value: string }) {
  buyerModel.setData({ phone: data.value });
}

function handleBuyerChanged() {
  const errors = buyerModel.validate();
  // Можно обновить состояние форм на основе ошибок
}

async function handleContactsSubmit() {
  try {
    const buyerData = buyerModel.getData();
    const cartItems = cartModel.getItems();
    
    const errors = buyerModel.validate();
    if (Object.keys(errors).length > 0) {
      console.error('Ошибки валидации:', errors);
      return;
    }
    
    if (cartItems.length === 0) {
      console.error('Корзина пуста');
      return;
    }
    
    const orderData: IOrderData = {
      payment: buyerData.payment,
      email: buyerData.email,
      phone: buyerData.phone,
      address: buyerData.address,
      total: cartModel.getTotalPrice(),
      items: cartItems.map(item => item.id)
    };
    
    const result = await apiClient.submitOrder(orderData);
    
    const successElement = cloneTemplate<HTMLElement>(successTemplate);
    const success = new Success(events, successElement);
    
    success.render({
      description: result.total
    });
    
    modal.content = success.render();
    
  } catch (error) {
    console.error('Ошибка при оформлении заказа:', error);
  }
}

function handleSuccessClose() {
  cartModel.clear();
  buyerModel.clear();
  // Модели сами вызовут события
  modal.close();
}

function setupEventListeners() {
  events.on('productlist:changed', handleProductListChanged);
  events.on('cart:changed', handleCartChanged);
  events.on('buyer:changed', handleBuyerChanged);
  
  events.on('basket:open', handleBasketOpen);
  events.on('card:select', handleCardSelect);
  events.on('card:add', handleCardAdd);
  events.on('card:remove', handleCardRemove);
  events.on('order:open', handleOrderOpen);
  events.on('order.payment:changed', handlePaymentChanged);
  events.on('order.address:change', handleAddressChange);
  events.on('order:submit', handleOrderSubmit);
  events.on('contacts:email:change', handleEmailChange);
  events.on('contacts:phone:change', handlePhoneChange);
  events.on('contacts:submit', handleContactsSubmit);
  events.on('success:close', handleSuccessClose);
}

// ========== ЗАГРУЗКА ДАННЫХ ==========

async function loadProducts() {
  try {
    const products = await apiClient.getProductList();
    productModel.setItems(products);
    // productModel сам вызовет events.emit('productlist:changed')
  } catch (error) {
    console.error('Ошибка загрузки товаров:', error);
  }
}

// ========== ИНИЦИАЛИЗАЦИЯ ПРИЛОЖЕНИЯ ==========

async function initApp() {
  try {
    const headerContainer = ensureElement<HTMLElement>('.header');
    const catalogContainer = ensureElement<HTMLElement>('.gallery');
    const modalContainer = ensureElement<HTMLElement>('#modal-container');
    
    cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
    cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
    cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
    basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
    orderTemplate = ensureElement<HTMLTemplateElement>('#order');
    contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
    successTemplate = ensureElement<HTMLTemplateElement>('#success');
    
    header = new Header(events, headerContainer);
    catalog = new Catalog(catalogContainer);
    modal = new Modal(modalContainer, events);
    
    setupEventListeners();
    
    await loadProducts();
    
  } catch (error) {
    console.error('Ошибка инициализации приложения:', error);
  }
}

// ========== ЗАПУСК ==========

document.addEventListener('DOMContentLoaded', () => {
  initApp();
});