import {
	IAppApi,
	ICardsContainer,
	ICartModel, ICartView, IContactsForm, IHeaderView, IModalCardView,
	IModalView, IOrderForm,
	IOrderModel,
	IProduct,
	IProductsModel, ISuccessView, TPaymentMethods,
} from '../../types';
import { IEvents } from '../base/events';
import { Events } from '../../utils/constants';
import { GalleryCardView } from '../ui/GalleryCardView';
import { CartCardView } from '../ui/CartCardView';

export class AppPresenter {
	protected cartCards: IProduct;
	constructor(
		protected events: IEvents,
		protected api: IAppApi,
		protected productsModel: IProductsModel,
		protected cartModel: ICartModel,
		protected orderModel: IOrderModel,
		protected cardsContainer: ICardsContainer,
		protected modalCardInstance: IModalCardView,
		protected modal: IModalView,
		protected cartView: ICartView,
		protected orderForm : IOrderForm,
		protected contactsForm: IContactsForm,
		protected successWindow: ISuccessView,
		protected headerView: IHeaderView
	) {
	}

	initialize(): void {
		this.api.getProductList()
			.then((products) => {
				console.log(products);
				this.productsModel.addProducts(products.items);
				const cards = this.productsModel.getAllProducts();
				console.log(cards)
				cards.forEach((data) => {
					console.log(13,data);
					const card= new GalleryCardView(this.events).render(data)
					this.cardsContainer.addCard(card);
				});
			});
	}

	setListeners(): void {
		this.events.on(Events.CARD.PREVIEW, (data: IProduct) => {
			const isInCart = this.cartModel.products.has(data.id); // products теперь Set<string>
			this.modal.openModal(this.modalCardInstance.render(data, isInCart));
		});


		this.events.on(Events.CART.OPEN, () => {
			this.modal.openModal(this.cartView.render());
		});

		this.events.on(Events.CART.ADD, (data: {id:string}) => {
			const item = this.productsModel.getProductForCart(data.id)
			this.cartModel.addToCart(item);
		});

		this.events.on(Events.CART.REMOVE, (product: IProduct) => {
			this.cartModel.removeFromCart(product);
		});

		this.events.on(Events.CART.UPDATE, (data:{ cardsId: string[], totalPrice: number, totalProducts: number }) => {
			const items = data.cardsId.map((id:string ,index:number) => {
				const product = this.productsModel.getProductById(id);
				return new CartCardView(this.events).render(product, index + 1);
			});
			this.cartView.update(items, data.totalPrice);
			this.headerView.updateCartCounter(data.totalProducts);
		})


		this.events.on(Events.CART.SUBMIT, () => {
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
			const cartData = this.cartModel.getCartData()
			this.api.createOrder(this.orderModel.createFullOrder(cartData.items, cartData.total)).then(
				result => {
					this.modal.renderContent(this.successWindow.render(result.total))
					this.cartModel.clearCart();
					this.headerView.updateCartCounter(0)
					this.cartView.clear();
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

