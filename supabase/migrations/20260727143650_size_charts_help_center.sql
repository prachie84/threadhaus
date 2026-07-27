-- ThreadHaus: Size Charts + Help Center Migration

-- 1. Size Charts Table
CREATE TABLE IF NOT EXISTS public.size_charts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  label TEXT NOT NULL,
  measurements JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 2. Help Center Categories Table
CREATE TABLE IF NOT EXISTS public.help_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'QuestionMarkCircleIcon',
  description TEXT NOT NULL DEFAULT '',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Help Center Articles Table
CREATE TABLE IF NOT EXISTS public.help_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.help_categories(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  is_featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. Product Highlights Table
CREATE TABLE IF NOT EXISTS public.product_highlights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id INTEGER NOT NULL,
  label TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  icon TEXT NOT NULL DEFAULT 'SparklesIcon',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5. Indexes
CREATE INDEX IF NOT EXISTS idx_size_charts_category ON public.size_charts(category);
CREATE INDEX IF NOT EXISTS idx_help_articles_category_id ON public.help_articles(category_id);
CREATE INDEX IF NOT EXISTS idx_product_highlights_product_id ON public.product_highlights(product_id);

-- 6. Enable RLS
ALTER TABLE public.size_charts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.help_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.help_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_highlights ENABLE ROW LEVEL SECURITY;

-- 7. Public read policies
DROP POLICY IF EXISTS "public_read_size_charts" ON public.size_charts;
CREATE POLICY "public_read_size_charts" ON public.size_charts FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_read_help_categories" ON public.help_categories;
CREATE POLICY "public_read_help_categories" ON public.help_categories FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_read_help_articles" ON public.help_articles;
CREATE POLICY "public_read_help_articles" ON public.help_articles FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_read_product_highlights" ON public.product_highlights;
CREATE POLICY "public_read_product_highlights" ON public.product_highlights FOR SELECT TO anon, authenticated USING (true);

-- 8. Seed: Size Charts
INSERT INTO public.size_charts (category, label, measurements) VALUES
('Women', 'XS', '{"bust": "31-32", "waist": "24-25", "hips": "34-35", "us": "0-2", "uk": "4-6", "eu": "32-34"}'),
('Women', 'S', '{"bust": "33-34", "waist": "26-27", "hips": "36-37", "us": "4-6", "uk": "8-10", "eu": "36-38"}'),
('Women', 'M', '{"bust": "35-36", "waist": "28-29", "hips": "38-39", "us": "8-10", "uk": "12-14", "eu": "40-42"}'),
('Women', 'L', '{"bust": "37-39", "waist": "30-32", "hips": "40-42", "us": "12-14", "uk": "16-18", "eu": "44-46"}'),
('Women', 'XL', '{"bust": "40-42", "waist": "33-35", "hips": "43-45", "us": "16-18", "uk": "20-22", "eu": "48-50"}'),
('Men', 'S', '{"chest": "35-37", "waist": "29-31", "hips": "35-37", "us": "S", "uk": "S", "eu": "44-46"}'),
('Men', 'M', '{"chest": "38-40", "waist": "32-34", "hips": "38-40", "us": "M", "uk": "M", "eu": "48-50"}'),
('Men', 'L', '{"chest": "41-43", "waist": "35-37", "hips": "41-43", "us": "L", "uk": "L", "eu": "52-54"}'),
('Men', 'XL', '{"chest": "44-46", "waist": "38-40", "hips": "44-46", "us": "XL", "uk": "XL", "eu": "56-58"}'),
('Children', '2T', '{"height": "33-35", "weight": "25-28", "chest": "20-21", "waist": "19-20"}'),
('Children', '3T', '{"height": "36-38", "weight": "29-32", "chest": "21-22", "waist": "20-21"}'),
('Children', '4T', '{"height": "39-41", "weight": "33-36", "chest": "22-23", "waist": "21-22"}'),
('Children', '5T', '{"height": "42-44", "weight": "37-40", "chest": "23-24", "waist": "22-23"}')
ON CONFLICT DO NOTHING;

-- 9. Seed: Help Categories
INSERT INTO public.help_categories (title, icon, description, sort_order) VALUES
('Orders & Shipping', 'TruckIcon', 'Track orders, delivery times, and shipping policies', 1),
('Returns & Exchanges', 'ArrowPathIcon', 'How to return or exchange items easily', 2),
('Sizing & Fit', 'RectangleGroupIcon', 'Find your perfect fit with our size guides', 3),
('Payments & Billing', 'CreditCardIcon', 'Payment methods, billing, and invoices', 4),
('Account & Profile', 'UserCircleIcon', 'Manage your account, password, and preferences', 5),
('Product Care', 'SparklesIcon', 'Washing instructions and garment care tips', 6)
ON CONFLICT DO NOTHING;

-- 10. Seed: Help Articles
INSERT INTO public.help_articles (category_id, question, answer, is_featured, sort_order)
SELECT id, 'How long does standard shipping take?', 'Standard shipping takes 5–7 business days. Express shipping (2–3 business days) is available at checkout for an additional fee. Free standard shipping on orders over $75.', true, 1 FROM public.help_categories WHERE title = 'Orders & Shipping'
ON CONFLICT DO NOTHING;

INSERT INTO public.help_articles (category_id, question, answer, is_featured, sort_order)
SELECT id, 'Can I track my order?', 'Yes! Once your order ships, you will receive a tracking number via email. You can also view your order status in your account under Order History.', true, 2 FROM public.help_categories WHERE title = 'Orders & Shipping'
ON CONFLICT DO NOTHING;

INSERT INTO public.help_articles (category_id, question, answer, is_featured, sort_order)
SELECT id, 'Do you ship internationally?', 'We currently ship to the US, Canada, UK, and Australia. International orders typically arrive within 10–14 business days.', false, 3 FROM public.help_categories WHERE title = 'Orders & Shipping'
ON CONFLICT DO NOTHING;

INSERT INTO public.help_articles (category_id, question, answer, is_featured, sort_order)
SELECT id, 'What is your return policy?', 'We offer hassle-free returns within 60 days of purchase. Items must be unworn, unwashed, and in original packaging with tags attached.', true, 1 FROM public.help_categories WHERE title = 'Returns & Exchanges'
ON CONFLICT DO NOTHING;

INSERT INTO public.help_articles (category_id, question, answer, is_featured, sort_order)
SELECT id, 'How do I start a return?', 'Log into your account, go to Order History, select the item you want to return, and click "Start Return". You will receive a prepaid return label via email within 24 hours.', false, 2 FROM public.help_categories WHERE title = 'Returns & Exchanges'
ON CONFLICT DO NOTHING;

INSERT INTO public.help_articles (category_id, question, answer, is_featured, sort_order)
SELECT id, 'How do I find my size?', 'Use our size chart on each product page. We recommend measuring your bust, waist, and hips and comparing to our size guide. When between sizes, we suggest sizing up for a relaxed fit.', true, 1 FROM public.help_categories WHERE title = 'Sizing & Fit'
ON CONFLICT DO NOTHING;

INSERT INTO public.help_articles (category_id, question, answer, is_featured, sort_order)
SELECT id, 'What payment methods do you accept?', 'We accept all major credit and debit cards (Visa, Mastercard, Amex), PayPal, and Apple Pay. All transactions are secured with SSL encryption.', true, 1 FROM public.help_categories WHERE title = 'Payments & Billing'
ON CONFLICT DO NOTHING;

INSERT INTO public.help_articles (category_id, question, answer, is_featured, sort_order)
SELECT id, 'How do I reset my password?', 'Click "Forgot Password" on the Sign In page. Enter your email address and we will send you a reset link within a few minutes. Check your spam folder if you do not see it.', true, 1 FROM public.help_categories WHERE title = 'Account & Profile'
ON CONFLICT DO NOTHING;

INSERT INTO public.help_articles (category_id, question, answer, is_featured, sort_order)
SELECT id, 'How do I wash my linen garments?', 'Machine wash on a gentle cycle with cold water. Lay flat or hang to dry — avoid tumble drying as it can shrink linen. Iron while slightly damp for best results.', true, 1 FROM public.help_categories WHERE title = 'Product Care'
ON CONFLICT DO NOTHING;

-- 11. Seed: Product Highlights (for product id 1 - Linen Blazer)
INSERT INTO public.product_highlights (product_id, label, description, icon, sort_order) VALUES
(1, 'Premium European Linen', 'Sourced from certified European mills for superior breathability and drape', 'SparklesIcon', 1),
(1, 'Sustainable Craftsmanship', 'Made in small batches with ethical manufacturing practices', 'ShieldCheckIcon', 2),
(1, 'Versatile Styling', 'Transitions effortlessly from casual weekends to polished evenings', 'ArrowsRightLeftIcon', 3),
(3, 'Relaxed Summer Silhouette', 'Designed for warm-weather comfort without sacrificing style', 'SunIcon', 1),
(3, 'Easy Care Fabric', 'Machine washable canvas blend that gets better with every wash', 'SparklesIcon', 2)
ON CONFLICT DO NOTHING;
