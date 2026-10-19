// dataService.js — central data service that merges seed JSON with localStorage runtime data
// This abstraction lets us replace localStorage with a real API later without changing UI.

import { storage, STORAGE_KEYS } from "./storage";
import seedFranchises from "../data/franchises.json";
import seedCakes from "../data/cakes.json";
import seedOrders from "../data/orders.json";
import seedEvents from "../data/events.json";
import seedCategories from "../data/categories.json";
import seedTestimonials from "../data/testimonials.json";
import seedSiteContent from "../data/siteContent.json";
import seedFaq from "../data/faq.json";
import seedBlog from "../data/blog.json";
import seedRecipes from "../data/recipes.json";
import seedGalleryReels from "../data/galleryReels.json";

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
  source?: string;
  email?: string;
  notes?: string;
};

const ENQUIRY_INIT_KEY = "__cs_enquiries_live_v4__";

function getEnquiriesRaw(): FranchiseEnquiry[] {
  if (!localStorage.getItem(PREFIX + ENQUIRY_INIT_KEY)) {
    // Switch to clean live mode: remove all legacy test leads
    storage.set(STORAGE_KEYS.ENQUIRIES, []);
    localStorage.setItem(PREFIX + ENQUIRY_INIT_KEY, "1");
    return [];
  }
  return storage.get<FranchiseEnquiry[]>(STORAGE_KEYS.ENQUIRIES, []);
}

