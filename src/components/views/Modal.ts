import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IModal {
  content: HTMLElement;
}

export class Modal extends Component<IModal> {
  protected closeButton: HTMLButtonElement;
  protected contentContainer: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);
    this.contentContainer = ensureElement<HTMLElement>('.modal__content', this.container);
    
    this.closeButton.addEventListener('click', this.close.bind(this));
    this.container.addEventListener('click', (event) => {
      if (event.target === this.container) {
        this.close();
      }
    });
    this.contentContainer.addEventListener('click', (event) => event.stopPropagation());
    
    // Добавляем обработку клавиши Escape
    document.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.key === 'Escape' && this.container.classList.contains('modal_active')) {
        this.close();
      }
    });
  }

  set content(value: HTMLElement) {
    this.contentContainer.replaceChildren(value);
  }

  open() {
    this.container.classList.add('modal_active');
    this.events.emit('modal:open');
  }

  close() {
    this.container.classList.remove('modal_active');
    this.contentContainer.replaceChildren();
    this.events.emit('modal:close');
  }
}