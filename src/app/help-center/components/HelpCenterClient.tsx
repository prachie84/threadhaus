'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import { createClient } from '@/lib/supabase/client';

interface HelpArticle {
  id: string;
  question: string;
  answer: string;
  is_featured: boolean;
}

interface HelpCategory {
  id: string;
  title: string;
  icon: string;
  description: string;
  articles: HelpArticle[];
}

const FALLBACK_CATEGORIES: HelpCategory[] = [
  {
    id: '1', title: 'Orders & Shipping', icon: 'TruckIcon', description: 'Track orders, delivery times, and shipping policies',
    articles: [
      { id: '1', question: 'How long does standard shipping take?', answer: 'Standard shipping takes 5–7 business days. Express shipping (2–3 business days) is available at checkout. Free standard shipping on orders over $75.', is_featured: true },
      { id: '2', question: 'Can I track my order?', answer: 'Yes! Once your order ships, you will receive a tracking number via email. You can also view your order status in your account under Order History.', is_featured: true },
    ]
  },
  {
    id: '2', title: 'Returns & Exchanges', icon: 'ArrowPathIcon', description: 'How to return or exchange items easily',
    articles: [
      { id: '3', question: 'What is your return policy?', answer: 'We offer hassle-free returns within 60 days of purchase. Items must be unworn, unwashed, and in original packaging with tags attached.', is_featured: true },
      { id: '4', question: 'How do I start a return?', answer: 'Log into your account, go to Order History, select the item you want to return, and click "Start Return". You will receive a prepaid return label via email within 24 hours.', is_featured: false },
    ]
  },
  {
    id: '3', title: 'Sizing & Fit', icon: 'RectangleGroupIcon', description: 'Find your perfect fit with our size guides',
    articles: [
      { id: '5', question: 'How do I find my size?', answer: 'Use our size chart on each product page. We recommend measuring your bust, waist, and hips and comparing to our size guide. When between sizes, we suggest sizing up for a relaxed fit.', is_featured: true },
    ]
  },
  {
    id: '4', title: 'Payments & Billing', icon: 'CreditCardIcon', description: 'Payment methods, billing, and invoices',
    articles: [
      { id: '6', question: 'What payment methods do you accept?', answer: 'We accept all major credit and debit cards (Visa, Mastercard, Amex), PayPal, and Apple Pay. All transactions are secured with SSL encryption.', is_featured: true },
    ]
  },
  {
    id: '5', title: 'Account & Profile', icon: 'UserCircleIcon', description: 'Manage your account, password, and preferences',
    articles: [
      { id: '7', question: 'How do I reset my password?', answer: 'Click "Forgot Password" on the Sign In page. Enter your email address and we will send you a reset link within a few minutes. Check your spam folder if you do not see it.', is_featured: true },
    ]
  },
  {
    id: '6', title: 'Product Care', icon: 'SparklesIcon', description: 'Washing instructions and garment care tips',
    articles: [
      { id: '8', question: 'How do I wash my linen garments?', answer: 'Machine wash on a gentle cycle with cold water. Lay flat or hang to dry — avoid tumble drying as it can shrink linen. Iron while slightly damp for best results.', is_featured: true },
    ]
  },
];

