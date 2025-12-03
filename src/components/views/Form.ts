import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

/**
 * Базовый класс для всех форм оформления заказа.
 * Отвечает за:
 * - поиск и хранение form, кнопки submit и контейнера ошибок;
 * - обработку события submit и генерацию события во внешнюю систему;
 * - общие методы установки ошибок и валидности формы.
 */
export abstract class Form<T> extends Component<T> {
  protected formElement: HTMLFormElement;
  protected submitButton: HTMLButtonElement;
  protected errorsElement: HTMLElement;

  constructor(
    protected events: IEvents,
    container: HTMLElement,
    protected submitEventName: string // имя события, которое генерируется при submit
  ) {
    super(container);

    this.formElement = this.container as HTMLFormElement;
    this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', this.formElement);
    this.errorsElement = ensureElement<HTMLElement>('.form__errors', this.formElement);

    this.formElement.addEventListener('submit', (event) => {
      event.preventDefault();
      this.events.emit(this.submitEventName);
    });
  }

  /**
   * Установить текст ошибок формы.
   * Принимает массив строк (часть может быть undefined), объединяет их в одну строку.
   */
  protected setErrors(errors?: (string | undefined)[]) {
    const messages = (errors ?? []).filter((msg): msg is string => Boolean(msg));
    this.errorsElement.textContent = messages.join('. ');
  }

  /**
   * Установить состояние валидности формы.
   * При valid === true кнопка сабмита активна, иначе — заблокирована.
   */
  protected setValid(valid?: boolean) {
    if (typeof valid === 'boolean') {
      this.submitButton.disabled = !valid;
    }
  }
}
