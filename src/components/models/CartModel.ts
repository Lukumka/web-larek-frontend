import { ICartModel, TCartProduct } from '../../types';
import { IEvents } from '../base/events';
import { Events } from '../../utils/constants';

export class CartModel implements ICartModel {
	protected _products: Set<string> = new Set();
	protected _totalPrice: number;
	protected _totalProducts: number;
	protected events: IEvents;

	constructor(events: IEvents) {
		this.events = events;
		this._totalPrice = 0;
		this._totalProducts = 0;
	}

	get products(): Set<string> {
		return this._products;
	}

	get totalPrice(): number {
		return this._totalPrice;
	}

	get totalProducts(): number {
		return this._totalProducts;
	}

	addToCart(data: TCartProduct): void {
		this._products.add(data.id);
		this._totalPrice += data.price;
		this.updateTotalProducts();
		this.events.emit(Events.CART.UPDATE, {
			cardsId: Array.from(this._products),
			totalPrice: this._totalPrice,
			totalProducts: this._totalProducts,
		});
	}

	removeFromCart(data: TCartProduct): void {
		if (!this._products.has(data.id)) return;

		this._products.delete(data.id);
		this._totalPrice -= data.price;
		this.updateTotalProducts();
		this.events.emit(Events.CART.UPDATE, {
			cardsId: Array.from(this._products),
			totalPrice: this._totalPrice,
			totalProducts: this._totalProducts,
		});
	}

	clearCart(): void {
		this._products.clear();
		this._totalPrice = 0;
		this._totalProducts = 0;
	}

	getCartData(): { total: number; items: string[] } {
		return {
			total: this._totalPrice,
			items: Array.from(this._products),
		};
	}

	protected updateTotalProducts(): void {
		this._totalProducts = this._products.size;
	}
}
