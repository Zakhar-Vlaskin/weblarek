import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export interface ISuccessView {
  total: number;
}

export class Success extends Component<ISuccessView> {
  protected descriptionElement: HTMLElement;
  protected closeButton: HTMLButtonElement;

  constructor(
    protected events: IEvents,
    container: HTMLElement
  ) {
    super(container);

    this.descriptionElement = ensureElement<HTMLElement>('.order-success__description', this.container);
    this.closeButton = ensureElement<HTMLButtonElement>('.order-success__close', this.container);

    this.closeButton.addEventListener('click', () => {
      this.events.emit('order:success-close', {});
    });
  }

  render(data?: Partial<ISuccessView>): HTMLElement {
    if (data && data.total !== undefined) {
      this.descriptionElement.textContent = `Списано ${data.total} синапсов`;
    }
    return this.container;
  }
}
