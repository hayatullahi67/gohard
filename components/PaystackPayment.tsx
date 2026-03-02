import React, { useState } from "react";
import { PaystackButton } from "react-paystack";
import { CheckCircle2, Building2, CreditCard } from "lucide-react";

interface PaystackPaymentProps {
    email: string;
    amount: number;
    onSuccess: (reference: any) => void;
    onClose: () => void;
}

const PaystackPayment: React.FC<PaystackPaymentProps> = ({ email, amount, onSuccess, onClose }) => {
    const publicKey = (import.meta as any).env.VITE_PAYSTACK_PUBLIC_KEY || "pk_test_xxxxxxxxxxxxxxxxx";
    const [selectedMethod, setSelectedMethod] = useState<"card" | "transfer" | null>(null);

    // Debug log to check key (first 7 chars only for security)
    console.log("Paystack Key Loaded:", publicKey.substring(0, 7) + "...");

    const cardProps = {
        email,
        amount: amount * 100,
        publicKey,
        text: "Pay with Card",
        currency: "NGN",
        channels: ["card"],
        onSuccess,
        onClose,
    };

    const transferProps = {
        email,
        amount: amount * 100,
        publicKey,
        text: "Pay via Bank Transfer",
        currency: "NGN",
        channels: ["bank_transfer", "bank"],
        onSuccess,
        onClose,
    };

    return (
        <div className="bg-[#0d0d14] rounded-2xl p-7 max-w-md w-full mx-auto border border-white/[0.07] shadow-2xl">

            {/* Header */}
            <div className="mb-6">
                <h2 className="text-white text-xl font-bold">Complete Payment</h2>
                <p className="text-gray-500 text-sm mt-1">
                    Amount:{" "}
                    <span className="text-gray-200 font-semibold">₦{amount.toLocaleString()}</span>
                </p>
            </div>

            {/* Method Selector Label */}
            <p className="text-gray-500 text-[11px] font-semibold tracking-widest uppercase mb-2.5">
                Choose Payment Method
            </p>

            {/* Method Tabs */}
            <div className="flex gap-3 mb-6">
                {/* Bank Transfer */}
                <button
                    onClick={() => setSelectedMethod("transfer")}
                    className={`flex-1 flex flex-col items-center gap-2 py-4 px-3 rounded-xl border transition-all duration-200 cursor-pointer
                        ${selectedMethod === "transfer"
                            ? "border-[#D4AF37] bg-[#D4AF37]/10"
                            : "border-white/[0.08] bg-white/[0.02] hover:border-white/20"
                        }`}
                >
                    <Building2
                        className={`w-5 h-5 transition-colors ${selectedMethod === "transfer" ? "text-[#D4AF37]" : "text-gray-600"}`}
                    />
                    <span className={`text-xs font-semibold transition-colors ${selectedMethod === "transfer" ? "text-[#D4AF37]" : "text-gray-400"}`}>
                        Bank Transfer
                    </span>
                    {selectedMethod === "transfer" && (
                        <span className="bg-[#D4AF37]/20 text-[#D4AF37] text-[9px] font-bold tracking-widest px-2 py-0.5 rounded-full uppercase">
                            Recommended
                        </span>
                    )}
                </button>

                {/* Debit Card */}
                <button
                    onClick={() => setSelectedMethod("card")}
                    className={`flex-1 flex flex-col items-center gap-2 py-4 px-3 rounded-xl border transition-all duration-200 cursor-pointer
                        ${selectedMethod === "card"
                            ? "border-[#D4AF37] bg-[#D4AF37]/10"
                            : "border-white/[0.08] bg-white/[0.02] hover:border-white/20"
                        }`}
                >
                    <CreditCard
                        className={`w-5 h-5 transition-colors ${selectedMethod === "card" ? "text-[#D4AF37]" : "text-gray-600"}`}
                    />
                    <span className={`text-xs font-semibold transition-colors ${selectedMethod === "card" ? "text-[#D4AF37]" : "text-gray-400"}`}>
                        Debit Card
                    </span>
                </button>
            </div>

            {/* Info Box */}
            {selectedMethod === "transfer" && (
                <div className="bg-[#D4AF37]/5 border border-[#D4AF37]/15 rounded-xl p-3.5 mb-5 flex gap-3 items-start">
                    <span className="text-base">🏦</span>
                    <p className="text-gray-400 text-xs leading-relaxed">
                        Paystack will show you a{" "}
                        <strong className="text-gray-200">dedicated bank account</strong> to transfer to.
                        Supports{" "}
                        <strong className="text-gray-200">PalmPay, Opay, GTBank, Access, UBA</strong> and
                        all Nigerian banks.
                    </p>
                </div>
            )}

            {selectedMethod === "card" && (
                <div className="bg-[#D4AF37]/5 border border-[#D4AF37]/15 rounded-xl p-3.5 mb-5 flex gap-3 items-start">
                    <span className="text-base">💳</span>
                    <p className="text-gray-400 text-xs leading-relaxed">
                        Pay securely with your{" "}
                        <strong className="text-gray-200">Visa, Mastercard</strong> or any Nigerian
                        debit card via Paystack's encrypted checkout.
                    </p>
                </div>
            )}

            {/* Paystack Button */}
            {selectedMethod ? (
                <>
                    {amount < 100 ? (
                        <div className="w-full py-4 bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] text-[10px] font-bold tracking-widest uppercase rounded-xl text-center px-4 leading-relaxed">
                            ⚠️ Paystack requires a minimum of ₦100 for Live Transactions.
                            <br />Please increase your cart total.
                        </div>
                    ) : (
                        <>
                            {selectedMethod === "transfer" ? (
                                <PaystackButton
                                    {...transferProps}
                                    className="w-full py-4 bg-[#D4AF37] hover:bg-[#C9A84C] text-black text-sm font-bold tracking-widest uppercase rounded-xl transition-all duration-200 cursor-pointer shadow-lg shadow-[#D4AF37]/20"
                                />
                            ) : (
                                <PaystackButton
                                    {...cardProps}
                                    className="w-full py-4 bg-[#D4AF37] hover:bg-[#C9A84C] text-black text-sm font-bold tracking-widest uppercase rounded-xl transition-all duration-200 cursor-pointer shadow-lg shadow-[#D4AF37]/20"
                                />
                            )}
                        </>
                    )}
                </>
            ) : (
                <div className="w-full py-4 bg-zinc-900/50 border border-zinc-800 text-zinc-500 text-sm font-bold tracking-widest uppercase rounded-xl text-center">
                    Select a Method Above
                </div>
            )}

            {/* Trust Badges */}
            <div className="mt-4 flex justify-center gap-5">
                <span className="flex items-center gap-1.5 text-gray-600 text-[10px] font-semibold uppercase tracking-widest">
                    <CheckCircle2 className="w-3 h-3 text-[#D4AF37]" /> Secured by Paystack
                </span>
                <span className="flex items-center gap-1.5 text-gray-600 text-[10px] font-semibold uppercase tracking-widest">
                    <CheckCircle2 className="w-3 h-3 text-[#D4AF37]" /> Instant Verification
                </span>
            </div>
        </div>
    );
};

export default PaystackPayment;
