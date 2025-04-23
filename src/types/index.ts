export interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category:string;
	price: number | null;
}

export interface IProductsModel {
	addProducts(cards: IProduct[]): void;
	getAllProducts(): IProduct[];
	getProductById(id: string): IProduct | undefined;
	clearProducts(): void;
}


export interface ICartModel{
	products: Map<string, number>;				// пока под вопросом
	totalPrice: number;
	totalProducts: number;
	addToCart(item: IProduct): void;
	removeFromCart(item: IProduct): void;
	clearCart(): void;
	getCartData(): Partial<IOrder>
}

export interface IOrder {
	payment: TPaymentMethods;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: string[];
}

export interface IOrderModel {
	payment: TPaymentMethods;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: string[];
	fullOrderData: IOrder;
}

export interface ICardView {
	readonly data: Partial<IProduct>;
	render(): HTMLElement;
	getGalleryCardView(element: HTMLElement): void;
	getModalCardView(element: HTMLElement): HTMLElement;
}

export interface ICardsContainer {
	addCard(card: HTMLElement): void;
	addCards(cards: HTMLElement[]): void;
	clear(): void;
	catalog: HTMLElement[]; // Сеттер
}
//
export interface IModalView {
	openModal(content:HTMLElement): void;
	closeModal(): void;
	clearModal(): void;
	renderContent(content: HTMLElement): void;
}

export interface ICartView {
	addItem(item: HTMLElement, itemId: string, sum: number, items:number): void;
	removeItem(itemId: string, sum: number,items: number): void;
	clear(): void;
	render(): HTMLElement;
}

export interface IFormView {
	getFieldValue(fieldName: string): string;
	getAllFieldsValues(): Record<string, string>;
	resetForm(): void;
	clearFields(): void;
	render(): HTMLFormElement;
}

export interface IOrderForm {
	selectPaymentMethod(method: string): void;
	resetForm(): void;
	render(): HTMLElement;
}

export interface IContactsForm {
	resetForm(): void;
	render(): HTMLElement;
}

export interface ISuccessView {
	render(sum:number): HTMLElement;
}

export type TPaymentMethods = 'card' | 'on-delivery';

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE' | 'PATCH' ;

export interface IApi {
	baseUrl: string;
	get<T>(uri: string): Promise<T>;
	post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export interface IBaseProductData {
	total: number;
	items: IProduct[];
}

export interface IAppApi {
	getProductList(): Promise<IBaseProductData>;
	getProduct(id: string): Promise<IProduct>;
	createOrder(order: IOrder): Promise<IOrder>;
}


