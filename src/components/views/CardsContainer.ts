import { ICardsContainer } from '../../types';

export class CardsContainer implements ICardsContainer{
	protected container: HTMLElement;
	constructor(container: HTMLElement) {
		this.container = container;
	}

	addCard(card: HTMLElement) {
		this.container.appendChild(card);
	}

	addCards(cards: HTMLElement[]) {
		cards.forEach(card => this.addCard(card));
	}

	clear() {
		this.container.innerHTML = '';
	}

	set catalog(items: HTMLElement[]) {
		this.container.replaceChildren(...items);
	}

}