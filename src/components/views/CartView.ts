import { ICartView } from '../../types';
import { IEvents } from '../base/events';
import { cloneTemplate } from '../../utils/utils';
import { Events } from '../../utils/constants';

export class CartView  implements ICartView {
	protected element: HTMLElement;
	protected container: HTMLElement;
	protected cartSubmitButton: HTMLButtonElement;
	protected priceContainer: HTMLSpanElement;
	protected events: IEvents;

	constructor(events: IEvents) {
		this.events = events;
		this.element = cloneTemplate('#basket');
		this.container = this.element.querySelector('.basket__list') as HTMLElement;
		this.priceContainer = this.element.querySelector('.basket__price') as HTMLSpanElement;
		this.cartSubmitButton = this.element.querySelector('.basket__button') as HTMLButtonElement;
		this.toggleSubmitButton()

		this.cartSubmitButton.addEventListener('click', () => {
			events.emit(Events.CART.SUBMIT)
		})
	}

	protected toggleSubmitButton() {
		this.cartSubmitButton.disabled = Number(this.priceContainer.textContent) === 0;
	}


	clear() {
		this.container.replaceChildren()
		this.render();
	}

	render(): HTMLElement {
		return this.element
	}

	update(cards: HTMLElement[], totalPrice: number) {
		this.priceContainer.textContent = `${String(totalPrice)} синапсов`;
		this.container.replaceChildren(...cards);
		this.toggleSubmitButton();
	}


}
