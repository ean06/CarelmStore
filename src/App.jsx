import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  LayoutDashboard, Users, CalendarDays, Wrench, Wallet, Boxes, Cog, TrendingUp,
  BarChart3, Map, ClipboardList, StickyNote, Settings as SettingsIcon,
  Plus, X, Search, Sun, Moon, Trash2, Pencil, ChevronRight, ChevronDown,
  AlertTriangle, CheckCircle2, Circle, Star, Crown, Heart, Sparkles,
  ArrowUpRight, ArrowDownRight, Menu, Download, Upload, ExternalLink,
  Package, ShoppingCart, Phone, MapPin, Clock,
  DollarSign, Filter, Image as ImageIcon, MoreHorizontal, Zap
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

/* ===================== THEME ===================== */
const DARK = {
  bg: "#0A0C0E", surface: "#131619", surface2: "#1B1F23", surface3: "#22262B",
  border: "#262B31", borderStrong: "#33393F", text: "#ECEEF0", textDim: "#9AA1AA",
  textFaint: "#5F656D", accent: "#2FD9C4", accentDim: "#123832", accent2: "#F2A93B",
  accent2Dim: "#3A2A10", danger: "#F0645F", dangerDim: "#3A1414", success: "#3ED598",
  successDim: "#0F2E22", shadow: "0 1px 2px rgba(0,0,0,0.4)",
};
const LIGHT = {
  bg: "#F5F6F7", surface: "#FFFFFF", surface2: "#F1F2F4", surface3: "#E9EBED",
  border: "#E3E5E8", borderStrong: "#D2D5DA", text: "#14171B", textDim: "#6B7280",
  textFaint: "#9CA3AF", accent: "#0E9C8C", accentDim: "#DFF5F1", accent2: "#C67B14",
  accent2Dim: "#FBEDD9", danger: "#D1403B", dangerDim: "#FBE6E5", success: "#1E9A63",
  successDim: "#E4F5EC", shadow: "0 1px 2px rgba(20,23,27,0.06)",
};

const NAV = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "customers", label: "Customers", icon: Users },
  { key: "bookings", label: "Bookings", icon: CalendarDays },
  { key: "services", label: "Services", icon: Wrench },
  { key: "finance", label: "Finance", icon: Wallet },
  { key: "inventory", label: "Inventory", icon: Boxes },
  { key: "equipment", label: "Equipment", icon: Cog },
  { key: "investment", label: "Investment", icon: TrendingUp },
  { key: "analytics", label: "Business Analytics", icon: BarChart3 },
  { key: "roadmap", label: "Growth Roadmap", icon: Map },
  { key: "dailyops", label: "Daily Operations", icon: ClipboardList },
  { key: "notes", label: "Notes", icon: StickyNote },
  { key: "settings", label: "Settings", icon: SettingsIcon },
];

const EXPENSE_CATEGORIES = ["Equipment", "Chemical", "Packaging", "Marketing", "Transportation", "Utilities", "Miscellaneous"];
const INCOME_CATEGORIES = ["Service Revenue", "Product Sales", "Other Income"];

const SHOPPING_LIST_SEED = [
  { name: "Perlengkapan Detailing #1", url: "https://vt.tokopedia.com/t/ZS9h1qx2768fJ-CrY0s/" },
  { name: "Perlengkapan Detailing #2", url: "https://vt.tokopedia.com/t/ZS9h1qsWxVT6E-xY4aU/" },
  { name: "Perlengkapan Detailing #3", url: "https://vt.tokopedia.com/t/ZS9h1qv7D8fYQ-9u4bK/" },
  { name: "Perlengkapan Detailing #4", url: "https://vt.tokopedia.com/t/ZS9h1qKdc6Hwx-JHWJj/" },
  { name: "Perlengkapan Detailing #5", url: "https://vt.tokopedia.com/t/ZS9h1q3FhjaKw-cgr1y/" },
  { name: "Perlengkapan Detailing #6", url: "https://vt.tokopedia.com/t/ZS9h1b1xN43NF-REIl0/" },
  { name: "Perlengkapan Detailing #7", url: "https://vt.tokopedia.com/t/ZS9h1be6tgWQF-INLGw/" },
  { name: "Perlengkapan Detailing #8", url: "https://vt.tokopedia.com/t/ZS9h1bRSMERxF-kVwCf/" },
  { name: "Perlengkapan Detailing #9 (Shopee)", url: "https://id.shp.ee/W1F2aq7D" },
].map((it, i) => ({
  id: "sl_" + i, name: it.name, url: it.url, category: "Chemical", priority: "Medium",
  price: 0, status: "not_purchased", supplier: "", purchaseDate: "", notes: "",
}));

const SERVICE_SEED = [
  { id: "sv_1", name: "Helmet Wash", price: 25000, estTime: 20, description: "Cuci helm standar, luar & dalam.", requiredProducts: "Foam cleaner, microfiber", addons: "", profitMargin: 60 },
  { id: "sv_2", name: "Deep Wash", price: 45000, estTime: 40, description: "Cuci menyeluruh termasuk busa/padding.", requiredProducts: "Foam cleaner, leather cleaner, microfiber", addons: "Pengharum helm", profitMargin: 55 },
  { id: "sv_3", name: "Helmet Polish", price: 60000, estTime: 45, description: "Polishing shell agar mengkilap.", requiredProducts: "Polish compound, microfiber", addons: "", profitMargin: 50 },
  { id: "sv_4", name: "Scratch Removal", price: 75000, estTime: 60, description: "Menghilangkan baret ringan-sedang.", requiredProducts: "Polish compound, sanding kit", addons: "", profitMargin: 45 },
  { id: "sv_5", name: "Premium Detailing", price: 120000, estTime: 90, description: "Paket lengkap: deep wash + polish + coating dasar.", requiredProducts: "Semua bahan", addons: "Visor cleaning", profitMargin: 50 },
  { id: "sv_6", name: "Visor Cleaning", price: 15000, estTime: 10, description: "Pembersihan & anti fog visor.", requiredProducts: "Glass cleaner, microfiber", addons: "", profitMargin: 65 },
];

const INVENTORY_SEED = [
  { id: "iv_1", name: "Foam Cleaner", category: "Chemical", currentStock: 0, minStock: 2, unit: "botol", purchasePrice: 45000, supplier: "", usagePerService: 0.1 },
  { id: "iv_2", name: "Microfiber Cloth", category: "Consumable", currentStock: 0, minStock: 5, unit: "pcs", purchasePrice: 15000, supplier: "", usagePerService: 0.2 },
  { id: "iv_3", name: "Leather Cleaner", category: "Chemical", currentStock: 0, minStock: 1, unit: "botol", purchasePrice: 55000, supplier: "", usagePerService: 0.08 },
  { id: "iv_4", name: "Polish Compound", category: "Chemical", currentStock: 0, minStock: 1, unit: "kaleng", purchasePrice: 65000, supplier: "", usagePerService: 0.05 },
  { id: "iv_5", name: "Glass Cleaner", category: "Chemical", currentStock: 0, minStock: 1, unit: "botol", purchasePrice: 35000, supplier: "", usagePerService: 0.06 },
];

const INVESTMENT_SEED = [
  { id: "in_1", name: "Rotary Polisher Machine", category: "Equipment", priority: "High", estimatedCost: 2500000, targetDate: "", reason: "Mempercepat proses polishing & meningkatkan hasil akhir.", businessImpact: "High - meningkatkan kapasitas & kualitas layanan premium.", currentProgress: 0, status: "Planned" },
];

const ROADMAP_STAGES = [
  { id: "rm_1", stage: 1, title: "Get first 10 customers", requirement: "10 total pelanggan", budget: 0, targetDate: "", auto: "customers10" },
  { id: "rm_2", stage: 2, title: "50 customers", requirement: "50 total pelanggan", budget: 0, targetDate: "", auto: "customers50" },
  { id: "rm_3", stage: 3, title: "100 customers", requirement: "100 total pelanggan", budget: 0, targetDate: "", auto: "customers100" },
  { id: "rm_4", stage: 4, title: "Buy Rotary Polisher", requirement: "Danai & beli Rotary Polisher Machine", budget: 2500000, targetDate: "", auto: "investment" },
  { id: "rm_5", stage: 5, title: "Professional Studio", requirement: "Sewa/bangun tempat usaha profesional", budget: 0, targetDate: "", auto: null },
  { id: "rm_6", stage: 6, title: "Hire first employee", requirement: "Rekrut karyawan pertama", budget: 0, targetDate: "", auto: null },
  { id: "rm_7", stage: 7, title: "Expand to multiple branches", requirement: "Buka cabang kedua", budget: 0, targetDate: "", auto: null },
];

const DAILY_OPENING = ["Prepare chemicals", "Prepare towels", "Check equipment", "Clean workspace", "Inventory check", "Review today's bookings"];
const DAILY_CLOSING = ["Clean tools", "Update inventory", "Financial closing", "Photo backup", "Prepare tomorrow's schedule"];

const DEFAULT_STATE = {
  settings: {
    businessName: "Carelm Store", logoText: "CS", address: "", whatsapp: "", instagram: "",
    pricingNote: "", currency: "IDR", theme: "dark",
  },
  customers: [],
  bookings: [],
  services: SERVICE_SEED,
  transactions: [],
  inventory: INVENTORY_SEED,
  equipment: [],
  shoppingList: SHOPPING_LIST_SEED,
  investments: INVESTMENT_SEED,
  roadmapProgress: {},
  dailyOps: { date: "", opening: {}, closing: {} },
  notes: [],
};

/* ===================== HELPERS ===================== */
let _uidCounter = 0;
function uid(prefix = "id") { _uidCounter += 1; return `${prefix}_${Date.now().toString(36)}${_uidCounter}`; }
function cn(...a) { return a.filter(Boolean).join(" "); }
function fmtIDR(n) {
  const v = Number(n) || 0;
  return "Rp " + Math.round(v).toLocaleString("id-ID");
}
function fmtNum(n) { return Math.round(Number(n) || 0).toLocaleString("id-ID"); }
function todayStr() { return new Date().toISOString().slice(0, 10); }
function monthKeyOf(dateStr) { return (dateStr || "").slice(0, 7); }
function fmtDate(d) {
  if (!d) return "-";
  try {
    return new Date(d + "T00:00:00").toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
  } catch { return d; }
}
function monthLabel(mk) {
  if (!mk) return "-";
  const [y, m] = mk.split("-");
  const names = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];
  return names[parseInt(m, 10) - 1] + " " + y;
}
function last6Months() {
  const out = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    out.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  }
  return out;
}

if (typeof window !== "undefined" && !window.storage) {
  window.storage = {
    get: async (key) => {
      try {
        const val = localStorage.getItem(key);
        return val !== null ? { value: val } : null;
      } catch { return null; }
    },
    set: async (key, value) => {
      try { localStorage.setItem(key, value); } catch {}
    },
    remove: async (key) => {
      try { localStorage.removeItem(key); } catch {}
    },
  };
}

