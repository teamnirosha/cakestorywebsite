// dataService.js — central data service that merges seed JSON with localStorage runtime data
// This abstraction lets us replace localStorage with a real API later without changing UI.

import { storage, STORAGE_KEYS } from "./storage";
import seedFranchises from "../data/franchises.json";
import seedCakes from "../data/cakes.json";
import seedOrders from "../data/orders.json";
import seedUsers from "../data/users.json";
import seedEvents from "../data/events.json";
import seedCategories from "../data/categories.json";
import seedTestimonials from "../data/testimonials.json";
import seedSiteContent from "../data/siteContent.json";
import seedEnquiries from "../data/enquiries.json";
import seedFaq from "../data/faq.json";
import seedBlog from "../data/blog.json";
import seedRecipes from "../data/recipes.json";

import { sendLeadToWebhook } from "./webhook";

const PREFIX = "cakestory:";

// ---------- Franchise Enquiry Service ----------
export type FranchiseEnquiry = {
  id: string;
  fullName: string;
  mobile: string;
  cityArea: string;
  investmentReadiness: "Ready to invest immediately" | "Within 3 months" | "Within 6 months" | "Just exploring";
  submittedAt: string;
  status: "new" | "contacted" | "qualified" | "closed";
};

const ENQUIRY_INIT_KEY = "__cs_enquiries_seeded__";

function getEnquiriesRaw(): FranchiseEnquiry[] {
  if (!localStorage.getItem(PREFIX + ENQUIRY_INIT_KEY)) {
    storage.set(STORAGE_KEYS.ENQUIRIES, seedEnquiries as FranchiseEnquiry[]);
    localStorage.setItem(PREFIX + ENQUIRY_INIT_KEY, "1");
  }
  return storage.get<FranchiseEnquiry[]>(STORAGE_KEYS.ENQUIRIES, seedEnquiries as FranchiseEnquiry[]);
}

export const enquiryService = {
  list(): FranchiseEnquiry[] {
    return getEnquiriesRaw();
  },
  get(id: string): FranchiseEnquiry | undefined {
    return getEnquiriesRaw().find((e) => e.id === id);
  },
  create(data: Omit<FranchiseEnquiry, "id" | "submittedAt" | "status">): FranchiseEnquiry {
    const all = getEnquiriesRaw();
    const id = `enq-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newEnquiry: FranchiseEnquiry = {
      ...data,
      id,
      submittedAt: new Date().toISOString(),
      status: "new",
    };
    storage.set(STORAGE_KEYS.ENQUIRIES, [newEnquiry, ...all]);

    // Dump lead data to n8n webhook asynchronously
    sendLeadToWebhook({
      ...newEnquiry,
      source: "CakeStory Website — Franchise Enquiry Modal",
    });

    return newEnquiry;
  },
  updateStatus(id: string, status: FranchiseEnquiry["status"]): FranchiseEnquiry | undefined {
    const all = getEnquiriesRaw();
    const idx = all.findIndex((e) => e.id === id);
    if (idx === -1) return undefined;
    all[idx].status = status;
    storage.set(STORAGE_KEYS.ENQUIRIES, all);
    return all[idx];
  },
  remove(id: string): boolean {
    const all = getEnquiriesRaw();
    const next = all.filter((e) => e.id !== id);
    storage.set(STORAGE_KEYS.ENQUIRIES, next);
    return next.length < all.length;
  },
  count(): number {
    return getEnquiriesRaw().length;
  },
  countNew(): number {
    return getEnquiriesRaw().filter((e) => e.status === "new").length;
  },
};


// ---------- Franchise Service ----------
export type Franchise = {
  id: string;
  slug: string;
  name: string;
  outletName: string;
  zone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
  phone: string;
  email: string;
  openingHours: string;
  manager?: string;
  services: string[];
  description: string;
  image?: string;
  active: boolean;
  established?: string;
};

const FRANCHISE_INIT_KEY = "__cs_franchises_official_branding_v7__";

function getFranchisesRaw(): Franchise[] {
  if (!localStorage.getItem(PREFIX + FRANCHISE_INIT_KEY)) {
    storage.set(STORAGE_KEYS.FRANCHISES, seedFranchises as Franchise[]);
    localStorage.setItem(PREFIX + FRANCHISE_INIT_KEY, "1");
  }
  const items = storage.get<Franchise[]>(STORAGE_KEYS.FRANCHISES, seedFranchises as Franchise[]);
  let needsUpdate = false;
  const migrated = items.map((item) => {
    if (!item.image || !item.image.startsWith("/images/outlets/")) {
      const match = (seedFranchises as Franchise[]).find((s) => s.id === item.id || s.slug === item.slug);
      if (match && match.image) {
        needsUpdate = true;
        return { ...item, image: match.image };
      }
    }
    return item;
  });
  if (needsUpdate) {
    storage.set(STORAGE_KEYS.FRANCHISES, migrated);
    return migrated;
  }
  return items;
}

export const franchiseService = {
  list(): Franchise[] {
    return getFranchisesRaw();
  },
  listActive(): Franchise[] {
    return getFranchisesRaw().filter((f) => f.active);
  },
  get(idOrSlug: string): Franchise | undefined {
    return getFranchisesRaw().find((f) => f.id === idOrSlug || f.slug === idOrSlug);
  },
  create(data: Omit<Franchise, "id">): Franchise {
    const all = getFranchisesRaw();
    const id = `franchise-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const slug = data.slug?.trim() || data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const newFranchise: Franchise = { ...data, id, slug };
    storage.set(STORAGE_KEYS.FRANCHISES, [newFranchise, ...all]);
    return newFranchise;
  },
  update(id: string, data: Partial<Franchise>): Franchise | undefined {
    const all = getFranchisesRaw();
    const idx = all.findIndex((f) => f.id === id);
    if (idx === -1) return undefined;
    const updated = { ...all[idx], ...data, id };
    all[idx] = updated;
    storage.set(STORAGE_KEYS.FRANCHISES, all);
    return updated;
  },
  toggleActive(id: string): Franchise | undefined {
    const f = this.get(id);
    if (!f) return undefined;
    return this.update(id, { active: !f.active });
  },
  remove(id: string): boolean {
    const all = getFranchisesRaw();
    const next = all.filter((f) => f.id !== id);
    storage.set(STORAGE_KEYS.FRANCHISES, next);
    return next.length < all.length;
  },
  count(): number {
    return getFranchisesRaw().length;
  },
  countActive(): number {
    return getFranchisesRaw().filter((f) => f.active).length;
  },
  zones(): string[] {
    const found = Array.from(new Set(getFranchisesRaw().map((f) => f.zone).filter(Boolean)));
    return found.length ? found.sort() : ["West Pune", "East Pune", "South Pune", "PCMC", "Satara"];
  },
  cities(): string[] {
    return Array.from(new Set(getFranchisesRaw().map((f) => f.city))).sort();
  },
  resetToSeed(): void {
    storage.set(STORAGE_KEYS.FRANCHISES, seedFranchises as Franchise[]);
  },
};

