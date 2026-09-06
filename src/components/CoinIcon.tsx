import { Coins } from 'lucide-react';

interface CoinIconProps {
  size?: number;
  className?: string;
}

export function CoinIcon({ size = 20, className = '' }: CoinIconProps) {
  return <Coins size={size} className={className} />;
}

interface CoinAmountProps {
  amount: number;
  delta?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function CoinAmount({ amount, delta = false, size = 'md' }: CoinAmountProps) {
  const sizeClasses = {
    sm: 'text-sm gap-1',
    md: 'text-base gap-1.5',
    lg: 'text-2xl gap-2',
  };
  const iconSize = { sm: 14, md: 18, lg: 28 };

  const sign = delta ? (amount > 0 ? '+' : amount < 0 ? '' : '') : '';
  const color = delta
    ? amount > 0
      ? 'text-emerald-400'
      : amount < 0
        ? 'text-blood-400'
        : 'text-gray-400'
    : 'text-gold-300';

  return (
    <span className={`inline-flex items-center ${sizeClasses[size]} ${color} font-bold`}>
      <CoinIcon size={iconSize[size]} className={delta ? '' : 'text-gold-400'} />
      <span>
        {sign}
        {amount}
      </span>
    </span>
  );
}

export function CoinPile({ amount, className = '' }: { amount: number; className?: string }) {
  return (
    <div className={`inline-flex items-center gap-2 rounded-full bg-gold-900/30 border border-gold-700/40 px-4 py-2 ${className}`}>
      <CoinIcon size={22} className="text-gold-400" />
      <span className="text-gold-200 font-bold text-lg">{amount}</span>
    </div>
  );
}
