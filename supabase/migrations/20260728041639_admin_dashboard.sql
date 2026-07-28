-- ThreadHaus: Admin Dashboard Migration
-- Adds admin RLS policies so admins can read all data

-- 1. Admin check function (reads from auth metadata to avoid recursion)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM auth.users au
    WHERE au.id = auth.uid()
    AND (
      au.raw_user_meta_data->>'role' = 'admin'
      OR au.raw_app_meta_data->>'role' = 'admin'
    )
  )
$$;

-- 2. Admin read policies for user_profiles
DROP POLICY IF EXISTS "admin_read_all_user_profiles" ON public.user_profiles;
CREATE POLICY "admin_read_all_user_profiles"
ON public.user_profiles
FOR SELECT
TO authenticated
USING (public.is_admin());

-- 3. Admin read/write policies for orders
DROP POLICY IF EXISTS "admin_manage_all_orders" ON public.orders;
CREATE POLICY "admin_manage_all_orders"
ON public.orders
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- 4. Admin read/write policies for order_items
DROP POLICY IF EXISTS "admin_manage_all_order_items" ON public.order_items;
CREATE POLICY "admin_manage_all_order_items"
ON public.order_items
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- 5. Admin write policies for help_categories
DROP POLICY IF EXISTS "admin_manage_help_categories" ON public.help_categories;
CREATE POLICY "admin_manage_help_categories"
ON public.help_categories
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- 6. Admin write policies for help_articles
DROP POLICY IF EXISTS "admin_manage_help_articles" ON public.help_articles;
CREATE POLICY "admin_manage_help_articles"
ON public.help_articles
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- 7. Admin write policies for product_highlights
DROP POLICY IF EXISTS "admin_manage_product_highlights" ON public.product_highlights;
CREATE POLICY "admin_manage_product_highlights"
ON public.product_highlights
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- 8. Admin write policies for size_charts
DROP POLICY IF EXISTS "admin_manage_size_charts" ON public.size_charts;
CREATE POLICY "admin_manage_size_charts"
ON public.size_charts
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- 9. Seed a demo admin user for testing
DO $$
DECLARE
  admin_uuid UUID := gen_random_uuid();
BEGIN
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
    is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
    recovery_token, recovery_sent_at, email_change_token_new, email_change,
    email_change_sent_at, email_change_token_current, email_change_confirm_status,
    reauthentication_token, reauthentication_sent_at, phone, phone_change,
    phone_change_token, phone_change_sent_at
  ) VALUES (
    admin_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
    'admin@threadhaus.com', crypt('admin123', gen_salt('bf', 10)), now(), now(), now(),
    jsonb_build_object('full_name', 'ThreadHaus Admin', 'role', 'admin'),
    jsonb_build_object('provider', 'email', 'providers', ARRAY['email']::TEXT[], 'role', 'admin'),
    false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null
  )
  ON CONFLICT (id) DO NOTHING;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Admin user creation skipped: %', SQLERRM;
END $$;
