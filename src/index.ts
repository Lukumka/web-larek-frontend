import './scss/styles.scss';

import { EventEmitter } from './components/base/events';
import { CartModel } from './components/models/CartModel';
import { OrderModel } from './components/models/OrderModel';
import { AppApi } from './components/api/AppApi';
import { Api } from './components/base/api';
import { API_URL } from './utils/constants';
import { ProductsModel } from './components/models/ProductsModel';
import { AppPresenter } from './components/presenter/Presenter';
import { CardsContainer } from './components/views/CardsContainer';
import { ModalView } from './components/ui/ModalView';
import { CartView } from './components/views/CartView';
import { OrderForm } from './components/ui/OrderForm';
import { ContactsForm } from './components/ui/ContactsForm';
import { SuccessView } from './components/ui/SucessView';

const events = new EventEmitter();

//Api
const baseApi = new Api(API_URL);
const api = new AppApi(baseApi,events)
//Models
const productsModel = new ProductsModel(events);
const cartModel = new CartModel(events);
const orderModel = new OrderModel(events);
//View
const cardsContainer = new CardsContainer(document.querySelector('.gallery'));
const modal = new ModalView(events);
const cart = new CartView(events);
const order = new OrderForm('#order', events);
const contacts = new ContactsForm('#contacts', events);
const successWindow = new SuccessView(events);

const  appPresenter = new AppPresenter(
	events,
	api,
	productsModel,
	cartModel,
	orderModel,
	cardsContainer,
	modal,
	cart,
	order,
	contacts,
	successWindow
);


appPresenter.initialize()
appPresenter.setListeners()




