import { useState, useEffect, useCallback } from "react";

/* ─────────────────────────────────────────────────────
   ROLES & PERMISSIONS (RBAC)
───────────────────────────────────────────────────── */
const ROLES = {
  ADMIN:    { id: "ADMIN",    label: "Administrador",      color: "#a78bfa", icon: "◈" },
  COMPRAS:  { id: "COMPRAS",  label: "Enc. de Compras",    color: "#38bdf8", icon: "◷" },
  CONSULTA: { id: "CONSULTA", label: "Usuario Consulta",   color: "#94a3b8", icon: "◎" },
};

const PERMISSIONS = {
  createSupplier:     ["ADMIN", "COMPRAS"],
  editSupplier:       ["ADMIN", "COMPRAS"],
  deleteSupplier:     ["ADMIN"],
  rateSupplier:       ["ADMIN", "COMPRAS"],
  createOrder:        ["ADMIN", "COMPRAS"],
  approveOrder:       ["ADMIN"],
  rejectOrder:        ["ADMIN"],
  cancelOrder:        ["ADMIN", "COMPRAS"],
  createProduct:      ["ADMIN", "COMPRAS"],
  editProduct:        ["ADMIN", "COMPRAS"],
  manageUsers:        ["ADMIN"],
  viewReports:        ["ADMIN", "COMPRAS", "CONSULTA"],
  createProveedor:    ["ADMIN"],
  addProductProveedor:["ADMIN", "COMPRAS"],
};

const can = (role, action) => PERMISSIONS[action]?.includes(role) ?? false;

/* ─────────────────────────────────────────────────────
   OC STATES
───────────────────────────────────────────────────── */
const OC_STATES = {
  PENDIENTE:  { label:"Pendiente",  color:"#94a3b8", bg:"rgba(148,163,184,.12)", next:["APROBADA","RECHAZADA","CANCELADA"] },
  APROBADA:   { label:"Aprobada",   color:"#60a5fa", bg:"rgba(96,165,250,.12)",  next:["CANCELADA","EN_TRANSITO"] },
  RECHAZADA:  { label:"Rechazada",  color:"#f87171", bg:"rgba(248,113,113,.12)", next:[] },
  CANCELADA:  { label:"Cancelada",  color:"#475569", bg:"rgba(71,85,105,.12)",   next:[] },
  EN_TRANSITO:{ label:"En Tránsito",color:"#fbbf24", bg:"rgba(251,191,36,.12)",  next:["ENTREGADA"] },
  ENTREGADA:  { label:"Entregada",  color:"#34d399", bg:"rgba(52,211,153,.12)",  next:[] },
};

/* ─────────────────────────────────────────────────────
   INITIAL DATA
───────────────────────────────────────────────────── */
const initSuppliers = [
  { id:"S-001", name:"TechSupply Global",    category:"Electrónicos", country:"China 🇨🇳",     contact:"wei.zhang@techsupply.cn",   phone:"+86 10 8888 9999", leadTime:14, nit:"900.123.456-1", address:"Shenzhen Industrial Park", deleted:false, rating:4.7, ratingCount:12, totalOrders:8,  totalSpent:4850000, createdAt:"2023-01-15", website:"techsupply.cn", paymentTerms:"30 días", minimumOrder:1000 },
  { id:"S-002", name:"AccesParts Co.",        category:"Accesorios",   country:"EE.UU 🇺🇸",     contact:"john.smith@accesparts.com", phone:"+1 555 234 5678", leadTime:7,  nit:"800.234.567-2", address:"Los Angeles, CA",           deleted:false, rating:3.9, ratingCount:7,  totalOrders:4,  totalSpent:1230000, createdAt:"2023-03-22", website:"accesparts.com", paymentTerms:"15 días", minimumOrder:500 },
  { id:"S-003", name:"HomeTech Industries",   category:"Hogar",        country:"Alemania 🇩🇪",   contact:"hans@hometech.de",          phone:"+49 30 12345678", leadTime:21, nit:"700.345.678-3", address:"Berlin, Germany",           deleted:false, rating:4.9, ratingCount:5,  totalOrders:3,  totalSpent:2100000, createdAt:"2023-06-10", website:"hometech.de", paymentTerms:"45 días", minimumOrder:2000 },
];

const initProducts = [
  { id:"P-001", name:"iPhone 15 Pro",        category:"Electrónicos", sku:"APL-IP15P-128",  stock:15, minStock:20, maxStock:150, supplierId:"S-001", unitCost:3200000, salePrice:4680000, leadTime:14, lastOrder:"2024-04-15", createdAt:"2023-05-10", description:"Smartphone premium Apple" },
  { id:"P-002", name:"Samsung Galaxy S24",   category:"Electrónicos", sku:"SAM-GS24-256",   stock:25, minStock:15, maxStock:100, supplierId:"S-001", unitCost:2100000, salePrice:2940000, leadTime:14, lastOrder:"2024-04-20", createdAt:"2023-05-12", description:"Smartphone Android flagship" },
  { id:"P-003", name:"AirPods Pro",          category:"Accesorios",   sku:"APL-APP-2GEN",   stock:8,  minStock:10, maxStock:80,  supplierId:"S-002", unitCost:1400000, salePrice:2010000, leadTime:7,  lastOrder:"2024-04-22", createdAt:"2023-05-15", description:"Auriculares inalámbricos premium" },
];

const initOrders = [
  { id:"OC-2024-089", supplierId:"S-001", productId:"P-001", qty:50,  unitCost:3200000, status:"EN_TRANSITO", createdAt:"2024-04-28", eta:"2024-05-12", approvedBy:"Admin",   notes:"Reposición urgente stock crítico" },
  { id:"OC-2024-088", supplierId:"S-002", productId:"P-003", qty:30,  unitCost:1400000, status:"APROBADA",   createdAt:"2024-04-26", eta:"2024-05-03", approvedBy:"Admin",   notes:"" },
  { id:"OC-2024-087", supplierId:"S-003", productId:"P-001", qty:15,  unitCost:1800000, status:"ENTREGADA",  createdAt:"2024-04-15", eta:"2024-04-30", approvedBy:"Admin",   notes:"Entrega completa verificada" },
];