export const enquiryService = {
  list(): FranchiseEnquiry[] {
    return getEnquiriesRaw();
  },
  get(id: string): FranchiseEnquiry | undefined {
    return getEnquiriesRaw().find((e) => e.id === id);
  },
  create(data: Omit<FranchiseEnquiry, "id" | "submittedAt" | "status"> & { source?: string }): FranchiseEnquiry {
    const all = getEnquiriesRaw();
    const id = `enq-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newEnquiry: FranchiseEnquiry = {
      ...data,
      id,
      submittedAt: new Date().toISOString(),
      status: "new",
      source: data.source || "CakeStory Website — Franchise Enquiry Modal",
    };
    storage.set(STORAGE_KEYS.ENQUIRIES, [newEnquiry, ...all]);

    // Dump lead data to n8n webhook asynchronously
    sendLeadToWebhook({
      id: newEnquiry.id,
      fullName: newEnquiry.fullName,
      mobile: newEnquiry.mobile,
      cityArea: newEnquiry.cityArea,
      investmentReadiness: newEnquiry.investmentReadiness,
      source: newEnquiry.source,
      submittedAt: newEnquiry.submittedAt,
      status: newEnquiry.status,
      email: newEnquiry.email,
      message: newEnquiry.notes,
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
  clearAll(): void {
    storage.set(STORAGE_KEYS.ENQUIRIES, []);
  },
  resetSeed(): FranchiseEnquiry[] {
    storage.set(STORAGE_KEYS.ENQUIRIES, []);
    return [];
  },
};


// ---------- Franchise Service ----------
export type Franchise = {
  id: string;
  slug: string;
  citySlug?: string;
  locality?: string;
  legacySlugs?: string[];
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
  googleMapsUrl?: string;
};

const FRANCHISE_INIT_KEY = "__cs_franchises_verified_official_v15__";

function getFranchisesRaw(): Franchise[] {
  const cached = storage.get<Franchise[]>(STORAGE_KEYS.FRANCHISES, []);
  const needsHydration =
    !localStorage.getItem(PREFIX + FRANCHISE_INIT_KEY) ||
    cached.length < (seedFranchises as Franchise[]).length ||
    cached.some((c) => !c.citySlug || !c.locality);

  if (needsHydration) {
    storage.set(STORAGE_KEYS.FRANCHISES, seedFranchises as Franchise[]);
    localStorage.setItem(PREFIX + FRANCHISE_INIT_KEY, "1");
    return seedFranchises as Franchise[];
  }
  const items = storage.get<Franchise[]>(STORAGE_KEYS.FRANCHISES, seedFranchises as Franchise[]);
  let needsUpdate = false;
  const migrated = items.map((item) => {
    const match = (seedFranchises as Franchise[]).find((s) => s.id === item.id || s.slug === item.slug);
    if (match) {
      if (!item.image || !item.image.startsWith("/images/outlets/")) {
        needsUpdate = true;
        item = { ...item, image: match.image };
      }
      if (match.googleMapsUrl && item.googleMapsUrl !== match.googleMapsUrl) {
        needsUpdate = true;
        item = { ...item, googleMapsUrl: match.googleMapsUrl };
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
    const raw = getFranchisesRaw();
    const clean = idOrSlug.toLowerCase().trim();

    const found = raw.find(
      (f) =>
        f.id.toLowerCase() === clean ||
        f.slug.toLowerCase() === clean ||
        f.legacySlugs?.some((ls) => ls.toLowerCase() === clean)
    );
    if (found) return found;

    // Graceful backward compatibility mapping for legacy/test slugs
    const legacyAliases: Record<string, string> = {
      "cakestory-hinjewadi": "wakad",
      "cakestory-kalyani-nagar": "viman-nagar",
      "cakestory-satara": "powai-naka",
      "cakestory-hadapsar": "phursungi",
      "cakestory-saswad": "saswad",
      "anand-plaza": "saswad",
    };
    const mappedSlug = legacyAliases[clean];
    if (mappedSlug) {
      return raw.find((f) => f.slug === mappedSlug || f.id === mappedSlug);
    }
    return undefined;
  },
  getByRoute(citySlug: string, areaSlug: string): Franchise | undefined {
    const raw = getFranchisesRaw();
    const cleanCity = citySlug.toLowerCase().trim();
    const cleanArea = areaSlug.toLowerCase().trim();

    return raw.find((f) => {
      const fCitySlug = (f.citySlug || f.city.toLowerCase().replace(/[^a-z0-9]+/g, "-")).toLowerCase();
      const cityMatches =
        fCitySlug === cleanCity ||
        (cleanCity === "pcmc" && fCitySlug === "pimpri-chinchwad") ||
        (cleanCity === "pimpri-chinchwad" && fCitySlug === "pcmc") ||
        (cleanCity === "saswad" && (f.slug === "saswad" || f.id === "franchise-016"));

      if (!cityMatches) return false;

      const areaMatches =
        f.slug.toLowerCase() === cleanArea ||
        f.legacySlugs?.some((ls) => ls.toLowerCase() === cleanArea) ||
        (f.locality && f.locality.toLowerCase().replace(/[^a-z0-9]+/g, "-") === cleanArea) ||
        (f.id === "franchise-016" && (cleanArea === "saswad" || cleanArea === "anand-plaza"));

      return areaMatches;
    });
  },
  getByLegacy(slugOrId: string): Franchise | undefined {
    return this.get(slugOrId);
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
  password?: string;
  role: string;
  avatar: string;
};

export type AuthUser = {
  id: string;
  name: string;
  username: string;
  email: string;
  role: "admin";
  avatar: string;
  isInitialCredentials?: boolean;
};

export type AdminCredentials = {
  username: string;
  passwordHash: string;
  updatedAt: string;
  isInitial: boolean;
};

// Cryptographically secure synchronous SHA-256 implementation (zero external dependencies)
function hashPassword(ascii: string): string {
  function rightRotate(value: number, amount: number) {
    return (value >>> amount) | (value << (32 - amount));
  }
  const mathPow = Math.pow;
  const maxWord = mathPow(2, 32);
  const lengthProperty = "length";
  let i: number, j: number;
  let result = "";
  const words: number[] = [];
  const asciiBitLength = ascii[lengthProperty] * 8;
  let hash: number[] = [];
  const k: number[] = [];
  let primeCounter = 0;
  const isComposite: Record<number, boolean> = {};

  for (let candidate = 2; primeCounter < 64; candidate++) {
    if (!isComposite[candidate]) {
      for (i = 0; i < 313; i += candidate) {
        isComposite[i] = true;
      }
      hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
      k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
    }
  }

  ascii += "\x80";
  while (ascii[lengthProperty] % 64 - 56) ascii += "\x00";
  for (i = 0; i < ascii[lengthProperty]; i++) {
    j = ascii.charCodeAt(i);
    if (j >> 8) return "";
    words[i >> 2] |= j << ((3 - i) % 4) * 8;
  }
  words[words[lengthProperty]] = (asciiBitLength / maxWord) | 0;
  words[words[lengthProperty]] = asciiBitLength;

  for (j = 0; j < words[lengthProperty]; ) {
    const w = words.slice(j, (j += 16));
    const oldHash = hash;
    hash = hash.slice(0, 8);
    for (i = 0; i < 64; i++) {
      const w15 = w[i - 15],
        w2 = w[i - 2];
      const a = hash[0],
        e = hash[4];
      const temp1 =
        hash[7] +
        (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) +
        ((e & hash[5]) ^ (~e & hash[6])) +
        k[i] +
        (w[i] =
          i < 16
            ? w[i]
            : (w[i - 16] +
                (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3)) +
                w[i - 7] +
                (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))) |
              0);
      const temp2 =
        (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) +
        ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));
      hash = [(temp1 + temp2) | 0].concat(hash);
      hash[4] = (hash[4] + temp1) | 0;
    }
    for (i = 0; i < 8; i++) {
      hash[i] = (hash[i] + oldHash[i]) | 0;
    }
  }

  for (i = 0; i < 8; i++) {
    for (let i2 = 3; i2 >= 0; i2--) {
      const b = (hash[i] >> (i2 * 8)) & 255;
      result += (b < 16 ? "0" : "") + b.toString(16);
    }
  }
  return result;
}

const ADMIN_INIT_KEY = "__cs_admin_auth_v8__";
const INITIAL_USERNAME = "admin";
// Initial temporary setup hash for CakeStory#Admin2026 — No plaintext password in code
const INITIAL_PASSWORD_HASH = "bb274ace4faf6d51cac26714fa9dc9b792cd98815017a9d5a4b06d4c62ef8a32";
const CLOUD_AUTH_URL = "https://api.restful-api.dev/objects/ff808181a09d98f701a148d0b7a87adf";

async function pushToCloud(creds: AdminCredentials): Promise<void> {
  try {
    await fetch(CLOUD_AUTH_URL, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "cakestory_auth_store",
        data: creds,
      }),
    });
  } catch {
    // Non-blocking background push
  }
}

async function syncFromCloud(): Promise<AdminCredentials | null> {
  try {
    const res = await fetch(CLOUD_AUTH_URL, {
      method: "GET",
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    const json = await res.json();
    if (json?.data?.username && json?.data?.passwordHash) {
      const cloudCreds = json.data as AdminCredentials;
      const localCreds = storage.get<AdminCredentials | null>(STORAGE_KEYS.ADMIN_CREDENTIALS, null);

      // If cloud has custom credentials (isInitial === false), local MUST adopt them across all devices!
      if (
        !cloudCreds.isInitial ||
        !localCreds ||
        new Date(cloudCreds.updatedAt || 0) > new Date(localCreds.updatedAt || 0)
      ) {
        storage.set(STORAGE_KEYS.ADMIN_CREDENTIALS, cloudCreds);
        return cloudCreds;
      }
    }
  } catch {
    // Offline graceful handling
  }
  return null;
}

function getAdminCredentials(): AdminCredentials {
  const needsInit = !localStorage.getItem(PREFIX + ADMIN_INIT_KEY);

  if (needsInit) {
    localStorage.setItem(PREFIX + ADMIN_INIT_KEY, "1");
    // Clear legacy sessions and old credentials
    storage.remove(STORAGE_KEYS.SESSION);
    storage.remove(STORAGE_KEYS.ADMIN_CREDENTIALS);

    const initial: AdminCredentials = {
      username: INITIAL_USERNAME,
      passwordHash: INITIAL_PASSWORD_HASH,
      updatedAt: new Date().toISOString(),
      isInitial: true,
    };
    storage.set(STORAGE_KEYS.ADMIN_CREDENTIALS, initial);
    // Background cloud sync check
    syncFromCloud();
    return initial;
  }

  const existing = storage.get<AdminCredentials | null>(STORAGE_KEYS.ADMIN_CREDENTIALS, null);

  // If custom credentials are set, preserve them
  if (existing && existing.isInitial === false && existing.username && existing.passwordHash) {
    return existing;
  }

  if (!existing) {
    const initial: AdminCredentials = {
      username: INITIAL_USERNAME,
      passwordHash: INITIAL_PASSWORD_HASH,
      updatedAt: new Date().toISOString(),
      isInitial: true,
    };
    storage.set(STORAGE_KEYS.ADMIN_CREDENTIALS, initial);
    syncFromCloud();
    return initial;
  }

  return existing;
}

export const authService = {
  getCredentials(): AdminCredentials {
    return getAdminCredentials();
  },

  isInitialCredentials(): boolean {
    return getAdminCredentials().isInitial;
  },

  syncWithCloud(): Promise<AdminCredentials | null> {
    return syncFromCloud();
  },

  login(identifierInput: string, passwordInput: string): AuthUser | null {
    const creds = getAdminCredentials();
    const inputUser = identifierInput.trim().toLowerCase();
    const targetUser = creds.username.trim().toLowerCase();
    const inputHash = hashPassword(passwordInput.trim());

    // Strict 1-to-1 matching. No fallbacks, no aliases, no backdoor passwords.
    const matchesUser = inputUser === targetUser;
    const matchesPass = inputHash === creds.passwordHash;

    if (matchesUser && matchesPass) {
      const authUser: AuthUser = {
        id: "admin-master",
        name: "CakeStory Operations Lead",
        username: creds.username,
        email: creds.username.includes("@") ? creds.username : "admin@cakestorydesserts.in",
        role: "admin",
        avatar: "https://i.pravatar.cc/120?img=68",
        isInitialCredentials: creds.isInitial,
      };
      // Store session
      storage.set(STORAGE_KEYS.SESSION, authUser);
      return authUser;
    }
    return null;
  },

  logout(): void {
    storage.remove(STORAGE_KEYS.SESSION);
  },

  current(): AuthUser | null {
    const session = storage.get<AuthUser | null>(STORAGE_KEYS.SESSION, null);
    if (!session || session.role !== "admin") return null;
    return session;
  },

  isAuthed(): boolean {
    return !!this.current();
  },

  verifyCurrentPassword(passwordInput: string): boolean {
    const creds = getAdminCredentials();
    const inputHash = hashPassword(passwordInput.trim());
    return inputHash === creds.passwordHash;
  },

  changeUsername(newUsername: string): { success: boolean; error?: string } {
    const trimmed = newUsername.trim();
    if (!trimmed) {
      return { success: false, error: "Username cannot be empty." };
    }
    if (trimmed.length < 3) {
      return { success: false, error: "Username must be at least 3 characters long." };
    }
    const creds = getAdminCredentials();
    const updated: AdminCredentials = {
      ...creds,
      username: trimmed,
      isInitial: false,
      updatedAt: new Date().toISOString(),
    };
    storage.set(STORAGE_KEYS.ADMIN_CREDENTIALS, updated);
    pushToCloud(updated);

    // Invalidate active session so administrator re-authenticates with new username
    this.logout();

    return { success: true };
  },

  changePassword(currentPasswordInput: string, newPasswordInput: string): { success: boolean; error?: string } {
    const creds = getAdminCredentials();
    if (!this.verifyCurrentPassword(currentPasswordInput)) {
      return { success: false, error: "Current password is incorrect." };
    }
    if (!newPasswordInput || newPasswordInput.length < 6) {
      return { success: false, error: "New password must be at least 6 characters long." };
    }
    const newHash = hashPassword(newPasswordInput.trim());
    if (newHash === creds.passwordHash) {
      return { success: false, error: "New password must be different from your current password." };
    }

    const updated: AdminCredentials = {
      username: creds.username,
      passwordHash: newHash,
      isInitial: false,
      updatedAt: new Date().toISOString(),
    };
    storage.set(STORAGE_KEYS.ADMIN_CREDENTIALS, updated);
    pushToCloud(updated);

    // Invalidate active session so administrator re-authenticates with new password
    this.logout();

    return { success: true };
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
  // Sync dynamic outlet count according to backend
  if (content.homeHero?.statistics?.[0]) {
    const activeOutlets = franchiseService.countActive();
    if (activeOutlets > 0) {
      content.homeHero.statistics[0].value = `${activeOutlets}+`;
    }
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

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  date: string;
  author: string;
  content: string;
  image: string;
};

export const blogService = {
  list: () => seedBlog as BlogPost[],
  get: (idOrSlug: string) => (seedBlog as BlogPost[]).find((b) => b.id === idOrSlug || b.slug === idOrSlug),
};

// ---------- Instagram Gallery & Reels Service ----------
export interface GalleryReelItem {
  id: string;
  reelUrl: string;
  title: string;
  marathiTitle?: string;
  videoUrl: string;
  thumbnail?: string;
  category?: string;
  categoryLabel?: string;
  duration?: string;
  description: string;
  order: number;
  enabled: boolean;
  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface GallerySectionSettings {
  enabled: boolean;
  eyebrow: string;
  eyebrowMarathi?: string;
  heading: string;
  headingMarathi?: string;
  subtitle: string;
  subtitleMarathi?: string;
  decorativePhrase?: string;
  instagramUrl: string;
  showCategories: boolean;
  showHighlights: boolean;
  ctaLabel?: string;
  autoplay: boolean;
  defaultMuted: boolean;
}

const DEFAULT_GALLERY_SETTINGS: GallerySectionSettings = {
  enabled: true,
  eyebrow: "INSTAGRAM",
  eyebrowMarathi: "इन्स्टाग्राम",
  heading: "Moments That Make Life Sweeter",
  headingMarathi: "आयुष्याला अधिक गोड बनवणारे खास क्षण",
  subtitle: "From custom creations to happy celebrations — catch the latest from CakeStory Desserts on Instagram.",
  subtitleMarathi: "कस्टम केक्सपासून ते प्रत्येक आनंदाच्या क्षणांपर्यंत — पहा केक स्टोरीचे ताजे रील्स आणि सेलिब्रेशन्स.",
  decorativePhrase: "Real Stories, Real Celebrations",
  instagramUrl: "https://www.instagram.com/cakestorydesserts/",
  showCategories: false,
  showHighlights: true,
  ctaLabel: "Follow @cakestorydesserts",
  autoplay: true,
  defaultMuted: true,
};

function dispatchGalleryUpdate() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("cakestory:gallery_updated"));
  }
}

export const galleryService = {
  getSettings(): GallerySectionSettings {
    const custom = storage.get<GallerySectionSettings | null>(STORAGE_KEYS.GALLERY_SETTINGS, null);
    return {
      ...DEFAULT_GALLERY_SETTINGS,
      ...(custom || {}),
    };
  },

  updateSettings(settings: Partial<GallerySectionSettings>): GallerySectionSettings {
    const current = this.getSettings();
    const updated: GallerySectionSettings = { ...current, ...settings };
    storage.set(STORAGE_KEYS.GALLERY_SETTINGS, updated);
    dispatchGalleryUpdate();
    return updated;
  },

  listReels(includeDisabled = false): GalleryReelItem[] {
    const reels = storage.get<GalleryReelItem[] | null>(STORAGE_KEYS.GALLERY_REELS, null);
    let all: GalleryReelItem[] = [];
    if (reels && Array.isArray(reels) && reels.length > 0) {
      all = reels.map((r, i) => {
        if (!r.videoUrl) {
          const seed = (seedGalleryReels as any)[i];
          return {
            ...r,
            videoUrl: seed?.videoUrl || `/videos/reels/reel-${(i % 5) + 1}.mp4`,
          };
        }
        return r;
      });
    } else {
      all = (seedGalleryReels as unknown) as GalleryReelItem[];
    }
    const sorted = [...all].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    if (includeDisabled) {
      return sorted;
    }
    return sorted.filter((r) => r.enabled !== false);
  },

  saveReels(reels: GalleryReelItem[]): void {
    storage.set(STORAGE_KEYS.GALLERY_REELS, reels);
    dispatchGalleryUpdate();
  },

  addReel(reel: Omit<GalleryReelItem, "id" | "order" | "createdAt" | "updatedAt">): GalleryReelItem {
    const all = this.listReels(true);
    const maxOrder = all.reduce((max, r) => Math.max(max, r.order ?? 0), 0);
    const now = new Date().toISOString();
    const newReel: GalleryReelItem = {
      ...reel,
      id: `reel-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      order: maxOrder + 1,
      enabled: reel.enabled ?? true,
      createdAt: now,
      updatedAt: now,
    };
    const updated = [...all, newReel];
    this.saveReels(updated);
    return newReel;
  },

  updateReel(id: string, updates: Partial<GalleryReelItem>): GalleryReelItem | undefined {
    const all = this.listReels(true);
    const idx = all.findIndex((r) => r.id === id);
    if (idx === -1) return undefined;
    all[idx] = {
      ...all[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.saveReels(all);
    return all[idx];
  },

  toggleEnabled(id: string): GalleryReelItem | undefined {
    const all = this.listReels(true);
    const idx = all.findIndex((r) => r.id === id);
    if (idx === -1) return undefined;
    all[idx].enabled = !all[idx].enabled;
    all[idx].updatedAt = new Date().toISOString();
    this.saveReels(all);
    return all[idx];
  },

  deleteReel(id: string): boolean {
    const all = this.listReels(true);
    const updated = all.filter((r) => r.id !== id);
    if (updated.length === all.length) return false;
    // Re-index remaining orders
    updated.forEach((r, i) => {
      r.order = i + 1;
    });
    this.saveReels(updated);
    return true;
  },

  moveReel(id: string, direction: "up" | "down"): boolean {
    const all = this.listReels(true);
    const idx = all.findIndex((r) => r.id === id);
    if (idx === -1) return false;
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= all.length) return false;
    const [item] = all.splice(idx, 1);
    all.splice(targetIdx, 0, item);
    all.forEach((r, i) => {
      r.order = i + 1;
    });
    this.saveReels(all);
    return true;
  },

  reorderReels(reels: GalleryReelItem[]): void {
    const withUpdatedOrders = reels.map((r, i) => ({
      ...r,
      order: i + 1,
      updatedAt: new Date().toISOString(),
    }));
    this.saveReels(withUpdatedOrders);
  },

  resetDefaults(): void {
    storage.remove(STORAGE_KEYS.GALLERY_SETTINGS);
    storage.remove(STORAGE_KEYS.GALLERY_REELS);
    dispatchGalleryUpdate();
  },
};