// ---------- Cake Service ----------
export type Cake = {
  id: string;
  name: string;
  category: string;
  categoryId: string;
  description: string;
  price: number;
  image: string;
  ingredients: string[];
  flavor: string;
  size: string;
  availability: string;
  featured: boolean;
  tags: string[];
  rating: number;
  color: string;
  status?: "active" | "inactive";
};

const CAKE_INIT_KEY = "__cs_cakes_real_assets_v2__";

function getCakesRaw(): Cake[] {
  if (!localStorage.getItem(PREFIX + CAKE_INIT_KEY)) {
    storage.set(STORAGE_KEYS.CAKES, seedCakes as Cake[]);
    localStorage.setItem(PREFIX + CAKE_INIT_KEY, "1");
  }
  return storage.get<Cake[]>(STORAGE_KEYS.CAKES, seedCakes as Cake[]);
}

export const cakeService = {
  list(): Cake[] {
    return getCakesRaw();
  },
  featured(): Cake[] {
    return getCakesRaw().filter((c) => c.featured);
  },
  get(id: string): Cake | undefined {
    return getCakesRaw().find((c) => c.id === id);
  },
  byCategory(categoryId: string): Cake[] {
    if (categoryId === "all") return this.list();
    return getCakesRaw().filter((c) => c.categoryId === categoryId);
  },
  count(): number {
    return getCakesRaw().length;
  },
  search(query: string): Cake[] {
    const q = query.toLowerCase().trim();
    if (!q) return this.list();
    return getCakesRaw().filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.flavor.toLowerCase().includes(q) ||
        c.tags.some((t) => t.toLowerCase().includes(q))
    );
  },
  create(data: Omit<Cake, "id">): Cake {
    const all = getCakesRaw();
    const id = `cake-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const categoryId = data.categoryId || `cat-${data.category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
    const newCake: Cake = {
      ...data,
      id,
      categoryId,
      status: data.status || "active",
      rating: data.rating ?? 4.8,
      ingredients: data.ingredients || ["Central Production Standard Sponge", "Whipped Dairy Cream"],
      flavor: data.flavor || data.name,
      size: data.size || "500g / 1kg",
      availability: data.availability || (data.status === "inactive" ? "out-of-stock" : "in-stock"),
      featured: data.featured ?? false,
      tags: data.tags || ["signature", "eggless"],
      color: data.color || "pink",
    };
    storage.set(STORAGE_KEYS.CAKES, [newCake, ...all]);
    return newCake;
  },
  update(id: string, data: Partial<Cake>): Cake | undefined {
    const all = getCakesRaw();
    const idx = all.findIndex((c) => c.id === id);
    if (idx === -1) return undefined;
    const updated = { ...all[idx], ...data, id };
    if (data.status) {
      updated.availability = data.status === "active" ? "in-stock" : "out-of-stock";
    }
    all[idx] = updated;
    storage.set(STORAGE_KEYS.CAKES, all);
    return updated;
  },
  delete(id: string): boolean {
    const all = getCakesRaw();
    const filtered = all.filter((c) => c.id !== id);
    if (filtered.length === all.length) return false;
    storage.set(STORAGE_KEYS.CAKES, filtered);
    return true;
  },
  toggleStatus(id: string): Cake | undefined {
    const cake = this.get(id);
    if (!cake) return undefined;
    const currentIsActive = cake.status ? cake.status === "active" : cake.availability !== "out-of-stock";
    const nextStatus: "active" | "inactive" = currentIsActive ? "inactive" : "active";
    return this.update(id, {
      status: nextStatus,
      availability: nextStatus === "active" ? "in-stock" : "out-of-stock",
    });
  },
};