/* ─────────────────────────────────────────────────────
   HELPERS & UTILITIES
───────────────────────────────────────────────────── */
const fmt = n => `$\u00A0${Number(n).toLocaleString("es-CO")}`;

const stockStatus = p => {
  if (p.stock <= 0) return "agotado";
  if (p.stock < p.minStock) return p.stock <= p.minStock * 0.5 ? "crítico" : "bajo";
  return "ok";
};

const daysLeft = p => {
  const dailyRate = p.maxStock / 30;
  return Math.max(0, Math.round(p.stock / dailyRate));
};

const STOCK_CFG = {
  agotado:{ dot:"#ef4444", text:"#fca5a5", bg:"rgba(239,68,68,.15)", border:"#ef4444", label:"AGOTADO" },
  crítico:{ dot:"#ef4444", text:"#fca5a5", bg:"rgba(239,68,68,.12)", border:"#ef4444", label:"CRÍTICO" },
  bajo:   { dot:"#f59e0b", text:"#fcd34d", bg:"rgba(245,158,11,.12)", border:"#f59e0b", label:"BAJO"   },
  ok:     { dot:"#22c55e", text:"#86efac", bg:"rgba(34,197,94,.1)",   border:"#22c55e", label:"OK"     },
};

const validateEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePhone = phone => /^[\d\s+()-]{7,}$/.test(phone);
const validateNIT = nit => nit.length >= 5;

/* ─────────────────────────────────────────────────────
   COMPONENTS
───────────────────────────────────────────────────── */

function Stars({ rating, onRate, canRate }) {
  return (
    <div style={{ display:"flex", gap:3 }}>
      {[1,2,3,4,5].map(s => (
        <span key={s}
          onClick={() => canRate && onRate && onRate(s)}
          style={{ fontSize:16, cursor: canRate ? "pointer" : "default",
            color: s <= Math.round(rating) ? "#fbbf24" : "rgba(255,255,255,.15)",
            transition:"color .15s" }}>
          ★
        </span>
      ))}
      <span style={{ fontSize:11, color:"#64748b", marginLeft:4, alignSelf:"center" }}>{rating.toFixed(1)}</span>
    </div>
  );
}

function Badge({ status }) {
  const cfg = status.includes("_") && OC_STATES[status] ? OC_STATES[status] : OC_STATES.PENDIENTE;
  return <span style={{ background:cfg.bg, color:cfg.color, borderRadius:6, padding:"3px 10px", fontSize:10, fontFamily:"'Syne Mono',monospace", whiteSpace:"nowrap" }}>{cfg.label}</span>;
}

function RoleBadge({ role }) {
  const r = ROLES[role] || { color:"#64748b", label:"Usuario" };
  return <span style={{ background:`${r.color}18`, color:r.color, borderRadius:20, padding:"3px 12px", fontSize:10, fontFamily:"'Syne Mono',monospace" }}>{r.icon} {r.label}</span>;
}

function Modal({ open, onClose, title, children, width=640 }) {
  if (!open) return null;
  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.75)", backdropFilter:"blur(6px)", zIndex:2000, display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:"#0c1420", border:"1px solid rgba(255,255,255,.09)", borderRadius:20, padding:32, maxWidth:width, width:"100%", maxHeight:"88vh", overflowY:"auto", boxShadow:"0 30px 80px rgba(0,0,0,.6)" }}>
        {title && <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:22, color:"#f1f5f9", margin:"0 0 24px" }}>{title}</h2>}
        {children}
        <button onClick={onClose} style={{ marginTop:20, padding:"9px 22px", background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.08)", borderRadius:8, color:"#64748b", cursor:"pointer", fontSize:12, fontFamily:"'Syne Mono',monospace" }}>✕ Cerrar</button>
      </div>
    </div>
  );
}

function Field({ label, value, mono }) {
  return (
    <div style={{ background:"rgba(255,255,255,.03)", borderRadius:8, padding:"12px 14px" }}>
      <div style={{ fontSize:9, color:"#475569", fontFamily:"'Syne Mono',monospace", letterSpacing:1, marginBottom:4 }}>{label.toUpperCase()}</div>
      <div style={{ fontSize:13, color:"#e2e8f0", fontWeight:500, fontFamily: mono ? "'Syne Mono',monospace" : "inherit" }}>{value}</div>
    </div>
  );
}

function Stat({ label, value, sub, accent, icon }) {
  return (
    <div style={{ background:"rgba(255,255,255,.025)", border:"1px solid rgba(255,255,255,.06)", borderRadius:14, padding:"20px 22px", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:accent }} />
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
        <span style={{ fontSize:10, color:"#475569", fontFamily:"'Syne Mono',monospace", letterSpacing:.8, textTransform:"uppercase" }}>{label}</span>
        <span style={{ fontSize:18 }}>{icon}</span>
      </div>
      <div style={{ fontFamily:"'Playfair Display',serif", fontSize:30, color:"#f1f5f9", lineHeight:1, marginBottom:4 }}>{value}</div>
      <div style={{ fontSize:11, color:"#475569" }}>{sub}</div>
    </div>
  );
}

function Toast({ msg, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3200); return ()=>clearTimeout(t); }, []);
  return (
    <div style={{ position:"fixed", bottom:32, right:32, background:"#0c1420", border:"1px solid rgba(99,102,241,.4)", borderRadius:12, padding:"14px 20px", color:"#e2e8f0", fontSize:13, zIndex:3000, boxShadow:"0 8px 30px rgba(0,0,0,.5)", maxWidth:340, display:"flex", gap:12, alignItems:"center" }}>
      <span style={{ fontSize:18 }}>✓</span>
      <span>{msg}</span>
    </div>
  );
}

