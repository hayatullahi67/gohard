
import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { X, Trash2, Plus, Minus, ArrowRight, User, MessageSquare, ReceiptText, Eye, Download } from 'lucide-react';
import { supabase } from '../lib/supabase';
import PaystackPayment from './PaystackPayment';
import { downloadReceiptPdf, ReceiptOrder } from '../lib/receipt';
import ReceiptPreviewModal from './ReceiptPreviewModal';


const CartDrawer: React.FC = () => {
    const { cart, removeFromCart, updateQuantity, totalPrice, isCartOpen, setIsCartOpen, clearCart } = useCart();
    const [showCheckout, setShowCheckout] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        address: '',
        state: '',
        phone: '',
        whatsapp: '',
        email: ''
    });
    const [isPaymentReady, setIsPaymentReady] = useState(false);
    const [receiptOrder, setReceiptOrder] = useState<ReceiptOrder | null>(null);
    const [previewOrder, setPreviewOrder] = useState<ReceiptOrder | null>(null);


    if (!isCartOpen) return null;

    const handleCheckout = async (reference: any) => {
        setLoading(true);
        console.log('Payment Success:', reference);

        try {
            // 1. Create the order in Supabase
            const { data: orderData, error: orderError } = await supabase
                .from('orders')
                .insert([{
                    customer_name: formData.fullName,
                    email: formData.email,
                    phone: formData.phone,
                    whatsapp: formData.whatsapp,
                    address: formData.address,
                    state: formData.state,
                    total_amount: totalPrice,
                    status: 'Pending',
                    items: cart,
                }])
                .select();

            if (orderError) throw orderError;
            const createdOrder = {
                customer_name: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                whatsapp: formData.whatsapp,
                address: formData.address,
                state: formData.state,
                total_amount: totalPrice,
                status: 'Paid',
                items: cart,
                created_at: new Date().toISOString(),
                ...(orderData?.[0] || {}),
                payment_reference: reference?.reference || reference?.trxref || reference?.transaction,
            };

            // 2. Reduce stock for each item in Supabase
            for (const item of cart) {
                const { data: product, error: fetchError } = await supabase
                    .from('products')
                    .select('stock_quantity')
                    .eq('id', item.id)
                    .single();

                if (fetchError) {
                    console.error(`Fetch stock error for ${item.name}:`, fetchError);
                    continue;
                }

                const currentStock = product?.stock_quantity || 0;
                const newStock = Math.max(0, currentStock - item.quantity);

                const { error: updateError } = await supabase
                    .from('products')
                    .update({ stock_quantity: newStock })
                    .eq('id', item.id);

                if (updateError) console.error(`Update stock error for ${item.name}:`, updateError);
            }

            setReceiptOrder(createdOrder);
            clearCart();
            setShowCheckout(false);
            setIsPaymentReady(false);
        } catch (error: any) {
            console.error('Checkout error details:', error);
            const errorMessage = error?.message || 'Unknown database error';
            const errorCode = error?.code || 'NO_CODE';
            alert(`DATABASE ERROR: ${errorMessage} (Code: ${errorCode}). Reference: ${reference.reference}`);
        } finally {
            setLoading(false);
        }
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsPaymentReady(true);
    };


    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
                onClick={() => setIsCartOpen(false)}
            />

            {/* Drawer */}
            <div className="relative w-full max-w-md bg-zinc-950 border-l border-zinc-900 shadow-2xl flex flex-col h-full animate-slide-in">
                <div className="p-6 border-b border-zinc-900 flex justify-between items-center bg-black">
                    <h2 className="font-heading font-black text-xl tracking-tighter uppercase italic text-[#D4AF37] flex items-center gap-2">
                        Your Arsenal <span className="text-xs font-bold text-zinc-500 not-italic">({cart.length})</span>
                    </h2>
                    <button
                        onClick={() => setIsCartOpen(false)}
                        className="p-2 hover:bg-zinc-900 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {receiptOrder ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-6 animate-fade-in">
                            <div className="w-20 h-20 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-full flex items-center justify-center">
                                <ReceiptText className="w-9 h-9 text-[#D4AF37]" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.4em] mb-3">Payment Confirmed</p>
                                <h3 className="text-2xl font-heading font-black uppercase italic tracking-tight text-white">Receipt Ready</h3>
                                <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-3 leading-relaxed">
                                    Your GOHARDREPUBLIC receipt has been generated. Print it or download a copy for your records.
                                </p>
                            </div>
                            <div className="w-full space-y-3">
                                <button
                                    onClick={() => setPreviewOrder(receiptOrder)}
                                    className="w-full bg-[#D4AF37] text-black font-black py-4 uppercase text-xs tracking-[0.25em] flex items-center justify-center gap-2 hover:bg-white transition-all"
                                >
                                    <Eye className="w-4 h-4" />
                                    View PDF Receipt
                                </button>
                                <button
                                    onClick={() => downloadReceiptPdf(receiptOrder, 'customer')}
                                    className="w-full bg-zinc-900 border border-zinc-800 text-white font-black py-4 uppercase text-xs tracking-[0.25em] flex items-center justify-center gap-2 hover:border-[#D4AF37] transition-all"
                                >
                                    <Download className="w-4 h-4" />
                                    Download PDF
                                </button>
                                <button
                                    onClick={() => {
                                        setReceiptOrder(null);
                                        setIsCartOpen(false);
                                    }}
                                    className="w-full text-zinc-600 font-black text-[10px] uppercase tracking-widest hover:text-white transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    ) : !showCheckout ? (
                        <>
                            {cart.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                                    <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center">
                                        <Trash2 className="w-8 h-8 text-zinc-700" />
                                    </div>
                                    <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs italic">Your cart is empty.</p>
                                    <button
                                        onClick={() => setIsCartOpen(false)}
                                        className="text-[#D4AF37] font-black text-[10px] uppercase tracking-[0.3em] hover:underline"
                                    >
                                        Start Shopping
                                    </button>
                                </div>
                            ) : (
                                cart.map((item) => (
                                    <div key={item.id} className="flex gap-4 group">
                                        <div className="w-24 h-24 bg-zinc-900 overflow-hidden shrink-0">
                                            <img src={item.image_url || item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between py-1">
                                            <div>
                                                <div className="flex justify-between">
                                                    <h4 className="font-black text-xs uppercase tracking-tight">{item.name}</h4>
                                                    <button onClick={() => removeFromCart(item.id)} className="text-zinc-600 hover:text-[#D4AF37]">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">₦{item.price.toLocaleString()}</p>
                                            </div>

                                            <div className="flex items-center space-x-4 border border-zinc-900 w-fit px-2 py-1">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="p-1 hover:text-[#D4AF37] transition-colors"
                                                >
                                                    <Minus className="w-3 h-3" />
                                                </button>
                                                <span className="text-xs font-black w-4 text-center">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="p-1 hover:text-[#D4AF37] transition-colors"
                                                >
                                                    <Plus className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </>
                    ) : (
                        <div className="animate-fade-in">
                            {!isPaymentReady ? (
                                <form id="checkout-form" onSubmit={handleFormSubmit} className="space-y-6 text-white">
                                    <div className="space-y-4">
                                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-400 mb-6 flex items-center gap-2">
                                            <User className="w-4 h-4 text-[#D4AF37]" /> Shipping Intel
                                        </h3>

                                        <div className="grid grid-cols-1 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Full Name</label>
                                                <input
                                                    required
                                                    type="text"
                                                    placeholder="ENTER FULL NAME"
                                                    className="w-full bg-zinc-900 border border-zinc-800 p-3 text-xs font-bold uppercase focus:border-[#D4AF37] outline-none transition-colors"
                                                    value={formData.fullName}
                                                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Delivery Address</label>
                                                <textarea
                                                    required
                                                    placeholder="STREET NAME, APARTMENT, ETC."
                                                    className="w-full bg-zinc-900 border border-zinc-800 p-3 text-xs font-bold uppercase focus:border-[#D4AF37] outline-none transition-colors h-24 resize-none"
                                                    value={formData.address}
                                                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 text-nowrap">State / Region</label>
                                                    <input
                                                        required
                                                        type="text"
                                                        placeholder="LAGOS"
                                                        className="w-full bg-zinc-900 border border-zinc-800 p-3 text-xs font-bold uppercase focus:border-[#D4AF37] outline-none transition-colors"
                                                        value={formData.state}
                                                        onChange={e => setFormData({ ...formData, state: e.target.value })}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Phone</label>
                                                    <input
                                                        required
                                                        type="tel"
                                                        placeholder="+234..."
                                                        className="w-full bg-zinc-900 border border-zinc-800 p-3 text-xs font-bold uppercase focus:border-[#D4AF37] outline-none transition-colors"
                                                        value={formData.phone}
                                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Email Address</label>
                                            <input
                                                required
                                                type="email"
                                                placeholder="GOHARD@EXAMPLE.COM"
                                                className="w-full bg-zinc-900 border border-zinc-800 p-3 text-xs font-bold uppercase focus:border-[#D4AF37] outline-none transition-colors"
                                                value={formData.email}
                                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>

                                        <div className="space-y-2 pt-4">
                                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-4 flex items-center gap-2 border-t border-zinc-900 pt-6">
                                                <MessageSquare className="w-4 h-4 text-[#25D366]" /> WhatsApp Contact
                                            </h3>
                                            <input
                                                required
                                                type="tel"
                                                placeholder="ACTIVE WHATSAPP NUMBER"
                                                className="w-full bg-zinc-900 border border-zinc-800 p-3 text-xs font-bold uppercase focus:border-[#D4AF37] outline-none transition-colors"
                                                value={formData.whatsapp}
                                                onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                                            />
                                            <p className="text-[9px] text-zinc-600 uppercase font-black tracking-widest leading-relaxed">
                                                We'll contact you here to finalize payment and delivery.
                                            </p>
                                        </div>
                                    </div>
                                </form>
                            ) : (
                                <PaystackPayment
                                    email={formData.email}
                                    amount={totalPrice}
                                    onSuccess={handleCheckout}
                                    onClose={() => setIsPaymentReady(false)}
                                />
                            )}
                        </div>
                    )}
                </div>

                <ReceiptPreviewModal
                    order={previewOrder}
                    audience="customer"
                    onClose={() => setPreviewOrder(null)}
                />

                <div className="p-6 bg-black border-t border-zinc-900 space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 italic">Total Loadout</span>
                        <span className="text-xl font-heading font-black text-white italic">₦{totalPrice.toLocaleString()}</span>
                    </div>

                    {cart.length > 0 && !isPaymentReady && !receiptOrder && (
                        <div className="w-full">
                            <button
                                disabled={loading}
                                onClick={() => showCheckout ? (document.getElementById('checkout-form') as HTMLFormElement).requestSubmit() : setShowCheckout(true)}
                                className="w-full bg-[#D4AF37] text-black font-black py-4 uppercase text-xs tracking-[0.3em] flex items-center justify-center gap-2 hover:bg-white transition-all group disabled:opacity-50"
                            >
                                {loading ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-zinc-900 border-t-black"></div>
                                ) : (
                                    <>
                                        {showCheckout ? 'Confirm Assignment' : 'Proceed to Checkout'}
                                        <ArrowRight className="w-4 h-4 translate-x-0 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </div>
                    )}

                    {showCheckout && !receiptOrder && (
                        <button
                            onClick={() => {
                                setShowCheckout(false);
                                setIsPaymentReady(false);
                            }}
                            className="w-full text-zinc-600 font-black text-[10px] uppercase tracking-widest hover:text-white transition-colors"
                        >
                            ← Back to Cart
                        </button>
                    )}

                </div>
            </div>
        </div>
    );
};


export default CartDrawer;
