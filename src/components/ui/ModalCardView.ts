import { IModalCardView, IProduct } from '../../types';
import { IEvents } from '../base/events';
import { Events } from '../../utils/constants';
import { BaseCardView } from '../base/card';

export class ModalCardView extends BaseCardView implements IModalCardView {
	protected image: HTMLImageElement;
	protected description: HTMLElement;
	protected category: HTMLElement;
	protected addButton: HTMLButtonElement;
	private boundClickHandler: (event: Event) => void;

	constructor(events: IEvents) {
		super('#card-preview', events);

		this.image = this.element.querySelector('.card__image') as HTMLImageElement;
		this.description = this.element.querySelector('.card__text') as HTMLElement;
		this.category = this.element.querySelector('.card__category') as HTMLElement;
		this.addButton = this.element.querySelector('.card__add-button') as HTMLButtonElement;

		this.boundClickHandler = this.handleAddButtonClick.bind(this); // Привязываем
	}

	render(data: Partial<IProduct>, isInCart: boolean ): HTMLElement {
		this.renderBase(data);
		this.element.dataset.id = data.id;
		this.image.src = this.resolveImagePath(data.image ?? '');
		this.description.textContent = data.description ?? '';
		this.category.textContent = data.category ?? '';
		this.changeCategoryColor(data.category ?? '');

		this.updateAddButton(data, isInCart);

		return this.element;
	}

	private updateAddButton(data: Partial<IProduct>, isInCart: boolean) {
		this.addButton.removeEventListener('click', this.boundClickHandler);

		if (!data.price || data.price === 0) {
			this.toggleButton(true, 'Товар бесценен');
		} else if (isInCart) {
			this.toggleButton(true, 'Товар в корзине');
		} else {
			this.toggleButton(false, 'Купить');
			this.addButton.addEventListener('click', this.boundClickHandler);
		}
	}

	private handleAddButtonClick(event: Event) {
		this.events.emit(Events.CART.ADD, { id: this.element.dataset.id });
		this.toggleButton(true, 'Товар в корзине');
		this.addButton.removeEventListener('click', this.boundClickHandler);
	}

	private toggleButton(state: boolean, message?: string) {
		this.addButton.disabled = state;
		if (message) {
			this.addButton.textContent = message;
		}
	}
}
