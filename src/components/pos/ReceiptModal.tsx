import { useState } from 'react';
import { Receipt } from '@/data/products';
import Icon from '@/components/ui/icon';

interface ReceiptModalProps {
  receipt: Receipt;
  onClose: () => void;
}

export default function ReceiptModal({ receipt, onClose }: ReceiptModalProps) {
  const [btStatus, setBtStatus] = useState<'idle' | 'connecting' | 'printing' | 'done' | 'error'>('idle');

  async function handleBluetoothPrint() {
    if (!navigator.bluetooth) {
      setBtStatus('error');
      setTimeout(() => setBtStatus('idle'), 3000);
      return;
    }
    try {
      setBtStatus('connecting');
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: ['000018f0-0000-1000-8000-00805f9b34fb'] }],
        optionalServices: ['000018f0-0000-1000-8000-00805f9b34fb'],
      });
      const server = await device.gatt!.connect();
      const service = await server.getPrimaryService('000018f0-0000-1000-8000-00805f9b34fb');
      const characteristic = await service.getCharacteristic('00002af1-0000-1000-8000-00805f9b34fb');

      setBtStatus('printing');

      const lines = [
        '\x1B\x40',
        '\x1B\x61\x01',
        '\x1B\x21\x10МОЙ МАГАЗИН\x1B\x21\x00\n',
        `${receipt.date.toLocaleDateString('ru-RU')} ${receipt.date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}\n`,
        `Кассир: ${receipt.cashier}\n`,
        '--------------------------------\n',
        ...receipt.items.map(i => `${i.name}\n  ${i.price.toFixed(2)} x ${i.quantity} = ${(i.price * i.quantity * (1 - i.discount / 100)).toFixed(2)} RUB\n`),
        '--------------------------------\n',
        `ИТОГО: ${receipt.total.toFixed(2)} RUB\n`,
        `Оплата: ${receipt.paymentMethod === 'cash' ? 'Наличные' : receipt.paymentMethod === 'sbp' ? 'СБП' : receipt.paymentMethod === 'sber' ? 'Сбер' : 'Карта'}\n`,
        '--------------------------------\n',
        '\x1B\x61\x01Спасибо за покупку!\n\n\n',
        '\x1D\x56\x41\x10',
      ];

      const text = lines.join('');
      const encoder = new TextEncoder();
      const data = encoder.encode(text);
      const chunkSize = 20;
      for (let i = 0; i < data.length; i += chunkSize) {
        await characteristic.writeValue(data.slice(i, i + chunkSize));
      }

      device.gatt!.disconnect();
      setBtStatus('done');
      setTimeout(() => setBtStatus('idle'), 3000);
    } catch {
      setBtStatus('error');
      setTimeout(() => setBtStatus('idle'), 3000);
    }
  }

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

        <div className="px-4 pb-4 space-y-2">
          <button
            onClick={handleBluetoothPrint}
            disabled={btStatus === 'connecting' || btStatus === 'printing'}
            className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 border ${
              btStatus === 'done'
                ? 'border-primary/40 bg-primary/10 text-primary'
                : btStatus === 'error'
                ? 'border-destructive/40 bg-destructive/10 text-destructive'
                : btStatus === 'connecting' || btStatus === 'printing'
                ? 'border-border bg-muted text-muted-foreground cursor-wait'
                : 'border-border text-foreground hover:border-primary hover:text-primary'
            }`}
          >
            <Icon name={btStatus === 'done' ? 'Check' : btStatus === 'error' ? 'AlertCircle' : 'Bluetooth'} size={14} />
            {btStatus === 'connecting' ? 'Подключение...' : btStatus === 'printing' ? 'Печать...' : btStatus === 'done' ? 'Чек напечатан!' : btStatus === 'error' ? 'Ошибка печати' : 'Печать по Bluetooth'}
          </button>
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