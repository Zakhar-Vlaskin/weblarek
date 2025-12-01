import { EventEmitter } from './components/base/Events';
import { Header } from './components/views/Header';

// Проверяем, что страница загружена
document.addEventListener('DOMContentLoaded', () => {
    console.log('=== Тестирование Header ===');
    
    // Находим существующий header на странице
    const headerElement = document.querySelector('.header');
    
    if (!headerElement) {
        console.error('❌ Header элемент не найден на странице!');
        return;
    }
    
    // Создаем EventEmitter
    const events = new EventEmitter();
    
    // Создаем Header
    const header = new Header(events, headerElement as HTMLElement);
    
    // Подписываемся на события
    events.on('basket:open', () => {
        console.log('✅ Событие basket:open сработало!');
    });
    
    // Тестируем установку counter
    console.log('Устанавливаю counter = 7...');
    header.counter = 7;
    
    // Проверяем результат
    const counter = document.querySelector('.header__basket-counter');
    console.log(`Текущее значение counter: ${counter?.textContent}`);
    
    // Проверяем кнопку
    const basketButton = document.querySelector('.header__basket');
    console.log(`Кнопка корзины найдена: ${!!basketButton}`);
    
    console.log('✅ Header готов к работе!');
    console.log('Кликни на корзину чтобы проверить событие basket:open');
});