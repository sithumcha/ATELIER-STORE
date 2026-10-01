// Editorial Direct PDF Invoice Generator Utility using jsPDF
import { jsPDF } from 'jspdf';
import { toast } from 'sonner';

export const downloadDirectPDFInvoice = (order, user) => {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const primaryColor = [28, 25, 23]; // #1c1917
    const secondaryColor = [194, 120, 3]; // #c27803
    const textColor = [68, 64, 60]; // #44403c
    const lightBg = [245, 245, 244]; // #f5f5f4

    // Header Branding Banner
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, 210, 28, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text('ATELIER STORE', 15, 16);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('OFFICIAL CUSTOMER TAX RECEIPT', 15, 22);

    // Invoice Meta Right Aligned
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`INVOICE #${order.id}`, 195, 15, { align: 'right' });

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Date: ${order.date || new Date().toLocaleDateString('en-US')}`, 195, 22, { align: 'right' });

    // Customer & Dispatch Information Cards
    let y = 38;

    // Left Column: Customer Account
    doc.setFillColor(...lightBg);
    doc.roundedRect(15, y, 85, 32, 2, 2, 'F');

    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...secondaryColor);
    doc.text('BILLED CUSTOMER ACCOUNT:', 20, y + 8);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryColor);
    doc.text(user?.name || order.patron || 'Valued Patron', 20, y + 15);

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...textColor);
    doc.text(user?.email || order.email || 'patron@atelierstore.com', 20, y + 21);
    
    const userLoc = [user?.address?.city, user?.address?.country].filter(Boolean).join(', ') || order.destination || 'Global Dispatch';
    doc.text(userLoc.length > 35 ? userLoc.slice(0, 35) + '...' : userLoc, 20, y + 26);

    // Right Column: Logistics & Courier Info
    doc.setFillColor(...lightBg);
    doc.roundedRect(110, y, 85, 32, 2, 2, 'F');

    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...secondaryColor);
    doc.text('FULFILLMENT & LOGISTICS:', 115, y + 8);

    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryColor);
    doc.text(`Courier: ${order.courier || 'Insured Pronto Express'}`, 115, y + 15);

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...textColor);
    doc.text(`Status: ${order.status || 'Awaiting Dispatch'}`, 115, y + 21);

    const activeTrk = order.trackingCode || order.trackingNumber || order.trackingNo;
    doc.text(`Tracking (AWB): ${activeTrk ? activeTrk : 'Pending Assignment'}`, 115, y + 26);

    // Table Header
    y = 78;
    doc.setFillColor(...primaryColor);
    doc.rect(15, y, 180, 8, 'F');

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('ITEM ARTIFACT DESCRIPTION', 20, y + 5.5);
    doc.text('QTY', 140, y + 5.5, { align: 'center' });
    doc.text('AMOUNT', 190, y + 5.5, { align: 'right' });

    // Table Items
    y += 8;
    const items = Array.isArray(order.items) && order.items.length > 0 ? order.items : [{ title: order.items || 'Archival Item', qty: 1, price: order.total }];

    items.forEach((item, idx) => {
      doc.setFillColor(idx % 2 === 0 ? 255 : 248, 250, 252);
      doc.rect(15, y, 180, 10, 'F');

      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...primaryColor);
      const titleStr = typeof item === 'string' ? item : item.title || 'Artifact Item';
      doc.text(titleStr.length > 55 ? titleStr.slice(0, 55) + '...' : titleStr, 20, y + 6.5);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...textColor);
      doc.text(String(item.qty || item.quantity || 1), 140, y + 6.5, { align: 'center' });

      doc.setFont('helvetica', 'bold');
      const itemPrice = typeof item.price === 'number' ? `Rs. ${Math.round(item.price).toLocaleString('en-LK')}` : (typeof item.price === 'string' ? item.price : order.total);
      doc.text(String(itemPrice), 190, y + 6.5, { align: 'right' });

      y += 10;
    });

    // Subtotal Summary Box
    y += 6;
    doc.setDrawColor(220, 220, 220);
    doc.setFillColor(...lightBg);
    doc.roundedRect(120, y, 75, 24, 2, 2, 'FD');

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...textColor);
    doc.text('Subtotal + Freight Included:', 125, y + 8);
    doc.text('Tax & Customs:', 125, y + 14);

    doc.text(order.total, 190, y + 8, { align: 'right' });
    doc.text('Prepaid DDP', 190, y + 14, { align: 'right' });

    doc.setDrawColor(200, 200, 200);
    doc.line(125, y + 17, 190, y + 17);

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...secondaryColor);
    doc.text('TOTAL:', 125, y + 22);
    doc.text(order.total, 190, y + 22, { align: 'right' });

    // Footer Watermark
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(140, 140, 140);
    doc.text('🔒 Official Encrypted Transaction Receipt • Atelier Store Vault', 105, 280, { align: 'center' });

    const fileName = `ATELIERSTORE_Invoice_${String(order.id).replace(/[^a-zA-Z0-9_-]/g, '')}.pdf`;
    doc.save(fileName);
    toast.success(`PDF Invoice "${fileName}" downloaded successfully!`);
  } catch (err) {
    console.error('Direct PDF download error:', err);
    toast.error('Failed to generate PDF invoice directly. Opening print dialog...');
  }
};
