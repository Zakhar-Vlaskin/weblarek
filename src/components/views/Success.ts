import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface ISuccess {
  description: number; // Оставляем number, так как это сумма
}

export class Success extends Component<ISuccess> {
  protected descriptionElement: HTMLElement;
  protected closeButton: HTMLButtonElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);

    this.descriptionElement = ensureElement<HTMLElement>('.order-success__description', container);
    this.closeButton = ensureElement<HTMLButtonElement>('.order-success__close', container);

    this.closeButton.addEventListener('click', () => {
      events.emit('success:close');
    });
  }

  set description(value: number) {
    this.setText(this.descriptionElement, `Списано ${value} синапсов`);
  }

  protected setText(element: HTMLElement, value: string) {
    if (element) {
      element.textContent = value;
    }
  }
}