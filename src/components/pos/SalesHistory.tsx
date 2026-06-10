import { useState } from 'react';
import { Receipt } from '@/data/products';
import Icon from '@/components/ui/icon';
import ReceiptModal from './ReceiptModal';

interface SalesHistoryProps {
  receipts: Receipt[];
}

export default function SalesHistory({ receipts }: SalesHistoryProps) {
  const [selected, setSelected] = useState<Receipt | null>(null);

  const totalRevenue = receipts.reduce((sum, r) => sum + r.total, 0);
  const totalItems = receipts.reduce((sum, r) => sum + r.items.reduce((s, i) => s + i.quantity, 0), 0);

  return (
    <div className="h-full flex flex-col animate-fade-in">
      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 p-4">
        <div className="bg-card border border-border rounded-lg p-3">
          <div className="text-xs text-muted-foreground mb-1">Продаж</div>
          <div className="text-2xl font-bold font-mono-ibm">{receipts.length}</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-3">
          <div className="text-xs text-muted-foreground mb-1">Выручка</div>
          <div className="text-lg font-bold font-mono-ibm cash-green">
            {totalRevenue.toLocaleString('ru-RU', { minimumFractionDigits: 2 })} ₽
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-3">
          <div className="text-xs text-muted-foreground mb-1">Товаров</div>
          <div className="text-2xl font-bold font-mono-ibm">{totalItems}</div>
        </div>
      </div>

      {/* Table header */}
      <div className="px-4 pb-2">
        <div className="grid grid-cols-12 text-xs text-muted-foreground font-medium px-3 py-2 bg-muted rounded-lg">
          <div className="col-span-2">Чек</div>
          <div className="col-span-4">Время</div>
          <div className="col-span-2 text-center">Товаров</div>
          <div className="col-span-2 text-center">Оплата</div>
          <div className="col-span-2 text-right">Сумма</div>
        </div>
      </div>

      {/* Receipts list */}
      <div className="flex-1 overflow-y-auto px-4 space-y-1">
        {receipts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
            <Icon name="History" size={36} className="opacity-20" />
            <span className="text-sm">Нет продаж</span>
            <span className="text-xs opacity-60">Продажи появятся после оплаты</span>
          </div>
        ) : (
          [...receipts].reverse().map((receipt, idx) => (
            <button
              key={receipt.id}
              onClick={() => setSelected(receipt)}
              className="w-full grid grid-cols-12 items-center text-sm px-3 py-2.5 rounded-lg border border-border bg-card hover:border-primary/40 hover:bg-accent transition-all animate-fade-in"
              style={{ animationDelay: `${idx * 0.04}s` }}
            >
              <div className="col-span-2 font-mono-ibm text-xs text-muted-foreground">#{receipt.id}</div>
              <div className="col-span-4 text-xs text-muted-foreground">
                {receipt.date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div className="col-span-2 text-center text-xs font-mono-ibm">
                {receipt.items.reduce((s, i) => s + i.quantity, 0)}
              </div>
              <div className="col-span-2 flex justify-center">
                {receipt.paymentMethod === 'card' ? (
                  <Icon name="CreditCard" size={13} className="text-blue-400" />
                ) : (
                  <Icon name="Banknote" size={13} className="text-amber-400" />
                )}
              </div>
              <div className="col-span-2 text-right font-semibold font-mono-ibm cash-green text-xs">
                {receipt.total.toFixed(2)} ₽
              </div>
            </button>
          ))
        )}
      </div>

      {selected && (
        <ReceiptModal receipt={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