// ---------- Recipe Service ----------
export type Recipe = {
  id: string;
  name: string;
  code: string;
  category: string;
  image: string;
  batchYield: string;
  prepTime: string;
  bakeTime: string;
  difficulty: string;
  description: string;
  ingredients: string[];
  sopSteps: string[];
};

const RECIPE_INIT_KEY = "__cs_recipes_seeded_v1__";

function getRecipesRaw(): Recipe[] {
  if (!localStorage.getItem(PREFIX + RECIPE_INIT_KEY)) {
    storage.set(STORAGE_KEYS.RECIPES, seedRecipes as Recipe[]);
    localStorage.setItem(PREFIX + RECIPE_INIT_KEY, "1");
  }
  return storage.get<Recipe[]>(STORAGE_KEYS.RECIPES, seedRecipes as Recipe[]);
}

export const recipeService = {
  list(): Recipe[] {
    return getRecipesRaw();
  },
  get(id: string): Recipe | undefined {
    return getRecipesRaw().find((r) => r.id === id);
  },
  byCategory(category: string): Recipe[] {
    if (!category || category === "all") return this.list();
    return getRecipesRaw().filter((r) => r.category.toLowerCase().includes(category.toLowerCase()));
  },
  count(): number {
    return getRecipesRaw().length;
  },
  resetSeed(): void {
    storage.set(STORAGE_KEYS.RECIPES, seedRecipes as Recipe[]);
  },
};

// ---------- Order Service ----------
export type Order = {
  id: string;
  customer: string;
  items: number;
  total: number;
  status: "delivered" | "in-transit" | "preparing" | "cancelled";
  date: string;
  outlet: string;
};

const ORDER_INIT_KEY = "__cs_orders_seeded__";

function getOrdersRaw(): Order[] {
  if (!localStorage.getItem(PREFIX + ORDER_INIT_KEY)) {
    storage.set(STORAGE_KEYS.ORDERS, seedOrders as Order[]);
    localStorage.setItem(PREFIX + ORDER_INIT_KEY, "1");
  }
  return storage.get<Order[]>(STORAGE_KEYS.ORDERS, seedOrders as Order[]);
}

export const orderService = {
  list(): Order[] {
    return getOrdersRaw();
  },
  recent(n: number = 5): Order[] {
    return getOrdersRaw().slice(0, n);
  },
  stats() {
    const orders = getOrdersRaw();
    return {
      total: orders.length,
      delivered: orders.filter((o) => o.status === "delivered").length,
      inTransit: orders.filter((o) => o.status === "in-transit").length,
      preparing: orders.filter((o) => o.status === "preparing").length,
      revenue: orders.reduce((s, o) => s + o.total, 0),
    };
  },
};

// ---------- User / Auth Service ----------
export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  avatar: string;
};

