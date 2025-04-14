import { IEvents } from '../base/events';
import { IOrder, IOrderModel, TPaymentMethods } from '../../types';


export class OrderModel implements IOrderModel {
	protected events: IEvents;
	protected _payment: TPaymentMethods;
	protected _email: string;
	protected _phone: string;
	protected _address: string;
	constructor(events: IEvents) {
	this.events = events;
	}

	set payment(method: TPaymentMethods) {
		this._payment = method;
	}

	get payment() {
		return this._payment;
	}

	set email(email: string) {
		this._email = email;
	}

	get email() {
		return this._email;
	}

	set phone(phone: string) {
		this._phone = phone;
	}

	get phone() {
		return this._phone;
	}

	set address(address: string) {
		this._address = address;
	}

	get address() {
		return this._address;
	}

	createFullOrder(items: string[], total: number): IOrder {
		return {
			payment: this._payment,
			email: this._email,
			phone: this._phone,
			address: this._address,
			total: total,
			items: items,
		}
	}
}