/* ===================== SUPABASE CLOUD SYNC ===================== */
// Table <-> app-state key map, plus camelCase <-> snake_case row transforms.
const CLOUD_TABLES = {
  customers: {
    stateKey: "customers",
    toDb: (r) => ({ id: r.id, name: r.name, phone: r.phone, instagram: r.instagram, motorcycle: r.motorcycle, helmet_brand: r.helmetBrand, helmet_type: r.helmetType, helmet_color: r.helmetColor, purchase_date: r.purchaseDate || null, address: r.address, notes: r.notes, customer_since: r.customerSince || null, referral: !!r.referral }),
    fromDb: (d) => ({ id: d.id, name: d.name || "", phone: d.phone || "", instagram: d.instagram || "", motorcycle: d.motorcycle || "", helmetBrand: d.helmet_brand || "", helmetType: d.helmet_type || "", helmetColor: d.helmet_color || "", purchaseDate: d.purchase_date || "", address: d.address || "", notes: d.notes || "", customerSince: d.customer_since || "", referral: !!d.referral }),
  },
  services: {
    stateKey: "services",
    toDb: (r) => ({ id: r.id, name: r.name, price: r.price, est_time: r.estTime, description: r.description, required_products: r.requiredProducts, addons: r.addons, profit_margin: r.profitMargin }),
    fromDb: (d) => ({ id: d.id, name: d.name || "", price: d.price || 0, estTime: d.est_time || 0, description: d.description || "", requiredProducts: d.required_products || "", addons: d.addons || "", profitMargin: d.profit_margin || 0 }),
  },
  bookings: {
    stateKey: "bookings",
    toDb: (r) => ({ id: r.id, customer_id: r.customerId || null, date: r.date || null, time: r.time, service: r.service, price: r.price, status: r.status, payment_status: r.paymentStatus, notes: r.notes }),
    fromDb: (d) => ({ id: d.id, customerId: d.customer_id || "", date: d.date || "", time: d.time || "", service: d.service || "", price: d.price || 0, status: d.status || "Pending", paymentStatus: d.payment_status || "Unpaid", notes: d.notes || "" }),
  },
  transactions: {
    stateKey: "transactions",
    toDb: (r) => ({ id: r.id, type: r.type, category: r.category, amount: r.amount, date: r.date || null, note: r.note }),
    fromDb: (d) => ({ id: d.id, type: d.type, category: d.category || "", amount: d.amount || 0, date: d.date || "", note: d.note || "" }),
  },
  inventory_items: {
    stateKey: "inventory",
    toDb: (r) => ({ id: r.id, name: r.name, category: r.category, current_stock: r.currentStock, min_stock: r.minStock, unit: r.unit, purchase_price: r.purchasePrice, supplier: r.supplier, usage_per_service: r.usagePerService }),
    fromDb: (d) => ({ id: d.id, name: d.name || "", category: d.category || "", currentStock: d.current_stock || 0, minStock: d.min_stock || 0, unit: d.unit || "", purchasePrice: d.purchase_price || 0, supplier: d.supplier || "", usagePerService: d.usage_per_service || 0 }),
  },
  equipment: {
    stateKey: "equipment",
    toDb: (r) => ({ id: r.id, name: r.name, status: r.status, purchase_date: r.purchaseDate || null, purchase_price: r.purchasePrice, lifetime_months: r.lifetimeMonths, condition: r.condition, maintenance_schedule: r.maintenanceSchedule, warranty: r.warranty }),
    fromDb: (d) => ({ id: d.id, name: d.name || "", status: d.status || "Active", purchaseDate: d.purchase_date || "", purchasePrice: d.purchase_price || 0, lifetimeMonths: d.lifetime_months || 0, condition: d.condition || "Good", maintenanceSchedule: d.maintenance_schedule || "", warranty: d.warranty || "" }),
  },
  shopping_list: {
    stateKey: "shoppingList",
    toDb: (r) => ({ id: r.id, name: r.name, url: r.url, category: r.category, priority: r.priority, price: r.price, status: r.status, supplier: r.supplier, purchase_date: r.purchaseDate || null, notes: r.notes }),
    fromDb: (d) => ({ id: d.id, name: d.name || "", url: d.url || "", category: d.category || "", priority: d.priority || "Medium", price: d.price || 0, status: d.status || "not_purchased", supplier: d.supplier || "", purchaseDate: d.purchase_date || "", notes: d.notes || "" }),
  },
  investments: {
    stateKey: "investments",
    toDb: (r) => ({ id: r.id, name: r.name, category: r.category, priority: r.priority, estimated_cost: r.estimatedCost, target_date: r.targetDate || null, reason: r.reason, business_impact: r.businessImpact, current_progress: r.currentProgress, status: r.status }),
    fromDb: (d) => ({ id: d.id, name: d.name || "", category: d.category || "", priority: d.priority || "Medium", estimatedCost: d.estimated_cost || 0, targetDate: d.target_date || "", reason: d.reason || "", businessImpact: d.business_impact || "", currentProgress: d.current_progress || 0, status: d.status || "Planned" }),
  },
  notes: {
    stateKey: "notes",
    toDb: (r) => ({ id: r.id, title: r.title, content: r.content, pinned: !!r.pinned }),
    fromDb: (d) => ({ id: d.id, title: d.title || "", content: d.content || "", pinned: !!d.pinned, updatedAt: d.updated_at }),
  },
};

function decodeJwt(token) {
  try {
    const payload = token.split(".")[1];
    const json = decodeURIComponent(atob(payload.replace(/-/g, "+").replace(/_/g, "/")).split("").map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0")).join(""));
    return JSON.parse(json);
  } catch { return null; }
}

async function sbRequest(cfg, path, options = {}) {
  const headers = {
    apikey: cfg.anonKey,
    Authorization: `Bearer ${options.token || cfg.session?.access_token || cfg.anonKey}`,
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  const res = await fetch(`${cfg.url.replace(/\/$/, "")}${path}`, { ...options, headers });
  if (!res.ok) {
    let msg = res.statusText;
    try { const j = await res.json(); msg = j.error_description || j.msg || j.message || msg; } catch {}
    throw new Error(msg);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

async function sbSignUp(cfg, email, password) {
  return sbRequest(cfg, "/auth/v1/signup", { method: "POST", body: JSON.stringify({ email, password }) });
}
async function sbSignIn(cfg, email, password) {
  return sbRequest(cfg, "/auth/v1/token?grant_type=password", { method: "POST", body: JSON.stringify({ email, password }) });
}
async function sbRefresh(cfg, refresh_token) {
  return sbRequest(cfg, "/auth/v1/token?grant_type=refresh_token", { method: "POST", body: JSON.stringify({ refresh_token }) });
}

async function mirrorSyncTable(cfg, table, def, appState, uid) {
  const rows = appState[def.stateKey] || [];
  if (rows.length > 0) {
    const dbRows = rows.map((r) => ({ ...def.toDb(r), user_id: uid }));
    await sbRequest(cfg, `/rest/v1/${table}?on_conflict=id`, {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify(dbRows),
    });
    const ids = rows.map((r) => r.id).join(",");
    await sbRequest(cfg, `/rest/v1/${table}?user_id=eq.${uid}&id=not.in.(${ids})`, { method: "DELETE", headers: { Prefer: "return=minimal" } });
  } else {
    await sbRequest(cfg, `/rest/v1/${table}?user_id=eq.${uid}`, { method: "DELETE", headers: { Prefer: "return=minimal" } });
  }
}

async function pushAllToCloud(cfg, appState) {
  const uid = decodeJwt(cfg.session.access_token)?.sub;
  for (const [table, def] of Object.entries(CLOUD_TABLES)) {
    await mirrorSyncTable(cfg, table, def, appState, uid);
  }
  const kvRows = [
    { user_id: uid, key: "settings", value: appState.settings },
    { user_id: uid, key: "dailyOps", value: appState.dailyOps },
    { user_id: uid, key: "roadmapProgress", value: appState.roadmapProgress || {} },
  ];
  await sbRequest(cfg, `/rest/v1/app_kv?on_conflict=user_id,key`, {
    method: "POST", headers: { Prefer: "resolution=merge-duplicates,return=minimal" }, body: JSON.stringify(kvRows),
  });
}

// Data "milik user" yang menandakan cloud sudah pernah diisi (bukan sekadar seed default).
const USER_DATA_KEYS = ["customers", "bookings", "transactions", "notes", "equipment"];

function hasLocalUserData(appState) {
  return USER_DATA_KEYS.some((k) => Array.isArray(appState[k]) && appState[k].length > 0);
}
function isCloudUserDataEmpty(pulledState) {
  return USER_DATA_KEYS.every((k) => !Array.isArray(pulledState[k]) || pulledState[k].length === 0);
}

async function pullAllFromCloud(cfg) {
  const next = { ...DEFAULT_STATE };
  for (const [table, def] of Object.entries(CLOUD_TABLES)) {
    const rows = await sbRequest(cfg, `/rest/v1/${table}?select=*&order=created_at.asc`, { method: "GET" });
    next[def.stateKey] = (rows || []).map(def.fromDb);
  }
  const kv = await sbRequest(cfg, `/rest/v1/app_kv?select=*`, { method: "GET" });
  (kv || []).forEach((row) => {
    if (row.key === "settings") next.settings = { ...DEFAULT_STATE.settings, ...row.value };
    if (row.key === "dailyOps") next.dailyOps = row.value;
    if (row.key === "roadmapProgress") next.roadmapProgress = row.value;
  });
  return next;
}

function useCloud() {
  const [cfg, setCfg] = useState(null); // { url, anonKey, session }
  const [status, setStatus] = useState("idle"); // idle | connecting | connected | error
  const [error, setError] = useState("");
  const [cfgLoaded, setCfgLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await window.storage.get("sb_auth", false);
        if (res && res.value) {
          const parsed = JSON.parse(res.value);
          setCfg(parsed);
          if (parsed.session?.access_token) setStatus("connected");
        }
      } catch {}
      setCfgLoaded(true);
    })();
  }, []);

  const persistCfg = async (next) => {
    setCfg(next);
    try { await window.storage.set("sb_auth", JSON.stringify(next), false); } catch {}
  };

  const signIn = async (url, anonKey, email, password) => {
    setStatus("connecting"); setError("");
    try {
      const base = { url, anonKey, session: null };
      const session = await sbSignIn(base, email, password);
      if (!session?.access_token) throw new Error("Login gagal, periksa email/password.");
      await persistCfg({ url, anonKey, session });
      setStatus("connected");
      return true;
    } catch (e) { setError(e.message || "Gagal terhubung"); setStatus("error"); return false; }
  };

  const signUp = async (url, anonKey, email, password) => {
    setStatus("connecting"); setError("");
    try {
      const base = { url, anonKey, session: null };
      const res = await sbSignUp(base, email, password);
      if (res?.access_token) {
        await persistCfg({ url, anonKey, session: res });
        setStatus("connected");
        return { ok: true, needsConfirm: false };
      }
      setStatus("idle");
      return { ok: true, needsConfirm: true };
    } catch (e) { setError(e.message || "Gagal mendaftar"); setStatus("error"); return { ok: false }; }
  };

  const disconnect = async () => { await persistCfg(null); setStatus("idle"); };

  const ensureFreshToken = async () => {
    if (!cfg?.session) return cfg;
    const payload = decodeJwt(cfg.session.access_token);
    const expiresInMs = payload ? payload.exp * 1000 - Date.now() : -1;
    if (expiresInMs > 60000) return cfg;
    try {
      const refreshed = await sbRefresh(cfg, cfg.session.refresh_token);
      const next = { ...cfg, session: refreshed };
      await persistCfg(next);
      return next;
    } catch (e) { setStatus("error"); setError("Sesi berakhir, silakan login lagi."); return cfg; }
  };

  return { cfg, status, error, cfgLoaded, signIn, signUp, disconnect, ensureFreshToken, setError };
}

/* ===================== STORAGE HOOK ===================== */
function useAppState() {
  const [state, setState] = useState(DEFAULT_STATE);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await window.storage.get("appstate", false);
        if (!cancelled && res && res.value) {
          const parsed = JSON.parse(res.value);
          setState({ ...DEFAULT_STATE, ...parsed, settings: { ...DEFAULT_STATE.settings, ...(parsed.settings || {}) } });
        }
      } catch (e) {
        /* no saved state yet, keep defaults */
      } finally {
        if (!cancelled) setLoaded(true);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const t = setTimeout(async () => {
      try { await window.storage.set("appstate", JSON.stringify(state), false); }
      catch (e) { /* ignore save errors */ }
    }, 300);
    return () => clearTimeout(t);
  }, [state, loaded]);

  return [state, setState, loaded];
}

/* ===================== UI ATOMS ===================== */
function useTheme(themeName) { return themeName === "light" ? LIGHT : DARK; }

function Btn({ children, onClick, variant = "default", size = "md", icon: Icon, T, style, disabled, type = "button" }) {
  const pad = size === "sm" ? "6px 10px" : size === "icon" ? "8px" : "9px 14px";
  const base = {
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
    padding: pad, borderRadius: 9, fontSize: 13, fontWeight: 500, cursor: disabled ? "not-allowed" : "pointer",
    border: "1px solid transparent", transition: "all .15s ease", whiteSpace: "nowrap",
    opacity: disabled ? 0.5 : 1,
  };
  const variants = {
    default: { background: T.accent, color: "#04211D", border: `1px solid ${T.accent}` },
    ghost: { background: "transparent", color: T.text, border: `1px solid ${T.border}` },
    subtle: { background: T.surface2, color: T.text, border: `1px solid ${T.border}` },
    danger: { background: "transparent", color: T.danger, border: `1px solid ${T.dangerDim}` },
  };
  return (
    <button type={type} disabled={disabled} onClick={onClick} style={{ ...base, ...variants[variant], ...style }}>
      {Icon && <Icon size={14} />}
      {children}
    </button>
  );
}

function IconBtn({ icon: Icon, onClick, T, title, danger }) {
  return (
    <button title={title} onClick={onClick} style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center", width: 30, height: 30,
      borderRadius: 8, border: `1px solid ${T.border}`, background: T.surface2,
      color: danger ? T.danger : T.textDim, cursor: "pointer",
    }}>
      <Icon size={14} />
    </button>
  );
}

function Card({ children, T, style, padding = 18 }) {
  return (
    <div style={{
      background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14,
      padding, boxShadow: T.shadow, ...style,
    }}>
      {children}
    </div>
  );
}

