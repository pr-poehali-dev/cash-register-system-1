import { useState, useCallback, useRef } from 'react';
import { PRODUCTS as INITIAL_PRODUCTS, Product, CartItem, Receipt } from '@/data/products';
import ProductCard from '@/components/pos/ProductCard';
import Cart from '@/components/pos/Cart';
import CheckoutModal from '@/components/pos/CheckoutModal';
import ReceiptModal from '@/components/pos/ReceiptModal';
import SalesHistory from '@/components/pos/SalesHistory';
import SettingsPanel from '@/components/pos/SettingsPanel';
import BarcodeScanner from '@/components/pos/BarcodeScanner';
import CreateProductModal from '@/components/pos/CreateProductModal';
import Icon from '@/components/ui/icon';

type Tab = 'pos' | 'history' | 'settings';

const DEFAULT_SETTINGS = {
  storeName: 'Мой Магазин',
  cashierName: 'Кассир №1',
  taxRate: 20,
  currency: 'RUB',
  defaultDiscount: 0,
};

let receiptCounter = 1000;

export default function Index() {
  const [tab, setTab] = useState<Tab>('pos');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('Все');
  const [showCheckout, setShowCheckout] = useState(false);
  const [lastReceipt, setLastReceipt] = useState<Receipt | null>(null);
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [callActive, setCallActive] = useState(false);
  const callTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [showCreateProduct, setShowCreateProduct] = useState(false);

  const categories = ['Все', ...Array.from(new Set(products.map(p => p.category)))];

  function handleAddProduct(product: Product) {
    setProducts(prev => [...prev, product]);
  }

  function playCallSound() {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.12);
      gain.gain.linearRampToValueAtTime(0.35, ctx.currentTime + i * 0.12 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.22);
      osc.start(ctx.currentTime + i * 0.12);
      osc.stop(ctx.currentTime + i * 0.12 + 0.25);
    });
  }

  function handleCallStaff() {
    if (callActive) return;
    playCallSound();
    setCallActive(true);
    clearTimeout(callTimerRef.current);
    callTimerRef.current = setTimeout(() => setCallActive(false), 4000);
  }

  const addToCart = useCallback((product: Product) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...product, quantity: 1, discount: settings.defaultDiscount }];
    });
  }, [settings.defaultDiscount]);

  const updateQty = useCallback((id: string, qty: number) => {
    if (qty <= 0) {
      setCart(prev => prev.filter(i => i.id !== id));
    } else {
      setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i));
    }
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCart(prev => prev.filter(i => i.id !== id));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  function handleCheckout(data: Omit<Receipt, 'id' | 'date'>) {
    receiptCounter++;
    const receipt: Receipt = {
      ...data,
      id: String(receiptCounter),
      date: new Date(),
      cashier: settings.cashierName,
    };
    setReceipts(prev => [...prev, receipt]);
    setLastReceipt(receipt);
    setCart([]);
    setShowCheckout(false);
  }

  const filteredProducts = products.filter(p => {
    const matchCat = category === 'Все' || p.category === category;
    const matchSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.barcode.includes(searchQuery);
    return matchCat && matchSearch;
  });

  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.quantity * (1 - i.discount / 100), 0);

  const NAV_TABS: { id: Tab; label: string; icon: string; badge?: number }[] = [
    { id: 'pos', label: 'Касса', icon: 'ScanLine' },
    { id: 'history', label: 'История', icon: 'History', badge: receipts.length },
    { id: 'settings', label: 'Настройки', icon: 'Settings' },
  ];

  return (
    <div className="h-screen flex flex-col bg-background font-ibm overflow-hidden">
      {/* Top bar */}
      <header className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-card shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon name="ScanLine" size={15} className="text-primary" />
          </div>
          <div>
            <div className="text-sm font-bold leading-none">{settings.storeName}</div>
            <div className="text-xs text-muted-foreground leading-none mt-0.5">{settings.cashierName}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-xs text-muted-foreground font-mono-ibm hidden sm:block">
            {new Date().toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })}
          </div>
          <div className="flex items-center gap-1 text-xs cash-green font-medium hidden sm:flex">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Смена открыта
          </div>
          <button
            onClick={handleCallStaff}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold border transition-all duration-200 ${
              callActive
                ? 'bg-amber-500 border-amber-400 text-white animate-pulse shadow-lg shadow-amber-500/30'
                : 'bg-amber-50 border-amber-300 text-amber-700 hover:bg-amber-100 hover:border-amber-400'
            }`}
          >
            <Icon name="Bell" size={15} />
            {callActive ? 'Вызов отправлен...' : 'Вызов сотрудника'}
          </button>
        </div>
      </header>

      {/* Nav tabs */}
      <div className="flex border-b border-border bg-card shrink-0">
        {NAV_TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium border-b-2 transition-all relative ${
              tab === t.id
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
            }`}
          >
            <Icon name={t.icon} size={15} />
            {t.label}
            {t.badge !== undefined && t.badge > 0 && (
              <span className="ml-0.5 text-xs bg-muted text-muted-foreground rounded-full px-1.5 font-mono-ibm">
                {t.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-hidden">
        {tab === 'pos' && (
          <div className="h-full flex">
            {/* Left: Product catalog */}
            <div className="flex-1 flex flex-col border-r border-border overflow-hidden">
              {/* Search + Barcode row */}
              <div className="p-3 border-b border-border space-y-2 shrink-0">
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowCreateProduct(true)}
                    className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 active:scale-[0.98] transition-all"
                  >
                    <Icon name="Plus" size={15} />
                    Создать товар
                  </button>
                  <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-md border border-border bg-input focus-within:border-primary/50 transition-colors">
                    <Icon name="Search" size={14} className="text-muted-foreground shrink-0" />
                    <input
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Поиск товара..."
                      className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                    />
                    {searchQuery && (
                      <button onClick={() => setSearchQuery('')} className="text-muted-foreground hover:text-foreground">
                        <Icon name="X" size={12} />
                      </button>
                    )}
                  </div>
                  <div className="w-48 shrink-0">
                    <BarcodeScanner products={products} onFound={addToCart} />
                  </div>
                </div>
                {/* Category filter */}
                <div className="flex gap-1.5 overflow-x-auto pb-0.5">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                        category === cat
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-muted-foreground hover:text-foreground hover:bg-accent'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Products grid */}
              <div className="flex-1 overflow-y-auto p-3">
                {filteredProducts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground">
                    <Icon name="PackageSearch" size={32} className="opacity-20" />
                    <span className="text-sm">Товары не найдены</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
                    {filteredProducts.map((product, idx) => (
                      <div key={product.id} style={{ animationDelay: `${idx * 0.02}s` }}>
                        <ProductCard product={product} onAdd={addToCart} />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom status */}
              <div className="px-3 py-2 border-t border-border flex items-center justify-between text-xs text-muted-foreground shrink-0">
                <span>{filteredProducts.length} товаров</span>
                <span className="font-mono-ibm">
                  {products.reduce((s, p) => s + p.stock, 0)} ед. на складе
                </span>
              </div>
            </div>

            {/* Right: Cart */}
            <div className="w-72 xl:w-80 flex flex-col shrink-0">
              <Cart
                items={cart}
                onUpdateQty={updateQty}
                onRemove={removeFromCart}
                onClearCart={clearCart}
                onCheckout={() => setShowCheckout(true)}
              />
            </div>
          </div>
        )}

        {tab === 'history' && (
          <SalesHistory receipts={receipts} />
        )}

        {tab === 'settings' && (
          <SettingsPanel settings={settings} onSave={setSettings} />
        )}
      </div>

      {/* Modals */}
      {showCreateProduct && (
        <CreateProductModal
          onSave={handleAddProduct}
          onClose={() => setShowCreateProduct(false)}
        />
      )}

      {showCheckout && (
        <CheckoutModal
          items={cart}
          total={cartTotal}
          onConfirm={handleCheckout}
          onClose={() => setShowCheckout(false)}
        />
      )}

      {lastReceipt && !showCheckout && (
        <ReceiptModal
          receipt={lastReceipt}
          onClose={() => setLastReceipt(null)}
        />
      )}
    </div>
  );
}