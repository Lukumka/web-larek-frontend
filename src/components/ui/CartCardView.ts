import { IProduct } from '../../types';
import { IEvents } from '../base/events';
import { Events } from '../../utils/constants';
import { BaseCardView } from '../base/card';

export class CartCardView extends BaseCardView {
	protected events: IEvents;

	constructor(events: IEvents) {
		super('#card-basket',events);
		this.events = events;
	}

	render(data: Partial<IProduct>, index:number): HTMLElement {
		this.renderBase(data);
		const removeButton = this.element.querySelector('.card__remove-button') as HTMLButtonElement;
		const indexContainer = this.element.querySelector('.basket__item-index') as HTMLSpanElement;
		if (indexContainer) {
			indexContainer.textContent = String(index)
		}
		if (removeButton) {
			removeButton.addEventListener('click', () => {
				this.events.emit(Events.CART.REMOVE, data);
			});
		}
		return this.element;
	}
}