export const authService = {
  login(email: string, password: string): User | null {
    const user = (seedUsers as User[]).find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (user) {
      const session = { ...user, password: undefined };
      storage.set(STORAGE_KEYS.SESSION, session);
      return user;
    }
    return null;
  },
  logout(): void {
    storage.remove(STORAGE_KEYS.SESSION);
  },
  current(): (User & { password?: string }) | null {
    return storage.get<User | null>(STORAGE_KEYS.SESSION, null);
  },
  isAuthed(): boolean {
    return !!this.current();
  },
};

// ---------- Cart Service ----------
export type CartItem = {
  id: string;
  type: "cake" | "custom";
  name: string;
  price: number;
  quantity: number;
  image: string;
  meta?: Record<string, any>;
};

export const cartService = {
  list(): CartItem[] {
    return storage.get<CartItem[]>(STORAGE_KEYS.CART, []);
  },
  add(item: Omit<CartItem, "quantity">, quantity: number = 1): CartItem[] {
    const cart = this.list();
    const existing = cart.find((c) => c.id === item.id && JSON.stringify(c.meta) === JSON.stringify(item.meta));
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({ ...item, quantity });
    }
    storage.set(STORAGE_KEYS.CART, cart);
    return cart;
  },
  update(id: string, quantity: number): CartItem[] {
    const cart = this.list();
    const item = cart.find((c) => c.id === id);
    if (item) {
      if (quantity <= 0) {
        return this.remove(id);
      }
      item.quantity = quantity;
      storage.set(STORAGE_KEYS.CART, cart);
    }
    return cart;
  },
  remove(id: string): CartItem[] {
    const cart = this.list().filter((c) => c.id !== id);
    storage.set(STORAGE_KEYS.CART, cart);
    return cart;
  },
  clear(): void {
    storage.set(STORAGE_KEYS.CART, []);
  },
  count(): number {
    return this.list().reduce((s, c) => s + c.quantity, 0);
  },
  total(): number {
    return this.list().reduce((s, c) => s + c.price * c.quantity, 0);
  },
};

// ---------- Wishlist Service ----------
export const wishlistService = {
  list(): string[] {
    return storage.get<string[]>(STORAGE_KEYS.WISHLIST, []);
  },
  toggle(id: string): string[] {
    const list = this.list();
    const idx = list.indexOf(id);
    if (idx >= 0) {
      list.splice(idx, 1);
    } else {
      list.push(id);
    }
    storage.set(STORAGE_KEYS.WISHLIST, list);
    return list;
  },
  has(id: string): boolean {
    return this.list().includes(id);
  },
};

// ---------- Static catalog services ----------
export const categoryService = {
  list: () => seedCategories as Array<{ id: string; name: string; icon: string; color: string }>,
};

export const eventService = {
  list: () => seedEvents as Array<any>,
  featured: () => (seedEvents as Array<any>).filter((e) => e.featured),
  get: (id: string) => (seedEvents as Array<any>).find((e) => e.id === id),
};

export const testimonialService = {
  list: () => seedTestimonials as Array<any>,
};

// ---------- Site / Home Content Service ----------
export type HeroStatistic = {
  id: string;
  value: string;
  label: string;
  description?: string;
  active: boolean;
};

export type HeroSupportingCard = {
  id: string;
  icon: string;
  title: string;
  description: string;
  active: boolean;
};

export type HeroFloatingBadge = {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  position: "top-left" | "bottom-right";
  active: boolean;
};

export type HomeHeroContent = {
  badgeText: string;
  headingPrefix: string;
  headingHighlight: string;
  description: string;
  primaryCta: {
    label: string;
    action: "modal" | "link";
    link?: string;
  };
  secondaryCta: {
    label: string;
    link: string;
  };
  statistics: HeroStatistic[];
  supportingCards: HeroSupportingCard[];
  floatingBadges: HeroFloatingBadge[];
  visual: {
    type: "3d" | "image";
    imageAsset?: string;
    caption?: string;
  };
};

export type CoreStrengthCard = {
  id: string;
  icon: string;
  title: string;
  description: string;
  active: boolean;
};

export type CoreStrengthsContent = {
  badge: string;
  title: string;
  subtitle: string;
  cards: CoreStrengthCard[];
};

export type StoryHeroContent = {
  imageAsset: string;
  caption?: string;
};

export type FranchiseHeroContent = {
  imageAsset: string;
  caption?: string;
};

