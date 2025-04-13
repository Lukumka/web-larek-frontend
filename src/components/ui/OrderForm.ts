import { FormView } from '../base/form';
import { IEvents } from '../base/events';
import { Events } from '../../utils/constants';
import { IOrderForm, TPaymentMethods } from '../../types';

export class OrderForm extends FormView implements IOrderForm {
	protected _inputs: Record<string, HTMLInputElement> = {};
	protected paymentMethod: TPaymentMethods;
	protected paymentButtonCard: HTMLButtonElement;
	protected paymentButtonOnDelivery: HTMLButtonElement;

	constructor(template: string, events: IEvents) {
		super(template, events);
		this._inputs = this.inputs;
		this.element.addEventListener('submit', (event) => {
			event.preventDefault();
			if (this.validateForm()) {
				this.events.emit(Events.ORDER.SUBMIT, {
					data: this.getAllFieldsValues(),
					paymentMethod: this.paymentMethod,
				});
			}
		});

		this.paymentButtonCard = this.element.querySelector('button[name="card"]');
		this.paymentButtonCard.addEventListener('click', (event) => {
			this.selectPaymentMethod('card');
		});
		this.paymentButtonOnDelivery = this.element.querySelector(
			'button[name="cash"]'
		);
		this.paymentButtonOnDelivery.addEventListener('click', (event) => {
			this.selectPaymentMethod('on-delivery');
		});
	}

	override validateForm(): boolean {
		return super.validateForm() && this.isPaymentSelected();
	}

	private isPaymentSelected(): boolean {
		return (
			this.paymentButtonCard.classList.contains('button_alt-active') ||
			this.paymentButtonOnDelivery.classList.contains('button_alt-active')
		);
	}

	selectPaymentMethod(method: 'card' | 'on-delivery') {
		this.paymentButtonCard.classList.remove('button_alt-active');
		this.paymentButtonOnDelivery.classList.remove('button_alt-active');
		this.paymentMethod = method;
		if (method === 'card') {
			this.paymentButtonCard.classList.add('button_alt-active');
		} else if (method === 'on-delivery') {
			this.paymentButtonOnDelivery.classList.add('button_alt-active');
		}
	}

	override resetForm (): void {
		super.resetForm();
		this.paymentButtonCard.classList.remove('button_alt-active');
		this.paymentButtonOnDelivery.classList.remove('button_alt-active');
	}

	render(): HTMLFormElement {
		return super.render();
	}
}
