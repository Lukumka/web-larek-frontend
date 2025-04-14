export interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category:string;
	price: number | null;
}

export type TCartProduct = Pick<IProduct, 'id' | 'price'>

export interface IProductsModel {
	addProducts(cards: IProduct[]): void;
	getAllProducts(): IProduct[];
	getProductById(id: string): IProduct | undefined;
	getProductForCart(id: string): TCartProduct;
	clearProducts(): void;
}

export interface ICartModel {
	products: Set<string>;
	totalPrice: number;
	totalProducts: number;
	addToCart(data: TCartProduct): void;
	removeFromCart(data: TCartProduct): void;
	clearCart(): void;
	getCartData(): { total: number; items: string[] };
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
	createFullOrder(items: string[], total: number): IOrder
}

export interface ICardView {
	render(data: Partial<IProduct>): HTMLElement;
}

export interface IModalCardView {
	render(data: Partial<IProduct>, isInCart: boolean): HTMLElement;
}

export interface IHeaderView {
	updateCartCounter(count: number): void;
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
	clear(): void;
	render(): HTMLElement;
	update(cards:HTMLElement[], totalPrice: number): void;
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


