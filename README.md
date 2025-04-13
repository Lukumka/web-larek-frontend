# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```



## Данные и типы данных, используемые в приложении

Продукт

```
export interface IProduct {
id: string;
description: string;
image: string;
title: string;
category:string;
price: number | null;
}
```

Заказ

```
export interface IOrder {
payment: TPaymentMethods;
email: string;
phone: string;
address: string;
total: number;
items: string[];
}
```

Итерфейс для модели продуктов

```
export interface IProductsModel {
addProducts(cards: IProduct[]): void;
getAllProducts(): IProduct[];
getProductById(id: string): IProduct | undefined;
clearProducts(): void;
}
```

Интерфейс для модели корзины

```
export interface ICartModel{
products: Map<string, number>;
totalPrice: number;
totalProducts: number;
addToCart(item: IProduct): void;
removeFromCart(item: IProduct): void;
clearCart(): void;
getCartData(): Partial<IOrder>
}
```

Интерфейс для модели заказа

```
export interface IOrderModel {
payment: TPaymentMethods;
email: string;
phone: string;
address: string;
total: number;
items: string[];
fullOrderData: IOrder;
}
```

Карточка продукта

```
export interface ICardView {
readonly data: Partial<IProduct>;
render(): HTMLElement;
getGalleryCardView(element: HTMLElement): void;
getModalCardView(element: HTMLElement): HTMLElement;
}
```

Контейнер для карточек

```
export interface ICardsContainer {
addCard(card: HTMLElement): void;
addCards(cards: HTMLElement[]): void;
clear(): void;
catalog: HTMLElement[]; 
}
```

Модальное окно

```
export interface IModalView {
openModal(content:HTMLElement): void;
closeModal(): void;
clearModal(): void;
renderContent(content: HTMLElement): void;
}
```

Корзина

```
export interface ICartView {
addItem(item: HTMLElement, itemId: string, sum: number, items:number): void;
removeItem(itemId: string, sum: number,items: number): void;
clear(): void;
render(): HTMLElement;
}
```

Базовая форма

```
export interface IFormView {
getFieldValue(fieldName: string): string;
getAllFieldsValues(): Record<string, string>;
resetForm(): void;
clearFields(): void;
render(): HTMLFormElement;
}
```

Форма заказа

```
export interface IOrderForm {
selectPaymentMethod(method: string): void;
resetForm(): void;
render(): HTMLElement;
}
```

Форма контактов

```
export interface IContactsForm {
resetForm(): void;
render(): HTMLElement;
}
```

Окно успешной покупки

```
export interface ISuccessView {
render(sum:number): HTMLElement;
}
```

Методы оплаты

```
export type TPaymentMethods = 'card' | 'on-delivery';
```

Методы запросов

```
export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE' | 'PATCH' ;
```

Базовое Апи

```
export interface IApi {
baseUrl: string;
get<T>(uri: string): Promise<T>;
post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}
```

Тип получения запроса

```
export interface IBaseProductData {
total: number;
items: IProduct[];
}
```

Апи приложения

```
export interface IAppApi {
getProductList(): Promise<IBaseProductData>;
getProduct(id: string): Promise<IProduct>;
createOrder(order: IOrder): Promise<IOrder>;
}
```

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP:
- слой представления, отвечает за отображение данных на странице,
- слой данных, отвечает за хранение и изменение данных
- презентер, отвечает за связь представления и данных.

### Базовый код

#### Класс Api
Содержит в себе базовую логику отправки запросов. В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.
Методы:
- `get` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер
- `post` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.

#### Класс EventEmitter
Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Класс используется в презентере для обработки событий и в слоях приложения для генерации событий.  
Основные методы, реализуемые классом описаны интерфейсом `IEvents`:
- `on` - подписка на событие
- `emit` - инициализация события
- `trigger` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие

### Слой данных

#### Класс ProductsModel
Класс отвечает за хранение и управление данными о продуктах на сайте.
Конструктор принимает `events` — экземпляр брокера событий `EventEmitter`
##### Поля
- cards: Map<string, IProduct>	Хранилище продуктов. Ключ — id продукта, значение — объект IProduct.
- events: IEvents	Брокер событий для генерации событий при изменении данных.
##### Методы
- `addProducts(cards: IProduct[]): void`	Добавляет массив продуктов в хранилище. Эмитит событие products:update.
- `getAllProducts(): IProduct[]`	Возвращает все продукты в виде массива.
- `getProductById(id: string): IProduct | undefined`	Возвращает продукт по id, если найден.
- `clearProducts(): void`	Очищает все продукты. Эмитит событие products:update.

