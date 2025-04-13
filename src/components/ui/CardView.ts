import { cloneTemplate } from '../../utils/utils';
import { ICardView, IProduct } from '../../types';
import { IEvents } from '../base/events';
import { CDN_URL, Events } from '../../utils/constants';

export class CardView implements ICardView {
	protected _data: Partial<IProduct>;
	protected element: HTMLElement;
	protected cardTitle: HTMLElement | null;
	protected cardImage: HTMLImageElement | null;
	protected cardDescription: HTMLElement | null;
	protected cardCategory: HTMLElement | null;
	protected cardPrice: HTMLElement | null;
	protected addToCartButton: HTMLButtonElement | null;
	protected removeFromCartButton: HTMLButtonElement | null;
	protected isInCart: boolean;
	protected events: IEvents;

	constructor(data: Partial<IProduct>, events: IEvents) {
		this._data = data;
		this.events = events;
		this.isInCart = false;
	}

	protected initHTML(templateId: string) {
		this.element = cloneTemplate(templateId);
		this.cardTitle = this.element.querySelector('.card__title');
		this.cardPrice = this.element.querySelector('.card__price');
		this.cardImage = this.element.querySelector('.card__image') ?? null;
		this.cardDescription = this.element.querySelector('.card__text') ?? null;
		this.cardCategory = this.element.querySelector('.card__category') ?? null;
		this.addToCartButton = this.element.querySelector('.card__add-button') ?? null;
		this.removeFromCartButton = this.element.querySelector('.card__remove-button') ?? null;

		if (this.cardCategory) {
			this.changeCategoryColor();
		}
	}

	get data(): Partial<IProduct> {
		return this._data;
	}

	getGalleryCardView() {
		this.initHTML('#card-catalog');

		this.element.addEventListener('click', (event: Event) => {
			this.events.emit(Events.CARD.PREVIEW, { id: this.data.id });
		});

		return this.render();
	}

	getCartCardView() {
		this.initHTML('#card-basket');

		if (this.removeFromCartButton) {
			this.removeFromCartButton.addEventListener('click', (event: Event) => {
				this.isInCart = false;
				this.events.emit(Events.CART.REMOVE, this.data);
			});
		}

		return this.render();
	}

	getModalCardView() {
		this.initHTML('#card-preview');

		if (this.addToCartButton) {
			if (this.data.price > 0) {
				if (!this.isInCart) {
					this.toggleAddToCartButton(false, 'Купить');
				}
				this.addToCartButton.addEventListener('click', (event: Event) => {
					this.isInCart = true;
					this.toggleAddToCartButton(true, 'Товар в корзине');
					this.events.emit(Events.CART.ADD, this.data);
				});
			} else {
				this.toggleAddToCartButton(true, 'Товар бесценен');
			}
		}

		return this.render();
	}

	protected toggleAddToCartButton(state: boolean, buttonText: string) {
		if (this.addToCartButton) {
			this.addToCartButton.disabled = state;
			this.addToCartButton.textContent = buttonText;
		}
	}

	protected changeCategoryColor() {
		switch (this.data.category) {
			case 'софт-скил':
				this.cardCategory.classList.add('card__category_soft');
				break;
			case 'другое':
				this.cardCategory.classList.add('card__category_other');
				break;
			case 'дополнительное':
				this.cardCategory.classList.add('card__category_additional');
				break;
			case 'кнопка':
				this.cardCategory.classList.add('card__category_button');
				break;
			case 'хард-скил':
				this.cardCategory.classList.add('card__category_hard');
				break;
		}
	}

	protected resolveImagePath(imageName: string): string {
		return `${CDN_URL}${imageName}`;
	}

	render() {
		if (this.cardImage) {
			this.cardImage.src = this.resolveImagePath(this.data.image) ?? '';
		}
		if (this.cardCategory) {
			this.cardCategory.textContent = this.data.category ?? '';
		}
		if (this.cardDescription) {
			this.cardDescription.textContent = this.data.description ?? '';
		}
		if (this.cardTitle) {
			this.cardTitle.textContent = this.data.title ?? '';
		}
		if (this.cardPrice) {
			this.cardPrice.textContent = String(this.data.price ?? '');
		}

		if (this.isInCart && this.addToCartButton) {
			this.toggleAddToCartButton(true, 'Товар в корзине');
		}
		return this.element;
	}

	resetCartState() {
		this.isInCart = false;
		this.toggleAddToCartButton(this.isInCart, 'Купить')
	}

}
