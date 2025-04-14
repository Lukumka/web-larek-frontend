import { IProduct } from '../../types';
import { IEvents } from '../base/events';
import { Events } from '../../utils/constants';
import { BaseCardView } from '../base/card';

export class GalleryCardView extends BaseCardView {
	protected events: IEvents;

	constructor(events: IEvents) {
		super('#card-catalog',events);
		this.events = events;
	}

	render(data: Partial<IProduct>): HTMLElement {
		this.renderBase(data);
		const image = this.element.querySelector('.card__image') as HTMLImageElement;
		const category = this.element.querySelector('.card__category') as HTMLElement;

		if (image) image.src = this.resolveImagePath(data.image ?? '');
		if (category) {
			category.textContent = data.category ?? '';
			this.changeCategoryColor(data.category ?? '');
		}

		this.element.addEventListener('click', () => {
			if (data.id) {
				this.events.emit(Events.CARD.PREVIEW, data);
			}
		});

		return this.element;
	}
}
