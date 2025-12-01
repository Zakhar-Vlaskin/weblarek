import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { categoryMap } from "../../utils/constants";

interface ICardActions {
  onClick: (event: MouseEvent) => void;
}

export interface ICard {
  id?: string;
  title: string;
  description?: string;
  image?: string; 
  category?: string;
  price: number | null;
  buttonText?: string;
  buttonDisabled?: boolean;
  index?: number;
}

export class Card extends Component<ICard> {
  protected _title: HTMLElement;
  protected _image: HTMLImageElement | null = null; 
  protected _category: HTMLElement | null = null; 
  protected _price: HTMLElement;
  protected _button: HTMLButtonElement | null = null;
  protected _description: HTMLElement | null = null;
  protected _index: HTMLElement | null = null;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);


    this._title = ensureElement<HTMLElement>('.card__title', this.container);
    this._price = ensureElement<HTMLElement>('.card__price', this.container);
    

    this._image = this.container.querySelector('.card__image');
    this._category = this.container.querySelector('.card__category');
    this._button = this.container.querySelector('.card__button');
    this._description = this.container.querySelector('.card__text');
    this._index = this.container.querySelector('.basket__item-index');

    if (actions?.onClick) {
      if (this._button) {
        this._button.addEventListener('click', actions.onClick);
      } else {
        container.addEventListener('click', actions.onClick);
      }
    }
  }

  set id(value: string) {
    this.container.dataset.id = value;
  }

  get id(): string {
    return this.container.dataset.id || '';
  }

  set title(value: string) {
    this.setText(this._title, value);
  }

  set image(value: string | undefined) {
    if (this._image && value) {
      this.setImage(this._image, value);
    }
  }

  set category(value: string | undefined) {
    if (this._category && value) {
      this.setText(this._category, value);
      
      // Удаляем все классы категорий
      Object.values(categoryMap).forEach(className => {
        this._category!.classList.remove(className);
      });
      
      // Добавляем соответствующий класс категории
      const categoryKey = value as keyof typeof categoryMap;
      if (categoryKey in categoryMap) {
        const categoryClass = categoryMap[categoryKey];
        this._category!.classList.add(categoryClass);
      } else {
        this._category!.classList.add('card__category_other');
      }
    }
  }

  set price(value: number | null) {
    if (value === null) {
      this.setText(this._price, 'Бесценно');
    } else {
      this.setText(this._price, `${value} синапсов`);
    }
  }

  set description(value: string | undefined) {
    if (this._description) {
      this.setText(this._description, value || '');
    }
  }

  set buttonText(value: string | undefined) {
    if (this._button && value) {
      this.setText(this._button, value);
    }
  }

  set buttonDisabled(value: boolean | undefined) {
    if (this._button && value !== undefined) {
      this._button.disabled = value;
    }
  }

  set index(value: number | undefined) {
    if (this._index && value !== undefined) {
      this.setText(this._index, String(value));
    }
  }

  protected setText(element: HTMLElement, value: string) {
    if (element) {
      element.textContent = value;
    }
  }
}