import { CartItem } from '@/data/products';
import Icon from '@/components/ui/icon';

interface CartProps {
  items: CartItem[];
  onUpdateQty: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
  onClearCart: () => void;
  onCheckout: () => void;
}

export default function Cart({ items, onUpdateQty, onRemove, onClearCart, onCheckout }: CartProps) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalDiscount = items.reduce((sum, item) => sum + (item.discount / 100) * item.price * item.quantity, 0);
  const total = subtotal - totalDiscount;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Icon name="ShoppingCart" size={18} className="text-muted-foreground" />
          <span className="font-semibold text-sm">Корзина</span>
          {items.length > 0 && (
            <span className="bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-scale-in">
              {items.reduce((s, i) => s + i.quantity, 0)}
            </span>
          )}
        </div>
        {items.length > 0 && (
          <button
            onClick={onClearCart}
            className="text-xs text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1"
          >
            <Icon name="Trash2" size={13} />
            Очистить
          </button>
        )}
      </div>

      {/* Items */}
      <div className="flex-1 overflow-y-auto">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
            <Icon name="ShoppingCart" size={36} className="opacity-20" />
            <span className="text-sm">Корзина пуста</span>
            <span className="text-xs opacity-60">Сканируйте товар или выберите из каталога</span>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {items.map((item, idx) => (
              <div
                key={item.id}
                className="flex items-center gap-2 p-2.5 rounded-md bg-card border border-border hover:border-border/80 group animate-fade-in"
                style={{ animationDelay: `${idx * 0.03}s` }}
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{item.name}</div>
                  <div className="text-xs text-muted-foreground font-mono-ibm">
                    {item.price.toFixed(2)} ₽ × {item.quantity}
                    {item.discount > 0 && (
                      <span className="ml-1 cash-amber">−{item.discount}%</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => onUpdateQty(item.id, item.quantity - 1)}
                    className="w-6 h-6 rounded flex items-center justify-center bg-secondary hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
                  >
                    <Icon name="Minus" size={11} />
                  </button>
                  <span className="w-7 text-center text-sm font-mono-ibm font-medium">{item.quantity}</span>
                  <button
                    onClick={() => onUpdateQty(item.id, item.quantity + 1)}
                    className="w-6 h-6 rounded flex items-center justify-center bg-secondary hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
                  >
                    <Icon name="Plus" size={11} />
                  </button>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-semibold font-mono-ibm cash-green">
                    {((item.price * item.quantity) * (1 - item.discount / 100)).toFixed(2)} ₽
                  </div>
                </div>
                <button
                  onClick={() => onRemove(item.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                >
                  <Icon name="X" size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Summary */}
      {items.length > 0 && (
        <div className="border-t border-border p-4 space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Подытог</span>
            <span className="font-mono-ibm">{subtotal.toFixed(2)} ₽</span>
          </div>
          {totalDiscount > 0 && (
            <div className="flex justify-between text-sm cash-amber">
              <span>Скидка</span>
              <span className="font-mono-ibm">−{totalDiscount.toFixed(2)} ₽</span>
            </div>
          )}
          <div className="flex justify-between text-lg font-bold pt-1 border-t border-border">
            <span>ИТОГО</span>
            <span className="font-mono-ibm cash-green">{total.toFixed(2)} ₽</span>
          </div>
          <button
            onClick={onCheckout}
            className="w-full mt-2 bg-primary text-primary-foreground py-3 rounded-md font-semibold text-sm hover:bg-primary/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Icon name="CreditCard" size={16} />
            Оплатить
          </button>
        </div>
      )}
    </div>
  );
}
