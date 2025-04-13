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
		ITEM_ADDED: 'cart:item-added',
		ITEM_REMOVED: 'cart:item-removed',
		CLEARED: 'cart:cleared',
		TOTAL_CHANGED: 'cart:total-changed',
		OPEN: 'cart:open',
		SUBMIT: 'cart:submit',
	},
	CARD: {
		SHOW: 'card:show',
		PREVIEW: 'card:preview',
	},
	MODAL: {
		OPEN: 'modal:open',
		CLOSE: 'modal:close',
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