function Stat({ label, value, sub, T, accent, icon: Icon, shine }) {
  return (
    <div style={{
      position: "relative", overflow: "hidden", background: T.surface, border: `1px solid ${T.border}`,
      borderRadius: 14, padding: "16px 18px", boxShadow: T.shadow,
    }}>
      {shine && (
        <div style={{
          position: "absolute", top: 0, left: "-60%", width: "50%", height: "100%",
          background: `linear-gradient(100deg, transparent, ${T.accent}22, transparent)`,
          animation: "shineSweep 3.2s ease-in-out infinite",
        }} />
      )}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <span style={{ fontSize: 12.5, color: T.textDim, fontWeight: 500 }}>{label}</span>
        {Icon && <Icon size={15} style={{ color: accent ? T.accent : T.textFaint }} />}
      </div>
      <div style={{ fontSize: 22, fontWeight: 600, color: T.text, fontFamily: "var(--mono)", letterSpacing: -0.3 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: T.textDim, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function Badge({ children, tone = "neutral", T }) {
  const tones = {
    neutral: { bg: T.surface2, fg: T.textDim, bd: T.border },
    accent: { bg: T.accentDim, fg: T.accent, bd: T.accentDim },
    amber: { bg: T.accent2Dim, fg: T.accent2, bd: T.accent2Dim },
    danger: { bg: T.dangerDim, fg: T.danger, bd: T.dangerDim },
    success: { bg: T.successDim, fg: T.success, bd: T.successDim },
  };
  const t = tones[tone] || tones.neutral;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 600,
      padding: "3px 8px", borderRadius: 999, background: t.bg, color: t.fg, border: `1px solid ${t.bd}`,
      textTransform: "uppercase", letterSpacing: 0.3,
    }}>{children}</span>
  );
}

function Empty({ title, sub, T, icon: Icon, action }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "56px 20px", textAlign: "center", color: T.textDim,
    }}>
      {Icon && <div style={{
        width: 44, height: 44, borderRadius: 12, background: T.surface2, display: "flex",
        alignItems: "center", justifyContent: "center", marginBottom: 14,
      }}><Icon size={20} style={{ color: T.textFaint }} /></div>}
      <div style={{ fontSize: 14.5, fontWeight: 600, color: T.text, marginBottom: 4 }}>{title}</div>
      {sub && <div style={{ fontSize: 13, marginBottom: 16, maxWidth: 320 }}>{sub}</div>}
      {action}
    </div>
  );
}

function Modal({ open, onClose, title, T, children, width = 480 }) {
  if (!open) return null;
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.5)",
      display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "40px 16px", overflowY: "auto",
    }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: "100%", maxWidth: width, background: T.surface, border: `1px solid ${T.border}`,
        borderRadius: 16, boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
      }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "16px 20px", borderBottom: `1px solid ${T.border}`,
        }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: T.text }}>{title}</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: T.textDim }}><X size={18} /></button>
        </div>
        <div style={{ padding: 20 }}>{children}</div>
      </div>
    </div>
  );
}

function Field({ label, children, T }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: "block", fontSize: 12.5, fontWeight: 500, color: T.textDim, marginBottom: 6 }}>{label}</label>
      {children}
    </div>
  );
}

function inputStyle(T) {
  return {
    width: "100%", padding: "9px 11px", borderRadius: 9, border: `1px solid ${T.border}`,
    background: T.surface2, color: T.text, fontSize: 13.5, outline: "none", boxSizing: "border-box",
  };
}
function Input(props) { const { T, ...rest } = props; return <input {...rest} style={{ ...inputStyle(T), ...(props.style || {}) }} />; }
function TextArea(props) { const { T, ...rest } = props; return <textarea {...rest} style={{ ...inputStyle(T), resize: "vertical", minHeight: 70, ...(props.style || {}) }} />; }
function Select({ T, children, ...rest }) { return <select {...rest} style={inputStyle(T)}>{children}</select>; }

function SectionHeader({ title, sub, T, action }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
      <div>
        <h1 style={{ fontSize: 19, fontWeight: 600, color: T.text, margin: 0, letterSpacing: -0.2 }}>{title}</h1>
        {sub && <p style={{ fontSize: 13, color: T.textDim, margin: "4px 0 0" }}>{sub}</p>}
      </div>
      {action}
    </div>
  );
}

function Progress({ value, T, tone = "accent", height = 6 }) {
  const color = tone === "accent" ? T.accent : tone === "amber" ? T.accent2 : tone === "danger" ? T.danger : T.success;
  return (
    <div style={{ width: "100%", height, borderRadius: 999, background: T.surface2, overflow: "hidden" }}>
      <div style={{ width: `${Math.min(100, Math.max(0, value))}%`, height: "100%", background: color, borderRadius: 999, transition: "width .4s ease" }} />
    </div>
  );
}

