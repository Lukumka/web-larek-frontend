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

### Интерфейсы и типы

---

#### `IProduct`
Описывает структуру товара.

##### Поля:
- `id: string` — уникальный идентификатор товара.
- `description: string` — описание.
- `image: string` — путь к изображению.
- `title: string` — заголовок/название товара.
- `category: string` — категория товара.
- `price: number | null` — цена (может быть `null`, если товар "бесценен").

---

#### `TCartProduct`
Тип для товара в корзине. Используется `Pick` из `IProduct`, включает:
- `id`
- `price`

---

#### `IProductsModel`
Модель списка товаров.

##### Методы:
- `addProducts(cards: IProduct[]): void` — добавляет товары.
- `getAllProducts(): IProduct[]` — возвращает все товары.
- `getProductById(id: string): IProduct | undefined` — получить товар по ID.
- `getProductForCart(id: string): TCartProduct` — возвращает данные товара для корзины.
- `clearProducts(): void` — очищает список товаров.

---

#### `ICartModel`
Модель корзины.

##### Поля:
- `products: Set<string>` — ID добавленных товаров.
- `totalPrice: number` — сумма.
- `totalProducts: number` — количество товаров.

##### Методы:
- `addToCart(data: TCartProduct): void` — добавляет товар.
- `removeFromCart(data: TCartProduct): void` — удаляет товар.
- `clearCart(): void` — очищает корзину.
- `getCartData(): { total: number; items: string[] }` — итоговые данные корзины.

---

#### `IOrder`
Данные для оформления заказа.

##### Поля:
- `payment: TPaymentMethods` — метод оплаты.
- `email: string`
- `phone: string`
- `address: string`
- `total: number`
- `items: string[]` — ID товаров.

---

#### `IOrderModel`
Модель заказа.

##### Поля:
- `payment`, `email`, `phone`, `address`

##### Методы:
- `createFullOrder(items: string[], total: number): IOrder` — формирует итоговый объект заказа.

---

#### `ICardView`
Интерфейс базового представления карточки.
- `render(data: Partial<IProduct>): HTMLElement`

#### `IModalCardView`
Интерфейс карточки для модального окна.
- `render(data: Partial<IProduct>, isInCart: boolean): HTMLElement`

---

#### `IHeaderView`
Интерфейс шапки сайта.
- `updateCartCounter(count: number): void` — обновление счётчика.

---

#### `ICardsContainer`
Контейнер для карточек.

##### Методы:
- `addCard(card: HTMLElement): void`
- `addCards(cards: HTMLElement[]): void`
- `clear(): void`

##### Свойства:
- `catalog: HTMLElement[]` — сеттер.

---

#### `IModalView`
Работа с модальным окном.

##### Методы:
- `openModal(content: HTMLElement): void`
- `closeModal(): void`
- `clearModal(): void`
- `renderContent(content: HTMLElement): void`

---

#### `ICartView`
Интерфейс корзины.

##### Методы:
- `clear(): void`
- `render(): HTMLElement`
- `update(cards: HTMLElement[], totalPrice: number): void`

---

#### `IFormView`
Базовая форма.

##### Методы:
- `getFieldValue(fieldName: string): string`
- `getAllFieldsValues(): Record<string, string>`
- `resetForm(): void`
- `clearFields(): void`
- `render(): HTMLFormElement`

---

#### `IOrderForm`
Форма заказа.

##### Методы:
- `selectPaymentMethod(method: string): void`
- `resetForm(): void`
- `render(): HTMLElement`

---

#### `IContactsForm`
Форма контактов.

##### Методы:
- `resetForm(): void`
- `render(): HTMLElement`

---

#### `ISuccessView`
Отображение окна об успешном заказе.

##### Метод:
- `render(sum: number): HTMLElement`

---

#### `TPaymentMethods`
Тип метода оплаты:
- `'card'`
- `'on-delivery'`

---

#### `ApiPostMethods`
Методы HTTP-запросов:
- `'POST'`, `'PUT'`, `'DELETE'`, `'PATCH'`

---

#### `IApi`
Базовый API-клиент.

##### Свойства:
- `baseUrl: string`

##### Методы:
- `get<T>(uri: string): Promise<T>`
- `post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>`

---

#### `IBaseProductData`
Тип ответа от сервера по товарам:
- `total: number`
- `items: IProduct[]`

---

#### `IAppApi`
Основной API-прокси приложения.

