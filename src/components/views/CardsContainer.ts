import { Component } from '../base/Component';
import { ICardsContainer } from '../../types';

export class CardsContainer extends Component<ICardsContainer> implements ICardsContainer{
	protected _catalog: HTMLElement;

	constructor(protected container: HTMLElement) {
		super(container);
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