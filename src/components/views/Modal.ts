import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export interface IModalView {
  content?: HTMLElement;
}

export class Modal extends Component<IModalView> {
  protected contentElement: HTMLElement;
  protected closeButton: HTMLButtonElement;

  constructor(
    protected events: IEvents,
    container: HTMLElement
  ) {
    super(container);

    this.contentElement = ensureElement<HTMLElement>('.modal__content', this.container);
    this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);

    // Кнопка закрытия
    this.closeButton.addEventListener('click', () => {
      this.close();
    });

    // Клик по фону
    this.container.addEventListener('click', (event) => {
      if (event.target === this.container) {
        this.close();
      }
    });
  }

  setContent(content: HTMLElement) {
    this.contentElement.innerHTML = '';
    this.contentElement.append(content);
  }

  open(content?: HTMLElement) {
    if (content) {
      this.setContent(content);
    }
    this.container.classList.add('modal_active');
    this.events.emit('modal:open', {});
  }

  close() {
    this.container.classList.remove('modal_active');
    this.events.emit('modal:close', {});
  }

  render(data?: Partial<IModalView>): HTMLElement {
    if (data?.content) {
      this.setContent(data.content);
    }
    return this.container;
  }
}