/* ===================== APP ===================== */
export default function CarelmStoreOS() {
  const [state, setState, loaded] = useAppState();
  const [tab, setTab] = useState("dashboard");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const T = useTheme(state.settings.theme);
  const cloud = useCloud();
  const [cloudSync, setCloudSync] = useState("idle"); // idle | syncing | synced | error
  const [cloudMsg, setCloudMsg] = useState("");
  const pulledOnceRef = useRef(false);

  const patch = (key, updater) => setState((s) => ({ ...s, [key]: typeof updater === "function" ? updater(s[key]) : updater }));
  const patchSettings = (updater) => setState((s) => ({ ...s, settings: { ...s.settings, ...(typeof updater === "function" ? updater(s.settings) : updater) } }));

  const computed = useMemo(() => computeAll(state), [state]);

  useEffect(() => {
    document.documentElement.style.setProperty("--mono", "'JetBrains Mono', ui-monospace, monospace");
  }, []);

  // Saat pertama kali connect: cek dulu apakah data user di Supabase masih kosong.
  // Jika kosong dan data lokal sudah ada isinya -> otomatis upload data lokal (tidak menimpa dengan kosong).
  // Jika Supabase sudah ada isinya -> tarik seperti biasa. Semua otomatis, tanpa klik manual.
  useEffect(() => {
    if (cloud.status !== "connected" || !cloud.cfg || pulledOnceRef.current) return;
    (async () => {
      setCloudSync("syncing"); setCloudMsg("Memeriksa data di Supabase...");
      try {
        const fresh = await cloud.ensureFreshToken();
        const pulled = await pullAllFromCloud(fresh);

        if (isCloudUserDataEmpty(pulled) && hasLocalUserData(state)) {
          // Cloud masih kosong, tapi lokal sudah punya data -> upload otomatis.
          setCloudMsg("Mengunggah data lokal ke Supabase...");
          await pushAllToCloud(fresh, state);
          setCloudSync("synced"); setCloudMsg("Data lokal otomatis diunggah ke Supabase.");
        } else {
          setState(pulled);
          setCloudSync("synced"); setCloudMsg("Tersinkron dengan Supabase.");
        }
      } catch (e) {
        setCloudSync("error"); setCloudMsg(e.message || "Gagal menyinkronkan dengan Supabase.");
      } finally {
        // Selalu tandai "sudah dicoba" agar perubahan data berikutnya tetap mencoba auto-save,
        // walau sinkronisasi awal ini sempat gagal.
        pulledOnceRef.current = true;
      }
    })();
  }, [cloud.status]); // eslint-disable-line

  // Push local changes to Supabase (debounced) whenever state changes and we're connected.
  useEffect(() => {
    if (cloud.status !== "connected" || !cloud.cfg || !pulledOnceRef.current) return;
    const t = setTimeout(async () => {
      setCloudSync("syncing");
      try {
        const fresh = await cloud.ensureFreshToken();
        await pushAllToCloud(fresh, state);
        setCloudSync("synced"); setCloudMsg("Tersimpan di Supabase.");
      } catch (e) { setCloudSync("error"); setCloudMsg(e.message || "Gagal menyimpan ke Supabase."); }
    }, 1200);
    return () => clearTimeout(t);
  }, [state, cloud.status]); // eslint-disable-line

  const pushNow = async () => {
    if (!cloud.cfg) return;
    setCloudSync("syncing"); setCloudMsg("Mengunggah data lokal ke Supabase...");
    try {
      const fresh = await cloud.ensureFreshToken();
      await pushAllToCloud(fresh, state);
      pulledOnceRef.current = true;
      setCloudSync("synced"); setCloudMsg("Data lokal berhasil diunggah.");
    } catch (e) { setCloudSync("error"); setCloudMsg(e.message || "Gagal mengunggah."); }
  };
  const pullNow = async () => {
    if (!cloud.cfg) return;
    setCloudSync("syncing"); setCloudMsg("Mengambil data dari Supabase...");
    try {
      const fresh = await cloud.ensureFreshToken();
      const pulled = await pullAllFromCloud(fresh);
      setState(pulled);
      pulledOnceRef.current = true;
      setCloudSync("synced"); setCloudMsg("Data cloud berhasil dimuat.");
    } catch (e) { setCloudSync("error"); setCloudMsg(e.message || "Gagal mengambil data."); }
  };

  if (!loaded) {
    return (
      <div style={{ minHeight: 500, display: "flex", alignItems: "center", justifyContent: "center", background: DARK.bg, color: DARK.textDim, fontFamily: "Inter, sans-serif" }}>
        Memuat Carelm Store OS...
      </div>
    );
  }

  return (
    <div style={{
      "--font-body": "'Inter', sans-serif", "--font-display": "'Space Grotesk', sans-serif",
      background: T.bg, color: T.text, fontFamily: "var(--font-body)", minHeight: "100vh", width: "100%",
      display: "flex", flex: 1, overflow: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-thumb { background: ${T.borderStrong}; border-radius: 8px; }
        ::-webkit-scrollbar-track { background: transparent; }
        @keyframes shineSweep { 0% { left: -60%; } 55% { left: 110%; } 100% { left: 110%; } }
        .navitem:hover { background: ${T.surface2}; }
        input::placeholder, textarea::placeholder { color: ${T.textFaint}; }
        table { border-collapse: collapse; width: 100%; }
        .rowhover:hover { background: ${T.surface2}; }
      `}</style>

      {/* Sidebar */}
      <aside style={{
        width: 232, minWidth: 232, background: T.surface, borderRight: `1px solid ${T.border}`,
        display: mobileNavOpen ? "flex" : "flex", flexDirection: "column", padding: "16px 12px",
      }} className="sidebar-desktop">
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 8px 18px" }}>
          <div style={{
            width: 32, height: 32, borderRadius: 9, background: T.accent, color: "#04211D",
            display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13,
            fontFamily: "var(--font-display)",
          }}>{(state.settings.logoText || "CS").slice(0, 2).toUpperCase()}</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, fontFamily: "var(--font-display)", letterSpacing: -0.2 }}>{state.settings.businessName || "Carelm Store"}</div>
            <div style={{ fontSize: 10.5, color: T.textFaint, fontWeight: 500 }}>Business OS</div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1, overflowY: "auto" }}>
          {NAV.map((n) => {
            const Icon = n.icon;
            const active = tab === n.key;
            return (
              <button key={n.key} className="navitem" onClick={() => { setTab(n.key); setMobileNavOpen(false); }} style={{
                display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 9,
                background: active ? T.surface2 : "transparent", border: "none", cursor: "pointer",
                color: active ? T.text : T.textDim, fontSize: 13, fontWeight: active ? 600 : 500, textAlign: "left",
                borderLeft: active ? `2px solid ${T.accent}` : "2px solid transparent",
              }}>
                <Icon size={15} style={{ color: active ? T.accent : T.textFaint, flexShrink: 0 }} />
                {n.label}
              </button>
            );
          })}
        </div>

        <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 12, marginTop: 10 }}>
          <button onClick={() => patchSettings((s) => ({ theme: s.theme === "dark" ? "light" : "dark" }))} style={{
            display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "8px 10px", borderRadius: 9,
            background: "transparent", border: `1px solid ${T.border}`, color: T.textDim, fontSize: 12.5, cursor: "pointer",
          }}>
            {state.settings.theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
            {state.settings.theme === "dark" ? "Light mode" : "Dark mode"}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", maxHeight: 800, overflow: "hidden" }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 24px",
          borderBottom: `1px solid ${T.border}`, background: T.bg,
        }}>
          <div style={{ fontSize: 13, color: T.textDim, display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ color: T.text, fontWeight: 600 }}>{NAV.find((n) => n.key === tab)?.label}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Badge T={T} tone="accent">{computed.healthScore >= 60 ? "Sehat" : computed.healthScore >= 35 ? "Perlu perhatian" : "Kritis"}</Badge>
          </div>
        </div>
        <div style={{ padding: 24, overflowY: "auto", flex: 1 }}>
          {tab === "dashboard" && <Dashboard T={T} state={state} computed={computed} setTab={setTab} />}
          {tab === "customers" && <CustomersView T={T} state={state} patch={patch} computed={computed} />}
          {tab === "bookings" && <BookingsView T={T} state={state} patch={patch} />}
          {tab === "services" && <ServicesView T={T} state={state} patch={patch} computed={computed} />}
          {tab === "finance" && <FinanceView T={T} state={state} patch={patch} computed={computed} />}
          {tab === "inventory" && <InventoryView T={T} state={state} patch={patch} />}
          {tab === "equipment" && <EquipmentView T={T} state={state} patch={patch} />}
          {tab === "investment" && <InvestmentView T={T} state={state} patch={patch} computed={computed} />}
          {tab === "analytics" && <AnalyticsView T={T} state={state} computed={computed} />}
          {tab === "roadmap" && <RoadmapView T={T} state={state} patch={patch} computed={computed} />}
          {tab === "dailyops" && <DailyOpsView T={T} state={state} patch={patch} />}
          {tab === "notes" && <NotesView T={T} state={state} patch={patch} />}
          {tab === "settings" && <SettingsView T={T} state={state} patchSettings={patchSettings} setState={setState} cloud={cloud} cloudSync={cloudSync} cloudMsg={cloudMsg} pushNow={pushNow} pullNow={pullNow} />}
        </div>
      </main>
    </div>
  );
}

/* ===================== COMPUTATIONS ===================== */
function computeAll(state) {
  const { customers, bookings, transactions, inventory, investments } = state;
  const today = todayStr();
  const thisMonth = monthKeyOf(today);

  const income = transactions.filter((t) => t.type === "income");
  const expense = transactions.filter((t) => t.type === "expense");
  const totalIncome = income.reduce((a, b) => a + Number(b.amount || 0), 0);
  const totalExpense = expense.reduce((a, b) => a + Number(b.amount || 0), 0);
  const totalProfit = totalIncome - totalExpense;

  const todayRevenue = income.filter((t) => t.date === today).reduce((a, b) => a + Number(b.amount || 0), 0);
  const monthRevenue = income.filter((t) => monthKeyOf(t.date) === thisMonth).reduce((a, b) => a + Number(b.amount || 0), 0);
  const monthExpense = expense.filter((t) => monthKeyOf(t.date) === thisMonth).reduce((a, b) => a + Number(b.amount || 0), 0);
  const monthProfit = monthRevenue - monthExpense;

  const months = last6Months();
  const monthly = months.map((mk) => {
    const rev = income.filter((t) => monthKeyOf(t.date) === mk).reduce((a, b) => a + Number(b.amount || 0), 0);
    const exp = expense.filter((t) => monthKeyOf(t.date) === mk).reduce((a, b) => a + Number(b.amount || 0), 0);
    return { month: monthLabel(mk), key: mk, revenue: rev, expense: exp, profit: rev - exp };
  });
  const lastMonthProfit = monthly[monthly.length - 2]?.profit || 0;
  const monthlyGrowth = lastMonthProfit !== 0 ? ((monthProfit - lastMonthProfit) / Math.abs(lastMonthProfit)) * 100 : (monthProfit > 0 ? 100 : 0);

  const avgMonthlyProfit = (() => {
    const activeMonths = monthly.filter((m) => m.revenue > 0 || m.expense > 0);
    if (!activeMonths.length) return 0;
    return activeMonths.reduce((a, b) => a + b.profit, 0) / activeMonths.length;
  })();

  const customerStats = customers.map((c) => {
    const cb = bookings.filter((b) => b.customerId === c.id && b.status === "Completed");
    const totalSpending = cb.reduce((a, b) => a + Number(b.price || 0), 0);
    const visits = cb.length;
    const serviceCounts = {};
    cb.forEach((b) => { serviceCounts[b.service] = (serviceCounts[b.service] || 0) + 1; });
    const favoriteService = Object.entries(serviceCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";
    const lastService = cb.map((b) => b.date).sort().slice(-1)[0] || null;
    return {
      ...c, visits, totalSpending, avgSpending: visits ? totalSpending / visits : 0,
      favoriteService, lastService,
      isVIP: totalSpending >= 300000, isLoyal: visits >= 5,
    };
  });

  const returningCustomers = customerStats.filter((c) => c.visits > 1).length;
  const totalCustomers = customers.length;

  const upcoming = bookings
    .filter((b) => ["Pending", "Confirmed"].includes(b.status) && b.date >= today)
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

  const serviceCountAll = {};
  bookings.forEach((b) => { serviceCountAll[b.service] = (serviceCountAll[b.service] || 0) + 1; });
  const mostPopular = Object.entries(serviceCountAll).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";

  const lowStock = inventory.filter((i) => Number(i.currentStock) <= Number(i.minStock));

  const currentInvestmentAlloc = investments.reduce((a, b) => a + Number(b.currentProgress || 0), 0);
  const currentCash = Math.max(0, totalProfit - currentInvestmentAlloc);

  let health = 0;
  health += totalProfit > 0 ? 25 : totalProfit === 0 ? 10 : 0;
  health += totalCustomers > 0 ? Math.min(20, (returningCustomers / Math.max(1, totalCustomers)) * 40) : 0;
  health += lowStock.length === 0 ? 15 : Math.max(0, 15 - lowStock.length * 4);
  health += upcoming.length > 0 ? 15 : 0;
  health += monthlyGrowth > 0 ? 25 : monthlyGrowth === 0 ? 10 : 0;
  const healthScore = Math.round(Math.max(0, Math.min(100, health)));

  return {
    totalIncome, totalExpense, totalProfit, todayRevenue, monthRevenue, monthExpense, monthProfit,
    monthly, monthlyGrowth, avgMonthlyProfit, customerStats, returningCustomers, totalCustomers,
    upcoming, mostPopular, lowStock, currentInvestmentAlloc, currentCash, healthScore,
  };
}

/* ===================== DASHBOARD ===================== */
function Dashboard({ T, state, computed, setTab }) {
  const c = computed;
  const pieData = EXPENSE_CATEGORIES.map((cat) => ({
    name: cat, value: state.transactions.filter((t) => t.type === "expense" && t.category === cat).reduce((a, b) => a + Number(b.amount || 0), 0),
  })).filter((d) => d.value > 0);
  const pieColors = [T.accent, T.accent2, "#7C7FE0", "#E07C9B", "#5DAEE0", "#8FBF5A", "#C77DD1"];

  return (
    <div>
      <SectionHeader T={T} title="Command Center" sub={`Ringkasan performa ${state.settings.businessName || "Carelm Store"} hari ini, ${fmtDate(todayStr())}`}
        action={
          <div style={{ display: "flex", gap: 8 }}>
            <Btn T={T} variant="subtle" icon={CalendarDays} onClick={() => setTab("bookings")}>Booking baru</Btn>
            <Btn T={T} icon={Plus} onClick={() => setTab("finance")}>Catat transaksi</Btn>
          </div>
        }
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px,1fr))", gap: 12, marginBottom: 14 }}>
        <Stat T={T} label="Pendapatan hari ini" value={fmtIDR(c.todayRevenue)} icon={DollarSign} accent shine />
        <Stat T={T} label="Pendapatan bulan ini" value={fmtIDR(c.monthRevenue)} icon={TrendingUp} sub={`${c.monthlyGrowth >= 0 ? "+" : ""}${c.monthlyGrowth.toFixed(1)}% vs bulan lalu`} />
        <Stat T={T} label="Total profit" value={fmtIDR(c.totalProfit)} icon={Wallet} />
        <Stat T={T} label="Kas saat ini" value={fmtIDR(c.currentCash)} icon={DollarSign} sub={`Investasi: ${fmtIDR(c.currentInvestmentAlloc)}`} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px,1fr))", gap: 12, marginBottom: 18 }}>
        <Stat T={T} label="Total pelanggan" value={c.totalCustomers} icon={Users} />
        <Stat T={T} label="Pelanggan kembali" value={c.returningCustomers} icon={Heart} />
        <Stat T={T} label="Booking mendatang" value={c.upcoming.length} icon={CalendarDays} />
        <Stat T={T} label="Layanan terpopuler" value={c.mostPopular} icon={Star} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 14, marginBottom: 14 }}>
        <Card T={T}>
          <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 12 }}>Revenue vs profit (6 bulan terakhir)</div>
          <div style={{ width: "100%", height: 230 }}>
            <ResponsiveContainer>
              <AreaChart data={c.monthly}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={T.accent} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={T.accent} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={T.border} strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" stroke={T.textFaint} fontSize={11.5} tickLine={false} axisLine={false} />
                <YAxis stroke={T.textFaint} fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => (v / 1000).toFixed(0) + "k"} width={44} />
                <Tooltip contentStyle={{ background: T.surface2, border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 12 }} formatter={(v) => fmtIDR(v)} />
                <Area type="monotone" dataKey="revenue" stroke={T.accent} fill="url(#rev)" strokeWidth={2} name="Revenue" />
                <Line type="monotone" dataKey="profit" stroke={T.accent2} strokeWidth={2} dot={{ r: 3 }} name="Profit" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card T={T}>
          <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 4 }}>Business health score</div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 10 }}>
            <div style={{ position: "relative", width: 92, height: 92, flexShrink: 0 }}>
              <svg width="92" height="92" viewBox="0 0 92 92">
                <circle cx="46" cy="46" r="40" stroke={T.surface2} strokeWidth="8" fill="none" />
                <circle cx="46" cy="46" r="40" stroke={T.accent} strokeWidth="8" fill="none" strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 40} strokeDashoffset={2 * Math.PI * 40 * (1 - c.healthScore / 100)}
                  transform="rotate(-90 46 46)" style={{ transition: "stroke-dashoffset .6s ease" }} />
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 700, fontFamily: "var(--mono)" }}>{c.healthScore}</div>
            </div>
            <div style={{ fontSize: 12.5, color: T.textDim, lineHeight: 1.6 }}>
              Skor dihitung dari profitabilitas, retensi pelanggan, stok, booking mendatang, dan pertumbuhan bulanan.
            </div>
          </div>
        </Card>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <Card T={T}>
          <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 12 }}>Booking mendatang</div>
          {c.upcoming.length === 0 ? (
            <Empty T={T} icon={CalendarDays} title="Belum ada booking" sub="Booking baru akan muncul di sini." />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {c.upcoming.slice(0, 5).map((b) => (
                <div key={b.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 10px", borderRadius: 9, background: T.surface2 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{state.customers.find((c2) => c2.id === b.customerId)?.name || "Pelanggan"}</div>
                    <div style={{ fontSize: 11.5, color: T.textDim }}>{b.service} · {fmtDate(b.date)} {b.time}</div>
                  </div>
                  <Badge T={T} tone={b.status === "Confirmed" ? "accent" : "amber"}>{b.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card T={T}>
          <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 12 }}>Alokasi pengeluaran</div>
          {pieData.length === 0 ? (
            <Empty T={T} icon={Wallet} title="Belum ada pengeluaran" sub="Catat transaksi di menu Finance." />
          ) : (
            <div style={{ width: "100%", height: 210, display: "flex", alignItems: "center" }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75} paddingAngle={2}>
                    {pieData.map((_, i) => <Cell key={i} fill={pieColors[i % pieColors.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v) => fmtIDR(v)} contentStyle={{ background: T.surface2, border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 11.5 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

/* ===================== CUSTOMERS ===================== */
function emptyCustomer() {
  return {
    id: uid("cu"), name: "", phone: "", instagram: "", motorcycle: "", helmetBrand: "", helmetType: "",
    helmetColor: "", purchaseDate: "", address: "", notes: "", customerSince: todayStr(), referral: false,
  };
}
function CustomersView({ T, state, patch, computed }) {
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState(null);
  const stats = computed.customerStats;
  const filtered = stats.filter((c) => (c.name + c.phone + c.motorcycle).toLowerCase().includes(query.toLowerCase()));

  const save = (cust) => {
    patch("customers", (list) => {
      const exists = list.some((c) => c.id === cust.id);
      return exists ? list.map((c) => (c.id === cust.id ? cust : c)) : [...list, cust];
    });
    setModal(null);
  };
  const remove = (id) => patch("customers", (list) => list.filter((c) => c.id !== id));

  const exportCSV = () => {
    const headers = ["Nama", "Telepon", "Instagram", "Motor", "Merk Helm", "Kunjungan", "Total Belanja"];
    const rows = filtered.map((c) => [c.name, c.phone, c.instagram, c.motorcycle, c.helmetBrand, c.visits, c.totalSpending]);
    const csv = [headers, ...rows].map((r) => r.map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "carelm-customers.csv"; a.click();
  };

  return (
    <div>
      <SectionHeader T={T} title="Customers" sub={`${state.customers.length} pelanggan terdaftar`}
        action={<div style={{ display: "flex", gap: 8 }}>
          <Btn T={T} variant="subtle" icon={Download} onClick={exportCSV}>Export</Btn>
          <Btn T={T} icon={Plus} onClick={() => setModal(emptyCustomer())}>Tambah pelanggan</Btn>
        </div>} />

      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        <div style={{ position: "relative", flex: 1, maxWidth: 320 }}>
          <Search size={14} style={{ position: "absolute", left: 10, top: 10, color: T.textFaint }} />
          <Input T={T} placeholder="Cari nama, telepon, motor..." value={query} onChange={(e) => setQuery(e.target.value)} style={{ paddingLeft: 30 }} />
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card T={T}><Empty T={T} icon={Users} title="Belum ada pelanggan" sub="Tambahkan pelanggan pertama untuk mulai melacak riwayat & loyalitas."
          action={<Btn T={T} icon={Plus} onClick={() => setModal(emptyCustomer())}>Tambah pelanggan</Btn>} /></Card>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px,1fr))", gap: 12 }}>
          {filtered.map((c) => (
            <Card T={T} key={c.id} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: 14.5, fontWeight: 600 }}>{c.name || "Tanpa nama"}</div>
                  <div style={{ fontSize: 12, color: T.textDim, marginTop: 2 }}>{c.phone || "-"}</div>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <IconBtn T={T} icon={Pencil} onClick={() => setModal(c)} />
                  <IconBtn T={T} icon={Trash2} danger onClick={() => remove(c.id)} />
                </div>
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {c.isVIP && <Badge T={T} tone="amber"><Crown size={10} />VIP</Badge>}
                {c.isLoyal && <Badge T={T} tone="accent"><Heart size={10} />Loyal</Badge>}
                {c.referral && <Badge T={T} tone="success"><Sparkles size={10} />Referral</Badge>}
              </div>
              <div style={{ fontSize: 12.5, color: T.textDim, lineHeight: 1.7 }}>
                {c.motorcycle && <div>Motor: {c.motorcycle}</div>}
                {c.helmetBrand && <div>Helm: {c.helmetBrand} {c.helmetType} ({c.helmetColor})</div>}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderTop: `1px solid ${T.border}`, paddingTop: 10, fontSize: 12 }}>
                <div><div style={{ color: T.textFaint }}>Kunjungan</div><div style={{ fontWeight: 600 }}>{c.visits}</div></div>
                <div><div style={{ color: T.textFaint }}>Total belanja</div><div style={{ fontWeight: 600 }}>{fmtIDR(c.totalSpending)}</div></div>
                <div><div style={{ color: T.textFaint }}>Favorit</div><div style={{ fontWeight: 600 }}>{c.favoriteService}</div></div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal T={T} open={!!modal} onClose={() => setModal(null)} title={modal && state.customers.some((c) => c.id === modal.id) ? "Edit pelanggan" : "Tambah pelanggan"} width={560}>
        {modal && <CustomerForm T={T} value={modal} onSave={save} />}
      </Modal>
    </div>
  );
}
function CustomerForm({ T, value, onSave }) {
  const [f, setF] = useState(value);
  const up = (k) => (e) => setF({ ...f, [k]: e.target && e.target.type === "checkbox" ? e.target.checked : e.target.value });
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Field T={T} label="Nama"><Input T={T} value={f.name} onChange={up("name")} placeholder="Nama pelanggan" /></Field>
        <Field T={T} label="Telepon / WhatsApp"><Input T={T} value={f.phone} onChange={up("phone")} placeholder="08..." /></Field>
        <Field T={T} label="Instagram"><Input T={T} value={f.instagram} onChange={up("instagram")} placeholder="@username" /></Field>
        <Field T={T} label="Motor"><Input T={T} value={f.motorcycle} onChange={up("motorcycle")} placeholder="Honda PCX" /></Field>
        <Field T={T} label="Merk helm"><Input T={T} value={f.helmetBrand} onChange={up("helmetBrand")} placeholder="KYT, INK, Arai..." /></Field>
        <Field T={T} label="Tipe helm"><Input T={T} value={f.helmetType} onChange={up("helmetType")} placeholder="Full-face, half-face..." /></Field>
        <Field T={T} label="Warna helm"><Input T={T} value={f.helmetColor} onChange={up("helmetColor")} /></Field>
        <Field T={T} label="Tanggal pembelian helm (opsional)"><Input T={T} type="date" value={f.purchaseDate} onChange={up("purchaseDate")} /></Field>
      </div>
      <Field T={T} label="Alamat"><Input T={T} value={f.address} onChange={up("address")} /></Field>
      <Field T={T} label="Catatan"><TextArea T={T} value={f.notes} onChange={up("notes")} placeholder="Preferensi, alergi bahan, dll." /></Field>
      <Field T={T} label="Pelanggan sejak"><Input T={T} type="date" value={f.customerSince} onChange={up("customerSince")} /></Field>
      <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: T.textDim, marginBottom: 16 }}>
        <input type="checkbox" checked={!!f.referral} onChange={up("referral")} /> Datang dari referral
      </label>
      <Btn T={T} onClick={() => onSave(f)} style={{ width: "100%" }}>Simpan pelanggan</Btn>
    </div>
  );
}

/* ===================== BOOKINGS ===================== */
const BOOKING_STATUSES = ["Pending", "Confirmed", "In Progress", "Waiting Pickup", "Completed", "Cancelled"];
function emptyBooking(customers) {
  return { id: uid("bk"), customerId: customers[0]?.id || "", date: todayStr(), time: "10:00", service: "", price: 0, status: "Pending", paymentStatus: "Unpaid", notes: "" };
}
function BookingsView({ T, state, patch }) {
  const [modal, setModal] = useState(null);
  const [filter, setFilter] = useState("All");
  const sorted = [...state.bookings].sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time));
  const filtered = filter === "All" ? sorted : sorted.filter((b) => b.status === filter);

  const save = (b) => {
    patch("bookings", (list) => (list.some((x) => x.id === b.id) ? list.map((x) => (x.id === b.id ? b : x)) : [...list, b]));
    setModal(null);
  };
  const remove = (id) => patch("bookings", (list) => list.filter((b) => b.id !== id));

  return (
    <div>
      <SectionHeader T={T} title="Bookings" sub={`${state.bookings.length} total booking`}
        action={<Btn T={T} icon={Plus} onClick={() => setModal(emptyBooking(state.customers))} disabled={state.customers.length === 0}>Booking baru</Btn>} />

      {state.customers.length === 0 && <Card T={T} style={{ marginBottom: 14 }}><div style={{ fontSize: 13, color: T.textDim }}>Tambahkan pelanggan terlebih dahulu di menu Customers sebelum membuat booking.</div></Card>}

      <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
        {["All", ...BOOKING_STATUSES].map((s) => (
          <button key={s} onClick={() => setFilter(s)} style={{
            padding: "6px 12px", borderRadius: 999, fontSize: 12, cursor: "pointer",
            background: filter === s ? T.accent : T.surface2, color: filter === s ? "#04211D" : T.textDim,
            border: `1px solid ${filter === s ? T.accent : T.border}`, fontWeight: 500,
          }}>{s}</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Card T={T}><Empty T={T} icon={CalendarDays} title="Tidak ada booking" sub="Booking dengan status ini belum ada." /></Card>
      ) : (
        <Card T={T} padding={0}>
          <table>
            <thead>
              <tr style={{ borderBottom: `1px solid ${T.border}` }}>
                {["Pelanggan", "Layanan", "Tanggal", "Harga", "Pembayaran", "Status", ""].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "10px 16px", fontSize: 11.5, color: T.textFaint, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.3 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr key={b.id} className="rowhover" style={{ borderBottom: `1px solid ${T.border}` }}>
                  <td style={{ padding: "10px 16px", fontSize: 13 }}>{state.customers.find((c) => c.id === b.customerId)?.name || "-"}</td>
                  <td style={{ padding: "10px 16px", fontSize: 13, color: T.textDim }}>{b.service}</td>
                  <td style={{ padding: "10px 16px", fontSize: 13, color: T.textDim }}>{fmtDate(b.date)} {b.time}</td>
                  <td style={{ padding: "10px 16px", fontSize: 13, fontFamily: "var(--mono)" }}>{fmtIDR(b.price)}</td>
                  <td style={{ padding: "10px 16px" }}><Badge T={T} tone={b.paymentStatus === "Paid" ? "success" : "amber"}>{b.paymentStatus}</Badge></td>
                  <td style={{ padding: "10px 16px" }}><Badge T={T} tone={b.status === "Completed" ? "success" : b.status === "Cancelled" ? "danger" : "accent"}>{b.status}</Badge></td>
                  <td style={{ padding: "10px 16px" }}>
                    <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                      <IconBtn T={T} icon={Pencil} onClick={() => setModal(b)} />
                      <IconBtn T={T} icon={Trash2} danger onClick={() => remove(b.id)} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      <Modal T={T} open={!!modal} onClose={() => setModal(null)} title={modal && state.bookings.some((x) => x.id === modal.id) ? "Edit booking" : "Booking baru"}>
        {modal && <BookingForm T={T} value={modal} customers={state.customers} services={state.services} onSave={save} />}
      </Modal>
    </div>
  );
}
function BookingForm({ T, value, customers, services, onSave }) {
  const [f, setF] = useState(value);
  const up = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const pickService = (name) => {
    const sv = services.find((s) => s.name === name);
    setF({ ...f, service: name, price: sv ? sv.price : f.price });
  };
  return (
    <div>
      <Field T={T} label="Pelanggan">
        <Select T={T} value={f.customerId} onChange={up("customerId")}>
          {customers.map((c) => <option key={c.id} value={c.id}>{c.name || "Tanpa nama"}</option>)}
        </Select>
      </Field>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Field T={T} label="Tanggal"><Input T={T} type="date" value={f.date} onChange={up("date")} /></Field>
        <Field T={T} label="Jam"><Input T={T} type="time" value={f.time} onChange={up("time")} /></Field>
      </div>
      <Field T={T} label="Layanan">
        <Select T={T} value={f.service} onChange={(e) => pickService(e.target.value)}>
          <option value="">Pilih layanan</option>
          {services.map((s) => <option key={s.id} value={s.name}>{s.name}</option>)}
        </Select>
      </Field>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Field T={T} label="Harga"><Input T={T} type="number" value={f.price} onChange={up("price")} /></Field>
        <Field T={T} label="Status pembayaran">
          <Select T={T} value={f.paymentStatus} onChange={up("paymentStatus")}>
            <option>Unpaid</option><option>Partial</option><option>Paid</option>
          </Select>
        </Field>
      </div>
      <Field T={T} label="Status booking">
        <Select T={T} value={f.status} onChange={up("status")}>
          {BOOKING_STATUSES.map((s) => <option key={s}>{s}</option>)}
        </Select>
      </Field>
      <Field T={T} label="Catatan"><TextArea T={T} value={f.notes} onChange={up("notes")} /></Field>
      <Btn T={T} onClick={() => onSave(f)} style={{ width: "100%" }}>Simpan booking</Btn>
    </div>
  );
}

/* ===================== SERVICES ===================== */
function emptyService() { return { id: uid("sv"), name: "", price: 0, estTime: 30, description: "", requiredProducts: "", addons: "", profitMargin: 50 }; }
function ServicesView({ T, state, patch, computed }) {
  const [modal, setModal] = useState(null);
  const popularity = {};
  state.bookings.forEach((b) => { popularity[b.service] = (popularity[b.service] || 0) + 1; });

  const save = (s) => { patch("services", (list) => (list.some((x) => x.id === s.id) ? list.map((x) => (x.id === s.id ? s : x)) : [...list, s])); setModal(null); };
  const remove = (id) => patch("services", (list) => list.filter((s) => s.id !== id));

  return (
    <div>
      <SectionHeader T={T} title="Services" sub="Kelola daftar layanan, harga, dan margin keuntungan"
        action={<Btn T={T} icon={Plus} onClick={() => setModal(emptyService())}>Tambah layanan</Btn>} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px,1fr))", gap: 12 }}>
        {state.services.map((s) => (
          <Card T={T} key={s.id}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 14.5, fontWeight: 600 }}>{s.name}</div>
                <div style={{ fontSize: 18, fontWeight: 700, fontFamily: "var(--mono)", color: T.accent, marginTop: 4 }}>{fmtIDR(s.price)}</div>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <IconBtn T={T} icon={Pencil} onClick={() => setModal(s)} />
                <IconBtn T={T} icon={Trash2} danger onClick={() => remove(s.id)} />
              </div>
            </div>
            <div style={{ fontSize: 12.5, color: T.textDim, margin: "8px 0" }}>{s.description}</div>
            <div style={{ display: "flex", gap: 12, fontSize: 12, color: T.textFaint, borderTop: `1px solid ${T.border}`, paddingTop: 10 }}>
              <div><Clock size={11} style={{ verticalAlign: -1 }} /> {s.estTime} mnt</div>
              <div>Margin {s.profitMargin}%</div>
              <div>Dipesan {popularity[s.name] || 0}x</div>
            </div>
          </Card>
        ))}
      </div>
      <Modal T={T} open={!!modal} onClose={() => setModal(null)} title={modal && state.services.some((x) => x.id === modal.id) ? "Edit layanan" : "Tambah layanan"}>
        {modal && <ServiceForm T={T} value={modal} onSave={save} />}
      </Modal>
    </div>
  );
}
function ServiceForm({ T, value, onSave }) {
  const [f, setF] = useState(value);
  const up = (k) => (e) => setF({ ...f, [k]: e.target.value });
  return (
    <div>
      <Field T={T} label="Nama layanan"><Input T={T} value={f.name} onChange={up("name")} /></Field>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Field T={T} label="Harga"><Input T={T} type="number" value={f.price} onChange={up("price")} /></Field>
        <Field T={T} label="Estimasi waktu (menit)"><Input T={T} type="number" value={f.estTime} onChange={up("estTime")} /></Field>
      </div>
      <Field T={T} label="Deskripsi"><TextArea T={T} value={f.description} onChange={up("description")} /></Field>
      <Field T={T} label="Produk yang dibutuhkan"><Input T={T} value={f.requiredProducts} onChange={up("requiredProducts")} /></Field>
      <Field T={T} label="Rekomendasi add-on"><Input T={T} value={f.addons} onChange={up("addons")} /></Field>
      <Field T={T} label="Margin keuntungan (%)"><Input T={T} type="number" value={f.profitMargin} onChange={up("profitMargin")} /></Field>
      <Btn T={T} onClick={() => onSave(f)} style={{ width: "100%" }}>Simpan layanan</Btn>
    </div>
  );
}

/* ===================== FINANCE ===================== */
function emptyTx(type) { return { id: uid("tx"), type, category: type === "income" ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0], amount: 0, date: todayStr(), note: "" }; }
function FinanceView({ T, state, patch, computed }) {
  const [modal, setModal] = useState(null);
  const c = computed;
  const sorted = [...state.transactions].sort((a, b) => b.date.localeCompare(a.date));

  const save = (t) => { patch("transactions", (list) => (list.some((x) => x.id === t.id) ? list.map((x) => (x.id === t.id ? t : x)) : [...list, t])); setModal(null); };
  const remove = (id) => patch("transactions", (list) => list.filter((t) => t.id !== id));

  const breakEven = useMemo(() => {
    const avgTicket = state.bookings.length ? state.bookings.reduce((a, b) => a + Number(b.price || 0), 0) / state.bookings.length : 0;
    const fixedCostEstimate = c.monthExpense;
    return avgTicket > 0 ? Math.ceil(fixedCostEstimate / avgTicket) : 0;
  }, [state.bookings, c.monthExpense]);

  return (
    <div>
      <SectionHeader T={T} title="Finance" sub="Pusat kendali arus kas, laba rugi, dan proyeksi bisnis"
        action={<div style={{ display: "flex", gap: 8 }}>
          <Btn T={T} variant="subtle" icon={ArrowDownRight} onClick={() => setModal(emptyTx("expense"))}>Catat pengeluaran</Btn>
          <Btn T={T} icon={ArrowUpRight} onClick={() => setModal(emptyTx("income"))}>Catat pemasukan</Btn>
        </div>} />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px,1fr))", gap: 12, marginBottom: 14 }}>
        <Stat T={T} label="Total pendapatan" value={fmtIDR(c.totalIncome)} icon={ArrowUpRight} />
        <Stat T={T} label="Total pengeluaran" value={fmtIDR(c.totalExpense)} icon={ArrowDownRight} />
        <Stat T={T} label="Net profit" value={fmtIDR(c.totalProfit)} icon={Wallet} accent />
        <Stat T={T} label="Break-even (order/bulan)" value={breakEven} icon={BarChart3} sub="Estimasi berdasarkan rata-rata harga" />
      </div>

      <Card T={T} style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 12 }}>Cash flow bulanan</div>
        <div style={{ width: "100%", height: 220 }}>
          <ResponsiveContainer>
            <BarChart data={c.monthly}>
              <CartesianGrid stroke={T.border} strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" stroke={T.textFaint} fontSize={11.5} tickLine={false} axisLine={false} />
              <YAxis stroke={T.textFaint} fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => (v / 1000).toFixed(0) + "k"} width={44} />
              <Tooltip formatter={(v) => fmtIDR(v)} contentStyle={{ background: T.surface2, border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11.5 }} />
              <Bar dataKey="revenue" fill={T.accent} name="Pemasukan" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" fill={T.danger} name="Pengeluaran" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card T={T} padding={0}>
        <div style={{ padding: "14px 16px", borderBottom: `1px solid ${T.border}`, fontSize: 13.5, fontWeight: 600 }}>Riwayat transaksi</div>
        {sorted.length === 0 ? <Empty T={T} icon={Wallet} title="Belum ada transaksi" sub="Catat pemasukan/pengeluaran pertama Anda." /> : (
          <table>
            <thead><tr style={{ borderBottom: `1px solid ${T.border}` }}>
              {["Tanggal", "Tipe", "Kategori", "Jumlah", "Catatan", ""].map((h) => <th key={h} style={{ textAlign: "left", padding: "10px 16px", fontSize: 11.5, color: T.textFaint, fontWeight: 600, textTransform: "uppercase" }}>{h}</th>)}
            </tr></thead>
            <tbody>
              {sorted.map((t) => (
                <tr key={t.id} className="rowhover" style={{ borderBottom: `1px solid ${T.border}` }}>
                  <td style={{ padding: "10px 16px", fontSize: 13 }}>{fmtDate(t.date)}</td>
                  <td style={{ padding: "10px 16px" }}><Badge T={T} tone={t.type === "income" ? "success" : "danger"}>{t.type === "income" ? "Masuk" : "Keluar"}</Badge></td>
                  <td style={{ padding: "10px 16px", fontSize: 13, color: T.textDim }}>{t.category}</td>
                  <td style={{ padding: "10px 16px", fontSize: 13, fontFamily: "var(--mono)", color: t.type === "income" ? T.success : T.danger }}>{t.type === "income" ? "+" : "-"}{fmtIDR(t.amount)}</td>
                  <td style={{ padding: "10px 16px", fontSize: 12.5, color: T.textDim }}>{t.note}</td>
                  <td style={{ padding: "10px 16px" }}>
                    <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                      <IconBtn T={T} icon={Pencil} onClick={() => setModal(t)} />
                      <IconBtn T={T} icon={Trash2} danger onClick={() => remove(t.id)} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      <Modal T={T} open={!!modal} onClose={() => setModal(null)} title={modal && state.transactions.some((x) => x.id === modal.id) ? "Edit transaksi" : "Transaksi baru"}>
        {modal && <TxForm T={T} value={modal} services={state.services} onSave={save} />}
      </Modal>
    </div>
  );
}
function TxForm({ T, value, services = [], onSave }) {
  const [f, setF] = useState(value);
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const up = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const cats = f.type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const isRevenueCategory =
    f.type === "income" &&
    f.category &&
    (f.category.toLowerCase().includes("revenue") || f.category === "Service Revenue");

  const handleServiceChange = (e) => {
    const serviceId = e.target.value;
    setSelectedServiceId(serviceId);
    if (!serviceId) return;

    const selectedService = services.find((s) => s.id === serviceId);
    if (selectedService) {
      setF((prev) => ({
        ...prev,
        amount: selectedService.price,
        note: prev.note ? prev.note : `Service: ${selectedService.name}`,
      }));
    }
  };

  return (
    <div>
      <Field T={T} label="Tipe">
        <Select T={T} value={f.type} onChange={(e) => setF({ ...f, type: e.target.value, category: e.target.value === "income" ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0] })}>
          <option value="income">Pemasukan</option><option value="expense">Pengeluaran</option>
        </Select>
      </Field>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Field T={T} label="Kategori"><Select T={T} value={f.category} onChange={up("category")}>{cats.map((c) => <option key={c}>{c}</option>)}</Select></Field>
        <Field T={T} label="Tanggal"><Input T={T} type="date" value={f.date} onChange={up("date")} /></Field>
      </div>

      {isRevenueCategory && (
        <Field T={T} label="Pilih Service">
          <Select T={T} value={selectedServiceId} onChange={handleServiceChange}>
            <option value="">-- Pilih Service --</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({fmtIDR(s.price)})
              </option>
            ))}
          </Select>
        </Field>
      )}

      <Field T={T} label="Jumlah (Rp)"><Input T={T} type="number" value={f.amount} onChange={up("amount")} /></Field>
      <Field T={T} label="Catatan"><TextArea T={T} value={f.note} onChange={up("note")} /></Field>
      <Btn T={T} onClick={() => onSave(f)} style={{ width: "100%" }}>Simpan transaksi</Btn>
    </div>
  );
}

/* ===================== INVENTORY ===================== */
function emptyInv() { return { id: uid("iv"), name: "", category: "Chemical", currentStock: 0, minStock: 1, unit: "pcs", purchasePrice: 0, supplier: "", usagePerService: 0.1 }; }
function InventoryView({ T, state, patch }) {
  const [modal, setModal] = useState(null);
  const save = (i) => { patch("inventory", (list) => (list.some((x) => x.id === i.id) ? list.map((x) => (x.id === i.id ? i : x)) : [...list, i])); setModal(null); };
  const remove = (id) => patch("inventory", (list) => list.filter((i) => i.id !== id));
  const low = state.inventory.filter((i) => Number(i.currentStock) <= Number(i.minStock));

  return (
    <div>
      <SectionHeader T={T} title="Inventory" sub="Bahan kimia & consumables"
        action={<Btn T={T} icon={Plus} onClick={() => setModal(emptyInv())}>Tambah item</Btn>} />

      {low.length > 0 && (
        <Card T={T} style={{ marginBottom: 14, borderColor: T.dangerDim, background: T.dangerDim }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: T.danger, fontSize: 13, fontWeight: 600 }}>
            <AlertTriangle size={15} /> {low.length} item stok menipis: {low.map((i) => i.name).join(", ")}
          </div>
        </Card>
      )}

      <Card T={T} padding={0}>
        <table>
          <thead><tr style={{ borderBottom: `1px solid ${T.border}` }}>
            {["Item", "Kategori", "Stok", "Min", "Estimasi job tersisa", "Harga beli", ""].map((h) => <th key={h} style={{ textAlign: "left", padding: "10px 16px", fontSize: 11.5, color: T.textFaint, fontWeight: 600, textTransform: "uppercase" }}>{h}</th>)}
          </tr></thead>
          <tbody>
            {state.inventory.map((i) => {
              const remainJobs = Number(i.usagePerService) > 0 ? Math.floor(Number(i.currentStock) / Number(i.usagePerService)) : "-";
              const isLow = Number(i.currentStock) <= Number(i.minStock);
              return (
                <tr key={i.id} className="rowhover" style={{ borderBottom: `1px solid ${T.border}` }}>
                  <td style={{ padding: "10px 16px", fontSize: 13, fontWeight: 500 }}>{i.name}</td>
                  <td style={{ padding: "10px 16px", fontSize: 12.5, color: T.textDim }}>{i.category}</td>
                  <td style={{ padding: "10px 16px" }}><Badge T={T} tone={isLow ? "danger" : "success"}>{i.currentStock} {i.unit}</Badge></td>
                  <td style={{ padding: "10px 16px", fontSize: 13, color: T.textDim }}>{i.minStock}</td>
                  <td style={{ padding: "10px 16px", fontSize: 13 }}>{remainJobs}</td>
                  <td style={{ padding: "10px 16px", fontSize: 13, fontFamily: "var(--mono)" }}>{fmtIDR(i.purchasePrice)}</td>
                  <td style={{ padding: "10px 16px" }}>
                    <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                      <IconBtn T={T} icon={Pencil} onClick={() => setModal(i)} />
                      <IconBtn T={T} icon={Trash2} danger onClick={() => remove(i.id)} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>

      <Modal T={T} open={!!modal} onClose={() => setModal(null)} title={modal && state.inventory.some((x) => x.id === modal.id) ? "Edit item" : "Tambah item"}>
        {modal && <InvForm T={T} value={modal} onSave={save} />}
      </Modal>
    </div>
  );
}
function InvForm({ T, value, onSave }) {
  const [f, setF] = useState(value);
  const up = (k) => (e) => setF({ ...f, [k]: e.target.value });
  return (
    <div>
      <Field T={T} label="Nama item"><Input T={T} value={f.name} onChange={up("name")} /></Field>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Field T={T} label="Kategori"><Input T={T} value={f.category} onChange={up("category")} /></Field>
        <Field T={T} label="Satuan"><Input T={T} value={f.unit} onChange={up("unit")} /></Field>
        <Field T={T} label="Stok saat ini"><Input T={T} type="number" value={f.currentStock} onChange={up("currentStock")} /></Field>
        <Field T={T} label="Stok minimum"><Input T={T} type="number" value={f.minStock} onChange={up("minStock")} /></Field>
        <Field T={T} label="Harga beli"><Input T={T} type="number" value={f.purchasePrice} onChange={up("purchasePrice")} /></Field>
        <Field T={T} label="Pemakaian per servis"><Input T={T} type="number" step="0.01" value={f.usagePerService} onChange={up("usagePerService")} /></Field>
      </div>
      <Field T={T} label="Supplier"><Input T={T} value={f.supplier} onChange={up("supplier")} /></Field>
      <Btn T={T} onClick={() => onSave(f)} style={{ width: "100%" }}>Simpan item</Btn>
    </div>
  );
}

/* ===================== EQUIPMENT ===================== */
function emptyEquip() { return { id: uid("eq"), name: "", status: "Active", purchaseDate: todayStr(), purchasePrice: 0, lifetimeMonths: 24, condition: "Good", maintenanceSchedule: "", warranty: "" }; }
const SHOP_STATUSES = ["not_purchased", "purchased", "delivered", "in_use"];
const SHOP_STATUS_LABEL = { not_purchased: "Belum dibeli", purchased: "Sudah dibeli", delivered: "Sudah sampai", in_use: "Sedang dipakai" };
function EquipmentView({ T, state, patch }) {
  const [modal, setModal] = useState(null);
  const save = (e) => { patch("equipment", (list) => (list.some((x) => x.id === e.id) ? list.map((x) => (x.id === e.id ? e : x)) : [...list, e])); setModal(null); };
  const remove = (id) => patch("equipment", (list) => list.filter((e) => e.id !== id));

  const updateShop = (id, patchObj) => patch("shoppingList", (list) => list.map((i) => (i.id === id ? { ...i, ...patchObj } : i)));

  return (
    <div>
      <SectionHeader T={T} title="Equipment" sub="Aset & rencana pembelian peralatan"
        action={<Btn T={T} icon={Plus} onClick={() => setModal(emptyEquip())}>Tambah peralatan</Btn>} />

      <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 10 }}>Peralatan aktif</div>
      {state.equipment.length === 0 ? (
        <Card T={T} style={{ marginBottom: 20 }}><Empty T={T} icon={Cog} title="Belum ada peralatan tercatat" sub="Tambahkan mesin/alat yang sudah dimiliki." /></Card>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px,1fr))", gap: 12, marginBottom: 20 }}>
          {state.equipment.map((e) => (
            <Card T={T} key={e.id}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{e.name}</div>
                <div style={{ display: "flex", gap: 6 }}>
                  <IconBtn T={T} icon={Pencil} onClick={() => setModal(e)} />
                  <IconBtn T={T} icon={Trash2} danger onClick={() => remove(e.id)} />
                </div>
              </div>
              <div style={{ fontSize: 12, color: T.textDim, marginTop: 6 }}>Beli: {fmtDate(e.purchaseDate)} · {fmtIDR(e.purchasePrice)}</div>
              <div style={{ marginTop: 8 }}><Badge T={T} tone={e.condition === "Good" ? "success" : e.condition === "Fair" ? "amber" : "danger"}>{e.condition}</Badge></div>
            </Card>
          ))}
        </div>
      )}

      <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 10 }}>Equipment Purchase Plan</div>
      <Card T={T} padding={0}>
        <table>
          <thead><tr style={{ borderBottom: `1px solid ${T.border}` }}>
            {["Item", "Kategori", "Prioritas", "Harga", "Status", "Link", ""].map((h) => <th key={h} style={{ textAlign: "left", padding: "10px 16px", fontSize: 11.5, color: T.textFaint, fontWeight: 600, textTransform: "uppercase" }}>{h}</th>)}
          </tr></thead>
          <tbody>
            {state.shoppingList.map((i) => (
              <tr key={i.id} className="rowhover" style={{ borderBottom: `1px solid ${T.border}` }}>
                <td style={{ padding: "10px 16px" }}>
                  <Input T={T} value={i.name} onChange={(e) => updateShop(i.id, { name: e.target.value })} style={{ padding: "5px 8px", fontSize: 12.5 }} />
                </td>
                <td style={{ padding: "10px 16px" }}>
                  <Input T={T} value={i.category} onChange={(e) => updateShop(i.id, { category: e.target.value })} style={{ padding: "5px 8px", fontSize: 12.5, width: 100 }} />
                </td>
                <td style={{ padding: "10px 16px" }}>
                  <Select T={T} value={i.priority} onChange={(e) => updateShop(i.id, { priority: e.target.value })} style={{ padding: "5px 8px", fontSize: 12.5 }}>
                    <option>Low</option><option>Medium</option><option>High</option>
                  </Select>
                </td>
                <td style={{ padding: "10px 16px" }}>
                  <Input T={T} type="number" value={i.price} onChange={(e) => updateShop(i.id, { price: e.target.value })} style={{ padding: "5px 8px", fontSize: 12.5, width: 110 }} />
                </td>
                <td style={{ padding: "10px 16px" }}>
                  <Select T={T} value={i.status} onChange={(e) => updateShop(i.id, { status: e.target.value })} style={{ padding: "5px 8px", fontSize: 12.5 }}>
                    {SHOP_STATUSES.map((s) => <option key={s} value={s}>{SHOP_STATUS_LABEL[s]}</option>)}
                  </Select>
                </td>
                <td style={{ padding: "10px 16px" }}>
                  <a href={i.url} target="_blank" rel="noreferrer" style={{ color: T.accent, display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12 }}>
                    Buka <ExternalLink size={12} />
                  </a>
                </td>
                <td style={{ padding: "10px 16px" }}>
                  <IconBtn T={T} icon={Trash2} danger onClick={() => patch("shoppingList", (list) => list.filter((x) => x.id !== i.id))} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ padding: 14 }}>
          <Btn T={T} variant="subtle" icon={Plus} onClick={() => patch("shoppingList", (list) => [...list, { id: uid("sl"), name: "Item baru", url: "", category: "Chemical", priority: "Medium", price: 0, status: "not_purchased", supplier: "", purchaseDate: "", notes: "" }])}>Tambah item belanja</Btn>
        </div>
      </Card>

      <Modal T={T} open={!!modal} onClose={() => setModal(null)} title={modal && state.equipment.some((x) => x.id === modal.id) ? "Edit peralatan" : "Tambah peralatan"}>
        {modal && <EquipForm T={T} value={modal} onSave={save} />}
      </Modal>
    </div>
  );
}
function EquipForm({ T, value, onSave }) {
  const [f, setF] = useState(value);
  const up = (k) => (e) => setF({ ...f, [k]: e.target.value });
  return (
    <div>
      <Field T={T} label="Nama peralatan"><Input T={T} value={f.name} onChange={up("name")} /></Field>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Field T={T} label="Tanggal beli"><Input T={T} type="date" value={f.purchaseDate} onChange={up("purchaseDate")} /></Field>
        <Field T={T} label="Harga beli"><Input T={T} type="number" value={f.purchasePrice} onChange={up("purchasePrice")} /></Field>
        <Field T={T} label="Estimasi umur (bulan)"><Input T={T} type="number" value={f.lifetimeMonths} onChange={up("lifetimeMonths")} /></Field>
        <Field T={T} label="Kondisi">
          <Select T={T} value={f.condition} onChange={up("condition")}><option>Good</option><option>Fair</option><option>Poor</option></Select>
        </Field>
      </div>
      <Field T={T} label="Jadwal maintenance"><Input T={T} value={f.maintenanceSchedule} onChange={up("maintenanceSchedule")} placeholder="Setiap 3 bulan" /></Field>
      <Field T={T} label="Garansi"><Input T={T} value={f.warranty} onChange={up("warranty")} /></Field>
      <Btn T={T} onClick={() => onSave(f)} style={{ width: "100%" }}>Simpan peralatan</Btn>
    </div>
  );
}

/* ===================== INVESTMENT ===================== */
function emptyInvestment() { return { id: uid("in"), name: "", category: "Equipment", priority: "Medium", estimatedCost: 0, targetDate: "", reason: "", businessImpact: "", currentProgress: 0, status: "Planned" }; }
function InvestmentView({ T, state, patch, computed }) {
  const [modal, setModal] = useState(null);
  const save = (i) => { patch("investments", (list) => (list.some((x) => x.id === i.id) ? list.map((x) => (x.id === i.id ? i : x)) : [...list, i])); setModal(null); };
  const remove = (id) => patch("investments", (list) => list.filter((i) => i.id !== id));

  return (
    <div>
      <SectionHeader T={T} title="Investment Planner" sub="Reinvestasi profit untuk pertumbuhan bisnis"
        action={<Btn T={T} icon={Plus} onClick={() => setModal(emptyInvestment())}>Tambah target investasi</Btn>} />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12, marginBottom: 18 }}>
        <Stat T={T} label="Rata-rata profit/bulan" value={fmtIDR(computed.avgMonthlyProfit)} icon={TrendingUp} />
        <Stat T={T} label="Total dana investasi" value={fmtIDR(computed.currentInvestmentAlloc)} icon={Wallet} />
        <Stat T={T} label="Kas tersedia" value={fmtIDR(computed.currentCash)} icon={DollarSign} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px,1fr))", gap: 12 }}>
        {state.investments.map((i) => {
          const needed = Math.max(0, Number(i.estimatedCost) - Number(i.currentProgress));
          const progressPct = Number(i.estimatedCost) > 0 ? (Number(i.currentProgress) / Number(i.estimatedCost)) * 100 : 0;
          const monthsNeeded = computed.avgMonthlyProfit > 0 ? Math.ceil(needed / computed.avgMonthlyProfit) : null;
          return (
            <Card T={T} key={i.id}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: 14.5, fontWeight: 600 }}>{i.name}</div>
                  <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                    <Badge T={T} tone={i.priority === "High" ? "danger" : i.priority === "Medium" ? "amber" : "neutral"}>{i.priority}</Badge>
                    <Badge T={T} tone="accent">{i.status}</Badge>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <IconBtn T={T} icon={Pencil} onClick={() => setModal(i)} />
                  <IconBtn T={T} icon={Trash2} danger onClick={() => remove(i.id)} />
                </div>
              </div>
              <div style={{ margin: "12px 0 6px", display: "flex", justifyContent: "space-between", fontSize: 12, color: T.textDim }}>
                <span>{fmtIDR(i.currentProgress)}</span><span>{fmtIDR(i.estimatedCost)}</span>
              </div>
              <Progress T={T} value={progressPct} />
              <div style={{ fontSize: 12, color: T.textDim, marginTop: 10, lineHeight: 1.7 }}>
                <div>Kurang: <b style={{ color: T.text }}>{fmtIDR(needed)}</b></div>
                <div>Estimasi tercapai: <b style={{ color: T.text }}>{monthsNeeded !== null ? `${monthsNeeded} bulan lagi` : "Perlu data profit"}</b></div>
                {i.reason && <div style={{ marginTop: 6 }}>{i.reason}</div>}
              </div>
            </Card>
          );
        })}
      </div>

      <Modal T={T} open={!!modal} onClose={() => setModal(null)} title={modal && state.investments.some((x) => x.id === modal.id) ? "Edit target" : "Target investasi baru"}>
        {modal && <InvestForm T={T} value={modal} onSave={save} />}
      </Modal>
    </div>
  );
}
function InvestForm({ T, value, onSave }) {
  const [f, setF] = useState(value);
  const up = (k) => (e) => setF({ ...f, [k]: e.target.value });
  return (
    <div>
      <Field T={T} label="Nama investasi"><Input T={T} value={f.name} onChange={up("name")} /></Field>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Field T={T} label="Kategori"><Input T={T} value={f.category} onChange={up("category")} /></Field>
        <Field T={T} label="Prioritas"><Select T={T} value={f.priority} onChange={up("priority")}><option>Low</option><option>Medium</option><option>High</option></Select></Field>
        <Field T={T} label="Estimasi biaya"><Input T={T} type="number" value={f.estimatedCost} onChange={up("estimatedCost")} /></Field>
        <Field T={T} label="Dana terkumpul"><Input T={T} type="number" value={f.currentProgress} onChange={up("currentProgress")} /></Field>
        <Field T={T} label="Target tanggal"><Input T={T} type="date" value={f.targetDate} onChange={up("targetDate")} /></Field>
        <Field T={T} label="Status"><Select T={T} value={f.status} onChange={up("status")}><option>Planned</option><option>Saving</option><option>Purchased</option></Select></Field>
      </div>
      <Field T={T} label="Alasan"><TextArea T={T} value={f.reason} onChange={up("reason")} /></Field>
      <Field T={T} label="Dampak ke bisnis"><TextArea T={T} value={f.businessImpact} onChange={up("businessImpact")} /></Field>
      <Btn T={T} onClick={() => onSave(f)} style={{ width: "100%" }}>Simpan target</Btn>
    </div>
  );
}

/* ===================== ANALYTICS ===================== */
function AnalyticsView({ T, state, computed }) {
  const c = computed;
  const avgTicket = state.bookings.length ? state.bookings.reduce((a, b) => a + Number(b.price || 0), 0) / state.bookings.length : 0;
  const retention = c.totalCustomers ? (c.returningCustomers / c.totalCustomers) * 100 : 0;
  const byService = {};
  state.bookings.forEach((b) => { byService[b.service] = (byService[b.service] || 0) + Number(b.price || 0); });
  const serviceData = Object.entries(byService).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  const bestMonth = [...c.monthly].sort((a, b) => b.profit - a.profit)[0];
  const worstMonth = [...c.monthly].sort((a, b) => a.profit - b.profit)[0];

  return (
    <div>
      <SectionHeader T={T} title="Business Analytics" sub="Insight performa bisnis secara menyeluruh" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12, marginBottom: 14 }}>
        <Stat T={T} label="Rata-rata nilai transaksi" value={fmtIDR(avgTicket)} icon={DollarSign} />
        <Stat T={T} label="Retensi pelanggan" value={retention.toFixed(0) + "%"} icon={Heart} />
        <Stat T={T} label="Bulan terbaik" value={bestMonth ? bestMonth.month : "-"} sub={bestMonth ? fmtIDR(bestMonth.profit) : ""} icon={TrendingUp} />
        <Stat T={T} label="Bulan terlemah" value={worstMonth ? worstMonth.month : "-"} sub={worstMonth ? fmtIDR(worstMonth.profit) : ""} icon={ArrowDownRight} />
      </div>

      <Card T={T} style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 12 }}>Revenue by service</div>
        {serviceData.length === 0 ? <Empty T={T} icon={BarChart3} title="Belum ada data" sub="Data akan muncul setelah ada booking selesai." /> : (
          <div style={{ width: "100%", height: Math.max(180, serviceData.length * 42) }}>
            <ResponsiveContainer>
              <BarChart data={serviceData} layout="vertical" margin={{ left: 10 }}>
                <CartesianGrid stroke={T.border} strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" stroke={T.textFaint} fontSize={11} tickFormatter={(v) => (v / 1000).toFixed(0) + "k"} />
                <YAxis type="category" dataKey="name" stroke={T.textFaint} fontSize={12} width={120} />
                <Tooltip formatter={(v) => fmtIDR(v)} contentStyle={{ background: T.surface2, border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="value" fill={T.accent} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>

      <Card T={T}>
        <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 12 }}>Profit per bulan</div>
        <div style={{ width: "100%", height: 220 }}>
          <ResponsiveContainer>
            <LineChart data={c.monthly}>
              <CartesianGrid stroke={T.border} strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" stroke={T.textFaint} fontSize={11.5} tickLine={false} axisLine={false} />
              <YAxis stroke={T.textFaint} fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => (v / 1000).toFixed(0) + "k"} width={44} />
              <Tooltip formatter={(v) => fmtIDR(v)} contentStyle={{ background: T.surface2, border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 12 }} />
              <Line type="monotone" dataKey="profit" stroke={T.accent2} strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}

/* ===================== ROADMAP ===================== */
function RoadmapView({ T, state, patch, computed }) {
  const rotary = state.investments.find((i) => i.name.toLowerCase().includes("rotary"));
  const autoPct = (auto) => {
    if (auto === "customers10") return Math.min(100, (computed.totalCustomers / 10) * 100);
    if (auto === "customers50") return Math.min(100, (computed.totalCustomers / 50) * 100);
    if (auto === "customers100") return Math.min(100, (computed.totalCustomers / 100) * 100);
    if (auto === "investment") return rotary ? Math.min(100, (Number(rotary.currentProgress) / Math.max(1, Number(rotary.estimatedCost))) * 100) : 0;
    return null;
  };
  const setManual = (id, pct) => patch("roadmapProgress", (rp) => ({ ...rp, [id]: pct }));

  return (
    <div>
      <SectionHeader T={T} title="Growth Roadmap" sub="7 tahap perjalanan Carelm Store menuju bisnis profesional" />
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {ROADMAP_STAGES.map((stage) => {
          const auto = autoPct(stage.auto);
          const pct = auto !== null ? auto : (state.roadmapProgress[stage.id] ?? 0);
          const done = pct >= 100;
          return (
            <Card T={T} key={stage.id} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
                background: done ? T.successDim : T.surface2, color: done ? T.success : T.textDim, fontWeight: 700, fontSize: 14,
              }}>{done ? <CheckCircle2 size={17} /> : stage.stage}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{stage.title}</div>
                  <span style={{ fontSize: 12.5, color: T.textDim, fontFamily: "var(--mono)" }}>{pct.toFixed(0)}%</span>
                </div>
                <div style={{ fontSize: 12.5, color: T.textDim, margin: "4px 0 10px" }}>{stage.requirement}{stage.budget > 0 ? ` · Estimasi budget ${fmtIDR(stage.budget)}` : ""}</div>
                <Progress T={T} value={pct} tone={done ? "success" : "accent"} />
                {auto === null && (
                  <input type="range" min="0" max="100" value={pct} onChange={(e) => setManual(stage.id, Number(e.target.value))} style={{ width: "100%", marginTop: 10 }} />
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

/* ===================== DAILY OPERATIONS ===================== */
function Checklist({ T, ops, toggle, title, items, section }) {
  const doneCount = items.filter((it) => ops[section][it]).length;
  return (
    <Card T={T} style={{ flex: 1 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ fontSize: 13.5, fontWeight: 600 }}>{title}</div>
        <Badge T={T} tone={doneCount === items.length ? "success" : "neutral"}>{doneCount}/{items.length}</Badge>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {items.map((it) => (
          <label key={it} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 9, background: T.surface2, cursor: "pointer" }}>
            <input type="checkbox" checked={!!ops[section][it]} onChange={() => toggle(section, it)} />
            <span style={{ fontSize: 13, color: ops[section][it] ? T.textDim : T.text, textDecoration: ops[section][it] ? "line-through" : "none" }}>{it}</span>
          </label>
        ))}
      </div>
    </Card>
  );
}

function DailyOpsView({ T, state, patch }) {
  const today = todayStr();
  const ops = state.dailyOps.date === today ? state.dailyOps : { date: today, opening: {}, closing: {} };
  useEffect(() => {
    if (state.dailyOps.date !== today) patch("dailyOps", { date: today, opening: {}, closing: {} });
  }, []); // eslint-disable-line

  const toggle = (section, item) => patch("dailyOps", (d) => {
    const base = d.date === today ? d : { date: today, opening: {}, closing: {} };
    return { ...base, [section]: { ...base[section], [item]: !base[section][item] } };
  });

  return (
    <div>
      <SectionHeader T={T} title="Daily Operations" sub={`Checklist harian · ${fmtDate(today)} · reset otomatis tiap hari`} />
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
        <Checklist T={T} ops={ops} toggle={toggle} title="Sebelum buka" items={DAILY_OPENING} section="opening" />
        <Checklist T={T} ops={ops} toggle={toggle} title="Sebelum tutup" items={DAILY_CLOSING} section="closing" />
      </div>
    </div>
  );
}

/* ===================== NOTES ===================== */
function NotesView({ T, state, patch }) {
  const [active, setActive] = useState(state.notes[0]?.id || null);
  const activeNote = state.notes.find((n) => n.id === active);

  const addNote = () => {
    const n = { id: uid("nt"), title: "Catatan baru", content: "", updatedAt: new Date().toISOString(), pinned: false };
    patch("notes", (list) => [n, ...list]);
    setActive(n.id);
  };
  const updateNote = (id, fields) => patch("notes", (list) => list.map((n) => (n.id === id ? { ...n, ...fields, updatedAt: new Date().toISOString() } : n)));
  const removeNote = (id) => { patch("notes", (list) => list.filter((n) => n.id !== id)); if (active === id) setActive(null); };

  return (
    <div>
      <SectionHeader T={T} title="Notes" sub="Catatan bebas gaya Notion" action={<Btn T={T} icon={Plus} onClick={addNote}>Catatan baru</Btn>} />
      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 14, minHeight: 380 }}>
        <Card T={T} padding={8}>
          {state.notes.length === 0 ? <div style={{ fontSize: 12.5, color: T.textDim, padding: 10 }}>Belum ada catatan.</div> : (
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {state.notes.map((n) => (
                <button key={n.id} onClick={() => setActive(n.id)} style={{
                  textAlign: "left", padding: "9px 10px", borderRadius: 8, border: "none", cursor: "pointer",
                  background: active === n.id ? T.surface2 : "transparent", color: T.text, fontSize: 12.5, fontWeight: active === n.id ? 600 : 400,
                }}>{n.title || "Tanpa judul"}</button>
              ))}
            </div>
          )}
        </Card>
        <Card T={T}>
          {!activeNote ? <Empty T={T} icon={StickyNote} title="Pilih atau buat catatan" sub="Catatan Anda akan tampil di sini." /> : (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <Input T={T} value={activeNote.title} onChange={(e) => updateNote(activeNote.id, { title: e.target.value })} style={{ fontSize: 15, fontWeight: 600, border: "none", background: "transparent", padding: 0 }} />
                <IconBtn T={T} icon={Trash2} danger onClick={() => removeNote(activeNote.id)} />
              </div>
              <TextArea T={T} value={activeNote.content} onChange={(e) => updateNote(activeNote.id, { content: e.target.value })} style={{ minHeight: 280, border: "none", background: "transparent", padding: 0, fontSize: 13.5, lineHeight: 1.7 }} placeholder="Tulis catatan Anda..." />
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

/* ===================== SETTINGS ===================== */
function SettingsView({ T, state, patchSettings, setState, cloud, cloudSync, cloudMsg, pushNow, pullNow }) {
  const s = state.settings;
  const up = (k) => (e) => patchSettings({ [k]: e.target.value });

  const exportData = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "carelm-store-backup.json"; a.click();
  };
  const importData = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        setState({ ...DEFAULT_STATE, ...parsed, settings: { ...DEFAULT_STATE.settings, ...(parsed.settings || {}) } });
      } catch { alert("File tidak valid."); }
    };
    reader.readAsText(file);
  };

  return (
    <div>
      <SectionHeader T={T} title="Settings" sub="Informasi bisnis dan preferensi" />
      <Card T={T} style={{ maxWidth: 560, marginBottom: 14 }}>
        <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 14 }}>Informasi bisnis</div>
        <Field T={T} label="Nama bisnis"><Input T={T} value={s.businessName} onChange={up("businessName")} /></Field>
        <Field T={T} label="Logo (inisial)"><Input T={T} value={s.logoText} onChange={up("logoText")} maxLength={2} /></Field>
        <Field T={T} label="Alamat"><Input T={T} value={s.address} onChange={up("address")} /></Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field T={T} label="WhatsApp"><Input T={T} value={s.whatsapp} onChange={up("whatsapp")} /></Field>
          <Field T={T} label="Instagram"><Input T={T} value={s.instagram} onChange={up("instagram")} /></Field>
        </div>
        <Field T={T} label="Catatan harga (opsional)"><TextArea T={T} value={s.pricingNote} onChange={up("pricingNote")} /></Field>
      </Card>

      <Card T={T} style={{ maxWidth: 560, marginBottom: 14 }}>
        <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 14 }}>Tampilan</div>
        <div style={{ display: "flex", gap: 8 }}>
          <Btn T={T} variant={s.theme === "dark" ? "default" : "subtle"} icon={Moon} onClick={() => patchSettings({ theme: "dark" })}>Dark</Btn>
          <Btn T={T} variant={s.theme === "light" ? "default" : "subtle"} icon={Sun} onClick={() => patchSettings({ theme: "light" })}>Light</Btn>
        </div>
      </Card>

      <CloudCard T={T} cloud={cloud} cloudSync={cloudSync} cloudMsg={cloudMsg} pushNow={pushNow} pullNow={pullNow} />

      <Card T={T} style={{ maxWidth: 560 }}>
        <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 14 }}>Data</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Btn T={T} variant="subtle" icon={Download} onClick={exportData}>Export semua data</Btn>
          <label style={{
            display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 14px", borderRadius: 9,
            border: `1px solid ${T.border}`, background: T.surface2, fontSize: 13, cursor: "pointer",
          }}>
            <Upload size={14} /> Import data
            <input type="file" accept="application/json" onChange={importData} style={{ display: "none" }} />
          </label>
        </div>
        <div style={{ fontSize: 12, color: T.textFaint, marginTop: 10 }}>Data tersimpan otomatis (lokal) dan bersifat pribadi untuk akun Anda.</div>
      </Card>
    </div>
  );
}

/* ===================== SUPABASE CLOUD CARD ===================== */
function CloudCard({ T, cloud, cloudSync, cloudMsg, pushNow, pullNow }) {
  const [mode, setMode] = useState("signin"); // signin | signup
  const [url, setUrl] = useState(cloud.cfg?.url || "");
  const [anonKey, setAnonKey] = useState(cloud.cfg?.anonKey || "");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notice, setNotice] = useState("");

  const connected = cloud.status === "connected";

  const doAuth = async () => {
    setNotice("");
    if (!url || !anonKey || !email || !password) { setNotice("Lengkapi semua field terlebih dahulu."); return; }
    if (mode === "signin") {
      await cloud.signIn(url.trim(), anonKey.trim(), email.trim(), password);
    } else {
      const res = await cloud.signUp(url.trim(), anonKey.trim(), email.trim(), password);
      if (res.ok && res.needsConfirm) setNotice("Cek email Anda untuk konfirmasi akun, lalu login.");
    }
  };

  return (
    <Card T={T} style={{ maxWidth: 560, marginBottom: 14 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
        <div style={{ fontSize: 13.5, fontWeight: 600 }}>Database (Supabase)</div>
        <Badge T={T} tone={connected ? "success" : cloud.status === "error" ? "danger" : "neutral"}>
          {connected ? "Terhubung" : cloud.status === "connecting" ? "Menghubungkan..." : cloud.status === "error" ? "Error" : "Belum terhubung"}
        </Badge>
      </div>
      <div style={{ fontSize: 12, color: T.textDim, marginBottom: 14, lineHeight: 1.6 }}>
        Hubungkan ke project Supabase Anda supaya data tersimpan di database sungguhan (Postgres), bukan hanya penyimpanan lokal. Jalankan dulu SQL schema yang disediakan di Supabase SQL Editor.
      </div>

      {!connected ? (
        <div>
          <Field T={T} label="Project URL"><Input T={T} value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://xxxxx.supabase.co" /></Field>
          <Field T={T} label="Anon public key"><Input T={T} value={anonKey} onChange={(e) => setAnonKey(e.target.value)} placeholder="eyJhbGciOi..." /></Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field T={T} label="Email"><Input T={T} type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
            <Field T={T} label="Password"><Input T={T} type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></Field>
          </div>
          {(notice || cloud.error) && <div style={{ fontSize: 12, color: T.danger, marginBottom: 10 }}>{notice || cloud.error}</div>}
          <div style={{ display: "flex", gap: 8 }}>
            <Btn T={T} onClick={doAuth} disabled={cloud.status === "connecting"}>{mode === "signin" ? "Masuk & Hubungkan" : "Daftar & Hubungkan"}</Btn>
            <Btn T={T} variant="subtle" onClick={() => setMode(mode === "signin" ? "signup" : "signin")}>
              {mode === "signin" ? "Belum punya akun? Daftar" : "Sudah punya akun? Masuk"}
            </Btn>
          </div>
        </div>
      ) : (
        <div>
          <div style={{ fontSize: 12.5, color: cloudSync === "error" ? T.danger : T.textDim, fontWeight: cloudSync === "error" ? 600 : 400, marginBottom: 12 }}>
            {cloudSync === "syncing" ? "Menyinkronkan..." : cloudMsg || "Terhubung."}
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
            <Btn T={T} variant="subtle" icon={Upload} onClick={pushNow}>Paksa upload sekarang</Btn>
            <Btn T={T} variant="subtle" icon={Download} onClick={pullNow}>Paksa muat dari Supabase</Btn>
            <Btn T={T} variant="danger" onClick={cloud.disconnect}>Putuskan koneksi</Btn>
          </div>
          <div style={{ fontSize: 11.5, color: T.textFaint }}>
            Setiap kali Anda menambah atau mengubah data, sistem otomatis menyimpannya ke Supabase (tanpa perlu klik apa pun). Dua tombol di atas hanya untuk kondisi khusus, misalnya memaksa sinkronisasi ulang.
          </div>
        </div>
      )}
    </Card>
  );
}