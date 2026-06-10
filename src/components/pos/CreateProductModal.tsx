import { useState } from 'react';
import { Product } from '@/data/products';
import Icon from '@/components/ui/icon';

const CATEGORIES_LIST = ['Молочные', 'Выпечка', 'Бакалея', 'Напитки', 'Мясные', 'Консервы', 'Соусы', 'Сладкое', 'Бытовая химия'];

interface CreateProductModalProps {
  onSave: (product: Product) => void;
  onClose: () => void;
}

export default function CreateProductModal({ onSave, onClose }: CreateProductModalProps) {
  const [form, setForm] = useState({
    name: '',
    barcode: '',
    category: 'Бакалея',
    price: '',
    unit: 'шт',
    stock: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Введите название';
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0) e.price = 'Введите корректную цену';
    if (!form.stock || isNaN(Number(form.stock)) || Number(form.stock) < 0) e.stock = 'Введите количество';
    return e;
  }

  function handleSave() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave({
      id: String(Date.now()),
      barcode: form.barcode || String(Math.floor(Math.random() * 9000000000000) + 1000000000000),
      name: form.name.trim(),
      category: form.category,
      price: parseFloat(form.price),
      unit: form.unit,
      stock: parseInt(form.stock),
    });
    onClose();
  }

  function field(key: keyof typeof form, label: string, placeholder: string, type = 'text') {
    return (
      <div className="space-y-1">
        <label className="text-xs text-muted-foreground font-medium">{label}</label>
        <input
          type={type}
          value={form[key]}
          onChange={e => { setForm(f => ({ ...f, [key]: e.target.value })); setErrors(er => ({ ...er, [key]: '' })); }}
          placeholder={placeholder}
          className={`w-full bg-input border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-colors ${errors[key] ? 'border-destructive' : 'border-border'}`}
        />
        {errors[key] && <div className="text-xs text-destructive">{errors[key]}</div>}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-card border border-border rounded-xl w-full max-w-md shadow-2xl animate-slide-up">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Icon name="PackagePlus" size={16} className="text-primary" />
            </div>
            <span className="font-semibold">Новый товар</span>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <Icon name="X" size={18} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {field('name', 'Название товара *', 'Например: Молоко 1л')}

          <div className="grid grid-cols-2 gap-3">
            {field('price', 'Цена (₽) *', '0.00', 'number')}
            {field('stock', 'Остаток *', '0', 'number')}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground font-medium">Категория</label>
              <select
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {CATEGORIES_LIST.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground font-medium">Единица</label>
              <select
                value={form.unit}
                onChange={e => setForm(f => ({ ...f, unit: e.target.value }))}
                className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {['шт', 'кг', 'л', 'уп', 'пак', 'м'].map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>

          {field('barcode', 'Штрихкод', 'Оставьте пустым — сгенерируем')}

          <div className="flex gap-2 pt-1">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:bg-accent transition-all"
            >
              Отмена
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <Icon name="Check" size={15} />
              Создать товар
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
