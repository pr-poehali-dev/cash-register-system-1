import { Product } from '@/data/products';
import Icon from '@/components/ui/icon';

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
}

export default function ProductCard({ product, onAdd }: ProductCardProps) {
  const isLowStock = product.stock <= 5;
  const isOutOfStock = product.stock === 0;

  return (
    <button
      onClick={() => !isOutOfStock && onAdd(product)}
      disabled={isOutOfStock}
      className={`
        group relative w-full text-left p-3 rounded-md border transition-all duration-150
        ${isOutOfStock
          ? 'border-border bg-muted/30 opacity-40 cursor-not-allowed'
          : 'border-border bg-card hover:border-primary/50 hover:bg-accent cursor-pointer active:scale-[0.98]'
        }
        animate-fade-in
      `}
    >
      <div className="flex flex-col gap-1.5">
        <div className="flex items-start justify-between gap-2">
          <span className="text-sm font-medium text-foreground leading-tight line-clamp-2">{product.name}</span>
          <span className={`shrink-0 text-xs px-1.5 py-0.5 rounded font-mono-ibm font-medium ${
            isLowStock && !isOutOfStock ? 'bg-amber-500/20 text-amber-400' : 'bg-muted text-muted-foreground'
          }`}>
            {product.stock} {product.unit}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{product.category}</span>
          <span className="text-base font-semibold cash-green font-mono-ibm">
            {product.price.toLocaleString('ru-RU', { minimumFractionDigits: 2 })} ₽
          </span>
        </div>
      </div>
      {!isOutOfStock && (
        <div className="absolute inset-0 rounded-md flex items-center justify-center bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="bg-primary rounded-full p-1">
            <Icon name="Plus" size={16} className="text-primary-foreground" />
          </div>
        </div>
      )}
    </button>
  );
}
