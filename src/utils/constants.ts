export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

export const settings = {

};
// cart-changed
export const Events = {
	PRODUCTS: {
		UPDATE: 'products:updated',
	},
	CART: {
		ADD: 'cart:add',
		REMOVE: 'cart:remove',
		UPDATE: 'cart:update',
		OPEN: 'cart:open',
		SUBMIT: 'cart:submit',
	},
	CARD: {
		PREVIEW: 'card:preview',
	},
	MODAL: {
		OPEN: 'modal:open',
		RENDERED: 'modal:rendered',
	},
	ORDER: {
		SUBMIT: 'order:submit',
		SUCCESS: 'order:success',
	},
	CONTACTS: {
		SUBMIT: 'contacts:submit',
	},
	SUCCESS: {
		SUBMIT: 'success:submit',
	},
	REQUEST: {
		PRODUCTS: 'request:product-list',
		PRODUCT: 'request:product',
		ORDER: 'request:order-success',

	}
} as const;
