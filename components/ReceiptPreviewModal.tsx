import React, { useEffect, useState } from 'react';
import { CalendarDays, Download, ExternalLink, FileText, Loader2, ShieldCheck, X } from 'lucide-react';
import {
  createReceiptPdfUrl,
  downloadReceiptPdf,
  formatCurrency,
  getReceiptNumber,
  ReceiptAudience,
  ReceiptOrder,
} from '../lib/receipt';

interface ReceiptPreviewModalProps {
  order: ReceiptOrder | null;
  audience: ReceiptAudience;
  onClose: () => void;
}

const ReceiptPreviewModal: React.FC<ReceiptPreviewModalProps> = ({ order, audience, onClose }) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!order) return;

    const url = createReceiptPdfUrl(order, audience);
    setPdfUrl(url);

    return () => {
      URL.revokeObjectURL(url);
      setPdfUrl(null);
    };
  }, [order, audience]);

  if (!order) return null;

  const receiptNumber = getReceiptNumber(order);
  const issuedDate = order.created_at
    ? new Date(order.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
    : new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-2 sm:p-4 md:p-6">
      <button
        type="button"
        aria-label="Close receipt preview"
        className="absolute inset-0 bg-black/95 backdrop-blur-xl"
        onClick={onClose}
      />

      <div className="relative w-full max-w-7xl h-[94vh] bg-zinc-950 border border-zinc-800 shadow-[0_0_120px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden rounded">
        <div className="bg-black border-b border-zinc-900 px-4 py-4 md:px-7 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-start sm:items-center gap-4 min-w-0">
            <div className="w-11 h-11 bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center shrink-0 rounded">
              <FileText className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <p className="text-[9px] font-black text-[#D4AF37] uppercase tracking-[0.3em]">
                  Receipt Preview
                </p>
                <span className="border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-[8px] font-black uppercase tracking-widest text-emerald-300 flex items-center gap-1 rounded-sm">
                  <ShieldCheck className="w-3 h-3" />
                  {order.status || 'Paid'}
                </span>
              </div>
              <h2 className="text-lg md:text-2xl font-heading font-black uppercase italic tracking-tight text-white break-words">
                {receiptNumber}
              </h2>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="w-3.5 h-3.5 text-zinc-600" />
                  {issuedDate}
                </span>
                <span>{formatCurrency(order.total_amount || 0)}</span>
                <span>{audience === 'admin' ? 'Admin Copy' : 'Customer Copy'}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-[1fr_1fr_auto] sm:flex sm:items-center gap-2">
            {pdfUrl && (
              <a
                href={pdfUrl}
                target="_blank"
                rel="noreferrer"
                className="bg-zinc-900 border border-zinc-800 text-zinc-300 px-3 sm:px-4 py-3 text-[10px] font-black uppercase tracking-widest transition-all hover:border-[#D4AF37] hover:text-white flex items-center justify-center gap-2 rounded-sm"
              >
                <ExternalLink className="w-4 h-4" />
                Open
              </a>
            )}
            <button
              type="button"
              onClick={() => downloadReceiptPdf(order, audience)}
              className="bg-[#D4AF37] border border-[#D4AF37] text-black px-3 sm:px-4 py-3 text-[10px] font-black uppercase tracking-widest transition-all hover:bg-white flex items-center justify-center gap-2 rounded-sm"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-3 bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-white hover:border-zinc-600 transition-all rounded-sm"
              aria-label="Close receipt preview"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 bg-zinc-900/70 p-2 sm:p-3 md:p-6 min-h-0">
          <div className="h-full w-full bg-zinc-950 border border-zinc-800 overflow-hidden shadow-2xl rounded-sm">
            {pdfUrl ? (
              <iframe
                title={`${receiptNumber} PDF receipt`}
                src={pdfUrl}
                className="w-full h-full bg-white"
              />
            ) : (
              <div className="h-full flex items-center justify-center text-zinc-500">
                <Loader2 className="w-6 h-6 animate-spin mr-3 text-[#D4AF37]" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Preparing Receipt</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-black border-t border-zinc-900 px-4 py-3 md:px-7">
          <p className="text-[8px] font-black uppercase tracking-[0.3em] text-zinc-600 text-center leading-relaxed">
            Review before download. This preview matches the saved PDF file.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReceiptPreviewModal;
