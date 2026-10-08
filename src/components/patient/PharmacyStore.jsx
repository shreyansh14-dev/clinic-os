import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { MEDICINE_CATALOG, MEDICINE_CATEGORIES } from '../../data/medicineCatalog';
import confetti from 'canvas-confetti';
import {
  Search,
  ShoppingCart,
  Pill,
  ShieldCheck,
  Zap,
  Truck,
  CheckCircle2,
  Clock,
  Plus,
  Minus,
  Trash2,
  FileText,
  Upload,
  X,
  Star,
  ChevronRight,
  Sparkles,
  Info,
  MapPin,
  Tag,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

export const PharmacyStore = () => {
  const {
    showToast,
    activePatient,
    prescriptions,
    pharmacyCart: cart,
    addToPharmacyCart,
    updatePharmacyCartQty,
    clearPharmacyCart
  } = useApp();
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState('All Medicines');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyOTC, setOnlyOTC] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null); // Detail modal
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isRxUploadOpen, setIsRxUploadOpen] = useState(false);
  const [rxUploaded, setRxUploaded] = useState(false);

  // Filter medicines
  const filteredMedicines = MEDICINE_CATALOG.filter(med => {
    const matchesCategory = selectedCategory === 'All Medicines' || med.category === selectedCategory;
    const matchesSearch = !searchQuery ||
      med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesOTC = !onlyOTC || !med.prescriptionRequired;

    return matchesCategory && matchesSearch && matchesOTC;
  });

  // Cart Calculations
  const cartItems = Object.entries(cart || {})
    .map(([id, qty]) => {
      const med = MEDICINE_CATALOG.find(m => m.id === id);
      return med ? { ...med, qty } : null;
    })
    .filter(Boolean);

  const cartSubtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const cartMRP = cartItems.reduce((acc, item) => acc + item.mrp * item.qty, 0);
  const totalSavings = cartMRP - cartSubtotal;
  const deliveryFee = cartSubtotal > 199 ? 0 : 25;
  const finalTotal = cartSubtotal + deliveryFee;
  const totalItemCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  const addToCart = (medId, e) => {
    if (e) e.stopPropagation();
    addToPharmacyCart(medId, 1);
    const med = MEDICINE_CATALOG.find(m => m.id === medId);
    showToast(`Added ${med?.name || 'Item'} to cart.`);
  };

  const removeFromCart = (medId, e) => {
    if (e) e.stopPropagation();
    updatePharmacyCartQty(medId, -1);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      showToast('Your cart is empty.', 'warn');
      return;
    }
    confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
    showToast(`Order Placed Successfully! Your medicines will arrive in 15 minutes.`);
    clearPharmacyCart();
    setIsCartOpen(false);
  };

  return (
    <div className="w-full space-y-6 pb-24 font-['Poppins']">

      {/* ── Breadcrumb & Navigation Bar ──────────────────────────────── */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 text-xs font-bold border border-slate-200 shadow-2xs cursor-pointer transition-all hover:scale-105 active:scale-95"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
          <span>Back to Dashboard</span>
        </button>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <button
            onClick={() => navigate('/')}
            className="hover:underline text-slate-500 hover:text-slate-700 bg-transparent border-none p-0 cursor-pointer"
          >
            Dashboard
          </button>
          <span>/</span>
          <span className="text-[#16163B] font-bold">Dedicated Medicine Store</span>
        </div>
      </div>

      {/* ── Hero Banner with 15-Min Delivery & Search ─────────────────── */}
      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-[#16163B] via-[#242454] to-[#1e1b4b] p-7 md:p-9 text-white shadow-xl">
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-emerald-400 animate-bounce" />
                15-Minute Express Delivery Active
              </span>
              <span className="text-xs text-slate-300 font-semibold flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#E9DF70]" />
                Mumbai (400050)
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-black text-white m-0 tracking-tight">
              MediCare Online Pharmacy
            </h1>
            <p className="text-xs md:text-sm text-slate-300 font-medium m-0 mt-1.5">
              100% Genuine Medicines • Over 75+ Specialized Options • Flat 15% to 25% Off MRP
            </p>

            {/* Quick Actions */}
            <div className="flex items-center gap-3 mt-4 flex-wrap">
              <button
                onClick={() => setIsRxUploadOpen(true)}
                className="px-4 py-2 bg-[#E9DF70] hover:bg-yellow-300 text-[#16163B] font-black text-xs rounded-xl border-none cursor-pointer flex items-center gap-1.5 shadow-sm transition-all hover:scale-105"
              >
                <Upload className="w-4 h-4" />
                <span>Upload Doctor Rx</span>
              </button>

              <button
                onClick={() => navigate('/my-meds')}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 cursor-pointer flex items-center gap-1.5 transition-all"
              >
                <Pill className="w-4 h-4 text-emerald-400" />
                <span>Medication Tracker</span>
              </button>
            </div>
          </div>

          {/* Cart Floating Box */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 flex items-center gap-4 shrink-0 shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-white text-[#16163B] flex items-center justify-center font-black shadow-md relative">
              <ShoppingCart className="w-6 h-6" />
              {totalItemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center">
                  {totalItemCount}
                </span>
              )}
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 block">Your Pharmacy Cart</span>
              <strong className="text-base font-black text-white block">₹{cartSubtotal}</strong>
              <button
                onClick={() => setIsCartOpen(true)}
                className="text-[11px] font-extrabold text-[#E9DF70] hover:underline cursor-pointer bg-transparent border-none p-0 mt-0.5"
              >
                View Cart & Checkout →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Search & Filter Controls ───────────────────────────────────── */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-lg">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search medicine (e.g. Dolo 650, Telma, Metformin, Pan 40)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#242454] shadow-2xs transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 bg-transparent border-none cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Toggles */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setOnlyOTC(!onlyOTC)}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold cursor-pointer border transition-all ${
              onlyOTC
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {onlyOTC ? '✓ OTC Medicines Only' : 'OTC (No Rx Needed)'}
          </button>

          <span className="text-xs font-bold text-slate-500">
            Showing <strong>{filteredMedicines.length}</strong> of {MEDICINE_CATALOG.length} medicines
          </span>
        </div>
      </div>

      {/* ── Category Pill Tabs ────────────────────────────────────────── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none">
        {MEDICINE_CATEGORIES.map(cat => {
          const isActive = selectedCategory === cat;
          const count = cat === 'All Medicines'
            ? MEDICINE_CATALOG.length
            : MEDICINE_CATALOG.filter(m => m.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-2xl text-xs font-extrabold whitespace-nowrap cursor-pointer transition-all border flex items-center gap-1.5 ${
                isActive
                  ? 'bg-[#16163B] text-white border-[#16163B] shadow-sm scale-105'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span>{cat}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                isActive ? 'bg-white/20 text-[#E9DF70]' : 'bg-slate-100 text-slate-500'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Medicine Cards Grid (Many Options) ────────────────────────── */}
      {filteredMedicines.length === 0 ? (
        <div className="bg-white rounded-[28px] p-12 text-center border border-slate-200 shadow-xs space-y-3">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Pill className="w-8 h-8" />
          </div>
          <h3 className="text-base font-black text-slate-900 m-0">No medicines found matching your search</h3>
          <p className="text-xs text-slate-500 font-semibold m-0">
            Try searching for active salts like 'Paracetamol', 'Pantoprazole', 'Azithromycin' or reset filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All Medicines');
              setOnlyOTC(false);
            }}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl border border-slate-200 cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4.5">
          {filteredMedicines.map(med => {
            const qtyInCart = cart[med.id] || 0;
            return (
              <div
                key={med.id}
                onClick={() => setSelectedMedicine(med)}
                className="bg-white rounded-[26px] p-4 border border-slate-200/90 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between cursor-pointer group relative"
              >
                <div>
                  {/* Medicine Product Image Canvas */}
                  <div className="relative w-full h-36 bg-[#F8FAFC] rounded-[20px] p-2.5 mb-3 flex items-center justify-center overflow-hidden border border-slate-100 group-hover:bg-[#F1F5F9] transition-colors">
                    {/* Top Badges */}
                    <div className="absolute top-2 left-2 z-10 flex items-center gap-1">
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-rose-500 text-white shadow-xs">
                        {med.discount}
                      </span>
                    </div>

                    <div className="absolute top-2 right-2 z-10">
                      {med.prescriptionRequired ? (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-slate-900/80 backdrop-blur-xs text-white">
                          Rx
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-600 text-white">
                          OTC
                        </span>
                      )}
                    </div>

                    {/* Image with zoom micro-motion */}
                    <img
                      src={med.image}
                      alt={med.name}
                      className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-300 drop-shadow-xs"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = `/images/medicines/${med.id}.svg`;
                      }}
                    />

                    {/* 15-min delivery pill badge */}
                    <div className="absolute bottom-1.5 left-2 px-2 py-0.5 rounded-md bg-white/95 backdrop-blur-xs text-emerald-700 text-[9px] font-extrabold flex items-center gap-1 shadow-2xs border border-emerald-100">
                      <Zap className="w-2.5 h-2.5 text-emerald-600 fill-emerald-600" />
                      <span>15 Min</span>
                    </div>
                  </div>

                  {/* Manufacturer & Rating */}
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                    <span className="truncate max-w-[130px]">{med.manufacturer}</span>
                    <div className="flex items-center gap-0.5 text-amber-500 font-extrabold shrink-0">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{med.rating}</span>
                      <span className="text-[9px] text-slate-400 font-medium">({med.reviews})</span>
                    </div>
                  </div>

                  {/* Title & Generic */}
                  <h3 className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors m-0 line-clamp-1 leading-snug font-['Poppins']">
                    {med.name}
                  </h3>
                  <span className="text-[11px] text-slate-500 font-medium block truncate mt-0.5">
                    {med.genericName}
                  </span>

                  <span className="inline-block mt-2 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200/60">
                    {med.packSize}
                  </span>
                </div>

                {/* Bottom Price & Add to Cart */}
                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <strong className="text-base font-black text-slate-900">₹{med.price}</strong>
                      <span className="text-xs text-slate-400 line-through">₹{med.mrp}</span>
                    </div>
                    <span className="text-[9px] text-emerald-600 font-extrabold block">Save ₹{med.mrp - med.price}</span>
                  </div>

                  {qtyInCart === 0 ? (
                    <button
                      onClick={(e) => addToCart(med.id, e)}
                      className="px-4 py-2 bg-[#16163B] hover:bg-[#242454] text-white font-black text-xs rounded-xl border-none cursor-pointer flex items-center gap-1.5 shadow-sm transition-all hover:scale-105 active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#E9DF70]" />
                      <span>Add</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-1.5 bg-slate-100 rounded-xl p-1 border border-slate-200">
                      <button
                        onClick={(e) => removeFromCart(med.id, e)}
                        className="w-6 h-6 rounded-lg bg-white text-slate-700 flex items-center justify-center cursor-pointer border-none shadow-2xs hover:bg-slate-50"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-black text-slate-900 px-1">{qtyInCart}</span>
                      <button
                        onClick={(e) => addToCart(med.id, e)}
                        className="w-6 h-6 rounded-lg bg-[#16163B] text-white flex items-center justify-center cursor-pointer border-none shadow-2xs hover:bg-[#242454]"
                      >
                        <Plus className="w-3 h-3 text-[#E9DF70]" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Slide-Out Cart Drawer ──────────────────────────────────────── */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex justify-end animate-fadeIn">
          <div className="bg-white w-full max-w-md h-full flex flex-col justify-between p-6 shadow-2xl animate-slideLeft">
            {/* Cart Header */}
            <div>
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-base font-black text-slate-900 m-0">
                    Your Medicine Cart ({totalItemCount})
                  </h3>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center border-none cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Delivery ETA pill */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 my-4 flex items-center gap-2.5">
                <Truck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span className="text-xs text-emerald-800 font-bold">
                  Express 15-Minute Delivery to <strong>Bandra West, Mumbai</strong>
                </span>
              </div>

              {/* Items List */}
              <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-360px)] pr-1">
                {cartItems.length === 0 ? (
                  <div className="py-12 text-center text-slate-400">
                    <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-30" />
                    <p className="text-xs font-bold">Your cart is empty.</p>
                  </div>
                ) : (
                  cartItems.map(item => (
                    <div key={item.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between gap-3">
                      {/* Product Thumbnail */}
                      <div className="w-12 h-12 rounded-xl bg-white p-1 border border-slate-200 shrink-0 flex items-center justify-center overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-contain mix-blend-multiply"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = `/images/medicines/${item.id}.svg`;
                          }}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <strong className="text-xs font-black text-slate-900 block truncate">{item.name}</strong>
                        <span className="text-[10px] text-slate-500 font-medium">{item.packSize}</span>
                        <div className="text-xs font-black text-slate-900 mt-0.5">
                          ₹{item.price * item.qty}
                          <span className="text-[10px] text-slate-400 font-normal ml-1">({item.price} each)</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 bg-white rounded-xl p-1 border border-slate-200">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center cursor-pointer border-none"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-black text-slate-900 px-1">{item.qty}</span>
                        <button
                          onClick={() => addToCart(item.id)}
                          className="w-6 h-6 rounded-lg bg-[#16163B] text-white flex items-center justify-center cursor-pointer border-none"
                        >
                          <Plus className="w-3 h-3 text-[#E9DF70]" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Bill Summary & Checkout */}
            {cartItems.length > 0 && (
              <div className="border-t border-slate-100 pt-4 space-y-3">
                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Item Total (MRP):</span>
                    <span className="line-through">₹{cartMRP}</span>
                  </div>
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Total Discount Saved:</span>
                    <span>-₹{totalSavings}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee:</span>
                    <span>{deliveryFee === 0 ? <strong className="text-emerald-600">FREE</strong> : `₹${deliveryFee}`}</span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
                    <span>To Pay:</span>
                    <span>₹{finalTotal}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs rounded-2xl border-none cursor-pointer shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Place Order • Pay ₹{finalTotal}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Medicine Detail Modal ──────────────────────────────────────── */}
      {selectedMedicine && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-[32px] p-6 sm:p-7 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-blue-100 text-blue-800">
                  {selectedMedicine.category}
                </span>
                <h3 className="text-lg font-black text-slate-900 m-0 mt-1">{selectedMedicine.name}</h3>
                <span className="text-xs text-slate-500 font-semibold">{selectedMedicine.genericName}</span>
              </div>
              <button
                onClick={() => setSelectedMedicine(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center border-none cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Prominent High-Def Medicine Product Image */}
            <div className="w-full h-44 sm:h-52 bg-[#F8FAFC] rounded-2xl p-4 flex items-center justify-center border border-slate-100 relative overflow-hidden">
              <img
                src={selectedMedicine.image}
                alt={selectedMedicine.name}
                className="h-full object-contain mix-blend-multiply drop-shadow-md"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = `/images/medicines/${selectedMedicine.id}.svg`;
                }}
              />
              <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-rose-500 text-white shadow-2xs">
                  {selectedMedicine.discount}
                </span>
                {selectedMedicine.prescriptionRequired ? (
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-slate-900 text-white shadow-2xs">
                    Rx Required
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-600 text-white shadow-2xs">
                    OTC
                  </span>
                )}
              </div>
              <span className="absolute bottom-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-white/95 text-emerald-800 text-[10px] font-bold shadow-xs border border-emerald-100 flex items-center gap-1">
                <Zap className="w-3 h-3 text-emerald-600 fill-emerald-600" /> 15-Minute Express Doorstep Delivery
              </span>
            </div>

            <p className="text-xs text-slate-600 font-medium leading-relaxed m-0">
              {selectedMedicine.description}
            </p>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Manufacturer:</span>
                <strong className="text-slate-800">{selectedMedicine.manufacturer}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Composition:</span>
                <strong className="text-slate-800">{selectedMedicine.composition}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Pack Format:</span>
                <strong className="text-slate-800">{selectedMedicine.packSize}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Standard Dosage:</span>
                <strong className="text-slate-800">{selectedMedicine.dosage}</strong>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div>
                <span className="text-xs text-slate-400 line-through">₹{selectedMedicine.mrp}</span>
                <div className="text-xl font-black text-slate-900">
                  ₹{selectedMedicine.price} <span className="text-xs text-emerald-600 font-bold">({selectedMedicine.discount})</span>
                </div>
              </div>

              <button
                onClick={() => {
                  addToCart(selectedMedicine.id);
                  setSelectedMedicine(null);
                }}
                className="px-6 py-2.5 bg-[#16163B] hover:bg-[#242454] text-white font-extrabold text-xs rounded-xl border-none cursor-pointer shadow-md transition-all hover:scale-105"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Upload Prescription Modal ──────────────────────────────────── */}
      {isRxUploadOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-[32px] p-7 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 text-center">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900 m-0">Upload Doctor Prescription</h3>
              <button
                onClick={() => setIsRxUploadOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center border-none cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 hover:border-blue-500 transition-colors cursor-pointer bg-slate-50">
              <Upload className="w-10 h-10 text-blue-500 mx-auto mb-2" />
              <strong className="text-xs font-black text-slate-800 block">Drag & Drop prescription image or PDF</strong>
              <span className="text-[10px] text-slate-400 font-semibold block mt-1">Our pharmacist will verify and auto-fill your cart within 5 minutes</span>
              <input
                type="file"
                className="hidden"
                id="rx-upload-input"
                onChange={() => {
                  setRxUploaded(true);
                  showToast('Prescription uploaded! MediCare Pharmacist is preparing your order.');
                  setTimeout(() => setIsRxUploadOpen(false), 800);
                }}
              />
              <label
                htmlFor="rx-upload-input"
                className="inline-block mt-3 px-4 py-1.5 bg-[#16163B] text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Browse Files
              </label>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default PharmacyStore;
