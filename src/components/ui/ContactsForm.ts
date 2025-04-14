

import { FormView } from '../base/form';
import { IEvents } from '../base/events';
import { Events } from '../../utils/constants';
import { IContactsForm, IOrderForm, TPaymentMethods } from '../../types';

export class ContactsForm extends FormView implements IContactsForm {
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
				this.events.emit(Events.CONTACTS.SUBMIT, this.getAllFieldsValues());
			}
		});
		this.updateErrors();
	}

	override validateForm(): boolean {
		return super.validateForm();
	}

	resetForm() {
		super.resetForm();
	}

	render(): HTMLFormElement {
		return super.render();
	}
}