#### Класс CartModel
Класс отвечает за хранение и управление данными о товарах, добавленных в корзину.
Конструктор принимает `events` — экземпляр брокера событий `EventEmitter`.

##### Поля
- `_products: Map<string, number>` — Хранилище товаров в корзине. Ключ — `id` продукта, значение — количество штук.
- `_totalPrice: number` — Суммарная стоимость товаров в корзине.
- `_totalProducts: number` — Общее количество товаров в корзине.
- `events: IEvents` — Брокер событий для генерации событий при изменении данных корзины.
##### Методы
- `addToCart(data: Partial<IProduct>): void` — Добавляет товар в корзину. Увеличивает количество и пересчитывает стоимость. Эмитит событие `cart:item-added`.
- `removeFromCart(data: Partial<IProduct>): void` — Удаляет товар из корзины. Уменьшает количество и пересчитывает стоимость. Эмитит событие `cart:item-removed`.
- `clearCart(): void` — Полностью очищает корзину, сбрасывает сумму покупок.
- `updateTotalProducts(): void` — Пересчитывает общее количество уникальных товаров в корзине.
- `getCartData(): { total: number; items: string[] }` — Возвращает объект с итоговой суммой и списком `id` товаров в корзине.
- `products` (getter) — Возвращает текущее содержимое корзины.
- `totalPrice` (getter) — Возвращает текущую общую сумму корзины.
- `totalProducts` (getter) — Возвращает общее количество товаров в корзине.

#### Класс OrderModel
Класс отвечает за хранение и управление данными заказа.  
Конструктор принимает `events` — экземпляр брокера событий `EventEmitter`.

##### Поля
- `events: IEvents` — Брокер событий (не используется в данной реализации).
- `_payment: TPaymentMethods` — Способ оплаты.
- `_email: string` — Электронная почта.
- `_phone: string` — Телефон.
- `_address: string` — Адрес доставки.
- `_total: number` — Сумма заказа.
- `_items: string[]` — Список id товаров в заказе.
- `_fullOrderData: IOrder | null` — Полные данные заказа.
##### Методы
- `payment` (getter/setter) — Устанавливает и возвращает способ оплаты.
- `email` (getter/setter) — Устанавливает и возвращает email.
- `phone` (getter/setter) — Устанавливает и возвращает телефон.
- `address` (getter/setter) — Устанавливает и возвращает адрес.
- `total` (getter/setter) — Устанавливает и возвращает сумму заказа.
- `items` (getter/setter) — Устанавливает и возвращает список id товаров.
- `fullOrderData` (getter) — Возвращает полную структуру заказа.

### Слой коммуникации

#### Класс AppApi
Класс отвечает за взаимодействие с API сервера.
В конструктор принимает экземпляр `Api` и брокер событий `EventEmitter`.

##### Поля
- `_baseApi: IApi` — Экземпляр API, отвечающий за низкоуровневое взаимодействие с сервером.
- `events: IEvents` — Брокер событий для генерации событий запросов.
##### Методы
- `getProductList(): Promise<IBaseProductData>` — Выполняет `GET` запрос для получения списка всех продуктов. Эмитит событие `request:products`.
- `getProduct(id: string): Promise<IProduct>` — Выполняет `GET` запрос для получения одного продукта по id. Эмитит событие `request:product`.
- `createOrder(order: IOrder): Promise<IOrder>` — Выполняет `POST` запрос для создания нового заказа.

### Классы представления

#### Компоненты

#### Базовый Класс Component
Класс является дженериком и родителем всех компонентов слоя представления. В дженерик принимает тип объекта, в котором данные будут передаваться в метод render для отображения данных в компоненте. В конструктор принимает элемент разметки, являющийся основным родительским контейнером компонента. Содержит метод render, отвечающий за сохранение полученных в параметре данных в полях компонентов через их сеттеры, возвращает обновленный контейнер компонента.

#### Класс FormView
Базовый абстрактный класс для форм. Отвечает за инициализацию полей, валидацию и управление кнопкой сабмита.

