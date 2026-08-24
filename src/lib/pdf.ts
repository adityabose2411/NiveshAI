// Branded PDF report generation for HundiAI (client-side, deterministic).
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export interface ReportTable {
  head: string[];
  rows: (string | number)[][];
  widthHints?: Record<number, number>;
}

export interface ReportSection {
  heading: string;
  paragraphs?: string[];
  kpis?: { label: string; value: string }[];
  table?: ReportTable;
  bullets?: string[];
  note?: string;
}

export interface ReportSpec {
  title: string;
  subtitle: string;
  company: string;
  period: string;
  sections: ReportSection[];
  fileName: string;
}

const SAFFRON: [number, number, number] = [234, 88, 12];
const CHARCOAL: [number, number, number] = [28, 25, 23];
const MUTED: [number, number, number] = [120, 113, 108];
const M = 14; // page margin

const GLYPHS: [RegExp, string][] = [
  [/\u20B9/g, "Rs "],
  [/\u03A3/g, "Sum "],
  [/\u221A/g, "sqrt"],
  [/\u00D7/g, "x"],
  [/\u00F7/g, "/"],
  [/\u2212/g, "-"],
  [/\u2265/g, ">="],
  [/\u2264/g, "<="],
  [/\u21D2/g, "=>"],
  [/\u00B2/g, "^2"],
  [/\u0394/g, "Delta "],
  [/\u03B2/g, "beta"],
  [/\u2032/g, "'"],
  [/\u2019/g, "'"],
];

/** Core PDF fonts are WinAnsi-only: swap glyphs they cannot render. */
const t = (v: string) => GLYPHS.reduce((acc, [re, rep]) => acc.replace(re, rep), String(v));


