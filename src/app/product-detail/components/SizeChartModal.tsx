'use client';
import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import { createClient } from '@/lib/supabase/client';

interface SizeRow {
  label: string;
  measurements: Record<string, string>;
}

interface SizeChartModalProps {
  category: string;
  onClose: () => void;
}

const WOMEN_COLS = ['Size', 'Bust (in)', 'Waist (in)', 'Hips (in)', 'US', 'UK', 'EU'];
const MEN_COLS = ['Size', 'Chest (in)', 'Waist (in)', 'Hips (in)', 'US', 'UK', 'EU'];
const CHILDREN_COLS = ['Size', 'Height (in)', 'Weight (lbs)', 'Chest (in)', 'Waist (in)'];

const FALLBACK_WOMEN: SizeRow[] = [
  { label: 'XS', measurements: { bust: '31–32', waist: '24–25', hips: '34–35', us: '0–2', uk: '4–6', eu: '32–34' } },
  { label: 'S', measurements: { bust: '33–34', waist: '26–27', hips: '36–37', us: '4–6', uk: '8–10', eu: '36–38' } },
  { label: 'M', measurements: { bust: '35–36', waist: '28–29', hips: '38–39', us: '8–10', uk: '12–14', eu: '40–42' } },
  { label: 'L', measurements: { bust: '37–39', waist: '30–32', hips: '40–42', us: '12–14', uk: '16–18', eu: '44–46' } },
  { label: 'XL', measurements: { bust: '40–42', waist: '33–35', hips: '43–45', us: '16–18', uk: '20–22', eu: '48–50' } },
];

export default function SizeChartModal({ category, onClose }: SizeChartModalProps) {
  const [rows, setRows] = useState<SizeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'chart' | 'howto'>('chart');

  const cols = category === 'Men' ? MEN_COLS : category === 'Children' ? CHILDREN_COLS : WOMEN_COLS;
  const measureKeys = category === 'Men'
    ? ['chest', 'waist', 'hips', 'us', 'uk', 'eu']
    : category === 'Children'
    ? ['height', 'weight', 'chest', 'waist']
    : ['bust', 'waist', 'hips', 'us', 'uk', 'eu'];

  useEffect(() => {
    const fetchChart = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('size_charts')
          .select('label, measurements')
          .eq('category', category)
          .order('sort_order', { ascending: true });

        if (error || !data || data.length === 0) {
          setRows(FALLBACK_WOMEN);
        } else {
          setRows(data as SizeRow[]);
        }
      } catch {
        setRows(FALLBACK_WOMEN);
      } finally {
        setLoading(false);
      }
    };
    fetchChart();
  }, [category]);

  return (
    <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-background rounded-t-3xl sm:rounded-3xl w-full sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border flex-shrink-0">
          <div>
            <h2 className="text-lg font-bold text-foreground">Size Chart</h2>
            <p className="text-xs text-muted-foreground mt-0.5">{category} — All measurements in inches</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
          >
            <Icon name="XMarkIcon" size={20} className="text-foreground" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border flex-shrink-0">
          {(['chart', 'howto'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-sm font-semibold capitalize transition-colors border-b-2 -mb-px ${
                activeTab === tab
                  ? 'border-accent text-accent' :'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab === 'howto' ? 'How to Measure' : 'Size Chart'}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-6">
          {activeTab === 'chart' && (
            loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      {cols.map((col) => (
                        <th key={col} className="text-left py-3 px-3 label-tag text-muted-foreground font-semibold whitespace-nowrap">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, i) => (
                      <tr
                        key={row.label}
                        className={`border-b border-border/50 transition-colors hover:bg-muted/40 ${
                          i % 2 === 0 ? 'bg-transparent' : 'bg-secondary/30'
                        }`}
                      >
                        <td className="py-3 px-3 font-bold text-foreground">{row.label}</td>
                        {measureKeys.map((key) => (
                          <td key={key} className="py-3 px-3 text-muted-foreground">
                            {row.measurements[key] ?? '—'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
                  * Measurements are approximate. If you are between sizes, we recommend sizing up for a relaxed fit.
                </p>
              </div>
            )
          )}

          {activeTab === 'howto' && (
            <div className="space-y-5">
              {[
                { label: category === 'Men' ? 'Chest' : 'Bust', desc: 'Measure around the fullest part of your chest, keeping the tape parallel to the floor.' },
                { label: 'Waist', desc: 'Measure around your natural waistline, the narrowest part of your torso.' },
                { label: category === 'Children' ? 'Height' : 'Hips', desc: category === 'Children' ? 'Measure from the top of the head to the floor while standing straight.' : 'Measure around the fullest part of your hips, about 8 inches below your waist.' },
              ].map((item) => (
                <div key={item.label} className="flex gap-4 p-4 bg-secondary/40 rounded-2xl">
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon name="ArrowsPointingOutIcon" size={16} className="text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm mb-1">{item.label}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
              <div className="p-4 bg-accent/5 border border-accent/20 rounded-2xl">
                <p className="text-sm text-foreground font-semibold mb-1">Pro Tip</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Use a soft measuring tape and measure over light clothing. Have a friend help for more accurate results.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
