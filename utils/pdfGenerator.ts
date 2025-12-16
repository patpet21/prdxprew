
import { jsPDF } from "jspdf";

/**
 * Generates and downloads a PDF from a data object.
 * @param title Title of the document
 * @param dataObject The data to render (can be nested)
 */
export const downloadPDF = (title: string, dataObject: any) => {
  const doc = new jsPDF();
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;
  let y = margin;
  const lineHeight = 7;

  // Title
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(title, margin, y);
  y += 15;

  // Timestamp
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Generated on: ${new Date().toLocaleString()}`, margin, y);
  y += 10;
  
  doc.setLineWidth(0.5);
  doc.line(margin, y, 190, y);
  y += 10;

  // Helper to check page break
  const checkPageBreak = () => {
    if (y > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
  };

  // Recursive function to print object
  const printObject = (obj: any, indent: number = 0) => {
    if (!obj) return;

    Object.entries(obj).forEach(([key, value]) => {
      checkPageBreak();

      // Format Key
      const label = key
        .replace(/([A-Z])/g, ' $1') // Add space before caps
        .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
        .replace(/_/g, ' '); // Replace underscores

      // Skip internal or empty keys
      if (key === 'id' || key === 'uuid' || value === null || value === undefined || value === '') return;

      doc.setFontSize(11);

      if (typeof value === 'object' && !Array.isArray(value)) {
        // Section Header
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0, 0, 0);
        doc.text(label, margin + indent, y);
        y += lineHeight;
        printObject(value, indent + 5);
      } else if (Array.isArray(value)) {
        // List
        doc.setFont("helvetica", "bold");
        doc.text(`${label}:`, margin + indent, y);
        y += lineHeight;
        
        doc.setFont("helvetica", "normal");
        value.forEach((item) => {
            checkPageBreak();
            if (typeof item === 'object') {
                 printObject(item, indent + 5);
            } else {
                 doc.text(`• ${String(item)}`, margin + indent + 5, y);
                 y += lineHeight;
            }
        });
      } else {
        // Simple Key-Value
        doc.setFont("helvetica", "bold");
        doc.text(`${label}:`, margin + indent, y);
        
        doc.setFont("helvetica", "normal");
        // Handle long text wrapping
        const textValue = String(value);
        const splitText = doc.splitTextToSize(textValue, 170 - (margin + indent));
        
        // Adjust X for value based on key length roughly, or just put on new line if long
        // Simple approach: Value next to key if short, or below
        const keyWidth = doc.getTextWidth(`${label}:`);
        
        if (splitText.length === 1 && (margin + indent + keyWidth + 5 + doc.getTextWidth(textValue)) < 180) {
            doc.text(textValue, margin + indent + keyWidth + 2, y);
            y += lineHeight;
        } else {
            y += lineHeight;
            splitText.forEach((line: string) => {
                checkPageBreak();
                doc.text(line, margin + indent + 5, y);
                y += lineHeight;
            });
        }
      }
    });
  };

  printObject(dataObject);

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(`Page ${i} of ${pageCount} - PropertyDEX Simulator`, margin, pageHeight - 10);
  }

  doc.save(`${title.replace(/\s+/g, '_')}.pdf`);
};
