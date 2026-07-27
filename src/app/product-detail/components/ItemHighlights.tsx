'use client';
import React, { useEffect, useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { createClient } from '@/lib/supabase/client';

interface Highlight {
  id: string;
  label: string;
  description: string;
  icon: string;
}

const FALLBACK_HIGHLIGHTS: Highlight[] = [
  { id: '1', label: 'Premium Quality', description: 'Crafted from the finest materials for lasting comfort and style', icon: 'SparklesIcon' },
  { id: '2', label: 'Ethical Production', description: 'Made in certified facilities with fair-trade practices', icon: 'ShieldCheckIcon' },
  { id: '3', label: 'Versatile Wear', description: 'Designed to transition seamlessly from day to evening', icon: 'ArrowsRightLeftIcon' },
];

interface ItemHighlightsProps {
  productId: number;
}

export default function ItemHighlights({ productId }: ItemHighlightsProps) {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('product_highlights')
          .select('id, label, description, icon')
          .eq('product_id', productId)
          .order('sort_order', { ascending: true });

        if (error || !data || data.length === 0) {
          setHighlights(FALLBACK_HIGHLIGHTS);
        } else {
          setHighlights(data);
        }
      } catch {
        setHighlights(FALLBACK_HIGHLIGHTS);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [productId]);

  if (loading) return null;

  return (
    <div className="mt-6 space-y-2.5">
      <p className="text-xs font-bold text-foreground uppercase tracking-widest mb-3 font-mono-label">Why You'll Love It</p>
      {highlights.map((h) => (
        <div
          key={h.id}
          className="flex items-start gap-3 p-3.5 rounded-2xl bg-secondary/40 border border-border/60 hover:border-accent/30 hover:bg-accent/5 transition-all group"
        >
          <div className="w-8 h-8 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0 group-hover:bg-accent/20 transition-colors">
            <Icon name={h.icon as any} size={16} className="text-accent" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground leading-tight">{h.label}</p>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{h.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
