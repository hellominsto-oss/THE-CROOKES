import { useLang } from '@/contexts/LanguageContext';
import { LanguageToggle } from '@/components/LanguageToggle';
import { Coins, VenetianMask, Users, Swords } from 'lucide-react';

interface HomeScreenProps {
  onStart: () => void;
}

export function HomeScreen({ onStart }: HomeScreenProps) {
  const { t } = useLang();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-radial-gold">
      <div className="absolute top-6 right-6">
        <LanguageToggle />
      </div>

      <div className="flex flex-col items-center gap-8 max-w-md w-full animate-fade-in-up">
        <div className="relative">
          <div className="absolute inset-0 blur-3xl bg-gold-500/20 rounded-full" />
          <div className="relative w-24 h-24 rounded-full bg-gradient-to-b from-gold-300 to-gold-600 flex items-center justify-center shadow-2xl shadow-gold-900/50">
            <Coins size={48} className="text-ink-950" />
          </div>
        </div>

        <div className="text-center">
          <h1 className="text-5xl font-display font-black text-gold-300 tracking-wider drop-shadow-lg">
            {t('appTitle')}
          </h1>
          <p className="text-gray-400 mt-3 text-sm tracking-wide">
            {t('appSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 w-full">
          <FeatureCard icon={<VenetianMask size={24} />} label={t('crooks')} />
          <FeatureCard icon={<Users size={24} />} label={t('citizens')} />
          <FeatureCard icon={<Swords size={24} />} label={t('rounds')} />
        </div>

        <button onClick={onStart} className="btn-primary text-lg w-full max-w-xs mt-4">
          {t('startGame')}
        </button>

        <div className="text-center text-gray-500 text-xs space-y-1 mt-2">
          <p>3–20 Players · Pass & Play</p>
          <p>English · العربية</p>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="card-surface flex flex-col items-center gap-2 py-4">
      <span className="text-gold-400">{icon}</span>
      <span className="text-xs text-gray-400 font-medium">{label}</span>
    </div>
  );
}
