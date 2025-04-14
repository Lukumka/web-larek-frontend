import { cloneTemplate } from '../../utils/utils';
import { ICardView, IProduct } from '../../types';
import { CDN_URL } from '../../utils/constants';
import { IEvents } from './events';

export abstract class BaseCardView implements ICardView {
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

	constructor(protected templateId: string, events: IEvents) {
		this.events = events;
		this.element = cloneTemplate(this.templateId);
		this.resetCartState()
		this.initHTML();
	}

	protected initHTML() {
		this.cardTitle = this.element.querySelector('.card__title');
		this.cardPrice = this.element.querySelector('.card__price');
		this.cardImage = this.element.querySelector('.card__image');
		this.cardDescription = this.element.querySelector('.card__text');
		this.cardCategory = this.element.querySelector('.card__category');
		this.addToCartButton = this.element.querySelector('.card__add-button');
		this.removeFromCartButton = this.element.querySelector('.card__remove-button');
	}

	protected resolveImagePath(imageName: string): string {
		return `${CDN_URL}${imageName}`;
	}

	protected changeCategoryColor(category: string) {
		if (!this.cardCategory) return;
		switch (category) {
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

	resetCartState() {
		this.isInCart = false;
	}

	protected renderBase(data: Partial<IProduct>): void {
		const title = this.element.querySelector('.card__title') as HTMLElement;
		const price = this.element.querySelector('.card__price') as HTMLElement;

		if (title) title.textContent = data.title ?? '';
		if (price) {
			if(data.price === null){
				price.textContent = 'Бесценно';
			} else {
				price.textContent = `${data.price} синапсов` ?? '';
			}
		}
	}


	abstract render(data: Partial<IProduct>, ...args: unknown[]): HTMLElement;
}
