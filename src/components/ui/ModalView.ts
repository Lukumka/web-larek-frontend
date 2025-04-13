import { IModalView } from '../../types';
import { IEvents } from '../base/events';
import { Events } from '../../utils/constants';

export class ModalView implements IModalView {
	protected modal: HTMLElement;
	protected modalContainer: HTMLElement;
	protected modalContent: HTMLElement;
	protected closeButton: HTMLButtonElement;
	protected events: IEvents;

	constructor(events: IEvents) {
		this.events = events;

		this.modal = document.querySelector('#modal-container') as HTMLElement;
		this.modalContainer = this.modal.querySelector('.modal__container') as HTMLElement;
		this.modalContent = this.modal.querySelector('.modal__content') as HTMLElement;
		this.closeButton = this.modal.querySelector('.modal__close') as HTMLButtonElement;

		this.closeButton.addEventListener('click', () => this.closeModal());

		this.modal.addEventListener('mousedown', (evt) => {
			if (evt.target === this.modal) {
				this.closeModal();
			}
		});

		this.handleEscUp = this.handleEscUp.bind(this);
	}

	openModal(content: HTMLElement) {
		this.clearModal();
		this.modal.classList.add('modal_active');
		document.body.classList.add('page__wrapper_locked');
		document.addEventListener('keyup', this.handleEscUp);
		this.renderContent(content)
	}

	closeModal() {
		this.modal.classList.remove('modal_active');
		document.body.classList.remove('page__wrapper_locked');
		document.removeEventListener('keyup', this.handleEscUp);
		this.clearModal();
	}

	protected handleEscUp(evt: KeyboardEvent) {
		if (evt.key === 'Escape') {
			this.closeModal();
		}
	}

	clearModal() {
		this.modalContent.replaceChildren();
	}

	 renderContent(element: HTMLElement) {
		this.modalContent.replaceChildren(element);
		this.events.emit(Events.MODAL.RENDERED);
	}
}
