import { IApi, IAppApi, IBaseProductData, IOrder, IProduct } from '../../types';
import { IEvents } from '../base/events';
import { Events } from '../../utils/constants';

export class AppApi implements IAppApi{
	private _baseApi: IApi;
	protected events: IEvents;
	constructor(baseApi: IApi,events: IEvents) {
		this._baseApi = baseApi;
		this.events = events;
	}

	getProductList(): Promise<IBaseProductData> {
		this.events.emit(Events.REQUEST.PRODUCTS)
		return this._baseApi.get<IBaseProductData>(`/product`).then((data:IBaseProductData) => data);
	}

	getProduct(id: string): Promise<IProduct> {
		this.events.emit(Events.REQUEST.PRODUCT)

		return this._baseApi.get<IProduct>(`/product/${id}`).then((product:IProduct) => product);
	}

	createOrder(order: IOrder) : Promise<IOrder> {
		return this._baseApi.post<IOrder>(`/order`, order).then((order:IOrder) => order);
	}

	}

