import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IContacts {
  email: string;
  phone: string;
  valid: boolean;
  errors: string;
}

export class Contacts extends Component<IContacts> {
  protected emailInput: HTMLInputElement;
  protected phoneInput: HTMLInputElement;
  protected submitButton: HTMLButtonElement;
  protected errorsElement: HTMLElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);

    this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', container);
    this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', container);
    this.submitButton = ensureElement<HTMLButtonElement>('.button', container);
    this.errorsElement = ensureElement<HTMLElement>('.form__errors', container);

    // Обработчики изменения полей
    this.emailInput.addEventListener('input', () => {
      events.emit('contacts:email:change', { value: this.emailInput.value });
    });

    this.phoneInput.addEventListener('input', () => {
      events.emit('contacts:phone:change', { value: this.phoneInput.value });
    });

    // Обработчик отправки формы
    this.container.addEventListener('submit', (event) => {
      event.preventDefault();
      events.emit('contacts:submit');
    });
  }

  set email(value: string) {
    this.emailInput.value = value;
  }

  set phone(value: string) {
    this.phoneInput.value = value;
  }

  set valid(value: boolean) {
    this.submitButton.disabled = !value;
  }

  set errors(value: string) {
    this.setText(this.errorsElement, value);
  }

  protected setText(element: HTMLElement, value: string) {
    if (element) {
      element.textContent = value;
    }
  }
}