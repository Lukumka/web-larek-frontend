import { IEvents } from '../base/events';
import { Events } from '../../utils/constants';
import { IHeaderView } from '../../types';

export class HeaderView implements IHeaderView{
	protected element: HTMLElement;
	protected headerCartOpenButton: HTMLButtonElement;
	protected headerCartItemsCounter: HTMLSpanElement;
	protected events: IEvents;

	constructor(events: IEvents) {
		this.events = events;
		this.element = document.querySelector('.header');
		this.headerCartOpenButton = this.element.querySelector('.header__basket') as HTMLButtonElement;
		this.headerCartOpenButton.addEventListener('click', () => {
			this.events.emit(Events.CART.OPEN);
		});
		this.headerCartItemsCounter = this.element.querySelector('.header__basket-counter') as HTMLSpanElement;
		this.updateCartCounter(0);
	}

	updateCartCounter(count: number): void {
		this.headerCartItemsCounter.textContent = count.toString();
	}
}