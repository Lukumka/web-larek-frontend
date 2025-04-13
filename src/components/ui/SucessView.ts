import { IEvents } from '../base/events';
import { cloneTemplate } from '../../utils/utils';
import { ISuccessView } from '../../types';
import { Events } from '../../utils/constants';

export class SuccessView implements ISuccessView {
	protected element: HTMLElement
	protected successDescription: HTMLElement;
	protected successButton: HTMLButtonElement;
	protected totalPrice: HTMLSpanElement;
	protected events: IEvents;
	constructor(events: IEvents) {
		this.events = events;
		this.element = cloneTemplate('#success');

		this.successButton = this.element.querySelector('.order-success__close');
		this.successButton.addEventListener('click', (event: Event) => {
			this.events.emit(Events.SUCCESS.SUBMIT)
		})
		this.successDescription = this.element.querySelector('.order-success__description');
	}

	render(sum: number): HTMLElement {
		if (sum) {
			this.successDescription.textContent = `Списано ${sum} синапсов`;
		}
		return this.element;

	}
}