##### Методы:
- `getProductList(): Promise<IBaseProductData>`
- `getProduct(id: string): Promise<IProduct>`
- `createOrder(order: IOrder): Promise<IOrder>`


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
Класс отвечает за хранение и управление данными о продуктах.  
Конструктор принимает `events` — экземпляр брокера событий `EventEmitter`.

##### Поля
- `cards: Map<string, IProduct>` — хранилище всех продуктов. Ключ — `id` продукта.
- `events: IEvents` — брокер событий.

##### Методы
- `addProducts(cards: IProduct[]): void`  
  Добавляет массив продуктов в хранилище.  
  Эмитит событие `products:update` после добавления.

- `getAllProducts(): IProduct[]`  
  Возвращает все продукты в виде массива.

- `getProductById(id: string): IProduct | undefined`  
  Возвращает продукт по его `id`.  
  Если продукт не найден — возвращает `undefined`.

- `getProductForCart(id: string): TCartProduct`  
  Возвращает объект для добавления товара в корзину.  
  Содержит только `id` и `price`.

- `clearProducts(): void`  
  Очищает все продукты из хранилища.  
  Эмитит событие `products:update` после очистки.

##### Генерируемые события
- `products:update` — генерируется при добавлении или очистке продуктов.  
  В payload передаётся текущее состояние `Map<string, IProduct>`.

#### Класс CartModel
Класс отвечает за хранение и управление данными о товарах, добавленных в корзину.  
Конструктор принимает `events` — экземпляр брокера событий `EventEmitter`.

##### Поля
- `_products: Set<string>` — множество ID товаров, добавленных в корзину (уникальные значения).
- `_totalPrice: number` — суммарная стоимость всех товаров в корзине.
- `_totalProducts: number` — количество товаров в корзине.
- `events: IEvents` — брокер событий для генерации событий обновления корзины.

##### Методы
- `addToCart(data: TCartProduct): void`  
  Добавляет товар в корзину. Обновляет цену и количество товаров. Эмитит событие `cart:update`.

- `removeFromCart(data: TCartProduct): void`  
  Удаляет товар из корзины по его `id`. Обновляет цену и количество товаров. Эмитит событие `cart:update`.

- `clearCart(): void`  
  Полностью очищает корзину, сбрасывает цену и количество товаров.

- `getCartData(): { total: number; items: string[] }`  
  Возвращает объект с итоговой суммой всех товаров и массивом их `id`.

- `updateTotalProducts(): void`  
  Пересчитывает общее количество товаров в корзине на основе множества `_products`.

##### Геттеры
- `products: Set<string>`  
  Возвращает множество товаров в корзине.

- `totalPrice: number`  
  Возвращает суммарную стоимость товаров в корзине.

- `totalProducts: number`  
  Возвращает общее количество товаров в корзине.

##### Генерируемые события
- `cart:update`  
  Генерируется при добавлении, удалении или очистке товаров в корзине.  
  Передает объект `{ cardsId: string[], totalPrice: number, totalProducts: number }`.

#### Класс OrderModel
Класс отвечает за хранение данных о заказе и формирование финального объекта заказа для отправки.  
Конструктор принимает `events` — экземпляр брокера событий `EventEmitter`.

##### Поля
- `events: IEvents` — брокер событий для работы с событиями в приложении.
- `_payment: TPaymentMethods` — выбранный способ оплаты (`'card'` или `'on-delivery'`).
- `_email: string` — электронная почта пользователя.
- `_phone: string` — телефон пользователя.
- `_address: string` — адрес доставки.

##### Методы
- `set payment(method: TPaymentMethods): void`  
  Сеттер для установки способа оплаты.

- `get payment(): TPaymentMethods`  
  Геттер для получения текущего способа оплаты.

- `set email(email: string): void`  
  Сеттер для установки электронной почты.

- `get email(): string`  
  Геттер для получения электронной почты.

- `set phone(phone: string): void`  
  Сеттер для установки номера телефона.

- `get phone(): string`  
  Геттер для получения номера телефона.

- `set address(address: string): void`  
  Сеттер для установки адреса доставки.

- `get address(): string`  
  Геттер для получения адреса доставки.

- `createFullOrder(items: string[], total: number): IOrder`  
  Метод для создания полного объекта заказа.  
  Принимает список товаров и общую сумму.  
  Возвращает объект `IOrder` со всеми необходимыми данными.

##### Использование
Экземпляр класса собирает данные по частям (оплата, контактные данные, адрес),  
а затем формирует итоговый заказ с помощью метода `createFullOrder`.


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

