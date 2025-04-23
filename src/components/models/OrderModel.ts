import { IEvents } from '../base/events';
import { IOrder, IOrderModel, TPaymentMethods } from '../../types';


export class OrderModel implements IOrderModel {
	protected events: IEvents;
	protected _payment: TPaymentMethods;
	protected _email: string;
	protected _phone: string;
	protected _address: string;
	protected _total: number;
	protected _items: string[];
	protected _fullOrderData: IOrder | null = null;

	constructor(events: IEvents) {
	this.events = events;
	this._fullOrderData = {
		payment: this._payment,
		email: this._email,
		phone: this._phone,
		address: this._address,
		total: this._total,
		items: this._items,
		}
	}

	set payment(method: TPaymentMethods) {
		this._payment = method;
		this._fullOrderData.payment = method;
	}

	get payment() {
		return this._payment;
	}

	set email(email: string) {
		this._email = email;
		this._fullOrderData.email = email;
	}

	get email() {
		return this._email;
	}

	set phone(phone: string) {
		this._phone = phone;
		this._fullOrderData.phone = phone;
	}

	get phone() {
		return this._phone;
	}

	set address(address: string) {
		this._address = address;
		this._fullOrderData.address = address;
	}

	get address() {
		return this._address;
	}

	set total(total: number) {
		this._total = total;
		this._fullOrderData.total = total;
	}

	get total() {
		return this._total;
	}

	set items(items: string[]) {
		this._items = items;
		this._fullOrderData.items = items;
	}

	get items() {
		return this._items;
	}

	get fullOrderData() {
		return this._fullOrderData;
	}
}
