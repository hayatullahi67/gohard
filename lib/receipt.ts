import { jsPDF } from 'jspdf';

type ReceiptItem = {
  name?: string;
  quantity?: number;
  price?: number;
};

export type ReceiptOrder = {
  id?: string;
  created_at?: string;
  customer_name?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  address?: string;
  state?: string;
  total_amount?: number;
  status?: string;
  items?: ReceiptItem[] | unknown;
  payment_reference?: string;
};

export type ReceiptAudience = 'customer' | 'admin';

const gold = '#D4AF37';
const black = '#050505';
const zinc = '#71717A';
const softLine = '#E4E4E7';
const ink = '#18181B';
const paper = '#FAFAFA';

export const formatCurrency = (amount = 0) => `NGN ${amount.toLocaleString()}`;

export const getReceiptNumber = (order?: ReceiptOrder) => {
  const id = order?.id || `${Date.now()}`;
  return `GHR-${id.substring(0, 8).toUpperCase()}`;
};

const safeText = (value: unknown, fallback = 'N/A') => {
  const text = String(value ?? '').trim();
  return text || fallback;
};

const moneyValue = (value: unknown) => Number(value || 0);

const formatDate = (date: Date) =>
  date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

const drawStatusPill = (doc: jsPDF, status: string, x: number, y: number) => {
  const label = status.toUpperCase();
  const width = Math.max(24, doc.getTextWidth(label) + 10);

  doc.setFillColor('#ECFDF5');
  doc.setDrawColor('#A7F3D0');
  doc.roundedRect(x - width, y - 5, width, 8, 4, 4, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor('#047857');
  doc.text(label, x - width / 2, y + 0.5, { align: 'center' });
};

const drawSectionTitle = (doc: jsPDF, title: string, x: number, y: number) => {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(zinc);
  doc.text(title.toUpperCase(), x, y, { charSpace: 0.9 });
  doc.setDrawColor(gold);
  doc.setLineWidth(0.7);
  doc.line(x, y + 3.5, x + 15, y + 3.5);
  doc.setLineWidth(0.2);
};

const drawLabel = (doc: jsPDF, label: string, value: string, x: number, y: number, maxWidth = 72) => {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(zinc);
  doc.text(label.toUpperCase(), x, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.8);
  doc.setTextColor(ink);
  const lines = doc.splitTextToSize(value, maxWidth);
  doc.text(lines, x, y + 5);
  return y + 7 + lines.length * 4.5;
};

const drawFooter = (doc: jsPDF, page: number, pageCount: number) => {
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setDrawColor(softLine);
  doc.line(14, pageHeight - 18, 196, pageHeight - 18);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor('#A1A1AA');
  doc.text('GOHARDREPUBLIC SECURE FULFILLMENT RECEIPT', 14, pageHeight - 10);
  doc.setFont('helvetica', 'normal');
  doc.text('Thank you for shopping with GOHARDREPUBLIC.', 14, pageHeight - 5);
  doc.setFont('helvetica', 'bold');
  doc.text(`PAGE ${page} OF ${pageCount}`, 196, pageHeight - 10, { align: 'right' });
};

export const createReceiptPdf = (order: ReceiptOrder, audience: ReceiptAudience = 'customer') => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const receiptNumber = getReceiptNumber(order);
  const orderDate = order.created_at ? new Date(order.created_at) : new Date();
  const items = Array.isArray(order.items) ? order.items : [];
  const subtotal = items.reduce((sum, item) => sum + moneyValue(item.price) * moneyValue(item.quantity), 0);
  const total = moneyValue(order.total_amount ?? subtotal);
  const status = safeText(order.status, 'Paid');

  doc.setProperties({
    title: `GOHARDREPUBLIC ${receiptNumber} RECEIPT`,
    subject: 'GOHARDREPUBLIC clothing order receipt',
    author: 'GOHARDREPUBLIC',
    creator: 'GOHARDREPUBLIC',
  });

  doc.setFillColor(paper);
  doc.rect(0, 0, pageWidth, doc.internal.pageSize.getHeight(), 'F');

  doc.setFillColor(black);
  doc.rect(0, 0, pageWidth, 54, 'F');
  doc.setFillColor(gold);
  doc.rect(0, 51, pageWidth, 3, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(23);
  doc.setTextColor('#FFFFFF');
  doc.text('GOHARDREPUBLIC', 14, 21);

  doc.setFontSize(7);
  doc.setTextColor('#C9C9D1');
  doc.text(audience === 'admin' ? 'ADMIN ORDER RECEIPT' : 'OFFICIAL CUSTOMER RECEIPT', 14, 30, {
    charSpace: 1.2,
  });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor('#E4E4E7');
  doc.text('Premium streetwear order documentation', 14, 39);

  doc.setFontSize(15);
  doc.setTextColor(gold);
  doc.text(receiptNumber, 196, 18, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor('#E4E4E7');
  doc.text(`Issued: ${formatDate(orderDate)}`, 196, 27, { align: 'right' });
  if (order.payment_reference) {
    doc.text(`Payment Ref: ${safeText(order.payment_reference)}`, 196, 36, { align: 'right' });
  }
  drawStatusPill(doc, status, 196, 46);

  doc.setDrawColor(softLine);
  doc.setFillColor('#FFFFFF');
  doc.roundedRect(14, 66, 86, 55, 3, 3, 'FD');
  doc.roundedRect(110, 66, 86, 55, 3, 3, 'FD');

  drawSectionTitle(doc, 'Customer Profile', 20, 77);
  drawSectionTitle(doc, 'Delivery Details', 116, 77);

  let leftY = 87;
  leftY = drawLabel(doc, 'Full Name', safeText(order.customer_name, 'Customer'), 20, leftY, 70);
  leftY = drawLabel(doc, 'Email', safeText(order.email), 20, leftY + 1, 70);
  leftY = drawLabel(doc, 'Phone', safeText(order.phone), 20, leftY + 1, 70);
  drawLabel(doc, 'WhatsApp', safeText(order.whatsapp), 20, leftY + 1, 70);

  let rightY = 87;
  rightY = drawLabel(doc, 'Address', safeText(order.address), 116, rightY, 70);
  rightY = drawLabel(doc, 'State / Region', safeText(order.state), 116, rightY + 1, 70);
  drawLabel(doc, 'Logistics Fee', 'Calculated on delivery', 116, rightY + 1, 70);

  drawSectionTitle(doc, 'Purchased Clothing', 14, 137);

  const startY = 146;
  const headerHeight = 10;
  const columns = [
    { label: 'ITEM', x: 16, width: 92 },
    { label: 'QTY', x: 112, width: 16 },
    { label: 'UNIT PRICE', x: 139, width: 24 },
    { label: 'LINE TOTAL', x: 174, width: 22 },
  ];

  const drawTableHeader = (y: number) => {
    doc.setFillColor(black);
    doc.rect(14, y, 182, headerHeight, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor('#FFFFFF');
    columns.forEach((column) => {
      doc.text(column.label, column.x, y + 6.5);
    });
  };

  drawTableHeader(startY);
  let y = startY + headerHeight;

  const usableBottom = 248;
  const receiptRows = items.length > 0 ? items : [{ name: 'No items found on this order.', quantity: 0, price: 0 }];

  receiptRows.forEach((item, index) => {
    const itemLines = doc.splitTextToSize(safeText(item.name, 'Product'), 86);
    const rowHeight = Math.max(12, 6 + itemLines.length * 4.2);

    if (y + rowHeight > usableBottom) {
      doc.addPage();
      y = 24;
      drawTableHeader(y);
      y += headerHeight;
    }

    const quantity = moneyValue(item.quantity);
    const price = moneyValue(item.price);
    const lineTotal = quantity * price;

    doc.setFillColor(index % 2 === 0 ? '#FFFFFF' : '#FAFAFA');
    doc.rect(14, y, 182, rowHeight, 'F');
    doc.setDrawColor(softLine);
    doc.line(14, y + rowHeight, 196, y + rowHeight);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(ink);
    doc.text(itemLines, 16, y + 7);

    doc.setFont('helvetica', 'normal');
    doc.text(String(quantity), 116, y + 7);
    doc.text(formatCurrency(price), 164, y + 7, { align: 'right' });
    doc.setFont('helvetica', 'bold');
    doc.text(formatCurrency(lineTotal), 196, y + 7, { align: 'right' });

    y += rowHeight;
  });

  if (y + 58 > 268) {
    doc.addPage();
    y = 28;
  }

  const totalsTop = y + 16;
  doc.setDrawColor(softLine);
  doc.setFillColor('#FFFFFF');
  doc.roundedRect(118, totalsTop, 78, 42, 3, 3, 'FD');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(zinc);
  doc.text('Subtotal', 124, totalsTop + 10);
  doc.text('Delivery', 124, totalsTop + 20);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(ink);
  doc.text(formatCurrency(subtotal), 190, totalsTop + 10, { align: 'right' });
  doc.text('Calculated on delivery', 190, totalsTop + 20, { align: 'right' });

  doc.setFillColor(black);
  doc.roundedRect(118, totalsTop + 28, 78, 14, 0, 0, 'F');
  doc.setFontSize(10);
  doc.setTextColor('#FFFFFF');
  doc.text('Total Paid', 124, totalsTop + 37);
  doc.setTextColor(gold);
  doc.text(formatCurrency(total), 190, totalsTop + 37, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(zinc);
  doc.text(
    'This receipt confirms successful order capture. Delivery fees are confirmed by support before dispatch.',
    14,
    totalsTop + 12,
    { maxWidth: 88 }
  );

  const pageCount = doc.getNumberOfPages();
  for (let page = 1; page <= pageCount; page += 1) {
    doc.setPage(page);
    drawFooter(doc, page, pageCount);
  }

  return doc;
};

export const createReceiptPdfBlob = (order: ReceiptOrder, audience: ReceiptAudience = 'customer') =>
  createReceiptPdf(order, audience).output('blob');

export const createReceiptPdfUrl = (order: ReceiptOrder, audience: ReceiptAudience = 'customer') =>
  URL.createObjectURL(createReceiptPdfBlob(order, audience));

export const downloadReceiptPdf = (order: ReceiptOrder, audience: ReceiptAudience = 'customer') => {
  createReceiptPdf(order, audience).save(`GOHARDREPUBLIC-${getReceiptNumber(order)}-RECEIPT.pdf`);
};