export function generateReport(spec: ReportSpec) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  let y = 0;

  // ---- cover band ----
  doc.setFillColor(...CHARCOAL);
  doc.rect(0, 0, pageW, 32, "F");
  doc.setFillColor(...SAFFRON);
  doc.rect(0, 32, pageW, 1.4, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("HundiAI", M, 14);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(220, 215, 210);
  doc.text("AI CFO for Indian businesses", M, 19.5);
  doc.setFontSize(8);
  doc.text(
    `Generated ${new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}`,
    pageW - M,
    14,
    { align: "right" },
  );
  doc.text("Demo workspace · figures are illustrative", pageW - M, 19.5, { align: "right" });

  y = 46;
  doc.setTextColor(...CHARCOAL);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text(t(spec.title), M, y);
  y += 8;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10.5);
  doc.setTextColor(...MUTED);
  doc.splitTextToSize(t(spec.subtitle), pageW - M * 2).forEach((line: string) => {
    doc.text(line, M, y);
    y += 5.4;
  });
  y += 2;
  doc.setFontSize(9.5);
  doc.setTextColor(...CHARCOAL);
  doc.text(t(`${spec.company}  ·  ${spec.period}`), M, y);
  y += 8;
  doc.setDrawColor(230, 226, 222);
  doc.line(M, y, pageW - M, y);
  y += 10;

  const ensure = (needed: number) => {
    if (y + needed > pageH - 20) {
      doc.addPage();
      y = 22;
    }
  };

  spec.sections.forEach((section) => {
    ensure(26);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12.5);
    doc.setTextColor(...CHARCOAL);
    doc.text(t(section.heading), M, y);
    doc.setDrawColor(...SAFFRON);
    doc.setLineWidth(0.8);
    doc.line(M, y + 1.8, M + 16, y + 1.8);
    doc.setLineWidth(0.2);
    y += 9;

    section.paragraphs?.forEach((p) => {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.6);
      doc.setTextColor(60, 55, 52);
      const lines = doc.splitTextToSize(t(p), pageW - M * 2);
      ensure(lines.length * 5);
      lines.forEach((line: string) => {
        doc.text(line, M, y);
        y += 4.9;
      });
      y += 3;
    });

    if (section.kpis?.length) {
      const perRow = 3;
      const boxW = (pageW - M * 2 - 6) / perRow;
      section.kpis.forEach((kpi, i) => {
        const col = i % perRow;
        if (col === 0) ensure(20);
        const x = M + col * (boxW + 3);
        const top = y;
        doc.setFillColor(250, 247, 244);
        doc.setDrawColor(232, 228, 224);
        doc.roundedRect(x, top, boxW, 17, 1.6, 1.6, "FD");
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.4);
        doc.setTextColor(...MUTED);
        doc.text(doc.splitTextToSize(t(kpi.label.toUpperCase()), boxW - 6)[0], x + 3, top + 6);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11.5);
        doc.setTextColor(...CHARCOAL);
        doc.text(doc.splitTextToSize(t(kpi.value), boxW - 6)[0], x + 3, top + 13);
        if (col === perRow - 1 || i === section.kpis!.length - 1) y = top + 21;
      });
    }

    if (section.bullets?.length) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.6);
      section.bullets.forEach((b) => {
        const lines = doc.splitTextToSize(t(b), pageW - M * 2 - 5);
        ensure(lines.length * 5 + 2);
        doc.setFillColor(...SAFFRON);
        doc.circle(M + 1.2, y - 1.3, 0.9, "F");
        doc.setTextColor(60, 55, 52);
        lines.forEach((line: string, idx: number) => {
          doc.text(line, M + 5, y + idx * 4.8);
        });
        y += lines.length * 4.8 + 2;
      });
      y += 2;
    }

    if (section.table) {
      ensure(30);
      autoTable(doc, {
        startY: y,
        head: [section.table.head.map((h) => t(h))],
        body: section.table.rows.map((r) => r.map((c) => t(String(c)))),
        margin: { left: M, right: M },
        styles: { font: "helvetica", fontSize: 8.4, cellPadding: 2, textColor: [50, 46, 44], lineColor: [235, 231, 227], lineWidth: 0.1 },
        headStyles: { fillColor: CHARCOAL, textColor: [255, 255, 255], fontSize: 8.2, fontStyle: "bold" },
        alternateRowStyles: { fillColor: [251, 249, 247] },
        columnStyles: Object.fromEntries(
          Object.entries(section.table.widthHints ?? {}).map(([k, v]) => [k, { cellWidth: v }]),
        ) as never,
      });
      // @ts-expect-error jspdf-autotable augments the doc instance
      y = (doc.lastAutoTable?.finalY ?? y) + 9;
    }

    if (section.note) {
      const lines = doc.splitTextToSize(t(section.note), pageW - M * 2 - 6);
      ensure(lines.length * 4.6 + 8);
      doc.setFillColor(255, 246, 237);
      doc.setDrawColor(253, 213, 175);
      doc.roundedRect(M, y - 4, pageW - M * 2, lines.length * 4.6 + 6, 1.6, 1.6, "FD");
      doc.setFont("helvetica", "italic");
      doc.setFontSize(8.6);
      doc.setTextColor(124, 62, 12);
      lines.forEach((line: string, i: number) => doc.text(line, M + 3, y + 1.5 + i * 4.6));
      y += lines.length * 4.6 + 11;
      doc.setFont("helvetica", "normal");
    }

    y += 3;
  });

  // ---- footers ----
  const pages = doc.getNumberOfPages();
  for (let p = 1; p <= pages; p++) {
    doc.setPage(p);
    doc.setDrawColor(235, 231, 227);
    doc.line(M, pageH - 14, pageW - M, pageH - 14);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.6);
    doc.setTextColor(...MUTED);
    doc.text(t(`HundiAI · ${spec.title} · ${spec.company}`), M, pageH - 9);
    doc.text(`Page ${p} of ${pages}`, pageW - M, pageH - 9, { align: "right" });
  }

  doc.save(spec.fileName);
}
