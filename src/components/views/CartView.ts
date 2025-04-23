import { ICartView } from '../../types';
import { IEvents } from '../base/events';
import { cloneTemplate } from '../../utils/utils';
import { Events } from '../../utils/constants';

export class CartView  implements ICartView {
	protected element: HTMLElement;
	protected cartOpenButton: HTMLButtonElement;
	protected container: HTMLElement;
	protected cartSubmitButton: HTMLButtonElement;
	protected priceContainer: HTMLSpanElement;
	protected events: IEvents;
	protected itemsCount: HTMLSpanElement;

	constructor(events: IEvents) {
		this.events = events;
		this.element = cloneTemplate('#basket');
		this.cartOpenButton = document.querySelector('.header__basket') as HTMLButtonElement;
		this.itemsCount = document.querySelector('.header__basket-counter') as HTMLSpanElement;
		this.container = this.element.querySelector('.basket__list') as HTMLElement;
		this.priceContainer = this.element.querySelector('.basket__price') as HTMLSpanElement;
		this.cartSubmitButton = this.element.querySelector('.basket__button') as HTMLButtonElement;
		this.toggleSubmitButton()

		this.cartOpenButton.addEventListener('click', () => {
			this.events.emit(Events.CART.OPEN);
		});

		this.cartSubmitButton.addEventListener('click', () => {
			events.emit(Events.CART.SUBMIT)
		})
	}

	addItem(item: HTMLElement, id: string, totalPrice: number, totalProducts: number) {
		item.dataset.id = id;
		this.container.appendChild(item);
		this.updateTotal(totalPrice,totalProducts);
		this.updateIndexes();
		this.toggleSubmitButton()
		console.log(this.itemsCount.textContent)
	}

	removeItem(id: string, totalPrice: number,totalProducts: number) {
		const element = this.container.querySelector(`[data-id="${id}"]`);
		if (element) {
			element.remove();
		}
		this.updateTotal(totalPrice,totalProducts);
		this.updateIndexes()
		this.toggleSubmitButton()
	}

	protected updateIndexes() {
		const items = this.container.querySelectorAll('.basket__item');
		items.forEach((item, index) => {
			const indexElement = item.querySelector('.basket__item-index') as HTMLElement;
			if (indexElement) {
				indexElement.textContent = (index + 1).toString();
			}
		});
	}

	protected toggleSubmitButton() {
		this.cartSubmitButton.disabled = Number(this.itemsCount.textContent) === 0;
	}

	protected updateTotal(sum: number, items: number) {
		this.priceContainer.textContent = `${String(sum)} синапсов`;
		this.itemsCount.textContent = `${String(items)}`;
	}

	clear() {
		this.container.replaceChildren()
		this.updateTotal(0,0);
		this.render();
	}

	render(): HTMLElement {
		return this.element
	}

}
