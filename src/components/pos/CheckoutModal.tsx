import { useState } from 'react';
import { CartItem, Receipt } from '@/data/products';
import Icon from '@/components/ui/icon';

interface CheckoutModalProps {
  items: CartItem[];
  total: number;
  onConfirm: (receipt: Omit<Receipt, 'id' | 'date'>) => void;
  onClose: () => void;
}

export default function CheckoutModal({ items, total, onConfirm, onClose }: CheckoutModalProps) {
  const [method, setMethod] = useState<'cash' | 'card'>('card');
  const [cashInput, setCashInput] = useState('');

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const discount = subtotal - total;
  const cashReceived = parseFloat(cashInput) || 0;
  const change = cashReceived - total;
  const canPay = method === 'card' || cashReceived >= total;

  function handleQuickCash(amount: number) {
    setCashInput(String(amount));
  }

  function handleConfirm() {
    if (!canPay) return;
    onConfirm({
      items,
      subtotal,
      discount,
      total,
      paymentMethod: method,
      cashReceived: method === 'cash' ? cashReceived : undefined,
      change: method === 'cash' ? change : undefined,
      cashier: 'Кассир №1',
    });
  }

  const quickAmounts = [
    Math.ceil(total / 100) * 100,
    Math.ceil(total / 500) * 500,
    Math.ceil(total / 1000) * 1000,
  ].filter((v, i, a) => a.indexOf(v) === i && v >= total);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-card border border-border rounded-xl w-full max-w-md shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Icon name="Receipt" size={16} className="text-primary" />
            </div>
            <span className="font-semibold">Оплата</span>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <Icon name="X" size={18} />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Total */}
          <div className="text-center py-2">
            <div className="text-sm text-muted-foreground mb-1">К оплате</div>
            <div className="text-4xl font-bold font-mono-ibm cash-green">{total.toFixed(2)} ₽</div>
            {discount > 0 && (
              <div className="text-xs cash-amber mt-1">Скидка: −{discount.toFixed(2)} ₽</div>
            )}
          </div>

          {/* Payment method */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setMethod('card')}
              className={`flex items-center justify-center gap-2 py-3 rounded-lg border font-medium text-sm transition-all ${
                method === 'card'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border text-muted-foreground hover:border-muted-foreground'
              }`}
            >
              <Icon name="CreditCard" size={16} />
              Карта
            </button>
            <button
              onClick={() => setMethod('cash')}
              className={`flex items-center justify-center gap-2 py-3 rounded-lg border font-medium text-sm transition-all ${
                method === 'cash'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border text-muted-foreground hover:border-muted-foreground'
              }`}
            >
              <Icon name="Banknote" size={16} />
              Наличные
            </button>
          </div>

          {/* Cash input */}
          {method === 'cash' && (
            <div className="space-y-3 animate-fade-in">
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Получено наличных</label>
                <input
                  type="number"
                  value={cashInput}
                  onChange={e => setCashInput(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-input border border-border rounded-md px-3 py-2.5 text-lg font-mono-ibm font-semibold text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  autoFocus
                />
              </div>
              <div className="flex gap-2">
                {quickAmounts.slice(0, 3).map(amount => (
                  <button
                    key={amount}
                    onClick={() => handleQuickCash(amount)}
                    className="flex-1 py-2 rounded-md border border-border text-sm font-mono-ibm font-medium text-muted-foreground hover:border-primary hover:text-primary transition-all"
                  >
                    {amount.toLocaleString('ru-RU')} ₽
                  </button>
                ))}
              </div>
              {cashReceived >= total && (
                <div className="flex justify-between items-center py-2.5 px-3 rounded-lg bg-primary/10 border border-primary/20 animate-fade-in">
                  <span className="text-sm text-muted-foreground">Сдача</span>
                  <span className="text-xl font-bold font-mono-ibm cash-green">{change.toFixed(2)} ₽</span>
                </div>
              )}
              {cashInput && cashReceived < total && (
                <div className="flex justify-between items-center py-2 px-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <span className="text-sm text-muted-foreground">Не хватает</span>
                  <span className="text-sm font-mono-ibm cash-red">{(total - cashReceived).toFixed(2)} ₽</span>
                </div>
              )}
            </div>
          )}

          {/* Confirm button */}
          <button
            onClick={handleConfirm}
            disabled={!canPay}
            className={`w-full py-3.5 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
              canPay
                ? 'bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.98]'
                : 'bg-muted text-muted-foreground cursor-not-allowed'
            }`}
          >
            <Icon name="Check" size={16} />
            {method === 'card' ? 'Подтвердить оплату картой' : 'Принять оплату'}
          </button>
        </div>
      </div>
    </div>
  );
}
