import { useState, useRef, useEffect } from 'react';
import { Product } from '@/data/products';
import Icon from '@/components/ui/icon';

interface BarcodeScannerProps {
  products: Product[];
  onFound: (product: Product) => void;
}

export default function BarcodeScanner({ products, onFound }: BarcodeScannerProps) {
  const [value, setValue] = useState('');
  const [status, setStatus] = useState<'idle' | 'found' | 'notfound'>('idle');
  const [foundName, setFoundName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function handleChange(val: string) {
    setValue(val);
    clearTimeout(timerRef.current);
    if (val.length >= 8) {
      const product = products.find(p => p.barcode === val.trim());
      if (product) {
        onFound(product);
        setFoundName(product.name);
        setStatus('found');
        setValue('');
        timerRef.current = setTimeout(() => setStatus('idle'), 2000);
      } else if (val.length >= 13) {
        setStatus('notfound');
        timerRef.current = setTimeout(() => { setStatus('idle'); setValue(''); }, 1500);
      }
    } else {
      setStatus('idle');
    }
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      const product = products.find(p => p.barcode === value.trim());
      if (product) {
        onFound(product);
        setFoundName(product.name);
        setStatus('found');
        setValue('');
        timerRef.current = setTimeout(() => setStatus('idle'), 2000);
      } else {
        setStatus('notfound');
        timerRef.current = setTimeout(() => { setStatus('idle'); setValue(''); }, 1500);
      }
    }
  }

  return (
    <div className="relative">
      <div className={`flex items-center gap-2 px-3 py-2 rounded-md border transition-all ${
        status === 'found' ? 'border-primary bg-primary/10' :
        status === 'notfound' ? 'border-destructive bg-destructive/10' :
        'border-border bg-input focus-within:border-primary/50'
      }`}>
        <Icon
          name={status === 'found' ? 'Check' : status === 'notfound' ? 'AlertCircle' : 'Scan'}
          size={15}
          className={
            status === 'found' ? 'text-primary' :
            status === 'notfound' ? 'text-destructive' :
            'text-muted-foreground'
          }
        />
        <input
          ref={inputRef}
          value={value}
          onChange={e => handleChange(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Штрихкод..."
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground font-mono-ibm"
        />
        {value && (
          <button onClick={() => { setValue(''); setStatus('idle'); }} className="text-muted-foreground hover:text-foreground">
            <Icon name="X" size={12} />
          </button>
        )}
      </div>
      {status === 'found' && (
        <div className="absolute top-full left-0 right-0 mt-1 px-2 py-1 bg-primary/10 border border-primary/30 rounded text-xs cash-green animate-fade-in truncate">
          ✓ {foundName}
        </div>
      )}
      {status === 'notfound' && (
        <div className="absolute top-full left-0 right-0 mt-1 px-2 py-1 bg-destructive/10 border border-destructive/30 rounded text-xs cash-red animate-fade-in">
          Товар не найден
        </div>
      )}
    </div>
  );
}