#### Класс BaseCardView
Базовый абстрактный класс для всех карточек товаров.  
Отвечает за базовую структуру карточки: создание элемента, базовый рендер и управление состоянием.
Конструктор принимает `templateId` селектор темплейта карточки и `events` экземпляр брокера событий для генерации событий.

##### Поля
- `element: HTMLElement` — основной элемент карточки.
- `cardTitle: HTMLElement | null` — элемент заголовка карточки.
- `cardImage: HTMLImageElement | null` — элемент изображения карточки.
- `cardDescription: HTMLElement | null` — элемент описания карточки.
- `cardCategory: HTMLElement | null` — элемент категории карточки.
- `cardPrice: HTMLElement | null` — элемент отображения цены.
- `addToCartButton: HTMLButtonElement | null` — кнопка "добавить в корзину".
- `removeFromCartButton: HTMLButtonElement | null` — кнопка "удалить из корзины".
- `isInCart: boolean` — флаг наличия карточки в корзине.
- `events: IEvents` — брокер событий.
##### Методы
- `initHTML(): void` — находит и сохраняет все основные элементы карточки.
- `resolveImagePath(imageName: string): string` — вернет полный URL к изображению.
- `changeCategoryColor(category: string): void` — задает цвет для категории по типу.
- `resetCartState(): void` — сбрасывает состояние кнопки "в корзине".
- `renderBase(data: Partial<IProduct>): void` — заполняет заголовок и цену товара.
- `render(data: Partial<IProduct>, ...args: unknown[]): HTMLElement` — **абстрактный метод**. Должен быть реализован в наследниках.


#### Класс FormView
Базовый абстрактный класс для всех форм в проекте.  
Отвечает за работу с полями формы, валидацию данных и отображение ошибок.  
Конструктор принимает `template` — селектор шаблона формы и `events` — экземпляр брокера событий.

##### Поля
- `events: IEvents` — брокер событий.
- `element: HTMLFormElement` — основной элемент формы.
- `inputs: Record<string, HTMLInputElement>` — коллекция полей формы по их имени (`name`).
- `submitButton: HTMLButtonElement` — кнопка отправки формы.
- `errorsConatiner: HTMLSpanElement` — контейнер для отображения ошибок валидации.

##### Методы
- `initializeFields(): void`  
  Инициализирует все поля формы, навешивает обработчики событий ввода на каждый инпут.

- `inputHandler(): void`  
  Обрабатывает ввод в поля: запускает валидацию и обновление состояния кнопки отправки и сообщений об ошибках.

- `validateForm(): boolean`  
  Проверяет валидность всей формы.

- `validateFields(): boolean`  
  Проверяет, что все поля заполнены и валидны.

- `updateErrors(): void`  
  Обновляет текст ошибок под формой в зависимости от состояния всех полей.

- `getFieldValue(fieldName: string): string`  
  Возвращает значение конкретного поля формы по его имени.

- `getAllFieldsValues(): Record<string, string>`  
  Возвращает объект со всеми введёнными значениями полей формы.

- `toggleSubmitButton(state: boolean): void`  
  Включает или выключает кнопку отправки формы в зависимости от валидности данных.

- `resetForm(): void`  
  Сбрасывает все поля формы, очищая их значения.

- `clearFields(): void`  
  Очищает значения всех полей формы.

- `render(): HTMLFormElement`  
  Возвращает элемент формы для вставки в DOM.

#### Класс CartCardView
Класс отвечает за отображение товара в корзине.  
Наследуется от `BaseCardView`. Используется для отображения карточки товара в списке корзины.

##### Поля
- `events: IEvents` — брокер событий для обработки действий пользователя.

##### Методы
- `render(data: Partial<IProduct>, index: number): HTMLElement`  
  Отрисовывает карточку товара для корзины:
  - Заполняет базовые поля карточки (`renderBase`).
  - Устанавливает индекс позиции товара в корзине.
  - Назначает обработчик на кнопку удаления товара, который генерирует событие `cart:remove`.

##### Генерируемые события
- `cart:remove` — удаление товара из корзины при нажатии на кнопку удаления.

#### Класс GalleryCardView
Класс отвечает за отображение карточки товара в галерее каталога.  
Наследуется от `BaseCardView`.

##### Поля
- `events: IEvents` — брокер событий для обработки действий пользователя.

