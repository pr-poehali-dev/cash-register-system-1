import { useState } from 'react';
import Icon from '@/components/ui/icon';

interface Settings {
  storeName: string;
  cashierName: string;
  taxRate: number;
  currency: string;
  defaultDiscount: number;
}

interface SettingsPanelProps {
  settings: Settings;
  onSave: (settings: Settings) => void;
  onClearProducts: () => void;
}

export default function SettingsPanel({ settings, onSave, onClearProducts }: SettingsPanelProps) {
  const [form, setForm] = useState<Settings>(settings);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    onSave(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="h-full overflow-y-auto p-4 animate-fade-in">
      <div className="max-w-lg space-y-4">
        <div>
          <h2 className="text-base font-semibold mb-1">Настройки кассы</h2>
          <p className="text-xs text-muted-foreground">Основные параметры магазина и кассира</p>
        </div>

        <div className="bg-card border border-border rounded-lg divide-y divide-border">
          {/* Store name */}
          <div className="p-4 space-y-1.5">
            <label className="text-xs text-muted-foreground font-medium block">Название магазина</label>
            <input
              value={form.storeName}
              onChange={e => setForm({ ...form, storeName: e.target.value })}
              className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Cashier */}
          <div className="p-4 space-y-1.5">
            <label className="text-xs text-muted-foreground font-medium block">Имя кассира</label>
            <input
              value={form.cashierName}
              onChange={e => setForm({ ...form, cashierName: e.target.value })}
              className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Tax rate */}
          <div className="p-4 space-y-1.5">
            <label className="text-xs text-muted-foreground font-medium block">Ставка НДС (%)</label>
            <div className="flex gap-2">
              {[0, 10, 20].map(rate => (
                <button
                  key={rate}
                  onClick={() => setForm({ ...form, taxRate: rate })}
                  className={`px-4 py-2 rounded-md text-sm font-medium border transition-all ${
                    form.taxRate === rate
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border text-muted-foreground hover:border-muted-foreground'
                  }`}
                >
                  {rate}%
                </button>
              ))}
            </div>
          </div>

          {/* Default discount */}
          <div className="p-4 space-y-1.5">
            <label className="text-xs text-muted-foreground font-medium block">Скидка по умолчанию (%)</label>
            <input
              type="number"
              min={0}
              max={100}
              value={form.defaultDiscount}
              onChange={e => setForm({ ...form, defaultDiscount: Number(e.target.value) })}
              className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        {/* Danger zone */}
        <div className="bg-card border border-destructive/30 rounded-lg p-4 space-y-3">
          <div className="text-xs font-medium text-destructive uppercase tracking-wide">Опасная зона</div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">Удалить все товары</div>
              <div className="text-xs text-muted-foreground">Весь каталог будет очищен без возможности восстановления</div>
            </div>
            <button
              onClick={() => { if (confirm('Удалить все товары из каталога?')) onClearProducts(); }}
              className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg border border-destructive/40 text-destructive text-sm font-semibold hover:bg-destructive hover:text-white active:scale-[0.98] transition-all"
            >
              <Icon name="Trash2" size={14} />
              Удалить все
            </button>
          </div>
        </div>

        {/* Info block */}
        <div className="bg-card border border-border rounded-lg p-4 space-y-3">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Версия системы</div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-muted-foreground">Версия</div>
            <div className="font-mono-ibm text-right">1.0.0</div>
            <div className="text-muted-foreground">Режим работы</div>
            <div className="text-right">
              <span className="text-xs px-2 py-0.5 bg-primary/10 cash-green rounded-full font-medium">Онлайн</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
            saved
              ? 'bg-primary/20 text-primary border border-primary/30'
              : 'bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.99]'
          }`}
        >
          <Icon name={saved ? 'Check' : 'Save'} size={15} />
          {saved ? 'Сохранено!' : 'Сохранить настройки'}
        </button>
      </div>
    </div>
  );
}