function StockBar({ product }) {
  const st = stockStatus(product);
  const cfg = STOCK_CFG[st];
  const pct = Math.min(100, (product.stock / product.maxStock) * 100);
  const minPct = (product.minStock / product.maxStock) * 100;
  return (
    <div style={{ position:"relative", height:5, background:"rgba(255,255,255,.07)", borderRadius:99 }}>
      <div style={{ position:"absolute", height:"100%", width:`${pct}%`, background:cfg.dot, borderRadius:99, transition:"width .6s" }} />
      <div style={{ position:"absolute", left:`${minPct}%`, top:-4, height:13, width:2, background:"#ef4444", borderRadius:1 }} title={`Mínimo: ${product.minStock}`} />
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   MAIN APP
───────────────────────────────────────────────────── */
export default function SupplyOSPro() {
  /* role & tabs */
  const [role, setRole] = useState("ADMIN");
  const [tab, setTab] = useState("dashboard");
  const [toast, setToast] = useState(null);

  /* data */
  const [suppliers, setSuppliers] = useState(initSuppliers);
  const [products, setProducts] = useState(initProducts);
  const [orders, setOrders] = useState(initOrders);

  /* modals */
  const [newSupplierModal, setNewSupplierModal] = useState(false);
  const [addProductModal, setAddProductModal] = useState(null);
  const [supplierModal, setSupplierModal] = useState(null);
  const [orderDetailModal, setOrderDetailModal] = useState(null);
  const [showDeleted, setShowDeleted] = useState(false);

  /* forms */
  const [supForm, setSupForm] = useState({
    name:"", category:"Electrónicos", country:"", contact:"", phone:"",
    leadTime:"", nit:"", address:"", website:"", paymentTerms:"", minimumOrder:""
  });

  const [productForm, setProductForm] = useState({
    name:"", sku:"", stock:"", minStock:"", maxStock:"",
    unitCost:"", salePrice:"", category:"Electrónicos", description:""
  });

  const [errors, setErrors] = useState({});

  const notify = msg => setToast(msg);

  /* ── Computed ── */
  const activeSuppliers = suppliers.filter(s => !s.deleted);
  const visibleSuppliers = showDeleted ? suppliers : activeSuppliers;
  const criticalProducts = products.filter(p => ["crítico","agotado"].includes(stockStatus(p)));
  const lowProducts = products.filter(p => stockStatus(p) === "bajo");
  const pendingOrders = orders.filter(o => o.status === "PENDIENTE");
  const totalInvValue = products.reduce((a,p) => a + p.stock * p.unitCost, 0);

  /* ── ACTIONS ── */
  
  const validateSupplier = (form) => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Nombre requerido";
    if (!form.contact.trim()) newErrors.contact = "Contacto requerido";
    if (!validateEmail(form.contact)) newErrors.contact = "Email inválido";
    if (!form.phone.trim()) newErrors.phone = "Teléfono requerido";
    if (!validatePhone(form.phone)) newErrors.phone = "Teléfono inválido";
    if (!form.nit.trim()) newErrors.nit = "NIT requerido";
    if (!validateNIT(form.nit)) newErrors.nit = "NIT inválido";
    if (!form.country.trim()) newErrors.country = "País requerido";
    if (!form.leadTime || isNaN(form.leadTime) || Number(form.leadTime) <= 0) newErrors.leadTime = "Lead time inválido";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateProduct = (form) => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Nombre requerido";
    if (!form.sku.trim()) newErrors.sku = "SKU requerido";
    if (!form.stock || isNaN(form.stock)) newErrors.stock = "Stock inválido";
    if (!form.minStock || isNaN(form.minStock)) newErrors.minStock = "Stock mín. inválido";
    if (!form.maxStock || isNaN(form.maxStock)) newErrors.maxStock = "Stock máx. inválido";
    if (Number(form.minStock) >= Number(form.maxStock)) newErrors.maxStock = "Máx. debe ser > Mín.";
    if (!form.unitCost || isNaN(form.unitCost) || Number(form.unitCost) <= 0) newErrors.unitCost = "Costo inválido";
    if (!form.salePrice || isNaN(form.salePrice) || Number(form.salePrice) <= 0) newErrors.salePrice = "Precio inválido";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createSupplier = () => {
    if (!can(role, "createSupplier")) { notify("⛔ Sin permisos"); return; }
    if (!validateSupplier(supForm)) return;

    const newS = {
      id: `S-${String(suppliers.length + 1).padStart(3, "0")}`,
      ...supForm,
      leadTime: Number(supForm.leadTime),
      minimumOrder: Number(supForm.minimumOrder) || 0,
      deleted: false,
      rating: 0,
      ratingCount: 0,
      totalOrders: 0,
      totalSpent: 0,
      createdAt: new Date().toISOString().slice(0,10),
    };
    setSuppliers(ss => [...ss, newS]);
    setNewSupplierModal(false);
    setSupForm({ name:"", category:"Electrónicos", country:"", contact:"", phone:"", leadTime:"", nit:"", address:"", website:"", paymentTerms:"", minimumOrder:"" });
    setErrors({});
    notify(`✓ Proveedor ${newS.name} registrado`);
  };

  const addProductToSupplier = () => {
    if (!can(role, "addProductProveedor")) { notify("⛔ Sin permisos"); return; }
    if (!validateProduct(productForm)) return;

    const newP = {
      id: `P-${String(products.length + 1).padStart(3, "0")}`,
      ...productForm,
      stock: Number(productForm.stock),
      minStock: Number(productForm.minStock),
      maxStock: Number(productForm.maxStock),
      unitCost: Number(productForm.unitCost),
      salePrice: Number(productForm.salePrice),
      supplierId: addProductModal,
      leadTime: suppliers.find(s => s.id === addProductModal)?.leadTime || 7,
      lastOrder: new Date().toISOString().slice(0,10),
      createdAt: new Date().toISOString().slice(0,10),
    };
    setProducts(ps => [...ps, newP]);
    setAddProductModal(null);
    setProductForm({ name:"", sku:"", stock:"", minStock:"", maxStock:"", unitCost:"", salePrice:"", category:"Electrónicos", description:"" });
    setErrors({});
    notify(`✓ Producto ${newP.name} agregado al proveedor`);
  };

  const rateSupplier = (supplierId, stars) => {
    if (!can(role, "rateSupplier")) { notify("⛔ Sin permisos"); return; }
    setSuppliers(ss => ss.map(s => {
      if (s.id !== supplierId) return s;
      const newCount = s.ratingCount + 1;
      const newRating = ((s.rating * s.ratingCount) + stars) / newCount;
      return { ...s, rating: newRating, ratingCount: newCount };
    }));
    notify(`✓ Calificación registrada: ${stars} ★`);
  };

  const softDelete = (supplierId) => {
    if (!can(role, "deleteSupplier")) { notify("⛔ Solo Admin"); return; }
    setSuppliers(ss => ss.map(s => s.id === supplierId ? { ...s, deleted: true } : s));
    notify("Proveedor desactivado");
  };

  const restore = (supplierId) => {
    setSuppliers(ss => ss.map(s => s.id === supplierId ? { ...s, deleted: false } : s));
    notify("Proveedor restaurado");
  };

  /* ── Styles ── */
  const S = {
    root: { minHeight:"100vh", background:"#080c15", color:"#e2e8f0", fontFamily:"'DM Sans',sans-serif", position:"relative" },
    grid: { position:"fixed", inset:0, backgroundImage:"linear-gradient(rgba(99,102,241,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,.025) 1px,transparent 1px)", backgroundSize:"48px 48px", pointerEvents:"none", zIndex:0 },
    sidebar: { position:"fixed", left:0, top:0, bottom:0, width:230, background:"rgba(8,12,21,.97)", borderRight:"1px solid rgba(255,255,255,.055)", zIndex:100, display:"flex", flexDirection:"column" },
    main: { marginLeft:230, padding:"36px 40px", position:"relative", zIndex:1, minHeight:"100vh" },
    input: { padding:"10px 14px", background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.08)", borderRadius:9, color:"#e2e8f0", fontSize:13, outline:"none", width:"100%", fontFamily:"'DM Sans',sans-serif" },
    btn: (bg,fg="#fff") => ({ padding:"10px 20px", background:bg, border:"none", borderRadius:9, color:fg, fontSize:13, fontWeight:600, cursor:"pointer" }),
    th: { padding:"11px 18px", textAlign:"left", fontSize:9, color:"#475569", fontFamily:"'Syne Mono',monospace", letterSpacing:1, textTransform:"uppercase", fontWeight:400 },
    td: { padding:"13px 18px", fontSize:13, borderTop:"1px solid rgba(255,255,255,.035)" },
  };

  const TABS = [
    { id:"dashboard", icon:"⬡", label:"Dashboard" },
    { id:"stock",     icon:"◈", label:"Stock & Productos" },
    { id:"suppliers", icon:"◎", label:"Proveedores" },
    { id:"orders",    icon:"◷", label:"Órdenes" },
  ];

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;700&family=DM+Sans:wght@300;400;500;600;700&family=Syne+Mono&display=swap" rel="stylesheet" />
      <div style={S.root}>
        <div style={S.grid} />

        {/* ── SIDEBAR ── */}
        <aside style={S.sidebar}>
          <div style={{ padding:"26px 22px 22px", borderBottom:"1px solid rgba(255,255,255,.05)" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:38, height:38, background:"linear-gradient(135deg,#6366f1,#a78bfa)", borderRadius:11, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, fontWeight:700 }}>⬡</div>
              <div>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:17, color:"#f1f5f9", lineHeight:1 }}>SupplyOS</div>
                <div style={{ fontSize:9, color:"#475569", fontFamily:"'Syne Mono',monospace", marginTop:2 }}>PRO v4.0</div>
              </div>
            </div>
          </div>

          {/* role switcher */}
          <div style={{ padding:"14px 16px", borderBottom:"1px solid rgba(255,255,255,.05)" }}>
            <div style={{ fontSize:9, color:"#475569", fontFamily:"'Syne Mono',monospace", marginBottom:8 }}>ROL ACTIVO</div>
            <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
              {Object.values(ROLES).map(r => (
                <button key={r.id} onClick={() => setRole(r.id)} style={{
                  display:"flex", alignItems:"center", gap:8, padding:"7px 10px", borderRadius:8, border:"none", cursor:"pointer", fontSize:12, fontFamily:"'DM Sans',sans-serif",
                  background: role === r.id ? `${r.color}18` : "transparent",
                  color: role === r.id ? r.color : "#475569",
                  fontWeight: role === r.id ? 600 : 400,
                }}>
                  <span>{r.icon}</span> {r.label}
                  {role === r.id && <span style={{ marginLeft:"auto", width:6, height:6, borderRadius:"50%", background:r.color }} />}
                </button>
              ))}
            </div>
          </div>

          {/* nav */}
          <nav style={{ padding:"16px 12px", flex:1 }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                width:"100%", display:"flex", alignItems:"center", gap:11, padding:"10px 13px",
                borderRadius:10, border:"none", cursor:"pointer", marginBottom:3,
                background: tab === t.id ? "rgba(99,102,241,.15)" : "transparent",
                color: tab === t.id ? "#a5b4fc" : "#4b5563",
                fontSize:13, fontFamily:"'DM Sans',sans-serif", fontWeight: tab === t.id ? 600 : 400,
                borderLeft: tab === t.id ? "2px solid #6366f1" : "2px solid transparent",
              }}>
                <span style={{ fontSize:15 }}>{t.icon}</span> {t.label}
                {t.id === "orders" && pendingOrders.length > 0 && (
                  <span style={{ marginLeft:"auto", background:"#ef4444", color:"#fff", borderRadius:99, minWidth:18, height:18, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700 }}>{pendingOrders.length}</span>
                )}
              </button>
            ))}
          </nav>

          {/* alerts */}
          <div style={{ margin:"0 12px 20px", background:"rgba(239,68,68,.07)", border:"1px solid rgba(239,68,68,.18)", borderRadius:12, padding:"13px 15px" }}>
            <div style={{ fontSize:9, color:"#ef4444", fontFamily:"'Syne Mono',monospace", letterSpacing:.8, marginBottom:10 }}>🔴 STOCK</div>
            <div style={{ display:"flex", justifyContent:"space-around" }}>
              {[{v:criticalProducts.length,l:"Críticos",c:"#fca5a5"},{v:lowProducts.length,l:"Bajos",c:"#fcd34d"},{v:pendingOrders.length,l:"OC Pend.",c:"#a5b4fc"}].map(x=>(
                <div key={x.l} style={{ textAlign:"center" }}>
                  <div style={{ fontFamily:"'Playfair Display',serif", fontSize:22, color:x.c }}>{x.v}</div>
                  <div style={{ fontSize:9, color:"#475569" }}>{x.l}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ padding:"0 16px 20px", borderTop:"1px solid rgba(255,255,255,.05)", paddingTop:14 }}>
            <div style={{ display:"flex", alignItems:"center", gap:9 }}>
              <div style={{ width:32, height:32, background:`linear-gradient(135deg,${ROLES[role].color},#0c1420)`, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, border:`1px solid ${ROLES[role].color}55` }}>
                {ROLES[role].icon}
              </div>
              <div>
                <div style={{ fontSize:12, color:"#e2e8f0", fontWeight:600 }}>Sesión</div>
                <div style={{ fontSize:10, color:"#475569", fontFamily:"'Syne Mono',monospace" }}>{ROLES[role].label}</div>
              </div>
            </div>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <main style={S.main}>

          {/* ════ DASHBOARD ════ */}
          {tab === "dashboard" && (
            <>
              <div style={{ marginBottom:28 }}>
                <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:34, color:"#f1f5f9", margin:0 }}>Panel de Control</h1>
                <p style={{ color:"#475569", margin:"5px 0 0", fontSize:13 }}>ERP Avanzado · {activeSuppliers.length} Proveedores · {products.length} Productos</p>
              </div>

              {/* KPIs */}
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:28 }}>
                <Stat label="Proveedores" value={activeSuppliers.length} sub={`${suppliers.filter(s=>s.deleted).length} inactivos`} accent="#6366f1" icon="◎" />
                <Stat label="Valor Inventario" value={`$${(totalInvValue/1000000).toFixed(1)}M`} sub="En bodega" accent="#8b5cf6" icon="◈" />
                <Stat label="Stock Crítico" value={criticalProducts.length} sub={`${lowProducts.length} bajo`} accent="#ef4444" icon="⚠" />
                <Stat label="OC Pendientes" value={pendingOrders.length} sub="Aprobación" accent="#fbbf24" icon="◷" />
              </div>

              {/* Proveedores activos */}
              <div style={{ background:"rgba(255,255,255,.02)", border:"1px solid rgba(255,255,255,.06)", borderRadius:16, padding:22, marginBottom:24 }}>
                <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:18, color:"#f1f5f9", margin:"0 0 16px" }}>Top Proveedores</h3>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:14 }}>
                  {activeSuppliers.slice(0,3).map(s => (
                    <div key={s.id} style={{ background:"rgba(255,255,255,.03)", borderRadius:12, padding:16 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
                        <div>
                          <div style={{ fontWeight:700, color:"#f1f5f9", fontSize:14 }}>{s.name}</div>
                          <div style={{ fontSize:10, color:"#475569", fontFamily:"'Syne Mono',monospace" }}>{s.id}</div>
                        </div>
                        <Stars rating={s.rating || 0} />
                      </div>
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, fontSize:11 }}>
                        <span style={{ color:"#64748b" }}>📦 {products.filter(p=>p.supplierId===s.id).length} productos</span>
                        <span style={{ color:"#64748b" }}>{s.leadTime}d lead</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ════ STOCK & PRODUCTOS ════ */}
          {tab === "stock" && (
            <>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:24 }}>
                <div>
                  <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:34, color:"#f1f5f9", margin:0 }}>Stock & Productos</h1>
                  <p style={{ color:"#475569", margin:"5px 0 0", fontSize:13 }}>{products.length} productos · Línea roja = mínimo requerido</p>
                </div>
              </div>

              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))", gap:16 }}>
                {products.map(item => {
                  const st = stockStatus(item);
                  const cfg = STOCK_CFG[st];
                  const sup = suppliers.find(s=>s.id===item.supplierId);
                  return (
                    <div key={item.id} style={{ background:"rgba(255,255,255,.02)", border:`1px solid ${st!=="ok"?cfg.border+"44":"rgba(255,255,255,.06)"}`, borderRadius:14, padding:20, position:"relative", overflow:"hidden" }}>
                      {st !== "ok" && <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:cfg.dot }} />}
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12 }}>
                        <div>
                          <div style={{ fontWeight:600, fontSize:14, color:"#f1f5f9" }}>{item.name}</div>
                          <div style={{ fontSize:10, color:"#475569", fontFamily:"'Syne Mono',monospace", marginTop:2 }}>{item.sku}</div>
                        </div>
                        <span style={{ background:cfg.bg, border:`1px solid ${cfg.border}`, color:cfg.text, borderRadius:6, padding:"3px 9px", fontSize:9, fontFamily:"'Syne Mono',monospace", height:"fit-content" }}>● {cfg.label}</span>
                      </div>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:8 }}>
                        <div>
                          <span style={{ fontFamily:"'Playfair Display',serif", fontSize:34, color:cfg.text }}>{item.stock}</span>
                          <span style={{ color:"#475569", fontSize:12 }}> / {item.maxStock}</span>
                        </div>
                        <div style={{ textAlign:"right" }}>
                          <div style={{ fontSize:11, color: daysLeft(item) <= 3 ? "#fca5a5" : "#64748b" }}>~{daysLeft(item)}d</div>
                          <div style={{ fontSize:10, color:"#475569" }}>mín:{item.minStock}</div>
                        </div>
                      </div>
                      <StockBar product={item} />
                      <div style={{ display:"flex", justifyContent:"space-between", marginTop:10, fontSize:11, color:"#475569" }}>
                        <span>{sup?.name}</span>
                        <span>{item.leadTime}d entrega</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* ════ PROVEEDORES ════ */}
          {tab === "suppliers" && (
            <>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:24 }}>
                <div>
                  <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:34, color:"#f1f5f9", margin:0 }}>Proveedores</h1>
                  <p style={{ color:"#475569", margin:"5px 0 0", fontSize:13 }}>Gestión completa · {activeSuppliers.length} activos</p>
                </div>
                <div style={{ display:"flex", gap:10 }}>
                  {can(role,"deleteSupplier") && (
                    <button onClick={() => setShowDeleted(!showDeleted)} style={{ ...S.btn("rgba(255,255,255,.04)","#94a3b8"), border:"1px solid rgba(255,255,255,.08)", fontSize:12 }}>
                      {showDeleted ? "Ocultar" : "Ver"} inactivos
                    </button>
                  )}
                  {can(role,"createSupplier") && (
                    <button onClick={() => setNewSupplierModal(true)} style={S.btn("linear-gradient(135deg,#6366f1,#8b5cf6)")}>+ Nuevo Proveedor</button>
                  )}
                </div>
              </div>

              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(360px,1fr))", gap:16 }}>
                {visibleSuppliers.map(s => {
                  const prods = products.filter(p=>p.supplierId===s.id);
                  const critProds = prods.filter(p=>stockStatus(p)!=="ok");
                  return (
                    <div key={s.id} style={{ background:"rgba(255,255,255,.02)", border:`1px solid ${s.deleted?"rgba(239,68,68,.2)":"rgba(255,255,255,.06)"}`, borderRadius:16, padding:22, opacity: s.deleted ? .6 : 1, position:"relative" }}>
                      {s.deleted && <div style={{ position:"absolute", top:12, right:12, background:"rgba(239,68,68,.15)", border:"1px solid #ef4444", borderRadius:6, padding:"3px 9px", fontSize:9, color:"#fca5a5", fontFamily:"'Syne Mono',monospace" }}>INACTIVO</div>}
                      
                      <div style={{ display:"flex", gap:12, alignItems:"center", marginBottom:16 }}>
                        <div style={{ width:44, height:44, background:"linear-gradient(135deg,#6366f1,#8b5cf6)", borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, fontFamily:"'Playfair Display',serif", flexShrink:0 }}>{s.name[0]}</div>
                        <div>
                          <div style={{ fontWeight:700, color:"#f1f5f9", fontSize:14 }}>{s.name}</div>
                          <div style={{ fontSize:10, color:"#475569", fontFamily:"'Syne Mono',monospace" }}>{s.id} · {s.country}</div>
                        </div>
                      </div>

                      <Stars rating={s.rating || 0} onRate={(stars) => rateSupplier(s.id, stars)} canRate={can(role,"rateSupplier") && !s.deleted} />

                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, margin:"14px 0" }}>
                        {[
                          { l:"Productos", v:prods.length, c:"#a5b4fc" },
                          { l:"Pedidos", v:s.totalOrders, c:"#e2e8f0" },
                          { l:"Lead Time", v:`${s.leadTime}d`, c:"#34d399" },
                        ].map(m=>(
                          <div key={m.l} style={{ background:"rgba(255,255,255,.03)", borderRadius:8, padding:"9px", textAlign:"center" }}>
                            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:16, color:m.c }}>{m.v}</div>
                            <div style={{ fontSize:9, color:"#475569", marginTop:2 }}>{m.l}</div>
                          </div>
                        ))}
                      </div>

                      <div style={{ fontSize:11, color:"#4b5563", marginBottom:4 }}>📧 {s.contact}</div>
                      <div style={{ fontSize:11, color:"#4b5563", marginBottom:12 }}>📞 {s.phone}</div>

                      <div style={{ display:"flex", gap:8 }}>
                        <button onClick={() => setSupplierModal(s)} style={{ flex:1, ...S.btn("rgba(99,102,241,.12)","#a5b4fc"), border:"1px solid rgba(99,102,241,.25)", fontSize:11, padding:"8px" }}>Ver Detalle</button>
                        {!s.deleted && can(role,"addProductProveedor") && (
                          <button onClick={() => setAddProductModal(s.id)} style={{ ...S.btn("rgba(34,197,94,.12)","#86efac"), border:"1px solid rgba(34,197,94,.25)", fontSize:11, padding:"8px 12px" }} title="Agregar producto">+Pro</button>
                        )}
                        {!s.deleted && can(role,"deleteSupplier") && (
                          <button onClick={() => softDelete(s.id)} style={{ ...S.btn("rgba(239,68,68,.1)","#fca5a5"), border:"1px solid rgba(239,68,68,.25)", fontSize:11, padding:"8px 12px" }} title="Soft delete">🗑</button>
                        )}
                        {s.deleted && can(role,"deleteSupplier") && (
                          <button onClick={() => restore(s.id)} style={{ ...S.btn("rgba(34,197,94,.1)","#86efac"), border:"1px solid rgba(34,197,94,.25)", fontSize:11, padding:"8px 12px" }} title="Restaurar">↺</button>
                        )}
                        {critProds.length > 0 && (
                          <span style={{ background:"rgba(239,68,68,.12)", border:"1px solid #ef4444", color:"#fca5a5", borderRadius:7, padding:"8px 10px", fontSize:10, fontFamily:"'Syne Mono',monospace" }}>{critProds.length}⚠</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* ════ ÓRDENES ════ */}
          {tab === "orders" && (
            <>
              <div style={{ marginBottom:24 }}>
                <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:34, color:"#f1f5f9", margin:0 }}>Órdenes de Compra</h1>
                <p style={{ color:"#475569", margin:"5px 0 0", fontSize:13 }}>{orders.length} órdenes · {pendingOrders.length} pendientes</p>
              </div>

              <div style={{ background:"rgba(255,255,255,.02)", border:"1px solid rgba(255,255,255,.06)", borderRadius:16, overflow:"hidden" }}>
                <table style={{ width:"100%", borderCollapse:"collapse" }}>
                  <thead>
                    <tr style={{ background:"rgba(255,255,255,.018)" }}>
                      {["# OC","Producto","Proveedor","Cant.","Total","Estado","ETA"].map(h=>(
                        <th key={h} style={S.th}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(o => {
                      const pr = products.find(p=>p.id===o.productId);
                      const sup = suppliers.find(s=>s.id===o.supplierId);
                      return (
                        <tr key={o.id} style={{ cursor:"pointer", transition:"background .15s" }}>
                          <td style={S.td}><span style={{ fontFamily:"'Syne Mono',monospace", fontSize:11, color:"#a5b4fc" }}>{o.id}</span></td>
                          <td style={S.td}>
                            <div style={{ fontSize:12, color:"#f1f5f9", fontWeight:500 }}>{pr?.name}</div>
                            <div style={{ fontSize:10, color:"#475569", fontFamily:"'Syne Mono',monospace" }}>{pr?.sku}</div>
                          </td>
                          <td style={S.td}><span style={{ fontSize:12, color:"#94a3b8" }}>{sup?.name}</span></td>
                          <td style={S.td}><span style={{ fontFamily:"'Playfair Display',serif", fontSize:20, color:"#f1f5f9" }}>{o.qty}</span></td>
                          <td style={S.td}><span style={{ fontSize:12, fontWeight:600, color:"#e2e8f0" }}>{fmt(o.qty*o.unitCost)}</span></td>
                          <td style={S.td}><Badge status={o.status} /></td>
                          <td style={S.td}><span style={{ fontSize:11, color:"#475569", fontFamily:"'Syne Mono',monospace" }}>{o.eta}</span></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </main>

        {/* ════ MODAL: NUEVO PROVEEDOR ════ */}
        <Modal open={newSupplierModal} onClose={() => { setNewSupplierModal(false); setErrors({}); }} title="Registrar Nuevo Proveedor" width={700}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
            {[
              { l:"Nombre *",        k:"name",         type:"text", ph:"TechSupply Global" },
              { l:"NIT *",           k:"nit",          type:"text", ph:"900.123.456-1" },
              { l:"Email *",         k:"contact",      type:"email", ph:"contacto@empresa.com" },
              { l:"Teléfono *",      k:"phone",        type:"tel", ph:"+57 4 555 6666" },
              { l:"País",            k:"country",      type:"text", ph:"Colombia 🇨🇴" },
              { l:"Lead Time (días)", k:"leadTime",     type:"number", ph:"7" },
              { l:"Dirección",       k:"address",      type:"text", ph:"Calle 123, Ciudad" },
              { l:"Sitio Web",       k:"website",      type:"url", ph:"www.empresa.com" },
              { l:"Términos Pago",   k:"paymentTerms", type:"text", ph:"30 días" },
              { l:"Min. Orden ($)",  k:"minimumOrder",  type:"number", ph:"1000" },
            ].map(f=>(
              <div key={f.k}>
                <label style={{ fontSize:10, color:"#475569", fontFamily:"'Syne Mono',monospace", display:"block", marginBottom:5 }}>{f.l.toUpperCase()}</label>
                <input style={{ ...S.input, borderColor: errors[f.k] ? "#ef4444" : "rgba(255,255,255,.08)" }} type={f.type} value={supForm[f.k]} onChange={e=>setSupForm(sf=>({...sf,[f.k]:e.target.value}))} placeholder={f.ph} />
                {errors[f.k] && <div style={{ fontSize:9, color:"#ef4444", marginTop:3 }}>⚠ {errors[f.k]}</div>}
              </div>
            ))}
            <div>
              <label style={{ fontSize:10, color:"#475569", fontFamily:"'Syne Mono',monospace", display:"block", marginBottom:5 }}>CATEGORÍA</label>
              <select style={S.input} value={supForm.category} onChange={e=>setSupForm(sf=>({...sf,category:e.target.value}))}>
                {["Electrónicos","Accesorios","Hogar","Ropa","Otros"].map(c=><option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <button onClick={createSupplier} style={{ ...S.btn("linear-gradient(135deg,#6366f1,#8b5cf6)"), marginTop:20, width:"100%", padding:12 }}>
            ✓ Registrar Proveedor
          </button>
        </Modal>

        {/* ════ MODAL: AGREGAR PRODUCTO AL PROVEEDOR ════ */}
        <Modal open={!!addProductModal} onClose={() => { setAddProductModal(null); setErrors({}); }} title="Agregar Producto a Proveedor" width={700}>
          {addProductModal && suppliers.find(s=>s.id===addProductModal) && (
            <>
              <div style={{ background:"rgba(99,102,241,.1)", border:"1px solid rgba(99,102,241,.25)", borderRadius:10, padding:12, marginBottom:20 }}>
                <div style={{ fontSize:11, color:"#a5b4fc", fontFamily:"'Syne Mono',monospace", marginBottom:4 }}>Proveedor asignado</div>
                <div style={{ fontSize:14, color:"#f1f5f9", fontWeight:600 }}>{suppliers.find(s=>s.id===addProductModal)?.name}</div>
              </div>

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                {[
                  { l:"Nombre *",      k:"name",      type:"text", ph:"iPhone 15 Pro" },
                  { l:"SKU *",         k:"sku",       type:"text", ph:"APL-IP15P-128" },
                  { l:"Categoría",     k:"category",  type:"select", opts:["Electrónicos","Accesorios","Hogar","Ropa","Otros"] },
                  { l:"Stock Inicial", k:"stock",     type:"number", ph:"50" },
                  { l:"Stock Mínimo",  k:"minStock",  type:"number", ph:"20" },
                  { l:"Stock Máximo",  k:"maxStock",  type:"number", ph:"150" },
                  { l:"Costo Unit. *", k:"unitCost",  type:"number", ph:"3200000" },
                  { l:"Precio Venta *",k:"salePrice", type:"number", ph:"4680000" },
                ].map(f=>(
                  <div key={f.k}>
                    <label style={{ fontSize:10, color:"#475569", fontFamily:"'Syne Mono',monospace", display:"block", marginBottom:5 }}>{f.l.toUpperCase()}</label>
                    {f.type === "select" ? (
                      <select style={S.input} value={productForm[f.k]} onChange={e=>setProductForm(pf=>({...pf,[f.k]:e.target.value}))}>
                        {f.opts.map(o=><option key={o} value={o}>{o}</option>)}
                      </select>
                    ) : (
                      <input style={{ ...S.input, borderColor: errors[f.k] ? "#ef4444" : "rgba(255,255,255,.08)" }} type={f.type} value={productForm[f.k]} onChange={e=>setProductForm(pf=>({...pf,[f.k]:e.target.value}))} placeholder={f.ph} />
                    )}
                    {errors[f.k] && <div style={{ fontSize:9, color:"#ef4444", marginTop:3 }}>⚠ {errors[f.k]}</div>}
                  </div>
                ))}
              </div>

              <div style={{ marginTop:14 }}>
                <label style={{ fontSize:10, color:"#475569", fontFamily:"'Syne Mono',monospace", display:"block", marginBottom:5 }}>DESCRIPCIÓN</label>
                <textarea style={{ ...S.input, height:70, resize:"vertical" }} value={productForm.description} onChange={e=>setProductForm(pf=>({...pf,description:e.target.value}))} placeholder="Descripción del producto..." />
              </div>

              <button onClick={addProductToSupplier} style={{ ...S.btn("linear-gradient(135deg,#34d399,#10b981)"), marginTop:20, width:"100%", padding:12 }}>
                ✓ Agregar Producto
              </button>
            </>
          )}
        </Modal>

        {/* ════ MODAL: DETALLE PROVEEDOR ════ */}
        <Modal open={!!supplierModal} onClose={() => setSupplierModal(null)} title="Detalle del Proveedor" width={700}>
          {supplierModal && (
            <>
              <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:24 }}>
                <div style={{ width:56, height:56, background:"linear-gradient(135deg,#6366f1,#8b5cf6)", borderRadius:14, display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, fontFamily:"'Playfair Display',serif" }}>{supplierModal.name[0]}</div>
                <div>
                  <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:22, color:"#f1f5f9", margin:0 }}>{supplierModal.name}</h2>
                  <Stars rating={supplierModal.rating || 0} onRate={stars => rateSupplier(supplierModal.id, stars)} canRate={can(role,"rateSupplier") && !supplierModal.deleted} />
                </div>
              </div>

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:20 }}>
                {[
                  { l:"ID", v:supplierModal.id },
                  { l:"NIT", v:supplierModal.nit },
                  { l:"Email", v:supplierModal.contact },
                  { l:"Teléfono", v:supplierModal.phone },
                  { l:"País", v:supplierModal.country },
                  { l:"Lead Time", v:`${supplierModal.leadTime} días` },
                  { l:"Dirección", v:supplierModal.address },
                  { l:"Sitio Web", v:supplierModal.website || "—" },
                  { l:"Términos Pago", v:supplierModal.paymentTerms || "—" },
                  { l:"Orden Mínima", v:fmt(supplierModal.minimumOrder || 0) },
                  { l:"Total Pedidos", v:supplierModal.totalOrders },
                  { l:"Total Invertido", v:fmt(supplierModal.totalSpent) },
                ].map(f=><Field key={f.l} label={f.l} value={f.v} />)}
              </div>

              <div style={{ marginTop:20 }}>
                <h4 style={{ fontFamily:"'Playfair Display',serif", color:"#94a3b8", margin:"0 0 12px", fontSize:15 }}>Productos ({products.filter(p=>p.supplierId===supplierModal.id).length})</h4>
                {products.filter(p=>p.supplierId===supplierModal.id).map(p => {
                  const st = stockStatus(p);
                  const cfg = STOCK_CFG[st];
                  return (
                    <div key={p.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 0", borderBottom:"1px solid rgba(255,255,255,.04)" }}>
                      <div>
                        <span style={{ fontSize:12, color:"#e2e8f0", fontWeight:500 }}>{p.name}</span>
                        <div style={{ fontSize:10, color:"#475569", fontFamily:"'Syne Mono',monospace" }}>{p.sku}</div>
                      </div>
                      <div style={{ display:"flex", gap:12 }}>
                        <span style={{ fontSize:12, color:"#475569" }}>{p.stock} un.</span>
                        <span style={{ background:cfg.bg, color:cfg.text, borderRadius:5, padding:"2px 8px", fontSize:9, fontFamily:"'Syne Mono',monospace" }}>{cfg.label}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </Modal>

        {toast && <Toast msg={toast} onClose={() => setToast(null)} />}
      </div>
    </>
  );
}
