import { IEvents } from '../base/events';
import { IProduct, IProductsModel } from '../../types';
import { Events } from '../../utils/constants';


export class ProductsModel implements IProductsModel {
	private cards: Map<string, IProduct> = new Map();
	protected events: IEvents;
	constructor(events: IEvents) {
		this.events = events;
	}

	addProducts(cards: IProduct[]) {
		cards.forEach(card => this.cards.set(card.id, card));
		this.events.emit(Events.PRODUCTS.UPDATE, this.cards);
	}

	getAllProducts(): IProduct[] {
		return Array.from(this.cards.values());
	}

	getProductById(id: string): IProduct | undefined {
		return this.cards.get(id);
	}

	clearProducts() {
		this.cards.clear();
		this.events.emit(Events.PRODUCTS.UPDATE, this.cards);
	}
}