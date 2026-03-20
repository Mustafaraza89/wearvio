insert into public.categories (name, slug, description)
values
  ('Streetwear', 'streetwear', 'Oversized fits, blazers, and urban layers.'),
  ('Y2K', 'y2k', 'Retro-inspired silhouettes and throwback styling.'),
  ('Hoodies', 'hoodies', 'Statement hoodies and puffer layers.'),
  ('Accessories', 'accessories', 'Mini bags, eyewear, and finishing pieces.'),
  ('Bottoms', 'bottoms', 'Cargo skirts, trousers, and utility fits.'),
  ('Shoes', 'shoes', 'Chunky sneakers and statement footwear.')
on conflict (slug) do update
  set name = excluded.name,
      description = excluded.description;

insert into public.products (
  category_id,
  name,
  slug,
  brand,
  sku,
  description,
  price,
  compare_at_price,
  quantity,
  low_stock_threshold,
  image_url,
  sizes,
  tag,
  is_active
)
values
  ((select id from public.categories where slug = 'streetwear'), 'Oversized Acid Wash Tee', 'oversized-acid-wash-tee', 'WEARVIO ORIGINALS', 'WO-001', 'An oversized acid wash tee for daily streetwear rotation.', 1299, null, 48, 6, 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&q=85&fit=crop&crop=top', '["XS","S","M","L"]'::jsonb, 'hot', true),
  ((select id from public.categories where slug = 'y2k'), 'Y2K Low Rise Cargos', 'y2k-low-rise-cargos', 'CARGO CULTURE', 'CC-002', 'Low rise cargos with a Y2K-inspired silhouette.', 2499, 3199, 12, 4, 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&q=85&fit=crop&crop=top', '["XS","S","M","L","XL"]'::jsonb, 'sale', true),
  ((select id from public.categories where slug = 'hoodies'), 'Cyber Zip Hoodie', 'cyber-zip-hoodie', 'TECHZONE', 'TZ-001', 'A cyber-inspired zip hoodie with premium fleece finish.', 3799, null, 2, 3, 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=85&fit=crop&crop=top', '["S","M","L","XL"]'::jsonb, 'new', true),
  ((select id from public.categories where slug = 'accessories'), 'Mini Crossbody Bag', 'mini-crossbody-bag', 'STRPD', 'BG-004', 'A compact crossbody bag for everyday essentials.', 1899, null, 17, 5, 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=85&fit=crop', '["ONE SIZE"]'::jsonb, 'hot', true),
  ((select id from public.categories where slug = 'shoes'), 'Chunky Platform Sneakers', 'chunky-platform-sneakers', 'SOLE THEORY', 'ST-005', 'Chunky platform sneakers with all-day comfort.', 4299, 5499, 29, 5, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=85&fit=crop', '["6","7","8","9","10"]'::jsonb, 'sale', true),
  ((select id from public.categories where slug = 'y2k'), 'Coquette Bow Mini Skirt', 'coquette-bow-mini-skirt', 'PASTEL RIOT', 'PR-006', 'A playful mini skirt finished with signature bow detailing.', 1799, null, 21, 5, 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=85&fit=crop&crop=top', '["XS","S","M","L"]'::jsonb, 'new', true),
  ((select id from public.categories where slug = 'bottoms'), 'Wide Leg Trousers', 'wide-leg-trousers', 'WRVIO STUDIO', 'WR-007', 'Wide leg trousers for modern relaxed tailoring.', 2299, null, 33, 6, 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=85&fit=crop&crop=top', '["XS","S","M","L","XL"]'::jsonb, 'hot', true),
  ((select id from public.categories where slug = 'accessories'), 'Tinted Aviator Sunglasses', 'tinted-aviator-sunglasses', 'LENSCRAFT', 'LC-008', 'Tinted aviators to finish your fit.', 999, 1499, 50, 8, 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=85&fit=crop', '["ONE SIZE"]'::jsonb, 'sale', true),
  ((select id from public.categories where slug = 'streetwear'), 'Dark Academia Blazer', 'dark-academia-blazer', 'ACADEMIA CO.', 'AC-009', 'A structured blazer with dark academia attitude.', 4599, null, 11, 3, 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=85&fit=crop&crop=top', '["XS","S","M","L","XL"]'::jsonb, 'new', true),
  ((select id from public.categories where slug = 'hoodies'), 'Puffer Vest Neon', 'puffer-vest-neon', 'ARCTIC DROP', 'AD-010', 'A neon puffer vest built for loud layering.', 3199, 3999, 9, 4, 'https://images.unsplash.com/photo-1544441893-675973e31985?w=600&q=85&fit=crop&crop=top', '["S","M","L","XL"]'::jsonb, 'hot', true),
  ((select id from public.categories where slug = 'streetwear'), 'Vintage Band Tee', 'vintage-band-tee', 'REWIND', 'RW-011', 'A worn-in vintage tee with oversized fit.', 1499, null, 41, 6, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=85&fit=crop&crop=top', '["XS","S","M","L"]'::jsonb, 'ltd', true),
  ((select id from public.categories where slug = 'bottoms'), 'Utility Cargo Skirt', 'utility-cargo-skirt', 'UTILITY GANG', 'UG-012', 'Utility-inspired cargo skirt with modern edge.', 2099, 2599, 18, 4, 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=85&fit=crop&crop=top', '["XS","S","M","L"]'::jsonb, 'sale', true)
on conflict (slug) do update
  set category_id = excluded.category_id,
      name = excluded.name,
      brand = excluded.brand,
      sku = excluded.sku,
      description = excluded.description,
      price = excluded.price,
      compare_at_price = excluded.compare_at_price,
      quantity = excluded.quantity,
      low_stock_threshold = excluded.low_stock_threshold,
      image_url = excluded.image_url,
      sizes = excluded.sizes,
      tag = excluded.tag,
      is_active = excluded.is_active;