export type SiteContent = {
  brand: {
    name: string;
    tagline: string;
    city: string;
    state: string;
    established?: string;
    description?: string;
  };
  homeHero: HomeHeroContent;
  storyHero?: StoryHeroContent;
  franchiseHero?: FranchiseHeroContent;
  coreStrengths: CoreStrengthsContent;
  stats?: Record<string, any>;
};

const SITE_CONTENT_INIT_KEY = "__cs_site_content_franchise_treats_v9__";

function getSiteContentRaw(): SiteContent {
  if (!localStorage.getItem(PREFIX + SITE_CONTENT_INIT_KEY)) {
    storage.set(STORAGE_KEYS.SITE_CONTENT, seedSiteContent as unknown as SiteContent);
    localStorage.setItem(PREFIX + SITE_CONTENT_INIT_KEY, "1");
  }
  const content = storage.get<SiteContent>(STORAGE_KEYS.SITE_CONTENT, seedSiteContent as unknown as SiteContent);
  // Ensure real images and new hero entries are present
  if (
    content.homeHero?.visual?.type === ("3d" as any) ||
    !content.homeHero?.visual?.imageAsset ||
    content.homeHero?.visual?.imageAsset === "14.JPG"
  ) {
    content.homeHero.visual.type = "image";
    content.homeHero.visual.imageAsset = "/images/hero-cake.jpg";
    content.homeHero.visual.caption = "Signature Handcrafted CakeStory Desserts Celebration Cake";
  }
  if (!content.storyHero) {
    content.storyHero = (seedSiteContent as any).storyHero || {
      imageAsset: "AZ_01460.JPG",
      caption: "Central Kitchen Craftsmanship & Fresh Gourmet Ingredients",
    };
  }
  if (!content.franchiseHero || content.franchiseHero.imageAsset === "1.jpg") {
    content.franchiseHero = {
      imageAsset: "/images/franchise-hero.png",
      caption: "CakeStory Desserts Premium Packaged Treats & Festive Retail Collection",
    };
  }
  return content;
}

export const contentService = {
  get(): SiteContent {
    return getSiteContentRaw();
  },
  save(updated: SiteContent): SiteContent {
    storage.set(STORAGE_KEYS.SITE_CONTENT, updated);
    return updated;
  },
  updateHero(partialHero: Partial<HomeHeroContent>): SiteContent {
    const current = getSiteContentRaw();
    const next: SiteContent = {
      ...current,
      homeHero: {
        ...current.homeHero,
        ...partialHero,
      },
    };
    storage.set(STORAGE_KEYS.SITE_CONTENT, next);
    return next;
  },
  updateStoryHero(partialStory: Partial<StoryHeroContent>): SiteContent {
    const current = getSiteContentRaw();
    const next: SiteContent = {
      ...current,
      storyHero: {
        ...(current.storyHero || { imageAsset: "AZ_01460.JPG", caption: "Central Kitchen Craftsmanship & Fresh Gourmet Ingredients" }),
        ...partialStory,
      },
    };
    storage.set(STORAGE_KEYS.SITE_CONTENT, next);
    return next;
  },
  updateFranchiseHero(partialFranchise: Partial<FranchiseHeroContent>): SiteContent {
    const current = getSiteContentRaw();
    const next: SiteContent = {
      ...current,
      franchiseHero: {
        ...(current.franchiseHero || { imageAsset: "1.jpg", caption: "High-Demand Signature Retail Cakes for Pune Outlets" }),
        ...partialFranchise,
      },
    };
    storage.set(STORAGE_KEYS.SITE_CONTENT, next);
    return next;
  },
  updateCoreStrengths(partialCS: Partial<CoreStrengthsContent>): SiteContent {
    const current = getSiteContentRaw();
    const next: SiteContent = {
      ...current,
      coreStrengths: {
        ...current.coreStrengths,
        ...partialCS,
      },
    };
    storage.set(STORAGE_KEYS.SITE_CONTENT, next);
    return next;
  },
  resetSeed(): void {
    storage.set(STORAGE_KEYS.SITE_CONTENT, seedSiteContent as unknown as SiteContent);
  },
};

export const faqService = {
  list: () => seedFaq as Array<{ id: string; category: string; question: string; answer: string }>,
  categories: () => Array.from(new Set(seedFaq.map((f: any) => f.category))),
};

export const blogService = {
  list: () => seedBlog as Array<{ id: string; title: string; slug: string; excerpt: string; date: string; author: string; content: string; image: string }>,
  get: (idOrSlug: string) => seedBlog.find((b: any) => b.id === idOrSlug || b.slug === idOrSlug),
};