##### Поля
- `events: IEvents` — Брокер событий.
- `element: HTMLFormElement` — DOM-элемент формы.
- `inputs: Record<string, HTMLInputElement>` — Все инпуты формы, сохраненные по имени.
- `submitButton: HTMLButtonElement` — Кнопка отправки формы.
##### Методы
- `initializeFields(): void` — Находит инпуты в шаблоне и устанавливает обработчики.
- `inputHandler(): void` — Проверяет валидность формы при изменении инпутов.
- `validateForm(): boolean` — Возвращает true, если форма валидна.
- `validateFields(): boolean` — Проверяет все поля на валидность и непустоту.
- `getFieldValue(fieldName: string): string` — Вернёт значение определённого поля.
- `getAllFieldsValues(): Record<string, string>` — Вернёт объект с значениями всех инпутов.
- `toggleSubmitButton(state: boolean): void` — Активирует/деактивирует кнопку сабмита.
- `resetForm(): void` — Сбрасывает форму и очищает все поля.
- `clearFields(): void` — Очищает значения всех инпутов.
- `render(): HTMLFormElement` — Вернёт DOM-элемент формы.

#### Класс CardView
Класс `CardView` отвечает за отображение карточек товара в разных состояниях: в каталоге, в корзине и в модальном окне.
Конструктор принимает `data` — данные товара и `events` — экземпляр брокера событий `EventEmitter`.

##### Поля
- `_data: Partial<IProduct>` — Данные товара, ассоциированные с карточкой.
- `element: HTMLElement` — DOM-элемент карточки.
- `cardTitle: HTMLElement | null` — Элемент названия товара.
- `cardImage: HTMLImageElement | null` — Элемент изображения товара.
- `cardDescription: HTMLElement | null` — Элемент описания товара.
- `cardCategory: HTMLElement | null` — Элемент категории товара.
- `cardPrice: HTMLElement | null` — Элемент цены товара.
- `addToCartButton: HTMLButtonElement | null` — Кнопка добавления товара в корзину.
- `removeFromCartButton: HTMLButtonElement | null` — Кнопка удаления товара из корзины.
- `isInCart: boolean` — Флаг состояния товара в корзине.
- `events: IEvents` — Брокер событий для генерации событий взаимодействия.
##### Методы
- `constructor(data: Partial<IProduct>, events: IEvents)` — Конструктор. Инициализирует данные карточки.
- `initHTML(templateId: string): void` — Клонирует шаблон по `id` и находит все элементы внутри карточки.
- `get data(): Partial<IProduct>` — Геттер для получения данных товара.
- `getGalleryCardView(): HTMLElement` — Генерирует карточку для каталога товаров. При клике эмитит событие открытия модалки с подробной карточкой.
- `getCartCardView(): HTMLElement` — Генерирует карточку для корзины. При клике на кнопку удаления эмитит событие удаления товара.
- `getModalCardView(): HTMLElement` — Генерирует карточку для модального окна с возможностью добавления в корзину.
- `toggleAddToCartButton(state: boolean, buttonText: string): void` — Активирует/деактивирует кнопку добавления в корзину.
- `changeCategoryColor(): void` — Применяет стили к категории товара в зависимости от ее типа.
- `resolveImagePath(imageName: string): string` — Возвращает полный путь до изображения товара.
- `render(): HTMLElement` — Заполняет шаблон карточки данными товара и возвращает его.
- `resetCartState(): void` — Сбрасывает состояние кнопки после очистки корзины.

#### Класс ModalView
Класс `ModalView` отвечает за управление модальным окном: его открытие, закрытие и обновление содержимого.
Конструктор принимает `events` — экземпляр брокера событий `EventEmitter`.

##### Поля
- `modal: HTMLElement` — Корневой элемент модального окна.
- `modalContainer: HTMLElement` — Контейнер для содержимого модального окна.
- `modalContent: HTMLElement` — Элемент, в который вставляется контент модального окна.
- `closeButton: HTMLButtonElement` — Кнопка закрытия модального окна.
- `events: IEvents` — Брокер событий для генерации событий при изменении модального окна.
##### Методы
- `constructor(events: IEvents)` — Конструктор. Находит элементы модального окна и добавляет слушатели событий.
- `openModal(content: HTMLElement): void` — Открывает модальное окно, блокирует прокрутку страницы и вставляет переданный контент.
- `closeModal(): void` — Закрывает модальное окно, разблокирует прокрутку страницы и очищает содержимое.
- `handleEscUp(evt: KeyboardEvent): void` — Обработчик события нажатия клавиши Escape для закрытия модального окна.
- `clearModal(): void` — Очищает содержимое модального окна.
- `renderContent(element: HTMLElement): void` — Отрисовывает переданный элемент внутри модального окна и эмитит событие о перерисовке.

