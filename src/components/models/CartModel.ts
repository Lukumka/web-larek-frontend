import { ICartModel, IProduct } from '../../types';
import { IEvents } from '../base/events';
import { Events } from '../../utils/constants';

export class CartModel implements ICartModel {
	protected _products: Map<string, number> = new Map();
	protected _totalPrice: number;
	protected _totalProducts: number;
	protected events: IEvents;

	constructor(events: IEvents) {
		this.events = events;
		this._totalPrice = 0;
		this._totalProducts = 0;
	}

	protected set products(data: Map<string, number>) {
		this._products = data;
	}

	get products() {
		return this._products;
	}

	protected set totalPrice(value: number) {
		this._totalPrice = value;
	}


	get totalPrice() {
		return this._totalPrice;
	}

	get totalProducts() {
		return this._totalProducts;
	}

	addToCart(data: Partial<IProduct>) {
		if (!data.id || !data.price) {
			console.warn('Нет id или price у товара');
			return;
		}
		if (!this.products.has(data.id)) {
			this.products.set(data.id, 1);
		} else {
			this.products.set(data.id, this.products.get(data.id) + 1);
		}
		this.totalPrice += Number(data.price);
		this.updateTotalProducts()
		this.events.emit(Events.CART.ITEM_ADDED, {
			id: data.id,
			totalPrice: this.totalPrice,
			totalProducts: this.totalProducts
		});
	}


	removeFromCart(data: Partial<IProduct>) {
	if (!this.products.has(data.id)) return;
		if (this.products.get(data.id) > 0){
			this.products.set(data.id, this.products.get(data.id) - 1);
			if (this.products.get(data.id) === 0) this.products.delete(data.id);
			this.totalPrice -= (data.price);
			this.updateTotalProducts()
			this.events.emit(Events.CART.ITEM_REMOVED, {
				id: data.id,
				totalPrice: this.totalPrice,
				totalProducts: this.totalProducts
			});
		}
	}


	clearCart(): void {
		this.products.clear();
		this.totalPrice = 0;
	}

	protected updateTotalProducts(): void {
		this._totalProducts = this.products.size;
	}

	getCartData() {
		return {
			total: this.totalPrice,
			items: Array.from(this.products.keys())
		}
	}
}