##### Методы
- `render(data: Partial<IProduct>): HTMLElement`  
  Отрисовывает карточку товара для каталога:
  - Заполняет базовые поля карточки (`renderBase`).
  - Устанавливает изображение и категорию товара.
  - Назначает обработчик на клик по карточке, который генерирует событие `card:preview` с данными товара.

##### Генерируемые события
- `card:preview` — событие открытия подробного просмотра товара в модальном окне.

#### Класс ModalCardView
Класс отвечает за отображение карточки товара в модальном окне.  
Наследуется от `BaseCardView`.

##### Поля
- `image: HTMLImageElement` — элемент изображения товара.
- `description: HTMLElement` — элемент описания товара.
- `category: HTMLElement` — элемент категории товара.
- `addButton: HTMLButtonElement` — кнопка добавления товара в корзину.
- `boundClickHandler: (event: Event) => void` — привязанный обработчик нажатия на кнопку "Купить".

##### Методы
- `render(data: Partial<IProduct>, isInCart: boolean): HTMLElement`  
  Отрисовывает карточку товара для модального окна:
  - Заполняет базовые поля карточки (`renderBase`).
  - Устанавливает изображение, описание и категорию товара.
  - Обновляет кнопку добавления в корзину в зависимости от состояния `isInCart`.

- `updateAddButton(data: Partial<IProduct>, isInCart: boolean): void`  
  Обновляет состояние кнопки добавления в корзину:
  - Блокирует кнопку, если товар уже в корзине или имеет цену 0.
  - Назначает или снимает обработчик клика по кнопке.

- `handleAddButtonClick(event: Event): void`  
  Обработчик клика по кнопке "Купить". Эмитит событие добавления товара в корзину и блокирует кнопку.

- `toggleButton(state: boolean, message?: string): void`  
  Меняет текст и доступность кнопки "Купить" в зависимости от состояния.

##### Генерируемые события
- `cart:add` — событие добавления товара в корзину, передает объект `{ id }`.

#### Класс HeaderView
Класс отвечает за отображение состояния корзины в шапке сайта.  
Конструктор принимает `events` — экземпляр брокера событий для генерации событий.

##### Поля
- `element: HTMLElement` — основной элемент шапки (`.header`).
- `headerCartOpenButton: HTMLButtonElement` — кнопка открытия корзины (`.header__basket`).
- `headerCartItemsCounter: HTMLSpanElement` — счетчик товаров в корзине (`.header__basket-counter`).
- `events: IEvents` — брокер событий.

##### Методы
- `updateCartCounter(count: number): void`  
  Обновляет текст счетчика количества товаров в корзине.

##### Генерируемые события
- `cart:open` — событие открытия корзины, эмитится при клике на кнопку корзины.


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
Класс отвечает за отображение и валидацию формы оформления заказа.  
Наследуется от базового класса `FormView`.  
Конструктор принимает `template` — селектор шаблона формы и `events` — экземпляр брокера событий.

##### Поля
- `_inputs: Record<string, HTMLInputElement>` — объект полей ввода формы.
- `paymentMethod: TPaymentMethods` — выбранный способ оплаты (`'card'` или `'on-delivery'`).
- `paymentButtonCard: HTMLButtonElement` — кнопка выбора оплаты картой.
- `paymentButtonOnDelivery: HTMLButtonElement` — кнопка выбора оплаты при получении.
- `events: IEvents` — брокер событий.

##### Методы
- `validateForm(): boolean`  
  Переопределяет базовую валидацию, добавляя проверку на выбор способа оплаты.

- `updateErrors(): void`  
  Переопределяет базовую проверку ошибок, добавляя сообщение о необходимости выбрать способ оплаты.

- `isPaymentSelected(): boolean`  
  Проверяет, выбран ли способ оплаты.

- `selectPaymentMethod(method: 'card' | 'on-delivery'): void`  
  Устанавливает выбранный способ оплаты и обновляет активные кнопки.

- `resetForm(): void`  
  Очищает поля формы и сбрасывает выбор способа оплаты.

- `render(): HTMLFormElement`  
  Возвращает элемент формы для вставки в DOM.

##### Генерируемые события
- `order:submit` — событие отправки формы оформления заказа.  
  Передаются данные полей формы и выбранный способ оплаты.

#### Класс ContactsForm
Класс отвечает за отображение и валидацию формы ввода контактных данных.  
Наследуется от базового класса `FormView`.  
Конструктор принимает `template` — селектор шаблона формы и `events` — экземпляр брокера событий.

