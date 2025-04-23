import {
	IAppApi,
	ICardsContainer,
	ICartModel, ICartView, IContactsForm,
	IModalView, IOrderForm,
	IOrderModel,
	IProduct,
	IProductsModel, ISuccessView, TPaymentMethods,
} from '../../types';
import { IEvents } from '../base/events';
import { CardView } from '../ui/CardView';
import { Events } from '../../utils/constants';

export class AppPresenter {
	protected cardsInstances: CardView[];

	constructor(
		protected events: IEvents,
		protected api: IAppApi,
		protected productsModel: IProductsModel,
		protected cartModel: ICartModel,
		protected orderModel: IOrderModel,
		protected cardsContainer: ICardsContainer,
		protected modal: IModalView,
		protected cartView: ICartView,
		protected orderForm : IOrderForm,
		protected contactsForm: IContactsForm,
		protected successWindow: ISuccessView,
	) {
		this.cardsInstances = []
	}

	initialize(): void {
		this.api.getProductList()
			.then((products) => {
				this.productsModel.addProducts(products.items);
				const cards = this.productsModel.getAllProducts();

				cards.forEach((data) => {
					const cardInstance = new CardView(data, this.events);
					this.cardsContainer.addCard(cardInstance.getGalleryCardView());
					this.cardsInstances.push(cardInstance); // Сохраняем экземпляры карточек
				});
			});
	}

	setListeners(): void {
		this.events.on(Events.CARD.PREVIEW, (data: { id: string }) => {
			const cardInstance = this.cardsInstances.find(card => card.data.id === data.id);
			if (cardInstance) {
				const modalContent = cardInstance.getModalCardView();
				this.modal.openModal(modalContent);
			} else {
				console.warn('Карточка не найдена по id:', data.id);
			}
		});

		this.events.on(Events.CART.OPEN, () => {
			this.modal.openModal(this.cartView.render());
		});

		this.events.on(Events.CART.ADD, (product: IProduct) => {
			console.log(product);
			this.cartModel.addToCart(product);
		});

		this.events.on(Events.CART.ITEM_ADDED, (data: { id: string, totalPrice: number, totalProducts: number }) => {
			const cardInstance = this.cardsInstances.find(item => item.data.id === data.id);
			this.cartView.addItem(cardInstance.getCartCardView(), data.id, data.totalPrice, data.totalProducts);
		});

		this.events.on(Events.CART.REMOVE, (product: IProduct) => {
			this.cartModel.removeFromCart(product);
		});

		this.events.on(Events.CART.ITEM_REMOVED, (data: { id: string, totalPrice: number, totalProducts: number }) => {
			this.cartView.removeItem(data.id, data.totalPrice, data.totalProducts);
		})

		this.events.on(Events.CART.SUBMIT, () => {
		const cartData = this.cartModel.getCartData()
			this.orderModel.items = cartData.items;
			this.orderModel.total = cartData.total;
			this.modal.renderContent(this.orderForm.render())
		})

		this.events.on(Events.ORDER.SUBMIT, (data: {data:{address:string}, paymentMethod:TPaymentMethods}) => {
			this.orderModel.address = data.data.address;
			this.orderModel.payment = data.paymentMethod;
			this.modal.renderContent(this.contactsForm.render())
		})

		this.events.on(Events.CONTACTS.SUBMIT, (data: {email:string, phone:string}) => {
			this.orderModel.email = data.email;
			this.orderModel.phone = data.phone;
			this.api.createOrder(this.orderModel.fullOrderData).then(
				result => {
					this.modal.renderContent(this.successWindow.render(result.total))
					this.cartModel.clearCart();
					this.cartView.clear();
					this.cardsInstances.forEach(card => card.resetCartState());
					this.orderForm.resetForm();
					this.contactsForm.resetForm();
				}
			)
		})

		this.events.on(Events.SUCCESS.SUBMIT, ()=>{
			this.modal.closeModal()
		})
	}

}

