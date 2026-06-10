export interface Product {
  id: string;
  barcode: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  stock: number;
}

export interface CartItem extends Product {
  quantity: number;
  discount: number;
}

export interface Receipt {
  id: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: 'cash' | 'card';
  cashReceived?: number;
  change?: number;
  date: Date;
  cashier: string;
}

export const PRODUCTS: Product[] = [
  { id: '1', barcode: '4607086560612', name: 'Молоко 3.2% 1л', category: 'Молочные', price: 89.90, unit: 'шт', stock: 48 },
  { id: '2', barcode: '4607012960215', name: 'Хлеб белый нарезной', category: 'Выпечка', price: 45.50, unit: 'шт', stock: 32 },
  { id: '3', barcode: '4607015340422', name: 'Яйца С1 10шт', category: 'Молочные', price: 119.00, unit: 'уп', stock: 25 },
  { id: '4', barcode: '4607044220819', name: 'Масло сливочное 200г', category: 'Молочные', price: 149.90, unit: 'шт', stock: 18 },
  { id: '5', barcode: '4600494017123', name: 'Сахар-песок 1кг', category: 'Бакалея', price: 69.90, unit: 'пак', stock: 60 },
  { id: '6', barcode: '4607086551016', name: 'Макароны спагетти 450г', category: 'Бакалея', price: 79.50, unit: 'уп', stock: 44 },
  { id: '7', barcode: '4607045310614', name: 'Кофе молотый 250г', category: 'Напитки', price: 349.00, unit: 'уп', stock: 15 },
  { id: '8', barcode: '4607086560629', name: 'Чай чёрный 25пак', category: 'Напитки', price: 129.90, unit: 'уп', stock: 38 },
  { id: '9', barcode: '4607012960346', name: 'Сок апельсиновый 1л', category: 'Напитки', price: 109.90, unit: 'шт', stock: 22 },
  { id: '10', barcode: '4607015340728', name: 'Вода минеральная 1.5л', category: 'Напитки', price: 55.00, unit: 'шт', stock: 72 },
  { id: '11', barcode: '4607044220957', name: 'Колбаса варёная 400г', category: 'Мясные', price: 289.00, unit: 'шт', stock: 12 },
  { id: '12', barcode: '4600494017247', name: 'Сыр российский 200г', category: 'Молочные', price: 219.90, unit: 'шт', stock: 20 },
  { id: '13', barcode: '4607086551023', name: 'Рис длиннозерный 1кг', category: 'Бакалея', price: 99.90, unit: 'пак', stock: 35 },
  { id: '14', barcode: '4607045310782', name: 'Гречка 900г', category: 'Бакалея', price: 119.50, unit: 'пак', stock: 40 },
  { id: '15', barcode: '4607086560636', name: 'Томатная паста 140г', category: 'Консервы', price: 49.90, unit: 'шт', stock: 55 },
  { id: '16', barcode: '4607012960483', name: 'Майонез Провансаль 400г', category: 'Соусы', price: 159.90, unit: 'шт', stock: 28 },
  { id: '17', barcode: '4607015340865', name: 'Подсолнечное масло 1л', category: 'Бакалея', price: 139.90, unit: 'шт', stock: 30 },
  { id: '18', barcode: '4607044221015', name: 'Шоколад тёмный 100г', category: 'Сладкое', price: 89.90, unit: 'шт', stock: 45 },
  { id: '19', barcode: '4600494017384', name: 'Печенье овсяное 300г', category: 'Сладкое', price: 75.00, unit: 'уп', stock: 38 },
  { id: '20', barcode: '4607086551089', name: 'Стиральный порошок 1.5кг', category: 'Бытовая химия', price: 399.00, unit: 'уп', stock: 16 },
];

export const CATEGORIES = ['Все', ...Array.from(new Set(PRODUCTS.map(p => p.category)))];