#### Класс OrderForm
Класс `OrderForm` расширяет базовый класс `FormView` и реализует работу с формой оформления заказа, включая выбор метода оплаты.
Конструктор принимает `template` (селектор шаблона формы) и `events` — экземпляр брокера событий `EventEmitter`.

##### Поля
- `_inputs: Record<string, HTMLInputElement>` — Хранилище полей формы.
- `paymentMethod: TPaymentMethods` — Выбранный метод оплаты (`card` или `on-delivery`).
- `paymentButtonCard: HTMLButtonElement` — Кнопка выбора оплаты картой.
- `paymentButtonOnDelivery: HTMLButtonElement` — Кнопка выбора оплаты при получении.
##### Методы
- `constructor(template: string, events: IEvents)` — Конструктор. Инициализирует форму, добавляет слушатели событий для кнопок выбора оплаты и отправки формы.
- `validateForm(): boolean` — Переопределяет базовую проверку формы, добавляя проверку выбранного способа оплаты.
- `isPaymentSelected(): boolean` — Проверяет, выбран ли способ оплаты.
- `selectPaymentMethod(method: 'card' | 'on-delivery'): void` — Выделяет выбранный способ оплаты, добавляя активный класс к кнопке.
- `resetForm(): void` — Очищает поля формы и сбрасывает выбранный метод оплаты.
- `render(): HTMLFormElement` — Возвращает отрендеренный элемент формы.

#### Класс ContactsForm
Класс `ContactsForm` расширяет базовый класс `FormView` и реализует работу с формой для ввода контактной информации пользователя.
Конструктор принимает `template` (селектор шаблона формы) и `events` — экземпляр брокера событий `EventEmitter`.

##### Поля
- `_inputs: Record<string, HTMLInputElement>` — Хранилище полей формы.
- `paymentMethod: TPaymentMethods` — (не используется в текущей реализации, остаток от базового шаблона).
- `paymentButtonCard: HTMLButtonElement` — (не используется в текущей реализации).
- `paymentButtonOnDelivery: HTMLButtonElement` — (не используется в текущей реализации).
##### Методы
- `constructor(template: string, events: IEvents)` — Конструктор. Инициализирует форму, добавляет слушатель события отправки формы.
- `validateForm(): boolean` — Переопределяет базовую валидацию формы, просто вызывая родительскую проверку полей.
- `resetForm(): void` — Очищает все поля формы, вызывая базовый метод `resetForm`.
- `render(): HTMLFormElement` — Возвращает отрендеренный элемент формы.

#### Класс SuccessView
Класс отвечает за отображение экрана успешного оформления заказа.
Конструктор принимает `events` — экземпляр брокера событий `EventEmitter`.

##### Поля
- `element: HTMLElement` — Элемент контейнера успешного оформления.
- `successDescription: HTMLElement` — Элемент для отображения текста об успешной оплате.
- `successButton: HTMLButtonElement` — Кнопка для закрытия окна успешной оплаты.
- `totalPrice: HTMLSpanElement` — Элемент для отображения суммы покупки.
- `events: IEvents` — Брокер событий для генерации событий.
##### Методы
- `constructor(events: IEvents)` — Создает элемент из шаблона `#success`, устанавливает обработчики событий на кнопку закрытия.
- `render(sum: number): HTMLElement` — Устанавливает текст об успешной оплате на основании переданной суммы `sum` и возвращает элемент разметки.

#### Представители View

#### Класс CardsContainer
Этот класс используется для отображения списка карточек на странице, управления их добавлением и очисткой. Поддерживает как поштучное добавление карточек, так и замену всего списка.
Класс отвечает за управление коллекцией карточек товаров на странице. Реализует интерфейс `ICardsContainer` и наследуется от базового класса `Component`.
Конструктор принимает DOM-элемент контейнера карточек.

##### Поля
- `container: HTMLElement` — Родительский контейнер для карточек.
- `_catalog: HTMLElement` — Внутреннее поле для управления элементами каталога.
##### Методы
- `addCard(card: HTMLElement): void` — Добавляет одну карточку в контейнер.
- `addCards(cards: HTMLElement[]): void` — Добавляет сразу несколько карточек в контейнер.
- `clear(): void` — Очищает контейнер от всех карточек.
- `catalog (setter)`: — Устанавливает новый массив карточек в контейнер, полностью заменяя его содержимое.