##### Поля
- `_inputs: Record<string, HTMLInputElement>` — объект полей ввода формы.
- `events: IEvents` — брокер событий.

##### Методы
- `validateForm(): boolean`  
  Переопределяет базовую валидацию. Проверяет, что все обязательные поля заполнены корректно.

- `resetForm(): void`  
  Очищает все поля формы.

- `render(): HTMLFormElement`  
  Возвращает элемент формы для вставки в DOM.

##### Генерируемые события
- `contacts:submit` — событие отправки формы контактных данных.  
  Передаются все значения полей формы.


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
Класс отвечает за управление коллекцией карточек на странице.  
Реализует интерфейс `ICardsContainer`.  
Конструктор принимает `container` — DOM-элемент, в который будут добавляться карточки.

##### Поля
- `container: HTMLElement` — контейнер для карточек.

##### Методы
- `addCard(card: HTMLElement): void`  
  Добавляет одну карточку в контейнер.

- `addCards(cards: HTMLElement[]): void`  
  Добавляет несколько карточек в контейнер.

- `clear(): void`  
  Очищает контейнер, удаляя все карточки.

- `catalog (setter): void`  
  Заменяет все карточки в контейнере на переданный массив новых элементов.

#### Класс CartView
Класс отвечает за отображение корзины на странице: список товаров, общую стоимость и управление кнопкой оформления заказа.  
Реализует интерфейс `ICartView`.  
Конструктор принимает `events` — экземпляр брокера событий `EventEmitter`.

##### Поля
- `element: HTMLElement` — основной элемент корзины.
- `container: HTMLElement` — контейнер для списка карточек в корзине.
- `cartSubmitButton: HTMLButtonElement` — кнопка оформления заказа.
- `priceContainer: HTMLSpanElement` — элемент для отображения общей суммы заказа.
- `events: IEvents` — брокер событий.

##### Методы
- `toggleSubmitButton(): void`  
  Включает или отключает кнопку оформления заказа в зависимости от суммы заказа.

- `clear(): void`  
  Очищает корзину и перерисовывает её содержимое.

- `render(): HTMLElement`  
  Возвращает основной элемент корзины для отображения.

- `update(cards: HTMLElement[], totalPrice: number): void`  
  Обновляет список карточек в корзине и общую стоимость.


### Презентер

#### Класс AppPresenter
Класс отвечает за связывание слоёв приложения (данные, представление и API).  
Реализует паттерн MVP. Обрабатывает события, обновляет модель и перерисовывает представление.

##### Поля
- `events: IEvents` — брокер событий.
- `api: IAppApi` — API для получения продуктов и создания заказов.
- `productsModel: IProductsModel` — модель для хранения данных о продуктах.
- `cartModel: ICartModel` — модель корзины.
- `orderModel: IOrderModel` — модель заказа.
- `cardsContainer: ICardsContainer` — контейнер для карточек в каталоге.
- `modalCardInstance: IModalCardView` — карточка для модального окна предпросмотра.
- `modal: IModalView` — модальное окно.
- `cartView: ICartView` — представление корзины.
- `orderForm: IOrderForm` — форма заказа.
- `contactsForm: IContactsForm` — форма контактов.
- `successWindow: ISuccessView` — окно успешного заказа.
- `headerView: IHeaderView` — представление хедера (корзина в шапке).

##### Методы
- `initialize(): void`  
  Загружает список продуктов через API и отрисовывает карточки каталога.

- `setListeners(): void`  
  Подписывается на события и связывает пользовательские действия с обновлением моделей и представлений:

  - `card:preview` — открывает модальное окно предпросмотра товара.
  - `cart:open` — открывает корзину.
  - `cart:add` — добавляет товар в корзину.
  - `cart:remove` — удаляет товар из корзины.
  - `cart:update` — обновляет содержимое корзины и счетчик в шапке.
  - `cart:submit` — открывает форму заказа.
  - `order:submit` — сохраняет адрес и способ оплаты, открывает форму контактов.
  - `contacts:submit` — отправляет заказ на сервер, очищает корзину, сбрасывает формы и показывает окно успеха.
  - `success:submit` — закрывает модальное окно.

##### Генерируемые события
- `cart:update` — обновление содержимого корзины и UI.
- `cart:submit` — отправка корзины на оформление заказа.
- `order:submit` — отправка данных заказа.
- `contacts:submit` — отправка контактных данных.
- `success:submit` — закрытие окна успешного заказа.
