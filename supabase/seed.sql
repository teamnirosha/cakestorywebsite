-- ========================================================================
-- CakeStory Desserts - Initial Data Seeder
-- Paste and Run this in your Supabase SQL Editor AFTER running schema.sql
-- ========================================================================

-- Ensure constraints do not block catalog or review imports
ALTER TABLE public.cakes DROP CONSTRAINT IF EXISTS cakes_category_id_fkey;
ALTER TABLE public.testimonials ALTER COLUMN comment DROP NOT NULL;

-- 1. Gallery Settings
INSERT INTO public.gallery_settings (id, enabled, eyebrow, eyebrow_marathi, heading, heading_marathi, subtitle, subtitle_marathi, decorative_phrase, instagram_url, show_categories, show_highlights, cta_label, autoplay, default_muted)
VALUES (
  'default',
  TRUE,
  'INSTAGRAM',
  'इन्स्टाग्राम',
  'Moments That Make Life Sweeter',
  'आयुष्याला अधिक गोड बनवणारे खास क्षण',
  'From custom creations to happy celebrations — catch the latest from CakeStory Desserts on Instagram.',
  'कस्टम केक्सपासून ते प्रत्येक आनंदाच्या क्षणांपर्यंत — पहा केक स्टोरीचे ताजे रील्स आणि सेलिब्रेशन्स.',
  'Real Stories, Real Celebrations',
  'https://www.instagram.com/cakestorydesserts/',
  FALSE,
  TRUE,
  'Follow @cakestorydesserts',
  TRUE,
  TRUE
) ON CONFLICT (id) DO UPDATE SET updated_at = NOW();

-- 2. Sweet Scenes Reels (5 items)
INSERT INTO public.gallery_reels (id, reel_url, title, marathi_title, video_url, thumbnail, category, category_label, duration, description, order_index, enabled, featured)
VALUES ('reel-001', 'https://www.instagram.com/reel/Db-vla0uZuG/?xtok=MXNhODUxYTVvbzlqOQ==', 'A Little Sweetness, A Lot of Happiness!', 'गोडवा थोडा, आनंद भरपूर!', '/videos/reels/reel-1.mp4', '/admin/images/AZ_01460.JPG', 'celebrations', 'Celebrations', '0:24', 'From dreamy cakes to delicious desserts and your favourite coffee — Cake Story is where every craving finds its happy ending.', 1, true, true)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, video_url = EXCLUDED.video_url, updated_at = NOW();

INSERT INTO public.gallery_reels (id, reel_url, title, marathi_title, video_url, thumbnail, category, category_label, duration, description, order_index, enabled, featured)
VALUES ('reel-002', 'https://www.instagram.com/reel/DdgwB10u_86/?dlrf=MXI2ZXVpbDkzamc2dA==', 'Satara, Your Cake Cravings Found Their Happy Place!', 'सातारा, केकच्या गोड क्षणांचे हक्काचे ठिकाण!', '/videos/reels/reel-2.mp4', '/admin/images/AZ_01692.JPG', 'custom-cakes', 'Custom Cakes', '0:18', '100+ flavours, delicious favourites & unique customised cakes — all under one roof.', 2, true, false)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, video_url = EXCLUDED.video_url, updated_at = NOW();

INSERT INTO public.gallery_reels (id, reel_url, title, marathi_title, video_url, thumbnail, category, category_label, duration, description, order_index, enabled, featured)
VALUES ('reel-003', 'https://www.instagram.com/reel/Dd1OLDbuyZe/?obrf=emI4NDdvNmx4aW5u', 'Moshi, Your Dessert Stop is Here!', 'मोशी, तुमचा आवडता गोड थांबा इथे आहे!', '/videos/reels/reel-3.mp4', '/admin/images/DSC08617.JPG', 'bts', 'Behind The Scenes', '0:30', 'From cakes to handcrafted desserts, there’s a whole lot of variety waiting for you at Cake Story Desserts, Moshi.', 3, true, true)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, video_url = EXCLUDED.video_url, updated_at = NOW();

INSERT INTO public.gallery_reels (id, reel_url, title, marathi_title, video_url, thumbnail, category, category_label, duration, description, order_index, enabled, featured)
VALUES ('reel-004', 'https://www.instagram.com/reel/Dd6dFwKOwQ3/?mdxt=MXRrN3Z2bHlhOG82MQ==', 'Satara, Your Dessert Stop Just Got Sweeter!', 'सातारा, डेझर्ट्सचा नवा आणि गोड अनुभव!', '/videos/reels/reel-4.mp4', '/admin/images/1.jpg', 'custom-cakes', 'Custom Cakes', '0:20', 'Fresh cakes, creamy desserts & delicious treats — all under one roof.', 4, true, false)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, video_url = EXCLUDED.video_url, updated_at = NOW();

INSERT INTO public.gallery_reels (id, reel_url, title, marathi_title, video_url, thumbnail, category, category_label, duration, description, order_index, enabled, featured)
VALUES ('reel-005', 'https://www.instagram.com/reel/DeMacAnu7sv/?psln=MTBmajVvNDBwdmZpZg==', 'From a Dream to a Dessert Destination!', 'स्वप्नातून साकारलेले गोड सेलिब्रेशन डेस्टिनेशन!', '/videos/reels/reel-5.mp4', '/admin/images/AZ_01683.JPG', 'outlets', 'Outlet Moments', '0:15', 'Keshavnagar, you’ve given CakeStory Desserts so much love! Behind every outlet is a story of passion, hard work & celebrations.', 5, true, false)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, video_url = EXCLUDED.video_url, updated_at = NOW();