#### Класс CartView
Класс отвечает за управление визуальным отображением корзины на сайте.
Конструктор принимает `events` — экземпляр брокера событий `EventEmitter`.

##### Поля
- `element: HTMLElement` — элемент корзины.
- `cartOpenButton: HTMLButtonElement` — кнопка открытия корзины.
- `container: HTMLElement` — контейнер с товарами в корзине.
- `cartSubmitButton: HTMLButtonElement` — кнопка оформления заказа.
- `priceContainer: HTMLSpanElement` — элемент отображения общей цены.
- `itemsCount: HTMLSpanElement` — счётчик товаров в корзине.
- `events: IEvents` — брокер событий.
##### Методы
- `addItem(item: HTMLElement, id: string, totalPrice: number, totalProducts: number): void`  
Добавляет товар в корзину, обновляет индексы и сумму заказа.
- `removeItem(id: string, totalPrice: number, totalProducts: number): void`  
  Удаляет товар по id, пересчитывает сумму заказа и обновляет индексы.
- `updateIndexes(): void`  
  Перенумеровывает товары в корзине.
- `toggleSubmitButton(): void`  
  Активирует или деактивирует кнопку оформления заказа в зависимости от количества товаров.
- `updateTotal(sum: number, items: number): void`  
  Обновляет итоговую сумму и количество товаров.
- `clear(): void`  
  Очищает корзину и сбрасывает итоговую сумму.
- `render(): HTMLElement`  
  Возвращает элемент корзины для отображения.

### Презентер

#### Класс AppPresenter
Класс связывает слои данных и представления. Отвечает за инициализацию приложения и настройку событий.

##### Поля
- `events: IEvents` — Брокер событий для обработки событий.
- `api: IAppApi` — Класс для работы с API.
- `productsModel: IProductsModel` — Модель продуктов.
- `cartModel: ICartModel` — Модель корзины.
- `orderModel: IOrderModel` — Модель заказа.
- `cardsContainer: ICardsContainer` — Контейнер для карточек.
- `modal: IModalView` — Модальное окно.
- `cartView: ICartView` — Вью корзины.
- `orderForm: IOrderForm` — Форма оформления заказа.
- `contactsForm: IContactsForm` — Форма контактных данных.
- `successWindow: ISuccessView` — Экран успешного заказа.
- `cardsInstances: CardView[]` — Массив экземпляров карточек.
##### Методы
- `initialize(): void` — Загружает товары и добавляет карточки в контейнер.
- `setListeners(): void` — Устанавливает все слушатели событий.
##### Генерируемые события
| Событие | Описание |
|:--------|:---------|
| `card:preview` | Открытие модального окна с карточкой товара. |
| `cart:open` | Открытие корзины. |
| `cart:add` | Добавление товара в корзину. |
| `cart:remove` | Удаление товара из корзины. |
| `cart:submit` | Переход к оформлению заказа. |
| `order:submit` | Отправка адреса доставки. |
| `contacts:submit` | Отправка контактных данных. |
| `success:submit` | Закрытие окна успеха. |

##### Логика работы
1. После загрузки товаров создаются и отображаются карточки.
2. Клик на карточку открывает модальное окно.
3. Добавление и удаление товаров в корзину.
4. Оформление заказа через формы адреса и контактов.
5. Отображение окна успеха и очистка состояния.



##### Генерируемые события
- `cart:open` — Открытие корзины.
- `cart:submit` — Нажатие на кнопку оформления заказа.
- `success:submit` — Генерируется при клике на кнопку закрытия окна успешного оформления заказа.
- `contacts:submit` — Генерируется при отправке формы контактов. Передаются все данные полей формы.
- `order:submit` — Генерируется при отправке формы заказа. Передаются данные полей формы и выбранный метод оплаты.
- `modal:rendered` — Генерируется при успешной отрисовке контента в модальном окне.
- `card:preview` — При клике на карточку в каталоге для открытия подробной карточки товара.
- `cart:add` — При добавлении товара в корзину.
- `cart:remove` — При удалении товара из корзины.
- `request:products` — Запрос за списком продуктов.
- `request:product` — Запрос за данными одного продукта.
- `cart:item-added` — Генерируется при добавлении товара в корзину. Передаются `id`, `totalPrice`, `totalProducts`.
- `cart:item-removed` — Генерируется при удалении товара из корзины. Передаются `id`, `totalPrice`, `totalProducts`.
- `products:update` — Генерируется при добавлении или очистке продуктов. Содержит текущее состояние Map<string, IProduct>.
