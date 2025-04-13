import { IEvents } from './events';
import { cloneTemplate } from '../../utils/utils';
import { Events } from '../../utils/constants';
import { IFormView } from '../../types';

export abstract class FormView implements IFormView {
	protected events: IEvents;
	protected element: HTMLFormElement;
	protected inputs: Record<string, HTMLInputElement> = {};
	protected submitButton: HTMLButtonElement;

	constructor(template: string, events: IEvents) {
		this.events = events;
		this.element = cloneTemplate(template);

		this.initializeFields();
		this.submitButton = this.element.querySelector('button[type="submit"]');
		this.toggleSubmitButton(true); // Изначально кнопка отключена
	}

	protected initializeFields(): void {
		const fields = this.element.querySelectorAll('input');
		fields.forEach((field) => {
			if (field.name) {
				this.inputs[field.name] = field as HTMLInputElement;
				field.addEventListener('input', () => this.inputHandler());
			}
		});
	}

	protected inputHandler(): void {
		this.toggleSubmitButton(!this.validateForm());
	}

	protected validateForm(): boolean {
		return this.validateFields();
	}

	protected validateFields(): boolean {
		return Object.values(this.inputs).every((input) => input.validity.valid && input.value.trim() !== '');
	}

	getFieldValue(fieldName: string): string {
		return this.inputs[fieldName]?.value ?? '';
	}

	getAllFieldsValues(): Record<string, string> {
		const data: Record<string, string> = {};
		for (const fieldName in this.inputs) {
			data[fieldName] = this.getFieldValue(fieldName);
		}
		return data;
	}

	protected toggleSubmitButton(state: boolean): void {
		if (this.submitButton) {
			this.submitButton.disabled = state;
		}
	}

	resetForm(): void {
		this.clearFields();
	}

	clearFields(): void {
		Object.values(this.inputs).forEach((input) => {
			input.value = '';
		});
	}

	render(): HTMLFormElement {
		return this.element;
	}
}