-- 3. Categories (19 items)
INSERT INTO public.categories (id, name, icon, color, order_index)
VALUES ('all', 'All Cakes', '🎂', 'from-pink-200 to-rose-200', 0)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.categories (id, name, icon, color, order_index)
VALUES ('cat-birthday', 'Birthday', '🎉', 'from-pink-200 to-rose-200', 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.categories (id, name, icon, color, order_index)
VALUES ('cat-wedding', 'Wedding', '💍', 'from-rose-200 to-pink-100', 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.categories (id, name, icon, color, order_index)
VALUES ('cat-anniversary', 'Anniversary', '💕', 'from-rose-100 to-pink-200', 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.categories (id, name, icon, color, order_index)
VALUES ('cat-chocolate', 'Chocolate', '🍫', 'from-amber-200 to-orange-100', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.categories (id, name, icon, color, order_index)
VALUES ('cat-fruit', 'Fruit', '🍓', 'from-red-200 to-rose-200', 5)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.categories (id, name, icon, color, order_index)
VALUES ('cat-premium', 'Premium', '👑', 'from-amber-100 to-yellow-100', 6)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.categories (id, name, icon, color, order_index)
VALUES ('cat-custom', 'Custom', '✨', 'from-purple-200 to-pink-200', 7)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.categories (id, name, icon, color, order_index)
VALUES ('cat-cupcakes', 'Cupcakes', '🧁', 'from-pink-200 to-fuchsia-200', 8)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.categories (id, name, icon, color, order_index)
VALUES ('cat-macarons', 'Macarons', '🍬', 'from-rose-200 to-pink-100', 9)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.categories (id, name, icon, color, order_index)
VALUES ('cat-donuts', 'Donuts', '🍩', 'from-pink-200 to-amber-100', 10)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.categories (id, name, icon, color, order_index)
VALUES ('cat-cookies', 'Cookies', '🍪', 'from-amber-200 to-yellow-100', 11)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.categories (id, name, icon, color, order_index)
VALUES ('cat-brownies', 'Brownies', '🍫', 'from-amber-300 to-orange-200', 12)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.categories (id, name, icon, color, order_index)
VALUES ('cat-bread', 'Bread', '🍞', 'from-orange-100 to-amber-100', 13)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.categories (id, name, icon, color, order_index)
VALUES ('cat-signature', 'Signature Cakes', '👑', 'from-amber-200 to-yellow-100', 14)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.categories (id, name, icon, color, order_index)
VALUES ('cat-celebration', 'Celebration Cakes', '🎉', 'from-pink-200 to-rose-200', 15)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.categories (id, name, icon, color, order_index)
VALUES ('cat-fusion', 'Fusion Specials', '✨', 'from-purple-200 to-pink-200', 16)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.categories (id, name, icon, color, order_index)
VALUES ('cat-pastries', 'Pastries & Slices', '🍰', 'from-amber-100 to-rose-100', 17)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.categories (id, name, icon, color, order_index)
VALUES ('cat-classic', 'Classic Cakes', '🎂', 'from-amber-200 to-orange-100', 18)
ON CONFLICT (id) DO NOTHING;

-- 4. Cakes Catalog (12 items)
INSERT INTO public.cakes (id, name, category, category_id, description, price, image, ingredients, flavor, size, availability, featured, tags, rating, color)
VALUES ('cake-001', 'Belgian Chocolate Truffle', 'Signature Cakes', 'cat-signature', 'Rich layers of dark Belgian chocolate ganache infused with delicate vanilla sponge and topped with hand-piped chocolate rosettes.', 549, '1.jpg', '["Belgian Dark Chocolate 54.5%","Vanilla Sponge","Dairy Whipped Cream","Dutch Cocoa","Gold Dust"]'::jsonb, 'Dark Chocolate Truffle', '500g / 1kg', 'in-stock', true, '["bestseller","dark-chocolate","eggless"]'::jsonb, 4.9, 'brown')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.cakes (id, name, category, category_id, description, price, image, ingredients, flavor, size, availability, featured, tags, rating, color)
VALUES ('cake-002', 'Fresh Strawberry Gateau', 'Celebration Cakes', 'cat-celebration', 'Artisan sponge layered with Mahabaleshwar strawberry reduction and fresh whipped dairy cream.', 599, '12.jpg', '["Fresh Strawberries","Light Sponge","Whipped Dairy Cream","White Chocolate Curls"]'::jsonb, 'Strawberry Cream', '500g / 1kg', 'in-stock', true, '["fresh-fruit","bestseller","seasonal"]'::jsonb, 4.8, 'pink')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.cakes (id, name, category, category_id, description, price, image, ingredients, flavor, size, availability, featured, tags, rating, color)
VALUES ('cake-003', 'Artisan Piped Celebration Tier', 'Custom Bakes', 'cat-custom', 'Intricate decorative piping, velvety crumb structure, and a balanced sweetness designed for milestone celebrations.', 649, '14.JPG', '["Buttercream","Moist Vanilla Sponge","Natural Berry Glaze","Edible Pearls"]'::jsonb, 'Vanilla Berry', '1kg / 2kg', 'in-stock', true, '["celebration","designer","custom"]'::jsonb, 4.9, 'pink')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.cakes (id, name, category, category_id, description, price, image, ingredients, flavor, size, availability, featured, tags, rating, color)
VALUES ('cake-004', 'Triple Layered Fusion Delight', 'Fusion Specials', 'cat-fusion', 'Three harmonious layers balancing dark chocolate mousse, hazelnut praline, and moist sponge.', 699, '5.png', '["Hazelnut Praline","Dark Chocolate","Milk Ganache","Cocoa Crunch"]'::jsonb, 'Chocolate Hazelnut', '500g / 1kg', 'in-stock', true, '["fusion","praline","rich"]'::jsonb, 4.9, 'brown')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.cakes (id, name, category, category_id, description, price, image, ingredients, flavor, size, availability, featured, tags, rating, color)
VALUES ('cake-005', 'Gourmet Opera Slice', 'Pastries & Slices', 'cat-pastries', 'Almond joconde sponge soaked in coffee syrup, layered with ganache and coffee buttercream.', 180, 'A7401344.jpeg', '["Almond Sponge","Espresso Syrup","Dark Chocolate Ganache","French Buttercream"]'::jsonb, 'Coffee & Chocolate', 'Individual Slice', 'in-stock', false, '["gourmet","french","coffee"]'::jsonb, 4.7, 'amber')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.cakes (id, name, category, category_id, description, price, image, ingredients, flavor, size, availability, featured, tags, rating, color)
VALUES ('cake-006', 'Grand Jubilee Celebration Tier', 'Celebration Cakes', 'cat-celebration', 'Showstopper multi-tiered cake finished with smooth Swiss meringue buttercream and artisan garnishes.', 1499, 'AZ_01460.JPG', '["Multi-tier Sponge","Swiss Meringue Buttercream","Fruit Reduction","Gold Accents"]'::jsonb, 'Vanilla & Red Berry', '2kg / 3kg', 'in-stock', true, '["wedding","anniversary","tiered"]'::jsonb, 5, 'white')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.cakes (id, name, category, category_id, description, price, image, ingredients, flavor, size, availability, featured, tags, rating, color)
VALUES ('cake-007', 'Glazed Fresh Fruit Gateau', 'Fruit Specials', 'cat-fruit', 'Light vanilla sponge loaded with seasonal kiwi, fresh cherries, and glazed grapes on dairy cream.', 549, 'AZ_01683.JPG', '["Seasonal Fruits","Chilled Vanilla Cream","Sponge Cake","Apricot Glaze"]'::jsonb, 'Exotic Fruit', '500g / 1kg', 'in-stock', true, '["fruit","light","eggless"]'::jsonb, 4.8, 'yellow')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.cakes (id, name, category, category_id, description, price, image, ingredients, flavor, size, availability, featured, tags, rating, color)
VALUES ('cake-008', 'Festive Pistachio Saffron Bake', 'Fusion Specials', 'cat-fusion', 'Kashmiri saffron milk soak with slivered Iranian pistachios and cardamom scented sponge.', 649, 'AZ_01692.JPG', '["Saffron","Iranian Pistachio","Cardamom Milk","Dairy Whip"]'::jsonb, 'Pistachio Kesar', '500g / 1kg', 'in-stock', true, '["festive","kesar","royal"]'::jsonb, 4.9, 'green')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.cakes (id, name, category, category_id, description, price, image, ingredients, flavor, size, availability, featured, tags, rating, color)
VALUES ('cake-009', 'Royal Dutch Chocolate Mousse', 'Signature Cakes', 'cat-signature', 'Airy dark chocolate mousse with a crunchy praline base and high-gloss mirror glaze.', 599, 'DSC03187.JPG', '["Dark Dutch Cocoa","Whipping Cream","Feuilletine Crunch","Chocolate Mirror Glaze"]'::jsonb, 'Dark Chocolate Mousse', '500g / 1kg', 'in-stock', true, '["mousse","chocolate","mirror-glaze"]'::jsonb, 4.9, 'brown')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.cakes (id, name, category, category_id, description, price, image, ingredients, flavor, size, availability, featured, tags, rating, color)
VALUES ('cake-010', 'Classic Fresh Cream Pineapple', 'Classic Cakes', 'cat-classic', 'Pune''s favorite traditional fresh pineapple cake with juicy pineapple compote and cherries.', 499, 'DSC08534.JPG', '["Pineapple Compote","Dairy Cream","Vanilla Sponge","Maraschino Cherries"]'::jsonb, 'Pineapple', '500g / 1kg', 'in-stock', false, '["classic","family-favorite","eggless"]'::jsonb, 4.7, 'yellow')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.cakes (id, name, category, category_id, description, price, image, ingredients, flavor, size, availability, featured, tags, rating, color)
VALUES ('cake-011', 'Velvet Rose & Raspberry', 'Celebration Cakes', 'cat-celebration', 'Delicate rose-water scented red sponge layered with tangy raspberry reduction and cream cheese.', 649, 'DSC08617.JPG', '["Raspberry Puree","Cream Cheese","Rose Water","Velvet Sponge"]'::jsonb, 'Rose Raspberry', '500g / 1kg', 'in-stock', true, '["velvet","raspberry","premium"]'::jsonb, 4.8, 'red')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.cakes (id, name, category, category_id, description, price, image, ingredients, flavor, size, availability, featured, tags, rating, color)
VALUES ('cake-012', 'Dark Chocolate Espresso Ganache', 'Signature Cakes', 'cat-signature', 'Bold single-origin espresso shot folded into 70% dark chocolate ganache with crunchy cocoa nibs.', 599, '1.jpg', '["Espresso Extract","70% Dark Chocolate","Dairy Whip","Roasted Cocoa Nibs"]'::jsonb, 'Mocha Espresso', '500g / 1kg', 'in-stock', false, '["espresso","dark-chocolate","gourmet"]'::jsonb, 4.8, 'brown')
ON CONFLICT (id) DO NOTHING;

-- 5. FAQs (10 items)
INSERT INTO public.faqs (id, question, question_marathi, answer, answer_marathi, category, order_index)
VALUES ('faq-1', 'Why should I choose CakeStory as a franchise partner?', NULL, 'CakeStory combines strong local brand recall across Pune with a proven, low-complexity operational model. Because all baking and manufacturing are handled centrally at our state-of-the-art facility, you do not need master chefs, expensive baking ovens, or kitchen staff. You run an elegant, high-margin retail outlet backed by established SOPs, daily cold-chain delivery, and comprehensive operational guidance.', NULL, 'Franchise Opportunity', 0)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.faqs (id, question, question_marathi, answer, answer_marathi, category, order_index)
VALUES ('faq-2', 'Where is CakeStory currently expanding?', NULL, 'We are actively expanding across high-density residential and commercial clusters in Pune, including West Pune (Kothrud, Bavdhan, Baner), East Pune (Kharadi, Wagholi, Hadapsar), South Pune (Kondhwa, Undri, Sinhagad Road), PCMC (Wakad, Ravet, Moshi), and regional growth corridors like Satara and Kolhapur.', NULL, 'Pune Expansion', 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.faqs (id, question, question_marathi, answer, answer_marathi, category, order_index)
VALUES ('faq-3', 'What support does CakeStory provide to franchise partners?', NULL, 'We offer complete 360-degree support: location feasibility analysis, store layout & architectural design, staff recruitment assistance, hands-on operational training, local marketing collateral, packaging supplies, and continuous product development. Our field operations team assists you through launch and ongoing store management.', NULL, 'Support & Training', 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.faqs (id, question, question_marathi, answer, answer_marathi, category, order_index)
VALUES ('faq-4', 'How does franchise onboarding work and what are the steps?', NULL, 'The journey follows a structured 7-step path: (1) Submit Franchise Enquiry, (2) Initial Business Discussion, (3) Territory & Location Evaluation, (4) Agreement & Commercial Formalities, (5) Store Fit-out & Visual Branding, (6) Staff Training & Dry Runs, and (7) Grand Launch with marketing launch support.', NULL, 'Onboarding Process', 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.faqs (id, question, question_marathi, answer, answer_marathi, category, order_index)
VALUES ('faq-5', 'Is training provided for me and my staff?', NULL, 'Yes. We provide thorough training covering retail counter management, POS billing software, product presentation, hygienic handling, customer service excellence, and inventory replenishment. No prior bakery or food experience is required.', NULL, 'Support & Training', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.faqs (id, question, question_marathi, answer, answer_marathi, category, order_index)
VALUES ('faq-6', 'How is product quality and consistency maintained across all outlets?', NULL, 'Quality is standardized through central manufacturing. Every cake recipe is executed with automated batching, strict temperature controls, and standardized ingredient ratios. Individual outlets receive finished, quality-tested cakes daily, ensuring a customer in Kothrud receives the identical taste and presentation as one in Baner.', NULL, 'Quality & Hygiene', 5)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.faqs (id, question, question_marathi, answer, answer_marathi, category, order_index)
VALUES ('faq-7', 'How are hygiene and food safety standards maintained?', NULL, 'Our central production facility follows cleanroom principles with UV sanitation, positive pressure ventilation, and full PPE for all culinary staff. Cakes are dispatched in tamper-evident, temperature-controlled packaging transported via refrigerated vehicles directly to outlet display chillers.', NULL, 'Quality & Hygiene', 6)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.faqs (id, question, question_marathi, answer, answer_marathi, category, order_index)
VALUES ('faq-8', 'Can I propose a location I already own or have shortlisted?', NULL, 'Yes! If you have a commercial shop or shortlisted space (ideally 150 to 350 sq.ft. with good street visibility and parking access), our site selection team will evaluate footfall, demographics, accessibility, and neighboring competition to confirm viability.', NULL, 'Franchise Opportunity', 7)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.faqs (id, question, question_marathi, answer, answer_marathi, category, order_index)
VALUES ('faq-9', 'Who is the ideal franchise partner for CakeStory?', NULL, 'We look for motivated entrepreneurs, business professionals, or passionate individuals who value discipline, customer hospitality, and brand standards. You should be enthusiastic about building a thriving local community business and growing alongside an ambitious Pune bakery brand.', NULL, 'Franchise Opportunity', 8)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.faqs (id, question, question_marathi, answer, answer_marathi, category, order_index)
VALUES ('faq-10', 'What happens after submitting a franchise enquiry on this website?', NULL, 'Once you submit our 4-field enquiry form, our Pune franchise expansion team reviews your preferred location and investment timeline. You will receive a direct phone consultation within 24 business hours to discuss territory availability and answer all your questions.', NULL, 'Onboarding Process', 9)
ON CONFLICT (id) DO NOTHING;

-- 6. Testimonials (4 items)
INSERT INTO public.testimonials (id, name, role, outlet, rating, comment, avatar)
VALUES ('t-001', 'Ananya Verma', 'Wedding Client', 'Pune', 5, 'Our wedding cake was a dream. The 3D design preview helped us visualize everything before the big day.', 'https://i.pravatar.cc/120?img=47')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.testimonials (id, name, role, outlet, rating, comment, avatar)
VALUES ('t-002', 'Rohit Khanna', 'Corporate Client', 'Pune', 5, 'CakeStory delivered 200 cupcakes for our product launch — all perfect, on time, and beautifully branded.', 'https://i.pravatar.cc/120?img=12')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.testimonials (id, name, role, outlet, rating, comment, avatar)
VALUES ('t-003', 'Sara Iyer', 'Birthday Mom', 'Pune', 5, 'My daughter''s unicorn cake was the highlight of her party. The 3D customization tool was so fun!', 'https://i.pravatar.cc/120?img=45')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.testimonials (id, name, role, outlet, rating, comment, avatar)
VALUES ('t-004', 'Karan Malhotra', 'Anniversary', 'Pune', 5, 'The pink velvet heart cake was romantic and delicious. The midnight delivery was a wonderful surprise.', 'https://i.pravatar.cc/120?img=33')
ON CONFLICT (id) DO NOTHING;

-- 7. Site Content Config
INSERT INTO public.site_content (key, content)
VALUES ('brand', '{"name":"CakeStory Desserts","tagline":"Build Your Future With a Brand That''s Built to Grow","city":"Pune","state":"Maharashtra","established":"2020","description":"A growing modern bakery brand and franchise ecosystem scaling across Pune."}'::jsonb)
ON CONFLICT (key) DO UPDATE SET content = EXCLUDED.content, updated_at = NOW();
INSERT INTO public.site_content (key, content)
VALUES ('homeHero', '{"badgeText":"CakeStory Desserts • A Growing Bakery Brand from Pune","headingPrefix":"Build Your Future With a Brand That''s","headingHighlight":"Built to Grow.","description":"CakeStory Desserts is expanding across Pune and looking for motivated entrepreneurs who want to build a successful bakery business with an established local brand, proven products, consistent processes, and complete operational support.","primaryCta":{"label":"Start Your Franchise Journey","action":"modal","link":"/franchise"},"secondaryCta":{"label":"See Our Outlets","link":"/outlets"},"statistics":[{"id":"stat-1","value":"68+","label":"PUNE OUTLETS","description":"Growing local network","active":true},{"id":"stat-2","value":"5","label":"ACTIVE ZONES","description":"Strategic territorial coverage","active":true},{"id":"stat-3","value":"100%","label":"CENTRAL SOPS","description":"Standardized batch consistency","active":true}],"supportingCards":[{"id":"card-1","icon":"🏭","title":"Central Pune Kitchen","description":"Daily batch quality control & cold chain dispatch","active":true},{"id":"card-2","icon":"🤝","title":"Franchise Support","description":"Turnkey store setup guidance & counter staff training","active":true}],"floatingBadges":[{"id":"badge-1","icon":"⭐","title":"Consistent Quality","subtitle":"Standardised Recipes","position":"top-left","active":true},{"id":"badge-2","icon":"📍","title":"Pune Network","subtitle":"High-Growth Catchments","position":"bottom-right","active":true}],"visual":{"type":"image","imageAsset":"/images/hero-cake.jpg","caption":"Signature Handcrafted CakeStory Desserts Celebration Cake"}}'::jsonb)
ON CONFLICT (key) DO UPDATE SET content = EXCLUDED.content, updated_at = NOW();
INSERT INTO public.site_content (key, content)
VALUES ('storyHero', '{"imageAsset":"AZ_01460.JPG","caption":"Central Kitchen Craftsmanship & Fresh Gourmet Ingredients"}'::jsonb)
ON CONFLICT (key) DO UPDATE SET content = EXCLUDED.content, updated_at = NOW();
INSERT INTO public.site_content (key, content)
VALUES ('franchiseHero', '{"imageAsset":"/images/franchise-hero.png","caption":"CakeStory Desserts Premium Packaged Treats & Festive Retail Collection"}'::jsonb)
ON CONFLICT (key) DO UPDATE SET content = EXCLUDED.content, updated_at = NOW();
INSERT INTO public.site_content (key, content)
VALUES ('coreStrengths', '{"badge":"Core Strengths","title":"Why Build Your Business With CakeStory Desserts?","subtitle":"More than a bakery brand — CakeStory Desserts is building a scalable business ecosystem across Pune, designed for ambitious young entrepreneurs.","cards":[{"id":"cs-1","icon":"🏪","title":"Proven Product Demand","description":"Operate in an everyday celebration & dessert category with products refined for high customer retention and repeat neighborhood orders.","active":true},{"id":"cs-2","icon":"⚙️","title":"Centralized Quality System","description":"Standardized recipes, automated ingredient batching, and strict temperature control eliminate guesswork and baking variances.","active":true},{"id":"cs-3","icon":"🏭","title":"Central Kitchen Support","description":"Cakes are baked, decorated, and chilled in our central Pune facility, dispatched fresh daily to keep outlet operations lean.","active":true},{"id":"cs-4","icon":"✨","title":"Handcrafted + Standardized","description":"Every cake unites artisan visual presentation with industrial consistency, giving customers celebratory perfection every time.","active":true},{"id":"cs-5","icon":"🤝","title":"Franchise Support","description":"Receive end-to-end guidance spanning commercial site selection, retail fit-out blueprints, counter POS software, and staff training.","active":true},{"id":"cs-6","icon":"📍","title":"Local Pune Advantage","description":"Deep territorial presence across Pune''s top residential and tech catchments ensures authentic brand recognition and customer trust.","active":true},{"id":"cs-7","icon":"🚀","title":"Youth Entrepreneur Opportunity","description":"Designed for motivated first-time and young entrepreneurs who want to lead a respected business with structured systems.","active":true},{"id":"cs-8","icon":"🎯","title":"Grow With the Brand","description":"Become a foundational partner as CakeStory Desserts expands across Pune, securing prime territorial rights in high-growth neighborhoods.","active":true}]}'::jsonb)
ON CONFLICT (key) DO UPDATE SET content = EXCLUDED.content, updated_at = NOW();

-- 8. Franchises & Outlets Network (68 verified stores)
INSERT INTO public.franchises (id, slug, name, outlet_name, zone, address, city, state, country, latitude, longitude, phone, email, opening_hours, manager, services, description, image, active, established, city_slug, locality, legacy_slugs, google_maps_url)
VALUES (
  'franchise-001',
  'baner',
  'CakeStory Desserts — Baner',
  'Baner Road',
  'West Pune',
  'Beside Malhar Dairy, Baner Road, Baner, Pune, Maharashtra 411045',
  'Pune',
  'Maharashtra',
  'India',
  18.559,
  73.7868,
  '+91 96073 32727',
  'care@cakestorydesserts.com',
  '10:00 AM - 11:30 PM',
  'Baner Boutique Team',
  '["Celebration Cakes","Artisanal Pastries","100% Pure Veg","Custom Orders","Takeaway"]'::jsonb,
  'Located on Baner Road beside Malhar Dairy, offering fresh handcrafted 100% pure vegetarian celebration cakes, designer pastries, and party orders daily.',
  '/images/outlets/baner.jpg',
  true,
  '2021',
  'pune',
  'Baner',
  '["cakestory-baner"]'::jsonb,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  phone = EXCLUDED.phone,
  google_maps_url = EXCLUDED.google_maps_url,
  updated_at = NOW();

INSERT INTO public.franchises (id, slug, name, outlet_name, zone, address, city, state, country, latitude, longitude, phone, email, opening_hours, manager, services, description, image, active, established, city_slug, locality, legacy_slugs, google_maps_url)
VALUES (
  'franchise-002',
  'kothrud',
  'CakeStory Desserts — Kothrud',
  'Narang Corner / Bus Stand',
  'West Pune',
  'shop no  19,shivtara garden co, new D.P road,kothrud',
  'Pune',
  'Maharashtra',
  'India',
  18.5074,
  73.8077,
  '+91 98505 48485',
  'care@cakestorydesserts.com',
  '10:00 AM - 12:00 AM',
  'Vijay Waghmare',
  '["Celebration Cakes","Fresh Desserts","100% Pure Veg","Quick Pickup","Custom Orders"]'::jsonb,
  'Situated at Narang Corner near Kothrud Bus Stand, serving fresh pure veg celebration cakes and delightful pastries crafted daily.',
  '/images/outlets/kothrud.jpg',
  true,
  '2021',
  'pune',
  'Kothrud',
  '["cakestory-kothrud"]'::jsonb,
  'https://share.google/rBGWQ3ZGXGnhmgTJS'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  phone = EXCLUDED.phone,
  google_maps_url = EXCLUDED.google_maps_url,
  updated_at = NOW();

INSERT INTO public.franchises (id, slug, name, outlet_name, zone, address, city, state, country, latitude, longitude, phone, email, opening_hours, manager, services, description, image, active, established, city_slug, locality, legacy_slugs, google_maps_url)
VALUES (
  'franchise-003',
  'karve-nagar',
  'CakeStory Desserts — Karve Nagar',
  'Kakade Plaza',
  'West Pune',
  ':SHOP NO.22,KAKADE PLAZA WING-B, KARVE ROAD ,KARVENAGAR 411052',
  'Pune',
  'Maharashtra',
  'India',
  18.4908,
  73.8183,
  '+91 90113 00402',
  'care@cakestorydesserts.com',
  '10:00 AM - 11:00 PM',
  'gaurav',
  '["Celebration Cakes","Artisan Ice Creams","100% Pure Veg","Party Packs"]'::jsonb,
  'Serving Karve Nagar from Kakade Plaza with handcrafted celebration cakes, dessert cups, and cold-chain deliveries from our central kitchen.',
  '/images/outlets/hinjewadi.jpg',
  true,
  '2022',
  'pune',
  'Karve Nagar',
  '["cakestory-karve-nagar"]'::jsonb,
  'https://maps.app.goo.gl/aEb8KHvxw1stpMms6?g_st=awb'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  phone = EXCLUDED.phone,
  google_maps_url = EXCLUDED.google_maps_url,
  updated_at = NOW();

INSERT INTO public.franchises (id, slug, name, outlet_name, zone, address, city, state, country, latitude, longitude, phone, email, opening_hours, manager, services, description, image, active, established, city_slug, locality, legacy_slugs, google_maps_url)
VALUES (
  'franchise-004',
  'wakad',
  'CakeStory Desserts — Wakad',
  'Dange Chowk',
  'PCMC',
  'shop no 1,Dange Empire,Near prerna Bank,Dange chowk',
  'Pimpri-Chinchwad',
  'Maharashtra',
  'India',
  18.6015,
  73.7661,
  '+91 78987 55656',
  'care@cakestorydesserts.com',
  '10:00 AM - 12:00 AM',
  'Aditya Jadhav',
  '["Designer Cakes","Instant Takeaway","100% Pure Veg","Birthday Specials"]'::jsonb,
  'Located at Dange Empire near Dange Chowk in Wakad, providing fresh pure veg celebration cakes and quick pickup for IT professionals and families.',
  '/images/outlets/wakad.jpg',
  true,
  '2022',
  'pimpri-chinchwad',
  'Wakad',
  '["cakestory-wakad"]'::jsonb,
  'https://maps.app.goo.gl/Rhb3Yjo3iZNWz6DV7?g_st=awb'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  phone = EXCLUDED.phone,
  google_maps_url = EXCLUDED.google_maps_url,
  updated_at = NOW();

INSERT INTO public.franchises (id, slug, name, outlet_name, zone, address, city, state, country, latitude, longitude, phone, email, opening_hours, manager, services, description, image, active, established, city_slug, locality, legacy_slugs, google_maps_url)
VALUES (
  'franchise-005',
  'pimple-saudagar',
  'CakeStory Desserts — Pimple Saudagar',
  'Radhanagari Society / PK Chowk',
  'PCMC',
  'Shop No. 5, Ground Floor, Radhanagari Society, Near PK Chowk, Pimple Saudagar, Pune, Maharashtra 411027',
  'Pimpri-Chinchwad',
  'Maharashtra',
  'India',
  18.5982,
  73.7997,
  '+91 94296 01731',
  'care@cakestorydesserts.com',
  '10:00 AM - 11:00 PM',
  'Pimple Saudagar Team',
  '["Artisan Cakes","Fresh Fruit Bakes","100% Pure Veg","Kids Birthday Themes"]'::jsonb,
  'A bustling family-favorite bakery in Pimple Saudagar near PK Chowk, offering delightful 100% pure vegetarian cakes and pastries.',
  '/images/outlets/pimple-saudagar.jpg',
  true,
  '2023',
  'pimpri-chinchwad',
  'Pimple Saudagar',
  '["cakestory-pimple-saudagar"]'::jsonb,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  phone = EXCLUDED.phone,
  google_maps_url = EXCLUDED.google_maps_url,
  updated_at = NOW();

INSERT INTO public.franchises (id, slug, name, outlet_name, zone, address, city, state, country, latitude, longitude, phone, email, opening_hours, manager, services, description, image, active, established, city_slug, locality, legacy_slugs, google_maps_url)
VALUES (
  'franchise-006',
  'chinchwad',
  'CakeStory Desserts — Chinchwad',
  'Shridhar Nagar',
  'PCMC',
  'Shop no 2,Premsagar Society,Shridhar nagar,Chinchwad',
  'Pimpri-Chinchwad',
  'Maharashtra',
  'India',
  18.6298,
  73.7997,
  '+91 84469 96488',
  'care@cakestorydesserts.com',
  '9:30 AM - 10:30 PM',
  'Mayur Bhujbal',
  '["Industrial Celebrations","Celebration Cakes","100% Pure Veg","Fresh Pastries"]'::jsonb,
  'Serving Chinchwad''s industrial and residential community with fresh daily deliveries and signature celebration cakes directly from our central kitchen.',
  '/images/outlets/chinchwad.jpg',
  true,
  '2023',
  'pimpri-chinchwad',
  'Chinchwad',
  '["cakestory-chinchwad"]'::jsonb,
  'https://maps.app.goo.gl/8qsK87tV7Rh3FDLZ6?g_st=awb'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  phone = EXCLUDED.phone,
  google_maps_url = EXCLUDED.google_maps_url,
  updated_at = NOW();

INSERT INTO public.franchises (id, slug, name, outlet_name, zone, address, city, state, country, latitude, longitude, phone, email, opening_hours, manager, services, description, image, active, established, city_slug, locality, legacy_slugs, google_maps_url)
VALUES (
  'franchise-007',
  'ravet',
  'CakeStory Desserts — Ravet',
  'SB Patil School Road',
  'PCMC',
  'Ranjan Heights,S.B Patil School road,Ravet',
  'Pimpri-Chinchwad',
  'Maharashtra',
  'India',
  18.6534,
  73.7439,
  '+91 99606 93711',
  'care@cakestorydesserts.com',
  '10:00 AM - 11:30 PM',
  'Gayatri  A Ladhha',
  '["Celebration Cakes","Custom Themed Bakes","100% Pure Veg","Takeaway"]'::jsonb,
  'Conveniently located on S.B. Patil School Road in Ravet, delivering premium handcrafted cakes for birthdays and milestone celebrations.',
  '/images/outlets/kalyani-nagar.jpg',
  true,
  '2023',
  'pimpri-chinchwad',
  'Ravet',
  '["cakestory-ravet"]'::jsonb,
  'https://share.google/8pV4vllbAbAS1nsNa'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  phone = EXCLUDED.phone,
  google_maps_url = EXCLUDED.google_maps_url,
  updated_at = NOW();

INSERT INTO public.franchises (id, slug, name, outlet_name, zone, address, city, state, country, latitude, longitude, phone, email, opening_hours, manager, services, description, image, active, established, city_slug, locality, legacy_slugs, google_maps_url)
VALUES (
  'franchise-008',
  'camp',
  'CakeStory Desserts — Camp',
  'Pulgate Chowk',
  'East Pune',
  'SHOP NO 4 RADIANT PRIME ARCADE PULGET CHOWK',
  'Pune',
  'Maharashtra',
  'India',
  18.5103,
  73.8824,
  '+91 70575 46970',
  'care@cakestorydesserts.com',
  '10:00 AM - 11:30 PM',
  'Sunny Charles',
  '["Signature Gateaux","Fusion Pastries","100% Pure Veg","Gifting Hampers"]'::jsonb,
  'Historic Camp''s sweet destination at Pulgate Chowk, famous for authentic pure veg pastries, celebration cakes, and artisanal desserts.',
  '/images/outlets/viman-nagar.jpg',
  true,
  '2021',
  'pune',
  'Camp',
  '["cakestory-camp"]'::jsonb,
  'https://share.google/DVwvSN4qABCazQlec'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  phone = EXCLUDED.phone,
  google_maps_url = EXCLUDED.google_maps_url,
  updated_at = NOW();

INSERT INTO public.franchises (id, slug, name, outlet_name, zone, address, city, state, country, latitude, longitude, phone, email, opening_hours, manager, services, description, image, active, established, city_slug, locality, legacy_slugs, google_maps_url)
VALUES (
  'franchise-009',
  'viman-nagar',
  'CakeStory Desserts — Viman Nagar',
  'Ganpati Chowk',
  'East Pune',
  'Shop No. 17, Ridhi Enclave, Anand Vidhya Niketan High School Road, Near Ganpati Square, Viman Nagar, Pune,  411014',
  'Pune',
  'Maharashtra',
  'India',
  18.5679,
  73.9143,
  '+91 72768 22006',
  'care@cakestorydesserts.com',
  '10:00 AM - 12:30 AM',
  'SWAPNIL NAVGHARE',
  '["Designer Cakes","Fusion Desserts","Party Catering","100% Pure Veg"]'::jsonb,
  'Premier East Pune bakery outlet near Ganpati Chowk in Viman Nagar, trusted by residents and students for hygienic and delectable bakes.',
  '/images/outlets/viman-nagar.jpg',
  true,
  '2021',
  'pune',
  'Viman Nagar',
  '["cakestory-viman-nagar"]'::jsonb,
  'https://maps.app.goo.gl/q2aEAZfz7iASUtqb9?g_st=awb'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  phone = EXCLUDED.phone,
  google_maps_url = EXCLUDED.google_maps_url,
  updated_at = NOW();

INSERT INTO public.franchises (id, slug, name, outlet_name, zone, address, city, state, country, latitude, longitude, phone, email, opening_hours, manager, services, description, image, active, established, city_slug, locality, legacy_slugs, google_maps_url)
VALUES (
  'franchise-010',
  'vadgaon-sheri',
  'CakeStory Desserts — Vadgaon Sheri',
  'Old Mundhwa Road',
  'East Pune',
  'shop no 1,sagar plaza,old mundhwa road,sai nagari,wadgaon sheri',
  'Pune',
  'Maharashtra',
  'India',
  18.5492,
  73.9248,
  '+91 70388 28346',
  'care@cakestorydesserts.com',
  '10:00 AM - 11:30 PM',
  'Sarthak Choukhande',
  '["Celebration Cakes","Fresh Daily Bakes","100% Pure Veg","Quick Delivery"]'::jsonb,
  'Serving Vadgaon Sheri and Mundhwa with standard batch precision, hygienic delivery, and rich chocolate specials.',
  '/images/outlets/kharadi.jpg',
  true,
  '2022',
  'pune',
  'Vadgaon Sheri',
  '["cakestory-vadgaon-sheri"]'::jsonb,
  'https://maps.app.goo.gl/cZZCgTm5prjEVgeV9?g_st=awb'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  phone = EXCLUDED.phone,
  google_maps_url = EXCLUDED.google_maps_url,
  updated_at = NOW();

INSERT INTO public.franchises (id, slug, name, outlet_name, zone, address, city, state, country, latitude, longitude, phone, email, opening_hours, manager, services, description, image, active, established, city_slug, locality, legacy_slugs, google_maps_url)
VALUES (
  'franchise-011',
  'kharadi',
  'CakeStory Desserts — Kharadi',
  'Rakshak Nagar / Zensar',
  'East Pune',
  'RAKSHANAGAR ,KHARADI',
  'Pune',
  'Maharashtra',
  'India',
  18.5529,
  73.9431,
  '+91 98601 44737',
  'care@cakestorydesserts.com',
  '10:00 AM - 11:30 PM',
  'Avinash Pakhale',
  '["Celebration Cakes","Corporate Hampers","100% Pure Veg","Instant Delivery"]'::jsonb,
  'Rapidly growing franchise store near Zensar in Kharadi, serving tech parks and townships with fresh daily supply from our central kitchen.',
  '/images/outlets/kharadi.jpg',
  true,
  '2023',
  'pune',
  'Kharadi',
  '["cakestory-kharadi"]'::jsonb,
  'https://maps.app.goo.gl/9KpoWhSx3A8D2Qxq7?g_st=awb'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  phone = EXCLUDED.phone,
  google_maps_url = EXCLUDED.google_maps_url,
  updated_at = NOW();

INSERT INTO public.franchises (id, slug, name, outlet_name, zone, address, city, state, country, latitude, longitude, phone, email, opening_hours, manager, services, description, image, active, established, city_slug, locality, legacy_slugs, google_maps_url)
VALUES (
  'franchise-012',
  'phursungi',
  'CakeStory Desserts — Phursungi',
  'Bhekrai Nagar',
  'East Pune',
  'Jadhav & Saumya Complex.opp.Bhekrainagar Bus depo,Bhekrainagar',
  'Pune',
  'Maharashtra',
  'India',
  18.4788,
  73.9619,
  '+91 99219 14444',
  'care@cakestorydesserts.com',
  '9:00 AM - 11:30 PM',
  'Santosh Choukhande',
  '["Celebration Cakes","Custom Cakes","100% Pure Veg","Evening Pickup"]'::jsonb,
  'High-traffic location at Bhekrai Nagar Bus Stop in Phursungi, offering handcrafted celebration cakes and party orders.',
  '/images/outlets/kondhwa.jpg',
  true,
  '2023',
  'pune',
  'Phursungi',
  '["cakestory-phursungi"]'::jsonb,
  'https://share.google/5jxmgkhQb8BfhoM2A'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  phone = EXCLUDED.phone,
  google_maps_url = EXCLUDED.google_maps_url,
  updated_at = NOW();

INSERT INTO public.franchises (id, slug, name, outlet_name, zone, address, city, state, country, latitude, longitude, phone, email, opening_hours, manager, services, description, image, active, established, city_slug, locality, legacy_slugs, google_maps_url)
VALUES (
  'franchise-013',
  'wanowrie-nibm',
  'CakeStory Desserts — Wanwadi',
  'Mayfair Eleganza',
  'South Pune',
  'MAIYFAIR ELEGANZA SHOP NO 6,KONDHWA',
  'Pune',
  'Maharashtra',
  'India',
  18.4907,
  73.8969,
  '+91 98817 90101',
  'care@cakestorydesserts.com',
  '9:00 AM - 12:00 AM',
  'Ajinkya Parkhe',
  '["Signature Cakes","Gourmet Pastries","100% Pure Veg","Midnight Celebrations"]'::jsonb,
  'South Pune boutique at Mayfair Eleganza in Wanowrie, open till midnight with delightful 100% pure vegetarian cakes and desserts.',
  '/images/outlets/kondhwa.jpg',
  true,
  '2022',
  'pune',
  'Wanowrie',
  '["cakestory-wanwadi"]'::jsonb,
  'https://maps.app.goo.gl/KKvuXNRaCEqWBd1F9?g_st=awb'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  phone = EXCLUDED.phone,
  google_maps_url = EXCLUDED.google_maps_url,
  updated_at = NOW();

INSERT INTO public.franchises (id, slug, name, outlet_name, zone, address, city, state, country, latitude, longitude, phone, email, opening_hours, manager, services, description, image, active, established, city_slug, locality, legacy_slugs, google_maps_url)
VALUES (
  'franchise-014',
  'kondhwa',
  'CakeStory Desserts — Kondhwa',
  'Gangadham / Aai Mata Chowk',
  'South Pune',
  'SHOP NO 20,GANESH MARKET,MARKET YARD PUNE',
  'Pune',
  'Maharashtra',
  'India',
  18.4812,
  73.8795,
  '+91 96573 59797',
  'care@cakestorydesserts.com',
  '9:00 AM - 12:00 AM',
  'Chaitanya Gaikwad',
  '["Family Celebration Cakes","100% Pure Veg","Bulk Party Packs","Festival Specials"]'::jsonb,
  'Situated at Aai Mata Chowk on Gangadham Market Yard Road, offering dependable consistency and rich chocolate specialities.',
  '/images/outlets/kondhwa.jpg',
  true,
  '2022',
  'pune',
  'Kondhwa',
  '["cakestory-kondhwa"]'::jsonb,
  'https://maps.app.goo.gl/9RoAvuxWniSVeQzw7?g_st=awb'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  phone = EXCLUDED.phone,
  google_maps_url = EXCLUDED.google_maps_url,
  updated_at = NOW();

INSERT INTO public.franchises (id, slug, name, outlet_name, zone, address, city, state, country, latitude, longitude, phone, email, opening_hours, manager, services, description, image, active, established, city_slug, locality, legacy_slugs, google_maps_url)
VALUES (
  'franchise-015',
  'bibwewadi',
  'CakeStory Desserts — Bibwewadi',
  'Balajinagar / Pune-Satara Road',
  'South Pune',
  'Dhankwadi balaji nagar,near Khujbu Hotel,Balajinagar',
  'Pune',
  'Maharashtra',
  'India',
  18.4682,
  73.8644,
  '+91 84838 00903',
  'care@cakestorydesserts.com',
  '10:00 AM - 12:00 AM',
  'Pankaj Mhaske',
  '["Custom Celebration Cakes","100% Pure Veg","Festival Specials","Instant Pickup"]'::jsonb,
  'Consistent neighborhood boutique on Pune-Satara Road at Balajinagar / Bibwewadi, providing wholesome pure veg cakes at accessible pricing.',
  '/images/outlets/bibwewadi.jpg',
  true,
  '2023',
  'pune',
  'Bibwewadi',
  '["cakestory-bibwewadi"]'::jsonb,
  'https://maps.app.goo.gl/5rxuyq2r3nZMdtsH9?g_st=awb'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  phone = EXCLUDED.phone,
  google_maps_url = EXCLUDED.google_maps_url,
  updated_at = NOW();

INSERT INTO public.franchises (id, slug, name, outlet_name, zone, address, city, state, country, latitude, longitude, phone, email, opening_hours, manager, services, description, image, active, established, city_slug, locality, legacy_slugs, google_maps_url)
VALUES (
  'franchise-016',
  'saswad',
  'CakeStory Desserts — Saswad',
  'Mhetre Mala / Saswad Court',
  'South Pune',
  'near saswad St stand,saswad',
  'Pune',
  'Maharashtra',
  'India',
  18.3444,
  74.0305,
  '+91 99212 94444',
  'care@cakestorydesserts.com',
  '9:30 AM - 11:45 PM',
  'Shubham KAPRE',
  '["Regional Franchise Hub","Celebration Cakes","Gourmet Sweets","100% Pure Veg"]'::jsonb,
  'Our flagship Purandar regional boutique near Saswad Court, bringing CakeStory''s renowned pure vegetarian bakery quality to the historical region.',
  '/images/outlets/saswad.jpg',
  true,
  '2023',
  'pune',
  'Saswad',
  '["cakestory-saswad","anand-plaza"]'::jsonb,
  'https://maps.app.goo.gl/KDSEzDFXCWGkT32c7?g_st=awb'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  phone = EXCLUDED.phone,
  google_maps_url = EXCLUDED.google_maps_url,
  updated_at = NOW();

INSERT INTO public.franchises (id, slug, name, outlet_name, zone, address, city, state, country, latitude, longitude, phone, email, opening_hours, manager, services, description, image, active, established, city_slug, locality, legacy_slugs, google_maps_url)
VALUES (
  'franchise-017',
  'hadapsar-sade-satra-nali',
  'Cakestory Desserts — Hadapsar (Sade Satra Nali)',
  'Rohan Plaza / DP Road',
  'East Pune',
  'OFFICE NO 28.29,SADE SATRA NALI,HADPSAR',
  'Pune',
  'Maharashtra',
  'India',
  18.5085,
  73.9482,
  '+91 93078 54425',
  'care@cakestorydesserts.com',
  '10:00 AM - 11:30 PM',
  'Pranay Kodre',
  '["Celebration Cakes","Fresh Pastries","100% Pure Veg","In-Store Shopping","Quick Delivery"]'::jsonb,
  'Located at Rohan Plaza on DP Road in Malwadi, Hadapsar, serving signature 100% pure vegetarian cakes and custom party bakes.',
  '/images/outlets/kharadi.jpg',
  true,
  '2022',
  'pune',
  'Hadapsar',
  '["cakestory-hadapsar-sade-satra-nali"]'::jsonb,
  'https://maps.app.goo.gl/daJufLyAnZ3LK9dRA?g_st=awb'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  phone = EXCLUDED.phone,
  google_maps_url = EXCLUDED.google_maps_url,
  updated_at = NOW();

INSERT INTO public.franchises (id, slug, name, outlet_name, zone, address, city, state, country, latitude, longitude, phone, email, opening_hours, manager, services, description, image, active, established, city_slug, locality, legacy_slugs, google_maps_url)
VALUES (
  'franchise-018',
  'hadapsar-magarpatta',
  'CakeStory Desserts — Hadapsar (Magarpatta Road)',
  'Magarpatta Road / Airtel Gallery',
  'East Pune',
  'Sudarshan Heritage Shop No 14, Near Airtel Gallery Magarpatta City Road Hadapsar Pune 411028',
  'Pune',
  'Maharashtra',
  'India',
  18.5144,
  73.9312,
  '+91 84110 00994',
  'care@cakestorydesserts.com',
  '10:00 AM - 12:00 AM',
  'sagar gupta',
  '["Designer Cakes","Midnight Delivery","100% Pure Veg","In-Store Shopping","Corporate Orders"]'::jsonb,
  'High-footfall Magarpatta Road outlet near Airtel Gallery, open until midnight for corporate celebrations and family gatherings.',
  '/images/outlets/viman-nagar.jpg',
  true,
  '2022',
  'pune',
  'Hadapsar',
  '["cakestory-hadapsar-magarpatta"]'::jsonb,
  'https://maps.app.goo.gl/fhnrJv83hDcXqMPE7?g_st=awb'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  phone = EXCLUDED.phone,
  google_maps_url = EXCLUDED.google_maps_url,
  updated_at = NOW();

INSERT INTO public.franchises (id, slug, name, outlet_name, zone, address, city, state, country, latitude, longitude, phone, email, opening_hours, manager, services, description, image, active, established, city_slug, locality, legacy_slugs, google_maps_url)
VALUES (
  'franchise-019',
  'lohegaon',
  'CakeStory Desserts — Lohegaon (Porwal Road)',
  'Aeropolis / Porwal Road',
  'East Pune',
  'Shop No 5, Aeropolis, Porwal Rd, Kutwal Colony, Lohegaon, Pune, Maharashtra 411047',
  'Pune',
  'Maharashtra',
  'India',
  18.5985,
  73.9054,
  '+91 99221 40236',
  'care@cakestorydesserts.com',
  '10:00 AM - 12:00 AM',
  'Omkar bhujbal',
  '["Celebration Cakes","Gourmet Pastries","100% Pure Veg","Party Packs","Kerbside Pickup"]'::jsonb,
  'Serving the growing residential communities of Lohegaon and Dhanori at Aeropolis on Porwal Road with daily fresh bakes.',
  '/images/outlets/viman-nagar.jpg',
  true,
  '2023',
  'pune',
  'Lohegaon',
  '["cakestory-lohegaon-porwal"]'::jsonb,
  'https://maps.app.goo.gl/T6zYrTNBfGpF21Ci6?g_st=awb'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  phone = EXCLUDED.phone,
  google_maps_url = EXCLUDED.google_maps_url,
  updated_at = NOW();

INSERT INTO public.franchises (id, slug, name, outlet_name, zone, address, city, state, country, latitude, longitude, phone, email, opening_hours, manager, services, description, image, active, established, city_slug, locality, legacy_slugs, google_maps_url)
VALUES (
  'franchise-020',
  'manjri',
  'CakeStory Desserts — Manjri (Shewalewadi Road)',
  'Swapnashilp Complex',
  'East Pune',
  '69/B1 SHOP NO 5,SWAPNSHIL COMPLEX',
  'Pune',
  'Maharashtra',
  'India',
  18.4988,
  73.9785,
  '+91 99707 23334',
  'care@cakestorydesserts.com',
  '10:00 AM - 12:00 AM',
  'Yash Kodre',
  '["Celebration Cakes","Artisanal Pastries","100% Pure Veg","Takeaway","Party Orders"]'::jsonb,
  'Conveniently situated at Swapnashilp Complex on Shewalewadi Road, serving Manjri and Hadapsar East with fresh handcrafted bakes.',
  '/images/outlets/kondhwa.jpg',
  true,
  '2023',
  'pune',
  'Manjri',
  '["cakestory-manjri-shewalewadi"]'::jsonb,
  'https://maps.app.goo.gl/kSstYn2id6j1adC98?g_st=awb'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  phone = EXCLUDED.phone,
  google_maps_url = EXCLUDED.google_maps_url,
  updated_at = NOW();

INSERT INTO public.franchises (id, slug, name, outlet_name, zone, address, city, state, country, latitude, longitude, phone, email, opening_hours, manager, services, description, image, active, established, city_slug, locality, legacy_slugs, google_maps_url)
VALUES (
  'franchise-021',
  'wanowrie-sacred-heart',
  'CakeStory Desserts — Wanowrie (Sacred Heart Town)',
  'Sacred Heart Town / McDonald''s',
  'South Pune',
  'SHOP NO. 13 SACRED HEART TOWN , WANAWADI 411 040',
  'Pune',
  'Maharashtra',
  'India',
  18.4952,
  73.8998,
  '+91 70575 46970',
  'care@cakestorydesserts.com',
  '10:00 AM - 11:00 PM',
  'Sunny Charles',
  '["Artisan Pastries","Celebration Cakes","100% Pure Veg","Express Pickup","Custom Frosting"]'::jsonb,
  'Located opposite McDonald''s in Sacred Heart Town, Wanowrie, delivering delicious pure veg gateaux and dessert treats.',
  '/images/outlets/kondhwa.jpg',
  true,
  '2022',
  'pune',
  'Wanowrie',
  '["cakestory-wanowrie-sacred-heart"]'::jsonb,
  'https://maps.app.goo.gl/2CPUyP1ffr58Aa7R8?g_st=awb'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  phone = EXCLUDED.phone,
  google_maps_url = EXCLUDED.google_maps_url,
  updated_at = NOW();

INSERT INTO public.franchises (id, slug, name, outlet_name, zone, address, city, state, country, latitude, longitude, phone, email, opening_hours, manager, services, description, image, active, established, city_slug, locality, legacy_slugs, google_maps_url)
VALUES (
  'franchise-022',
  'keshav-nagar',
  'CakeStory Desserts — Keshav Nagar (Mundhwa)',
  'Pramiva / Manjari Road',
  'East Pune',
  '37 Pramiva, Manjari Rd, near K.R.B. Workshop, Sasane Colony, Keshav Nagar, Mundhwa, Keshvnagar, Pune, Maharashtra 411036',
  'Pune',
  'Maharashtra',
  'India',
  18.5372,
  73.9358,
  '+91 77448 47372',
  'care@cakestorydesserts.com',
  '10:00 AM - 11:30 PM',
  'Kunal kodre',
  '["Celebration Cakes","Fresh Fruit Bakes","100% Pure Veg","Takeaway","Doorstep Delivery"]'::jsonb,
  'Serving the riverside residential belt of Keshav Nagar and Mundhwa with guaranteed fresh cold-chain deliveries daily.',
  '/images/outlets/kharadi.jpg',
  true,
  '2022',
  'pune',
  'Keshav Nagar',
  '["cakestory-keshav-nagar"]'::jsonb,
  'https://maps.app.goo.gl/roSbZgqwaXeMa6p19?g_st=ac'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  phone = EXCLUDED.phone,
  google_maps_url = EXCLUDED.google_maps_url,
  updated_at = NOW();

INSERT INTO public.franchises (id, slug, name, outlet_name, zone, address, city, state, country, latitude, longitude, phone, email, opening_hours, manager, services, description, image, active, established, city_slug, locality, legacy_slugs, google_maps_url)
VALUES (
  'franchise-023',
  'hadapsar-sasane-nagar',
  'CakeStory Desserts — Hadapsar (Sasane Nagar)',
  'Gandharv Geet / DP Road',
  'East Pune',
  'shop no 7,Gandharv Geet,Near Pearl hospital,Navnath Chowk',
  'Pune',
  'Maharashtra',
  'India',
  18.4932,
  73.9348,
  '+91 98818 17785',
  'care@cakestorydesserts.com',
  '10:00 AM - 12:00 AM',
  'Santosh Hole',
  '["Celebration Cakes","Custom Themed Bakes","100% Pure Veg","In-Store Pickup","Midnight Delivery"]'::jsonb,
  'Neighborhood favorite at Gandharv Geet in Sasane Nagar, open till midnight for milestone birthday and anniversary cakes.',
  '/images/outlets/kondhwa.jpg',
  true,
  '2023',
  'pune',
  'Hadapsar',
  '["cakestory-hadapsar-sasane-nagar"]'::jsonb,
  'https://share.google/Zvz59mLcz7HUQiWuD'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  phone = EXCLUDED.phone,
  google_maps_url = EXCLUDED.google_maps_url,
  updated_at = NOW();

INSERT INTO public.franchises (id, slug, name, outlet_name, zone, address, city, state, country, latitude, longitude, phone, email, opening_hours, manager, services, description, image, active, established, city_slug, locality, legacy_slugs, google_maps_url)
VALUES (
  'franchise-024',
  'rahatani',
  'CakeStory Desserts — Rahatani (BRTS Road)',
  'Shri Vitthal Rukhmini Colony',
  'PCMC',
  'JQ7P+V7J, Chikhali - Kaspate Vasti BRTS Rd, Shri Vitthal Rukhmini Colony, Rahatani, Pimpri-Chinchwad, Maharashtra 411017',
  'Pimpri-Chinchwad',
  'Maharashtra',
  'India',
  18.5985,
  73.7845,
  '+91 89994 13275',
  'care@cakestorydesserts.com',
  '10:00 AM - 12:00 AM',
  'PRAVIN RAUT',
  '["Designer Cakes","Pure Veg Pastries","100% Pure Veg","Party Packs","Express Pickup"]'::jsonb,
  'Positioned along the Kaspate Vasti BRTS link in Rahatani, providing seamless access to pure vegetarian cakes across PCMC.',
  '/images/outlets/pimple-saudagar.jpg',
  true,
  '2023',
  'pimpri-chinchwad',
  'Rahatani',
  '["cakestory-rahatani"]'::jsonb,
  'https://maps.app.goo.gl/JiLrd3TEruFZgSaT7?g_st=awb'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  phone = EXCLUDED.phone,
  google_maps_url = EXCLUDED.google_maps_url,
  updated_at = NOW();

INSERT INTO public.franchises (id, slug, name, outlet_name, zone, address, city, state, country, latitude, longitude, phone, email, opening_hours, manager, services, description, image, active, established, city_slug, locality, legacy_slugs, google_maps_url)
VALUES (
  'franchise-025',
  'undri',
  'CakeStory Desserts — Undri (Euro School Road)',
  'The Land Mark Society',
  'South Pune',
  'shop no 5,near Euro school,Bellagio,undri',
  'Pune',
  'Maharashtra',
  'India',
  18.4623,
  73.9102,
  '+91 96573 59797',
  'care@cakestorydesserts.com',
  '10:00 AM - 11:30 PM',
  'Chaitanya Gaikwad',
  '["Celebration Cakes","Kids Party Bakes","100% Pure Veg","Family Combos","Doorstep Delivery"]'::jsonb,
  'Located near Euro School at The Land Mark Society in Undri, a top destination for school birthdays and family celebrations.',
  '/images/outlets/kondhwa.jpg',
  true,
  '2023',
  'pune',
  'Undri',
  '["cakestory-undri"]'::jsonb,
  'https://maps.app.goo.gl/faYL37Z97oVftgpp7?g_st=awb'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  phone = EXCLUDED.phone,
  google_maps_url = EXCLUDED.google_maps_url,
  updated_at = NOW();

INSERT INTO public.franchises (id, slug, name, outlet_name, zone, address, city, state, country, latitude, longitude, phone, email, opening_hours, manager, services, description, image, active, established, city_slug, locality, legacy_slugs, google_maps_url)
VALUES (
  'franchise-026',
  'loni-kalbhor',
  'CakeStory Desserts — Loni Kalbhor (Kadamwak Wasti)',
  'Nilesh Kunj / MIT Corner',
  'East Pune',
  'shop no 7,Nilesh Kunj,MIT Corner,Loni Kalbhor',
  'Pune',
  'Maharashtra',
  'India',
  18.4892,
  74.0251,
  '+91 83086 15656',
  'care@cakestorydesserts.com',
  '10:00 AM - 11:30 PM',
  'Ruturaj Gaikwad',
  '["Student Specials","Celebration Cakes","100% Pure Veg","Quick Pickup","Gifting Bakes"]'::jsonb,
  'Situated at MIT Corner in Kadamwak Wasti, catering to the vast student and residential demographic along Pune-Solapur Highway.',
  '/images/outlets/kondhwa.jpg',
  true,
  '2023',
  'pune',
  'Loni Kalbhor',
  '["cakestory-loni-kalbhor"]'::jsonb,
  'https://share.google/PGrpF1s1aM5qR08zX'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  phone = EXCLUDED.phone,
  google_maps_url = EXCLUDED.google_maps_url,
  updated_at = NOW();

INSERT INTO public.franchises (id, slug, name, outlet_name, zone, address, city, state, country, latitude, longitude, phone, email, opening_hours, manager, services, description, image, active, established, city_slug, locality, legacy_slugs, google_maps_url)
VALUES (
  'franchise-027',
  'moshi',
  'CakeStory Desserts — Moshi (Spine Road)',
  'L-Axis Commercial Centre',
  'PCMC',
  'Shop No. 4, L-Axis Commercial Centre, Spine Road, Moshi Pradhikaran, PCMC, Pune- 412105',
  'Pimpri-Chinchwad',
  'Maharashtra',
  'India',
  18.648376199999998,
  73.8432989,
  '+91 96099 92727',
  'care@cakestorydesserts.com',
  '10:00 AM - 10:30 PM',
  'Kundan Gaikwad',
  '["Signature Cakes","Pastries & Brownies","100% Pure Veg","Takeaway","Custom Themes"]'::jsonb,
  'Conveniently located at L-Axis Commercial Centre on Spine Road in Moshi, bringing pure veg bakery excellence to North PCMC.',
  '/images/outlets/chinchwad.jpg',
  true,
  '2023',
  'pimpri-chinchwad',
  'Moshi',
  '["cakestory-moshi-spine-road"]'::jsonb,
  'https://maps.app.goo.gl/QJ7cweJAjiZ8iwBn8?g_st=awb'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  phone = EXCLUDED.phone,
  google_maps_url = EXCLUDED.google_maps_url,
  updated_at = NOW();

INSERT INTO public.franchises (id, slug, name, outlet_name, zone, address, city, state, country, latitude, longitude, phone, email, opening_hours, manager, services, description, image, active, established, city_slug, locality, legacy_slugs, google_maps_url)
VALUES (
  'franchise-028',
  'chikhali-jadhav-wadi',
  'CakeStory Desserts — Chikhali (Jadhav Wadi)',
  'Kumar Pratham / Shiv Rasta',
  'PCMC',
  'Shop no-,Behind Kumar pratham society,Jadhavwadi -moshi shiv road , jadhavwadi, chikhali,pune-411062.',
  'Pimpri-Chinchwad',
  'Maharashtra',
  'India',
  18.6782,
  73.8185,
  '+91 90117 47485',
  'care@cakestorydesserts.com',
  '10:00 AM - 11:30 PM',
  'rushikesh jadhav',
  '["Celebration Cakes","100% Pure Veg","Kerbside Pickup","Party Orders","No-Contact Delivery"]'::jsonb,
  'Serving residential communities around Kumar Pratham and Jadhav Wadi with delicious daily freshly prepared eggless cakes.',
  '/images/outlets/chinchwad.jpg',
  true,
  '2023',
  'pimpri-chinchwad',
  'Chikhali',
  '["cakestory-chikhali-jadhav-wadi"]'::jsonb,
  'https://maps.app.goo.gl/7nsPdCNDJMqv682G6?g_st=awb'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  phone = EXCLUDED.phone,
  google_maps_url = EXCLUDED.google_maps_url,
  updated_at = NOW();

INSERT INTO public.franchises (id, slug, name, outlet_name, zone, address, city, state, country, latitude, longitude, phone, email, opening_hours, manager, services, description, image, active, established, city_slug, locality, legacy_slugs, google_maps_url)
VALUES (
  'franchise-029',
  'new-sangavi',
  'CakeStory Desserts — New Sangavi (Krushna Chowk)',
  'Radha Raman Complex',
  'PCMC',
  'Shop no 6,Radharaman Complex,Krushna chowk,navi sangavi',
  'Pimpri-Chinchwad',
  'Maharashtra',
  'India',
  18.5832,
  73.8124,
  '+91 95032 70027',
  'care@cakestorydesserts.com',
  '10:00 AM - 11:00 PM',
  'Kunal Jagdale',
  '["Designer Cakes","Dessert Cups","100% Pure Veg","In-Store Pickup","Celebration Packs"]'::jsonb,
  'Prime location at Krushna Chowk in New Sangavi, popular among families and IT commuters between Aundh and Pimpri.',
  '/images/outlets/wakad.jpg',
  true,
  '2022',
  'pimpri-chinchwad',
  'New Sangavi',
  '["cakestory-new-sangavi"]'::jsonb,
  'https://maps.app.goo.gl/UefW8ZTWmCn9RExZ7?g_st=awb'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  phone = EXCLUDED.phone,
  google_maps_url = EXCLUDED.google_maps_url,
  updated_at = NOW();

INSERT INTO public.franchises (id, slug, name, outlet_name, zone, address, city, state, country, latitude, longitude, phone, email, opening_hours, manager, services, description, image, active, established, city_slug, locality, legacy_slugs, google_maps_url)
VALUES (
  'franchise-030',
  'hadapsar-factory-outlet',
  'CakeStory Desserts — Hadapsar (Factory Central Outlet)',
  'Chaitanya Colony / Central Hub',
  'East Pune',
  '36, Subhash Nagar, Chaitanya Colony, Hadapsar, Pune, Maharashtra 411028',
  'Pune',
  'Maharashtra',
  'India',
  18.5021,
  73.9284,
  '+91 92092 42556',
  'care@cakestorydesserts.com',
  '9:00 AM - 10:30 PM',
  'Chaitanya Colony Team',
  '["Direct-From-Kitchen","Celebration Cakes","Bulk Orders","100% Pure Veg","Central Pickup"]'::jsonb,
  'Direct retail factory outlet in Hadapsar providing freshly baked cakes straight from our central preparation kitchen.',
  '/images/outlets/kharadi.jpg',
  true,
  '2021',
  'pune',
  'Hadapsar',
  '["cakestory-hadapsar-factory-outlet"]'::jsonb,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  phone = EXCLUDED.phone,
  google_maps_url = EXCLUDED.google_maps_url,
  updated_at = NOW();

INSERT INTO public.franchises (id, slug, name, outlet_name, zone, address, city, state, country, latitude, longitude, phone, email, opening_hours, manager, services, description, image, active, established, city_slug, locality, legacy_slugs, google_maps_url)
VALUES (
  'franchise-031',
  'narhe',
  'CakeStory Desserts — Narhe (Zeal College Road)',
  'Malvika Arcade / Vetal Buwa Chowk',
  'South Pune',
  'malvika arcade,zeel college road,vetal buwa chowk, narhe',
  'Pune',
  'Maharashtra',
  'India',
  18.4485,
  73.8212,
  '+91 75888 74242',
  'care@cakestorydesserts.com',
  '10:00 AM - 12:00 AM',
  'Avinash Tilekar',
  '["Celebration Cakes","Youth Party Specials","100% Pure Veg","In-Store Shopping","Instant Pickup"]'::jsonb,
  'Vibrant outlet on Zeal College Road in Narhe, catering to students, faculty, and local families with delightful cake selections.',
  '/images/outlets/bibwewadi.jpg',
  true,
  '2023',
  'pune',
  'Narhe',
  '["cakestory-narhe"]'::jsonb,
  'https://maps.app.goo.gl/UVG2Rz1oUpvHc2226?g_st=awb'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  phone = EXCLUDED.phone,
  google_maps_url = EXCLUDED.google_maps_url,
  updated_at = NOW();

INSERT INTO public.franchises (id, slug, name, outlet_name, zone, address, city, state, country, latitude, longitude, phone, email, opening_hours, manager, services, description, image, active, established, city_slug, locality, legacy_slugs, google_maps_url)
VALUES (
  'franchise-032',
  'hadapsar-kalepadal',
  'CakeStory Desserts — Hadapsar (Kalepadal)',
  'Shiv Vihar / Kale Borate Nagar',
  'East Pune',
  'Shop No. 1, Shiv Vihar Housing Society, Kale Borate Nagar, Kalepadal, Hadapsar, Pune, Maharashtra 411028',
  'Pune',
  'Maharashtra',
  'India',
  18.4891,
  73.9385,
  '+91 94221 45859',
  'care@cakestorydesserts.com',
  '10:00 AM - 11:50 PM',
  'Shiv Vihar Team',
  '["Celebration Cakes","Fresh Daily Bakes","100% Pure Veg","Party Packs","Evening Delivery"]'::jsonb,
  'Located at Shiv Vihar in Kale Borate Nagar, Kalepadal, serving fresh eggless celebration cakes with dependable local delivery.',
  '/images/outlets/kondhwa.jpg',
  true,
  '2023',
  'pune',
  'Hadapsar',
  '["cakestory-hadapsar-kalepadal"]'::jsonb,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  phone = EXCLUDED.phone,
  google_maps_url = EXCLUDED.google_maps_url,
  updated_at = NOW();

INSERT INTO public.franchises (id, slug, name, outlet_name, zone, address, city, state, country, latitude, longitude, phone, email, opening_hours, manager, services, description, image, active, established, city_slug, locality, legacy_slugs, google_maps_url)
VALUES (
  'franchise-033',
  'pimpri',
  'CakeStory Desserts — Pimpri (Nehru Nagar)',
  'Rajveer Imperia / Ajmera Road',
  'PCMC',
  'shop no 1,rajveer imperia,ajmera main road,nehrunagar,pimpari',
  'Pimpri-Chinchwad',
  'Maharashtra',
  'India',
  18.6341,
  73.8214,
  '+91 93393 30909',
  'care@cakestorydesserts.com',
  '10:00 AM - 12:00 AM',
  'Alpana.S.Bhamare',
  '["Signature Cakes","Custom Celebration Bakes","100% Pure Veg","Takeaway","Fast Delivery"]'::jsonb,
  'Situated near Annasaheb Magar Stadium at Rajveer Imperia in Nehru Nagar, Pimpri, delivering fresh celebration gateaux.',
  '/images/outlets/chinchwad.jpg',
  true,
  '2023',
  'pimpri-chinchwad',
  'Pimpri',
  '["cakestory-pimpri-nehru-nagar"]'::jsonb,
  'https://maps.app.goo.gl/8fffQNdXti2gD9Kg9?g_st=awb'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  phone = EXCLUDED.phone,
  google_maps_url = EXCLUDED.google_maps_url,
  updated_at = NOW();

INSERT INTO public.franchises (id, slug, name, outlet_name, zone, address, city, state, country, latitude, longitude, phone, email, opening_hours, manager, services, description, image, active, established, city_slug, locality, legacy_slugs, google_maps_url)
VALUES (
  'franchise-034',
  'warje',
  'CakeStory Desserts — Warje (Bypass / RMD Sinhgad)',
  'Prestige Point / Aditya Garden City',
  'West Pune',
  'SHOP NO 1 , PRESTIGE POINT RMD COLLAGE ROAD ,WARJE 411058',
  'Pune',
  'Maharashtra',
  'India',
  18.4890681,
  73.7898927,
  '+91 82756 15123',
  'care@cakestorydesserts.com',
  '10:00 AM - 11:55 PM',
  'yogesh machinkar',
  '["Celebration Cakes","Artisanal Ice Creams","100% Pure Veg","Dine-In & Takeaway","Midnight Bakes"]'::jsonb,
  'Flagship cafe & ice cream parlour at Prestige Point next to the Mumbai-Pune bypass in Warje, open till midnight.',
  '/images/outlets/hinjewadi.jpg',
  true,
  '2022',
  'pune',
  'Warje',
  '["cakestory-warje-bypass"]'::jsonb,
  'https://maps.app.goo.gl/e9gPBTu48yyY5UQP8'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  phone = EXCLUDED.phone,
  google_maps_url = EXCLUDED.google_maps_url,
  updated_at = NOW();

INSERT INTO public.franchises (id, slug, name, outlet_name, zone, address, city, state, country, latitude, longitude, phone, email, opening_hours, manager, services, description, image, active, established, city_slug, locality, legacy_slugs, google_maps_url)
VALUES (
  'franchise-035',
  'anand-nagar',
  'CakeStory Desserts — Anand Nagar (Sun City Road)',
  'BG Arcade / Maruti Mandir',
  'South Pune',
  'shop no 4,Nirmal Township,Saraswat bank,Suncity,anand nagar',
  'Pune',
  'Maharashtra',
  'India',
  18.4773621,
  73.81902529999999,
  '+91 96574 97858',
  'care@cakestorydesserts.com',
  '10:00 AM - 11:00 PM',
  'Somnath Choukhande',
  '["Signature Bakes","Pastry Slices","100% Pure Veg","Quick Pickup","Doorstep Delivery"]'::jsonb,
  'Located near Dakshin Mukhi Maruti Mandir at BG Arcade on Sun City Road, providing tasty pure vegetarian cakes to Anand Nagar.',
  '/images/outlets/bibwewadi.jpg',
  true,
  '2023',
  'pune',
  'Anand Nagar',
  '["cakestory-anand-nagar-suncity"]'::jsonb,
  'https://maps.app.goo.gl/SQYFb4SSREVgDn617?g_st=awb'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  phone = EXCLUDED.phone,
  google_maps_url = EXCLUDED.google_maps_url,
  updated_at = NOW();

INSERT INTO public.franchises (id, slug, name, outlet_name, zone, address, city, state, country, latitude, longitude, phone, email, opening_hours, manager, services, description, image, active, established, city_slug, locality, legacy_slugs, google_maps_url)
VALUES (
  'franchise-036',
  'kolhewadi',
  'CakeStory Desserts — Kolhewadi (Sinhgad Road)',
  'Amrut Vihar / Canara Bank',
  'South Pune',
  'Shop no 15,Amrut Vihar,opp to canara bank,Sinhagad road,Kirkatwadi',
  'Pune',
  'Maharashtra',
  'India',
  18.4312,
  73.7915,
  '+91 81819 84444',
  'care@cakestorydesserts.com',
  '10:00 AM - 11:30 PM',
  'Dinesh Bhandalkar',
  '["Celebration Cakes","Fresh Desserts","100% Pure Veg","Takeout","Party Hampers"]'::jsonb,
  'Serving Kolhewadi and upper Sinhgad Road communities from Amrut Vihar Apartments with hygienic, handcrafted eggless cakes.',
  '/images/outlets/bibwewadi.jpg',
  true,
  '2023',
  'pune',
  'Kolhewadi',
  '["cakestory-kolhewadi"]'::jsonb,
  'https://share.google/h6EnE0WWJwRt2O2wE'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  phone = EXCLUDED.phone,
  google_maps_url = EXCLUDED.google_maps_url,
  updated_at = NOW();

INSERT INTO public.franchises (id, slug, name, outlet_name, zone, address, city, state, country, latitude, longitude, phone, email, opening_hours, manager, services, description, image, active, established, city_slug, locality, legacy_slugs, google_maps_url)
VALUES (
  'franchise-037',
  'shivane',
  'CakeStory Desserts — Shivane (Uttam Nagar)',
  'Rajarshi Shahu Bank / Uttam Nagar',
  'South Pune',
  'shop no 7,opp to rajshri shahu bank,Uttam nagar,Yashwant nagar,Shivane',
  'Pune',
  'Maharashtra',
  'India',
  18.4621,
  73.7841,
  '+91 81819 84444',
  'care@cakestorydesserts.com',
  '10:00 AM - 11:30 PM',
  'Dinesh Bhandalkar',
  '["Designer Cakes","Dessert Cups","100% Pure Veg","In-Store Pickup","Celebration Bakes"]'::jsonb,
  'Located opposite Rajarshi Shahu Bank in Uttam Nagar, Shivane, providing fresh daily deliveries and birthday specials.',
  '/images/outlets/bibwewadi.jpg',
  true,
  '2023',
  'pune',
  'Shivane',
  '["cakestory-shivane"]'::jsonb,
  'https://share.google/h6EnE0WWJwRt2O2wE'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  phone = EXCLUDED.phone,
  google_maps_url = EXCLUDED.google_maps_url,
  updated_at = NOW();

INSERT INTO public.franchises (id, slug, name, outlet_name, zone, address, city, state, country, latitude, longitude, phone, email, opening_hours, manager, services, description, image, active, established, city_slug, locality, legacy_slugs, google_maps_url)
VALUES (
  'franchise-038',
  'nigdi-sector-25',
  'CakeStory Desserts — Nigdi (Sector 25)',
  'Parveen Palace / Festival Chowk',
  'PCMC',
  'shop no 3,Praveen Palace,Festival Chowk,Near bhel chowk,nigdi',
  'Pimpri-Chinchwad',
  'Maharashtra',
  'India',
  18.6612,
  73.7712,
  '+91 93739 94479',
  'care@cakestorydesserts.com',
  '10:00 AM - 11:30 PM',
  'Yash ZENDE',
  '["Celebration Cakes","Party Catering","100% Pure Veg","Pick-up","Custom Themes"]'::jsonb,
  'Bustling PCMC outlet at Festival Chowk in Nigdi Sector 25, renowned for quick pickup and delicious themed birthday gateaux.',
  '/images/outlets/chinchwad.jpg',
  true,
  '2023',
  'pimpri-chinchwad',
  'Nigdi',
  '["cakestory-nigdi-sector-25"]'::jsonb,
  'https://maps.app.goo.gl/YDp7dnY5mbd5g7at9?g_st=awb'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  phone = EXCLUDED.phone,
  google_maps_url = EXCLUDED.google_maps_url,
  updated_at = NOW();

INSERT INTO public.franchises (id, slug, name, outlet_name, zone, address, city, state, country, latitude, longitude, phone, email, opening_hours, manager, services, description, image, active, established, city_slug, locality, legacy_slugs, google_maps_url)
VALUES (
  'franchise-039',
  'nigdi-yamuna-nagar',
  'CakeStory Desserts — Nigdi (Yamuna Nagar)',
  'Sant Krupa Complex',
  'PCMC',
  'Shop no 1,Santkrupa complex,Near LIC office,LIC corner,yamunanagar',
  'Pimpri-Chinchwad',
  'Maharashtra',
  'India',
  18.6578,
  73.7812,
  '+91 97677 75269',
  'care@cakestorydesserts.com',
  '10:00 AM - 12:00 AM',
  'Rushikesh Wadhane',
  '["Celebration Cakes","Fresh Pastries","100% Pure Veg","Delivery","Quick Orders"]'::jsonb,
  'Situated at Sant Krupa Complex in Yamuna Nagar, Nigdi, catering to residential families with fresh daily deliveries.',
  '/images/outlets/chinchwad.jpg',
  true,
  '2023',
  'pimpri-chinchwad',
  'Nigdi',
  '["cakestory-nigdi-yamuna-nagar"]'::jsonb,
  'https://maps.app.goo.gl/sE45NgpEDZWfSaGK8?g_st=awb'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  phone = EXCLUDED.phone,
  google_maps_url = EXCLUDED.google_maps_url,
  updated_at = NOW();

INSERT INTO public.franchises (id, slug, name, outlet_name, zone, address, city, state, country, latitude, longitude, phone, email, opening_hours, manager, services, description, image, active, established, city_slug, locality, legacy_slugs, google_maps_url)
VALUES (
  'franchise-040',
  'dhayari',
  'CakeStory Desserts — Dhayari (Ganpati Chowk)',
  'Sterling Nisarga II / Ganpati Chowk',
  'South Pune',
  'near umbraya ganpati mandir,dhayari',
  'Pune',
  'Maharashtra',
  'India',
  18.4465,
  73.8091,
  '+91 88889 41010',
  'care@cakestorydesserts.com',
  '10:00 AM - 11:30 PM',
  'Sagar Sake',
  '["Celebration Cakes","Fresh Fruit Bakes","100% Pure Veg","In-Store Pickup","Express Delivery"]'::jsonb,
  'Popular Dhayari boutique at Ganpati Chowk in Sterling Nisarga II, delivering fresh eggless cakes to South Pune families.',
  '/images/outlets/bibwewadi.jpg',
  true,
  '2023',
  'pune',
  'Dhayari',
  '["cakestory-dhayari"]'::jsonb,
  'https://maps.app.goo.gl/aXRq4QGAbpDZdE6s7?g_st=iw'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  phone = EXCLUDED.phone,
  google_maps_url = EXCLUDED.google_maps_url,
  updated_at = NOW();

INSERT INTO public.franchises (id, slug, name, outlet_name, zone, address, city, state, country, latitude, longitude, phone, email, opening_hours, manager, services, description, image, active, established, city_slug, locality, legacy_slugs, google_maps_url)
VALUES (
  'franchise-041',
  'kondhwa-tilekar-nagar',
  'CakeStory Desserts — Kondhwa (Tilekar Nagar / ISKCON)',
  'Gagan Unnati / Katraj-Kondhwa Road',
  'South Pune',
  'Shop no.8 Gagan Unnati building Katraj kondhwa road near iscon temple tilekar nagar Pune',
  'Pune',
  'Maharashtra',
  'India',
  18.4612,
  73.8821,
  '+91 95636 43535',
  'care@cakestorydesserts.com',
  '10:00 AM - 11:30 PM',
  'vaishanv jagtap',
  '["Celebration Cakes","Temple & Festival Sweets","100% Pure Veg","Takeaway","Custom Frosting"]'::jsonb,
  'Conveniently located near ISKCON Temple on Katraj-Kondhwa Road, serving 100% pure vegetarian cakes and festival desserts.',
  '/images/outlets/kondhwa.jpg',
  true,
  '2023',
  'pune',
  'Kondhwa',
  '["cakestory-kondhwa-tilekar-nagar"]'::jsonb,
  'https://maps.app.goo.gl/N5v6mzcjhPH8LjQXA?g_st=awb'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  phone = EXCLUDED.phone,
  google_maps_url = EXCLUDED.google_maps_url,
  updated_at = NOW();

INSERT INTO public.franchises (id, slug, name, outlet_name, zone, address, city, state, country, latitude, longitude, phone, email, opening_hours, manager, services, description, image, active, established, city_slug, locality, legacy_slugs, google_maps_url)
VALUES (
  'franchise-042',
  'katraj',
  'CakeStory Desserts — Katraj (Jambhulwadi Road)',
  'Hanuman Nagar / Jambhulwadi Road',
  'South Pune',
  'Jambhulwadi Road, Hanuman Nagar, Katraj, Pune, Maharashtra 411046',
  'Pune',
  'Maharashtra',
  'India',
  18.4412,
  73.8562,
  '+91 80807 65985',
  'care@cakestorydesserts.com',
  '10:00 AM - 11:30 PM',
  'Hanuman Nagar Team',
  '["Celebration Cakes","Eggless Pastries","100% Pure Veg","Pickup","Express Delivery"]'::jsonb,
  'Serving Katraj, Hanuman Nagar, and Jambhulwadi with dependable pure veg cake artistry and fresh party bakes.',
  '/images/outlets/bibwewadi.jpg',
  true,
  '2023',
  'pune',
  'Katraj',
  '["cakestory-katraj-jambhulwadi"]'::jsonb,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  phone = EXCLUDED.phone,
  google_maps_url = EXCLUDED.google_maps_url,
  updated_at = NOW();

INSERT INTO public.franchises (id, slug, name, outlet_name, zone, address, city, state, country, latitude, longitude, phone, email, opening_hours, manager, services, description, image, active, established, city_slug, locality, legacy_slugs, google_maps_url)
VALUES (
  'franchise-043',
  'chikhali-sane-chowk',
  'CakeStory Desserts — Chikhali (Sane Chowk)',
  'GMC Raj Palace / Sector 19',
  'PCMC',
  'Shop no 6,G.M.C, Raj Palace,Sane Chowk,Chikhali',
  'Pimpri-Chinchwad',
  'Maharashtra',
  'India',
  18.6695,
  73.7995,
  '+91 88053 19464',
  'care@cakestorydesserts.com',
  '10:00 AM - 11:30 PM',
  'Ganesh Phadtare',
  '["Celebration Cakes","Custom Themed Bakes","100% Pure Veg","Takeaway","Order Ahead"]'::jsonb,
  'Situated at Sane Chowk on Chikhali-Akurdi Road, serving Sector 19 and Newale Wasti with signature celebration cakes.',
  '/images/outlets/chinchwad.jpg',
  true,
  '2023',
  'pimpri-chinchwad',
  'Chikhali',
  '["cakestory-chikhali-sane-chowk"]'::jsonb,
  'https://share.google/strofgX3EiINnvMmc'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  phone = EXCLUDED.phone,
  google_maps_url = EXCLUDED.google_maps_url,
  updated_at = NOW();

INSERT INTO public.franchises (id, slug, name, outlet_name, zone, address, city, state, country, latitude, longitude, phone, email, opening_hours, manager, services, description, image, active, established, city_slug, locality, legacy_slugs, google_maps_url)
VALUES (
  'franchise-044',
  'phursungi-ganganagar',
  'CakeStory Desserts — Phursungi (Ganganagar)',
  'Ganganagar Main Road',
  'East Pune',
  'Opposite Rickshaw Stand, Ganganagar Main Road, Phursungi, Pune, Maharashtra 412308',
  'Pune',
  'Maharashtra',
  'India',
  18.4725,
  73.9682,
  '+91 97634 22920',
  'care@cakestorydesserts.com',
  '10:00 AM - 11:00 PM',
  'Ganganagar Main Road Team',
  '["Celebration Cakes","Quick Pick-up","100% Pure Veg","Party Packs","Local Delivery"]'::jsonb,
  'Located opposite the rickshaw stand on Ganganagar Main Road in Phursungi, providing quick cake pickups and party orders.',
  '/images/outlets/kondhwa.jpg',
  true,
  '2023',
  'pune',
  'Phursungi',
  '["cakestory-phursungi-ganganagar"]'::jsonb,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  phone = EXCLUDED.phone,
  google_maps_url = EXCLUDED.google_maps_url,
  updated_at = NOW();

INSERT INTO public.franchises (id, slug, name, outlet_name, zone, address, city, state, country, latitude, longitude, phone, email, opening_hours, manager, services, description, image, active, established, city_slug, locality, legacy_slugs, google_maps_url)
VALUES (
  'franchise-045',
  'mundhwa',
  'CakeStory Desserts — Mundhwa (Pratima Palace)',
  'Pratima Palace / Mundhwa Chowk',
  'East Pune',
  'Pratima Palace, Mundhwa, Pune, Maharashtra 411036',
  'Pune',
  'Maharashtra',
  'India',
  18.5358,
  73.9214,
  '+91 93736 10618',
  'care@cakestorydesserts.com',
  '10:00 AM - 11:30 PM',
  'Pratima Palace Team',
  '["Celebration Cakes","Artisanal Bakes","100% Pure Veg","Takeaway","Drive-Through Pickup"]'::jsonb,
  'Serving the vibrant Mundhwa community from Pratima Palace with handcrafted cakes delivered from our central hub.',
  '/images/outlets/viman-nagar.jpg',
  true,
  '2023',
  'pune',
  'Mundhwa',
  '["cakestory-mundhwa-pratima-palace"]'::jsonb,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  phone = EXCLUDED.phone,
  google_maps_url = EXCLUDED.google_maps_url,
  updated_at = NOW();

INSERT INTO public.franchises (id, slug, name, outlet_name, zone, address, city, state, country, latitude, longitude, phone, email, opening_hours, manager, services, description, image, active, established, city_slug, locality, legacy_slugs, google_maps_url)
VALUES (
  'franchise-046',
  'wagholi',
  'CakeStory Desserts — Wagholi (Kesnand Road)',
  'Kesnand Road Hub',
  'East Pune',
  'Survey No. 42, Kesnand Road, near Wagheshwar Temple, Wagholi, Pune, Maharashtra 412207',
  'Pune',
  'Maharashtra',
  'India',
  18.5812,
  73.9854,
  '+91 98819 14444',
  'care@cakestorydesserts.com',
  '10:00 AM - 11:00 PM',
  'Kesnand Road Hub Team',
  '["Celebration Cakes","100% Pure Veg","Express Delivery","Takeaway"]'::jsonb,
  'High-growth eastern suburb outlet on Kesnand Road, bringing CakeStory pure vegetarian excellence to Wagholi families.',
  '/images/outlets/kharadi.jpg',
  true,
  '2023',
  'pune',
  'Wagholi',
  '["cakestory-wagholi"]'::jsonb,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  phone = EXCLUDED.phone,
  google_maps_url = EXCLUDED.google_maps_url,
  updated_at = NOW();

INSERT INTO public.franchises (id, slug, name, outlet_name, zone, address, city, state, country, latitude, longitude, phone, email, opening_hours, manager, services, description, image, active, established, city_slug, locality, legacy_slugs, google_maps_url)
VALUES (
  'franchise-047',
  'hinjawadi-phase-1',
  'CakeStory Desserts — Hinjawadi (Phase 1 / Shivaji Chowk)',
  'Hinjawadi IT Hub',
  'West Pune',
  'Shop No. 11, Prime Plaza, Shivaji Chowk, Hinjawadi Phase 1, Pune, Maharashtra 411057',
  'Pune',
  'Maharashtra',
  'India',
  18.5912,
  73.7389,
  '+91 98819 14444',
  'care@cakestorydesserts.com',
  '10:00 AM - 12:00 AM',
  'Hinjawadi IT Hub Team',
  '["Tech Park Deliveries","Celebration Cakes","100% Pure Veg","Midnight Celebrations"]'::jsonb,
  'Serving Hinjawadi IT parks with scheduled milestone celebrations, employee birthday hampers, and pure veg gateaux.',
  '/images/outlets/hinjewadi.jpg',
  true,
  '2023',
  'pune',
  'Hinjawadi',
  '["cakestory-hinjawadi-it-hub"]'::jsonb,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  phone = EXCLUDED.phone,
  google_maps_url = EXCLUDED.google_maps_url,
  updated_at = NOW();

INSERT INTO public.franchises (id, slug, name, outlet_name, zone, address, city, state, country, latitude, longitude, phone, email, opening_hours, manager, services, description, image, active, established, city_slug, locality, legacy_slugs, google_maps_url)
VALUES (
  'franchise-048',
  'hinjawadi-phase-3',
  'CakeStory Desserts — Hinjawadi (Phase 3 / Megapolis)',
  'Megapolis Circle',
  'West Pune',
  'Commercial Hub, Near Megapolis Circle, Hinjawadi Phase 3, Pune, Maharashtra 411057',
  'Pune',
  'Maharashtra',
  'India',
  18.5834,
  73.6987,
  '+91 98819 14444',
  'care@cakestorydesserts.com',
  '10:00 AM - 11:30 PM',
  'Megapolis Circle Team',
  '["Residential Deliveries","Celebration Cakes","100% Pure Veg","Party Packs"]'::jsonb,
  'Dedicated township hub for Hinjawadi Phase 3 residential communities, providing rapid dessert delivery.',
  '/images/outlets/hinjewadi.jpg',
  true,
  '2024',
  'pune',
  'Hinjawadi',
  '["cakestory-hinjawadi-megapolis"]'::jsonb,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  phone = EXCLUDED.phone,
  google_maps_url = EXCLUDED.google_maps_url,
  updated_at = NOW();

INSERT INTO public.franchises (id, slug, name, outlet_name, zone, address, city, state, country, latitude, longitude, phone, email, opening_hours, manager, services, description, image, active, established, city_slug, locality, legacy_slugs, google_maps_url)
VALUES (
  'franchise-049',
  'bhosari',
  'CakeStory Desserts — Bhosari (Dighi-Bhosari Road)',
  'PCMC Industrial Hub',
  'PCMC',
  'Survey No. 78, Pune-Nashik Highway, Near Landewadi Chowk, Bhosari, PCMC, Pune, Maharashtra 411039',
  'Pimpri-Chinchwad',
  'Maharashtra',
  'India',
  18.6274,
  73.8489,
  '+91 98819 14444',
  'care@cakestorydesserts.com',
  '9:30 AM - 10:30 PM',
  'PCMC Industrial Hub Team',
  '["Industrial Events","Celebration Cakes","100% Pure Veg","Takeaway"]'::jsonb,
  'Strategic retail and corporate celebrations outlet in the Bhosari industrial and residential sector.',
  '/images/outlets/chinchwad.jpg',
  true,
  '2023',
  'pimpri-chinchwad',
  'Bhosari',
  '["cakestory-bhosari"]'::jsonb,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  phone = EXCLUDED.phone,
  google_maps_url = EXCLUDED.google_maps_url,
  updated_at = NOW();

INSERT INTO public.franchises (id, slug, name, outlet_name, zone, address, city, state, country, latitude, longitude, phone, email, opening_hours, manager, services, description, image, active, established, city_slug, locality, legacy_slugs, google_maps_url)
VALUES (
  'franchise-050',
  'pimple-gurav',
  'CakeStory Desserts — Pimple Gurav (Kate Puram)',
  'Kate Puram Chowk',
  'PCMC',
  'Shop No. 3, Kate Puram Chowk, Pimple Gurav, Pimpri-Chinchwad, Maharashtra 411061',
  'Pimpri-Chinchwad',
  'Maharashtra',
  'India',
  18.5876,
  73.8198,
  '+91 98819 14444',
  'care@cakestorydesserts.com',
  '10:00 AM - 11:00 PM',
  'Kate Puram Chowk Team',
  '["Celebration Cakes","Artisan Bakes","100% Pure Veg","Pickup"]'::jsonb,
  'Family-favorite neighborhood outlet at Kate Puram Chowk serving Pimple Gurav and Dapodi.',
  '/images/outlets/wakad.jpg',
  true,
  '2023',
  'pimpri-chinchwad',
  'Pimple Gurav',
  '["cakestory-pimple-gurav"]'::jsonb,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  phone = EXCLUDED.phone,
  google_maps_url = EXCLUDED.google_maps_url,
  updated_at = NOW();

INSERT INTO public.franchises (id, slug, name, outlet_name, zone, address, city, state, country, latitude, longitude, phone, email, opening_hours, manager, services, description, image, active, established, city_slug, locality, legacy_slugs, google_maps_url)
VALUES (
  'franchise-051',
  'bavdhan',
  'CakeStory Desserts — Bavdhan (Chandani Chowk)',
  'Paud Road / Chandani Chowk',
  'West Pune',
  'Commercial Wing, Paud Road, Near Chandani Chowk, Bavdhan, Pune, Maharashtra 411021',
  'Pune',
  'Maharashtra',
  'India',
  18.5089,
  73.7745,
  '+91 98819 14444',
  'care@cakestorydesserts.com',
  '10:00 AM - 11:00 PM',
  'Paud Road Team',
  '["Celebration Cakes","Gourmet Desserts","100% Pure Veg","Express Pickup"]'::jsonb,
  'Conveniently connecting West Pune commuters at Chandani Chowk with fresh vegetarian celebration cakes.',
  '/images/outlets/baner.jpg',
  true,
  '2023',
  'pune',
  'Bavdhan',
  '["cakestory-bavdhan"]'::jsonb,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  phone = EXCLUDED.phone,
  google_maps_url = EXCLUDED.google_maps_url,
  updated_at = NOW();

INSERT INTO public.franchises (id, slug, name, outlet_name, zone, address, city, state, country, latitude, longitude, phone, email, opening_hours, manager, services, description, image, active, established, city_slug, locality, legacy_slugs, google_maps_url)
VALUES (
  'franchise-052',
  'aundh',
  'CakeStory Desserts — Aundh (Parihar Chowk)',
  'Parihar Chowk / DP Road',
  'West Pune',
  'Shop No. 2, DP Road, near Parihar Chowk, Aundh, Pune, Maharashtra 411007',
  'Pune',
  'Maharashtra',
  'India',
  18.5582,
  73.8078,
  '+91 98819 14444',
  'care@cakestorydesserts.com',
  '10:00 AM - 11:30 PM',
  'Parihar Chowk Team',
  '["Artisan Gateaux","Pastries & Brownies","100% Pure Veg","Takeaway"]'::jsonb,
  'High-end retail destination in Aundh at Parihar Chowk, catering to discerning dessert lovers.',
  '/images/outlets/baner.jpg',
  true,
  '2023',
  'pune',
  'Aundh',
  '["cakestory-aundh"]'::jsonb,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  phone = EXCLUDED.phone,
  google_maps_url = EXCLUDED.google_maps_url,
  updated_at = NOW();

INSERT INTO public.franchises (id, slug, name, outlet_name, zone, address, city, state, country, latitude, longitude, phone, email, opening_hours, manager, services, description, image, active, established, city_slug, locality, legacy_slugs, google_maps_url)
VALUES (
  'franchise-053',
  'balewadi',
  'CakeStory Desserts — Balewadi High Street',
  'Balewadi High Street Link',
  'West Pune',
  'Shop No. 8, Balewadi High Street, Balewadi, Pune, Maharashtra 411045',
  'Pune',
  'Maharashtra',
  'India',
  18.5724,
  73.7735,
  '+91 98819 14444',
  'care@cakestorydesserts.com',
  '10:00 AM - 12:00 AM',
  'Balewadi High Street Link Team',
  '["Designer Pastries","Celebration Cakes","100% Pure Veg","Dine-In & Pickup"]'::jsonb,
  'Trendy Balewadi outlet offering celebration bakes and premium pastries until midnight.',
  '/images/outlets/baner.jpg',
  true,
  '2024',
  'pune',
  'Balewadi',
  '["cakestory-balewadi"]'::jsonb,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  phone = EXCLUDED.phone,
  google_maps_url = EXCLUDED.google_maps_url,
  updated_at = NOW();

INSERT INTO public.franchises (id, slug, name, outlet_name, zone, address, city, state, country, latitude, longitude, phone, email, opening_hours, manager, services, description, image, active, established, city_slug, locality, legacy_slugs, google_maps_url)
VALUES (
  'franchise-054',
  'dhanori',
  'CakeStory Desserts — Dhanori (Tingre Nagar)',
  'Tingre Nagar / Airport Link',
  'East Pune',
  'Near Dhanori Jakat Naka, Tingre Nagar Road, Dhanori, Pune, Maharashtra 411015',
  'Pune',
  'Maharashtra',
  'India',
  18.5791,
  73.8895,
  '+91 98819 14444',
  'care@cakestorydesserts.com',
  '10:00 AM - 11:00 PM',
  'Tingre Nagar Team',
  '["Celebration Cakes","Pure Veg Bakes","100% Pure Veg","Takeaway"]'::jsonb,
  'Positioned along the airport transit corridor in Dhanori, serving fresh daily bakes to growing residential enclaves.',
  '/images/outlets/viman-nagar.jpg',
  true,
  '2023',
  'pune',
  'Dhanori',
  '["cakestory-dhanori"]'::jsonb,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  phone = EXCLUDED.phone,
  google_maps_url = EXCLUDED.google_maps_url,
  updated_at = NOW();

INSERT INTO public.franchises (id, slug, name, outlet_name, zone, address, city, state, country, latitude, longitude, phone, email, opening_hours, manager, services, description, image, active, established, city_slug, locality, legacy_slugs, google_maps_url)
VALUES (
  'franchise-055',
  'vishrantwadi',
  'CakeStory Desserts — Vishrantwadi (Alandi Road)',
  'Alandi Road Chowk',
  'East Pune',
  'Shop No. 4, Tingre Complex, Alandi Road, Vishrantwadi, Pune, Maharashtra 411015',
  'Pune',
  'Maharashtra',
  'India',
  18.5645,
  73.8765,
  '+91 98819 14444',
  'care@cakestorydesserts.com',
  '10:00 AM - 11:00 PM',
  'Alandi Road Chowk Team',
  '["Celebration Cakes","100% Pure Veg","Party Packs","Instant Delivery"]'::jsonb,
  'Located at Vishrantwadi Chowk on Alandi Road, providing delicious eggless cakes to northern residential areas.',
  '/images/outlets/viman-nagar.jpg',
  true,
  '2023',
  'pune',
  'Vishrantwadi',
  '["cakestory-vishrantwadi"]'::jsonb,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  phone = EXCLUDED.phone,
  google_maps_url = EXCLUDED.google_maps_url,
  updated_at = NOW();

INSERT INTO public.franchises (id, slug, name, outlet_name, zone, address, city, state, country, latitude, longitude, phone, email, opening_hours, manager, services, description, image, active, established, city_slug, locality, legacy_slugs, google_maps_url)
VALUES (
  'franchise-056',
  'swargate',
  'CakeStory Desserts — Swargate (Mukund Nagar)',
  'Mukund Nagar / Tilak Road',
  'South Pune',
  'Shop No. 3, Mukund Nagar Corner, near Laxmi Narayan Theatre, Swargate, Pune, Maharashtra 411037',
  'Pune',
  'Maharashtra',
  'India',
  18.4985,
  73.8612,
  '+91 98819 14444',
  'care@cakestorydesserts.com',
  '9:30 AM - 11:00 PM',
  'Mukund Nagar Team',
  '["Traditional Celebrations","Gateaux & Pastries","100% Pure Veg","Takeaway"]'::jsonb,
  'Historic transit hub outlet at Swargate, serving central Pune families with pure veg celebration bakes.',
  '/images/outlets/bibwewadi.jpg',
  true,
  '2022',
  'pune',
  'Swargate',
  '["cakestory-swargate"]'::jsonb,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  phone = EXCLUDED.phone,
  google_maps_url = EXCLUDED.google_maps_url,
  updated_at = NOW();

INSERT INTO public.franchises (id, slug, name, outlet_name, zone, address, city, state, country, latitude, longitude, phone, email, opening_hours, manager, services, description, image, active, established, city_slug, locality, legacy_slugs, google_maps_url)
VALUES (
  'franchise-057',
  'sinhgad-road',
  'CakeStory Desserts — Sinhgad Road (Manik Baug)',
  'Manik Baug / Sinhgad Road',
  'South Pune',
  'Shop No. 5, Sinhgad Road, opposite Manik Baug Petrol Pump, Pune, Maharashtra 411051',
  'Pune',
  'Maharashtra',
  'India',
  18.4725,
  73.8214,
  '+91 98819 14444',
  'care@cakestorydesserts.com',
  '10:00 AM - 11:30 PM',
  'Manik Baug Team',
  '["Celebration Cakes","Custom Themed Bakes","100% Pure Veg","Pickup"]'::jsonb,
  'Busy Sinhgad Road boutique at Manik Baug, popular among local housing complexes for evening cake pickups.',
  '/images/outlets/bibwewadi.jpg',
  true,
  '2022',
  'pune',
  'Sinhgad Road',
  '["cakestory-sinhgad-road-manik-baug"]'::jsonb,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  phone = EXCLUDED.phone,
  google_maps_url = EXCLUDED.google_maps_url,
  updated_at = NOW();

INSERT INTO public.franchises (id, slug, name, outlet_name, zone, address, city, state, country, latitude, longitude, phone, email, opening_hours, manager, services, description, image, active, established, city_slug, locality, legacy_slugs, google_maps_url)
VALUES (
  'franchise-058',
  'powai-naka',
  'CakeStory Desserts — Satara (Powai Naka)',
  'Powai Naka Flagship Hub',
  'Satara',
  'shop 1 , Near By Rangoli Nursery, Kesarkar peth, Shahu Chouk, Satara -415 002, Satara, Maharashtra 415001',
  'Satara',
  'Maharashtra',
  'India',
  17.6854,
  73.9982,
  '+91 90965 17538',
  'care@cakestorydesserts.com',
  '9:30 AM - 10:30 PM',
  'Hemant Pakhale',
  '["Regional Flagship","Celebration Cakes","100% Pure Veg","Bulk Party Packs"]'::jsonb,
  'Satara City flagship outlet near Powai Naka, expanding CakeStory''s renowned quality across Western Maharashtra.',
  '/images/outlets/satara.jpg',
  true,
  '2023',
  'satara',
  'Powai Naka',
  '["cakestory-satara-powai-naka"]'::jsonb,
  'https://share.google/OV13EkVUXa6fdkKf7'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  phone = EXCLUDED.phone,
  google_maps_url = EXCLUDED.google_maps_url,
  updated_at = NOW();

INSERT INTO public.franchises (id, slug, name, outlet_name, zone, address, city, state, country, latitude, longitude, phone, email, opening_hours, manager, services, description, image, active, established, city_slug, locality, legacy_slugs, google_maps_url)
VALUES (
  'franchise-059',
  'highway-junction',
  'CakeStory Desserts — Satara (Bombay Restaurant Chowk)',
  'Highway Junction / NH48',
  'Satara',
  'Shop no.5 hotel pride executive jawal, Bombay Restorent Chowk, satara 415002',
  'Satara',
  'Maharashtra',
  'India',
  17.7012,
  74.0145,
  '+91 90965 17538',
  'care@cakestorydesserts.com',
  '9:00 AM - 11:00 PM',
  'hemant pakhale',
  '["Highway Gateway","Celebration Cakes","100% Pure Veg","Express Takeaway"]'::jsonb,
  'Highway transit retail boutique at Bombay Restaurant Chowk on NH48, serving travelers and regional residents.',
  '/images/outlets/satara.jpg',
  true,
  '2024',
  'satara',
  'Highway Junction',
  '["cakestory-satara-highway"]'::jsonb,
  'https://maps.app.goo.gl/Tf8vyvdvxvia2zEK7?g_st=awb'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  phone = EXCLUDED.phone,
  google_maps_url = EXCLUDED.google_maps_url,
  updated_at = NOW();

INSERT INTO public.franchises (id, slug, name, outlet_name, zone, address, city, state, country, latitude, longitude, phone, email, opening_hours, manager, services, description, image, active, established, city_slug, locality, legacy_slugs, google_maps_url)
VALUES (
  'franchise-060',
  'midc-hub',
  'CakeStory Desserts — Shirwal Corridor',
  'Shirwal MIDC Hub',
  'Satara',
  'shop no 1,sajswar building,near st stand,shirwal',
  'Shirwal',
  'Maharashtra',
  'India',
  18.1345,
  73.9875,
  '+91 99233 61189',
  'care@cakestorydesserts.com',
  '9:30 AM - 10:00 PM',
  'Rushikesh Bhargude',
  '["Industrial Hub","Celebration Cakes","100% Pure Veg","Pickup"]'::jsonb,
  'Connecting Pune and Satara industrial growth corridors with fresh pure vegetarian celebration cakes.',
  '/images/outlets/satara.jpg',
  true,
  '2024',
  'shirwal',
  'Shirwal',
  '["cakestory-shirwal"]'::jsonb,
  'https://maps.app.goo.gl/DgNhwfsGug56yomw8?g_st=aw'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  phone = EXCLUDED.phone,
  google_maps_url = EXCLUDED.google_maps_url,
  updated_at = NOW();

INSERT INTO public.franchises (id, slug, name, outlet_name, zone, address, city, state, country, latitude, longitude, phone, email, opening_hours, manager, services, description, image, active, established, city_slug, locality, legacy_slugs, google_maps_url)
VALUES (
  'franchise-061',
  'station-road',
  'CakeStory Desserts — Talegaon Dabhade',
  'Station Road / Talegaon',
  'PCMC',
  'Shop No. 2, Station Road, Talegaon Dabhade, Pune District, Maharashtra 410506',
  'Talegaon',
  'Maharashtra',
  'India',
  18.7324,
  73.6845,
  '+91 98819 14444',
  'care@cakestorydesserts.com',
  '10:00 AM - 10:30 PM',
  'Station Road Team',
  '["Celebration Cakes","100% Pure Veg","Family Bakes","Pickup"]'::jsonb,
  'Western Maharashtra regional expansion hub serving Talegaon and Old Mumbai-Pune Highway communities.',
  '/images/outlets/wakad.jpg',
  true,
  '2024',
  'talegaon',
  'Talegaon',
  '["cakestory-talegaon"]'::jsonb,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  phone = EXCLUDED.phone,
  google_maps_url = EXCLUDED.google_maps_url,
  updated_at = NOW();

INSERT INTO public.franchises (id, slug, name, outlet_name, zone, address, city, state, country, latitude, longitude, phone, email, opening_hours, manager, services, description, image, active, established, city_slug, locality, legacy_slugs, google_maps_url)
VALUES (
  'franchise-062',
  'ambethan-chowk',
  'CakeStory Desserts — Chakan (Ambethan Chowk)',
  'Ambethan Chowk / MIDC',
  'PCMC',
  'Shop No. 4, Ambethan Chowk, Chakan MIDC Road, Chakan, Maharashtra 410501',
  'Chakan',
  'Maharashtra',
  'India',
  18.7589,
  73.8582,
  '+91 98819 14444',
  'care@cakestorydesserts.com',
  '9:30 AM - 10:30 PM',
  'Ambethan Chowk Team',
  '["Industrial Events","Celebration Cakes","100% Pure Veg","Takeaway"]'::jsonb,
  'Serving automobile and engineering industrial corridors of Chakan with scheduled company events and celebrations.',
  '/images/outlets/chinchwad.jpg',
  true,
  '2024',
  'chakan',
  'Chakan',
  '["cakestory-chakan"]'::jsonb,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  phone = EXCLUDED.phone,
  google_maps_url = EXCLUDED.google_maps_url,
  updated_at = NOW();

INSERT INTO public.franchises (id, slug, name, outlet_name, zone, address, city, state, country, latitude, longitude, phone, email, opening_hours, manager, services, description, image, active, established, city_slug, locality, legacy_slugs, google_maps_url)
VALUES (
  'franchise-063',
  'jejuri',
  'CakeStory Desserts — Jejuri',
  'Jejuri',
  'South-East Corridor',
  'sai sameer building,main peth,near talathi office,jejuri',
  'Jejuri',
  'Maharashtra',
  'India',
  18.2778,
  74.1594,
  '+91 95035 29161',
  'care@cakestorydesserts.com',
  '10:00 AM - 11:30 PM',
  'Sourabh Thorat',
  '["Celebration Cakes","Artisanal Pastries","100% Pure Veg","Custom Orders","Takeaway"]'::jsonb,
  'Located in Main Peth near Talathi Office, Jejuri, offering fresh 100% pure veg cakes and custom celebration orders.',
  '/images/outlets/jejuri.jpg',
  true,
  '2023',
  'pune-rural',
  'Jejuri',
  '["cakestory-jejuri"]'::jsonb,
  'https://maps.app.goo.gl/tjyDHkiLnxfiA9C87?g_st=awb'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  phone = EXCLUDED.phone,
  google_maps_url = EXCLUDED.google_maps_url,
  updated_at = NOW();

INSERT INTO public.franchises (id, slug, name, outlet_name, zone, address, city, state, country, latitude, longitude, phone, email, opening_hours, manager, services, description, image, active, established, city_slug, locality, legacy_slugs, google_maps_url)
VALUES (
  'franchise-064',
  'nasrapur',
  'CakeStory Desserts — Nasrapur',
  'Nasrapur',
  'South Corridor',
  'Near Swapnlok Soc.Gate,nasrapur',
  'Nasrapur',
  'Maharashtra',
  'India',
  18.2562,
  73.9189,
  '+91 90964 35443',
  'care@cakestorydesserts.com',
  '10:00 AM - 11:30 PM',
  'Ajay Jagtap',
  '["Celebration Cakes","Artisanal Pastries","100% Pure Veg","Custom Orders","Takeaway"]'::jsonb,
  'Located near Swapnalok Society Gate, Nasrapur on the Pune-Satara highway corridor, serving fresh eggless celebration cakes.',
  '/images/outlets/nasrapur.jpg',
  true,
  '2023',
  'pune-rural',
  'Nasrapur',
  '["cakestory-nasrapur"]'::jsonb,
  ''
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  phone = EXCLUDED.phone,
  google_maps_url = EXCLUDED.google_maps_url,
  updated_at = NOW();

INSERT INTO public.franchises (id, slug, name, outlet_name, zone, address, city, state, country, latitude, longitude, phone, email, opening_hours, manager, services, description, image, active, established, city_slug, locality, legacy_slugs, google_maps_url)
VALUES (
  'franchise-065',
  'uruli-kanchan',
  'CakeStory Desserts — Uruli Kanchan',
  'Uruli Kanchan',
  'East Corridor',
  'Sarvadnya Heights,Shop no-7,Ashram Road,Uruli Kanchan',
  'Uruli Kanchan',
  'Maharashtra',
  'India',
  18.4839,
  74.1345,
  '+91 92090 76078',
  'care@cakestorydesserts.com',
  '10:00 AM - 11:30 PM',
  'Rishikesh kad',
  '["Celebration Cakes","Artisanal Pastries","100% Pure Veg","Custom Orders","Takeaway"]'::jsonb,
  'Situated at Sarvadnya Heights on Ashram Road, Uruli Kanchan, serving fresh artisanal cakes and desserts daily.',
  '/images/outlets/uruli-kanchan.jpg',
  true,
  '2023',
  'pune-rural',
  'Uruli Kanchan',
  '["cakestory-uruli-kanchan"]'::jsonb,
  'https://maps.app.goo.gl/beuKSkBobokJAkwo8?g_st=awb'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  phone = EXCLUDED.phone,
  google_maps_url = EXCLUDED.google_maps_url,
  updated_at = NOW();

INSERT INTO public.franchises (id, slug, name, outlet_name, zone, address, city, state, country, latitude, longitude, phone, email, opening_hours, manager, services, description, image, active, established, city_slug, locality, legacy_slugs, google_maps_url)
VALUES (
  'franchise-066',
  'khandala',
  'CakeStory Desserts — Khandala',
  'Khandala',
  'Satara District',
  'DCC bank Khandala,Satara Road,Khandala Bavada',
  'Khandala',
  'Maharashtra',
  'India',
  18.0667,
  74.0278,
  '+91 93073 45448',
  'care@cakestorydesserts.com',
  '10:00 AM - 11:30 PM',
  'Sachin Yadav',
  '["Celebration Cakes","Artisanal Pastries","100% Pure Veg","Custom Orders","Takeaway"]'::jsonb,
  'Located at DCC Bank, Satara Road, Khandala Bavada, bringing CakeStory''s pure vegetarian desserts to Khandala.',
  '/images/outlets/khandala.jpg',
  true,
  '2023',
  'satara',
  'Khandala',
  '["cakestory-khandala"]'::jsonb,
  'https://maps.app.goo.gl/x5C7FpuXS94GEigTA?g_st=aw'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  phone = EXCLUDED.phone,
  google_maps_url = EXCLUDED.google_maps_url,
  updated_at = NOW();

INSERT INTO public.franchises (id, slug, name, outlet_name, zone, address, city, state, country, latitude, longitude, phone, email, opening_hours, manager, services, description, image, active, established, city_slug, locality, legacy_slugs, google_maps_url)
VALUES (
  'franchise-067',
  'khed-shivapur',
  'CakeStory Desserts — Khed Shivapur',
  'Khed Shivapur',
  'South Corridor',
  'Shrikrushna Complex,Kondhanpur Phata,Shrimanagar,khed shivapur',
  'Khed Shivapur',
  'Maharashtra',
  'India',
  18.3483637,
  73.8506472,
  '+91 90964 35443',
  'care@cakestorydesserts.com',
  '10:00 AM - 11:30 PM',
  'Ajay Jagtap',
  '["Celebration Cakes","Artisanal Pastries","100% Pure Veg","Custom Orders","Takeaway"]'::jsonb,
  'Situated at Shrikrushna Complex, Kondhanpur Phata, Shrimanagar, Khed Shivapur, serving fresh handcrafted cakes daily.',
  '/images/outlets/khed-shivapur.jpg',
  true,
  '2023',
  'pune-rural',
  'Khed Shivapur',
  '["cakestory-khed-shivapur"]'::jsonb,
  'https://maps.app.goo.gl/h5E6c2ZJDFze9aEc8?g_st=awb'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  phone = EXCLUDED.phone,
  google_maps_url = EXCLUDED.google_maps_url,
  updated_at = NOW();

INSERT INTO public.franchises (id, slug, name, outlet_name, zone, address, city, state, country, latitude, longitude, phone, email, opening_hours, manager, services, description, image, active, established, city_slug, locality, legacy_slugs, google_maps_url)
VALUES (
  'franchise-068',
  'lonand',
  'CakeStory Desserts — Lonand',
  'Lonand',
  'Satara District',
  'SHOP NO.2,VIMALCHANDRA BUILDING LONAND SATARA ROAD, LONAND 415521',
  'Lonand',
  'Maharashtra',
  'India',
  18.0417,
  74.1925,
  '+91 93721 47147',
  'care@cakestorydesserts.com',
  '10:00 AM - 11:30 PM',
  'Suraj kodre',
  '["Celebration Cakes","Artisanal Pastries","100% Pure Veg","Custom Orders","Takeaway"]'::jsonb,
  'Located in Vimalchandra Building on Lonand-Satara Road, Lonand, offering 100% pure vegetarian cakes and pastries.',
  '/images/outlets/lonand.jpg',
  true,
  '2023',
  'satara',
  'Lonand',
  '["cakestory-lonand"]'::jsonb,
  'https://maps.app.goo.gl/qTafQaNMz7cjgXbu7?g_st=awb'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  phone = EXCLUDED.phone,
  google_maps_url = EXCLUDED.google_maps_url,
  updated_at = NOW();

