import { Receipt } from '@/data/products';
import Icon from '@/components/ui/icon';

interface ReceiptModalProps {
  receipt: Receipt;
  onClose: () => void;
}

export default function ReceiptModal({ receipt, onClose }: ReceiptModalProps) {
  const dateStr = receipt.date.toLocaleDateString('ru-RU', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  });
  const timeStr = receipt.date.toLocaleTimeString('ru-RU', {
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-card border border-border rounded-xl w-full max-w-sm shadow-2xl animate-slide-up">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Icon name="FileText" size={16} className="text-primary" />
            <span className="font-semibold text-sm">Чек #{receipt.id}</span>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <Icon name="X" size={16} />
          </button>
        </div>

        <div className="p-4 font-mono-ibm text-sm space-y-3">
          {/* Store name */}
          <div className="text-center border-b border-dashed border-border pb-3">
            <div className="font-bold text-base">МОЙ МАГАЗИН</div>
            <div className="text-xs text-muted-foreground">ИНН 000000000000</div>
            <div className="text-xs text-muted-foreground mt-1">{dateStr} {timeStr}</div>
            <div className="text-xs text-muted-foreground">Кассир: {receipt.cashier}</div>
          </div>

          {/* Items */}
          <div className="space-y-1.5">
            {receipt.items.map(item => (
              <div key={item.id}>
                <div className="text-xs text-muted-foreground truncate">{item.name}</div>
                <div className="flex justify-between text-xs">
                  <span>{item.price.toFixed(2)} × {item.quantity} {item.unit}</span>
                  <span className="font-medium">
                    {(item.price * item.quantity * (1 - item.discount / 100)).toFixed(2)} ₽
                  </span>
                </div>
                {item.discount > 0 && (
                  <div className="text-xs cash-amber">Скидка {item.discount}%</div>
                )}
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="border-t border-dashed border-border pt-3 space-y-1">
            {receipt.discount > 0 && (
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Скидка</span>
                <span className="cash-amber">−{receipt.discount.toFixed(2)} ₽</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-base">
              <span>ИТОГО</span>
              <span className="cash-green">{receipt.total.toFixed(2)} ₽</span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground pt-1">
              <span>Способ оплаты</span>
              <span>{receipt.paymentMethod === 'cash' ? 'Наличные' : 'Банковская карта'}</span>
            </div>
            {receipt.paymentMethod === 'cash' && receipt.cashReceived !== undefined && (
              <>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Получено</span>
                  <span>{receipt.cashReceived.toFixed(2)} ₽</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Сдача</span>
                  <span className="cash-green">{(receipt.change ?? 0).toFixed(2)} ₽</span>
                </div>
              </>
            )}
          </div>

          <div className="text-center text-xs text-muted-foreground border-t border-dashed border-border pt-3">
            Спасибо за покупку!
          </div>
        </div>

        <div className="px-4 pb-4">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
          >
            <Icon name="Plus" size={14} />
            Новая продажа
          </button>
        </div>
      </div>
    </div>
  );
}