export default function HelpCenterClient() {
  const [categories, setCategories] = useState<HelpCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [openArticle, setOpenArticle] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = createClient();
        const { data: cats, error: catErr } = await supabase
          .from('help_categories')
          .select('id, title, icon, description')
          .order('sort_order', { ascending: true });

        if (catErr || !cats || cats.length === 0) {
          setCategories(FALLBACK_CATEGORIES);
          setLoading(false);
          return;
        }

        const { data: articles, error: artErr } = await supabase
          .from('help_articles')
          .select('id, category_id, question, answer, is_featured')
          .order('sort_order', { ascending: true });

        if (artErr || !articles) {
          setCategories(FALLBACK_CATEGORIES);
          setLoading(false);
          return;
        }

        const merged: HelpCategory[] = cats.map((cat) => ({
          ...cat,
          articles: articles.filter((a: any) => a.category_id === cat.id),
        }));
        setCategories(merged);
      } catch {
        setCategories(FALLBACK_CATEGORIES);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = categories.map((cat) => ({
    ...cat,
    articles: cat.articles.filter(
      (a) =>
        a.question.toLowerCase().includes(search.toLowerCase()) ||
        a.answer.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter((cat) =>
    search ? cat.articles.length > 0 : activeCategory ? cat.id === activeCategory : true
  );

  const featuredArticles = categories.flatMap((c) => c.articles.filter((a) => a.is_featured)).slice(0, 6);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="text-center mb-12 animate-in">
        <span className="label-tag text-accent mb-3 block">Support</span>
        <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 tracking-tight">Help Center</h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
          Find answers to common questions about orders, sizing, returns, and more.
        </p>

        {/* Search */}
        <div className="relative max-w-lg mx-auto mt-8">
          <Icon name="MagnifyingGlassIcon" size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search for answers..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setActiveCategory(null); }}
            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all text-sm"
          />
        </div>
      </div>

      {/* Category Pills */}
      {!search && (
        <div className="flex flex-wrap gap-2 justify-center mb-10 animate-in-delay-1">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
              !activeCategory ? 'bg-accent text-white' : 'bg-secondary text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            All Topics
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                activeCategory === cat.id ? 'bg-accent text-white' : 'bg-secondary text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {cat.title}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Featured Quick Answers (only when no search/filter) */}
          {!search && !activeCategory && (
            <div className="mb-12 animate-in-delay-1">
              <h2 className="text-lg font-bold text-foreground mb-5">Popular Questions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {featuredArticles.map((article) => (
                  <button
                    key={article.id}
                    onClick={() => {
                      const cat = categories.find((c) => c.articles.some((a) => a.id === article.id));
                      if (cat) { setActiveCategory(cat.id); setOpenArticle(article.id); }
                    }}
                    className="text-left p-4 bg-card border border-border rounded-2xl hover:border-accent/40 hover:bg-accent/5 transition-all group"
                  >
                    <div className="flex items-start gap-3">
                      <Icon name="QuestionMarkCircleIcon" size={16} className="text-accent flex-shrink-0 mt-0.5" />
                      <p className="text-sm font-medium text-foreground group-hover:text-accent transition-colors leading-snug">
                        {article.question}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Category Sections */}
          <div className="space-y-6">
            {filtered.length === 0 ? (
              <div className="text-center py-16">
                <Icon name="MagnifyingGlassIcon" size={40} className="text-muted-foreground mx-auto mb-4" />
                <p className="text-foreground font-semibold mb-2">No results found</p>
                <p className="text-sm text-muted-foreground">Try a different search term or browse all topics above.</p>
              </div>
            ) : (
              filtered.map((cat) => (
                <div key={cat.id} className="bg-card border border-border rounded-3xl overflow-hidden animate-in">
                  {/* Category Header */}
                  <div className="flex items-center gap-4 px-6 py-5 border-b border-border bg-secondary/30">
                    <div className="w-10 h-10 rounded-2xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <Icon name={cat.icon as any} size={20} className="text-accent" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground">{cat.title}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{cat.description}</p>
                    </div>
                    <span className="ml-auto label-tag text-muted-foreground">{cat.articles.length} articles</span>
                  </div>

                  {/* Articles */}
                  <div className="divide-y divide-border">
                    {cat.articles.map((article) => (
                      <div key={article.id}>
                        <button
                          onClick={() => setOpenArticle(openArticle === article.id ? null : article.id)}
                          className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-muted/40 transition-colors group"
                        >
                          <span className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors pr-4">
                            {article.question}
                          </span>
                          <Icon
                            name={openArticle === article.id ? 'ChevronUpIcon' : 'ChevronDownIcon'}
                            size={16}
                            className="text-muted-foreground flex-shrink-0 transition-transform"
                          />
                        </button>
                        {openArticle === article.id && (
                          <div className="px-6 pb-5 animate-scale-in">
                            <p className="text-sm text-muted-foreground leading-relaxed border-l-2 border-accent/30 pl-4">
                              {article.answer}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Still need help */}
          <div className="mt-14 text-center p-8 bg-gradient-to-br from-accent/5 to-accent/10 border border-accent/20 rounded-3xl animate-in-delay-2">
            <div className="w-12 h-12 rounded-2xl bg-accent/15 flex items-center justify-center mx-auto mb-4">
              <Icon name="ChatBubbleLeftRightIcon" size={24} className="text-accent" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">Still need help?</h3>
            <p className="text-sm text-muted-foreground mb-5 max-w-sm mx-auto">
              Our support team is available Monday–Friday, 9am–6pm EST. We typically respond within 2 hours.
            </p>
            <Link href="/contact" className="btn-accent inline-flex">
              <Icon name="EnvelopeIcon" size={16} />
              Contact Support
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
