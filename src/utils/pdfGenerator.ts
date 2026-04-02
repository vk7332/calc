
import { TaxSettings, AuditResult } from '@/types/client';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'; // This fixes the 'autoTable' errors

// If you still get a red squiggly on autoTable, use this specific import instead:
// import 'jspdf-autotable';

const DEFAULT_SETTINGS: TaxSettings = {
    assessmentYear: '2026-27',
    standardDeduction: 50000,
    cessRate: 0.04,
    rebateLimitNew: 700000,
    rebateLimitOld: 500000,
    isComparisonMode: false,
};


export async function exportTaxReport(result: AuditResult, clientName: string, settings: TaxSettings = DEFAULT_SETTINGS): Promise<string> {
    const { jsPDF } = await import('jspdf');
    const autoTable = (await import('jspdf-autotable')).default;
    // Use it immediately to satisfy the compiler
    const doc = new jsPDF();
    const isScenario = settings.isComparisonMode;

    // 1. "What-If" Banner (Only if Scenario is Active)
    if (isScenario) {
        doc.setFillColor(254, 242, 242); // Light Red Background
        doc.rect(0, 0, 210, 15, 'F');
        doc.setFontSize(9);
        doc.setTextColor(185, 28, 28); // Bold Red Text
        doc.setFont("helvetica", "bold");
        doc.text("SCENARIO ANALYSIS: PROPOSED BUDGET AMENDMENTS (NOT CURRENT LAW)", 105, 10, { align: 'center' });
    }

    // 2. Header & Branding
    doc.setFontSize(20);
    doc.setTextColor(40);
    doc.text("Strategic Tax Audit Report", 14, isScenario ? 30 : 22);

    // Inject essential result values (ensures 'result' is used for type-checking)
    doc.setFontSize(10);
    doc.setTextColor(80);
    doc.text(`Client: ${clientName || 'Anonymous'}`, 14, isScenario ? 40 : 32);
    doc.text(`Total Income: ₹${result.totalIncome.toLocaleString('en-IN')}`, 14, isScenario ? 46 : 38);
    doc.text(`Taxable Income: ₹${result.taxableIncome.toLocaleString('en-IN')}`, 14, isScenario ? 52 : 44);

    // 3. Dynamic Legend for the Comparison Bar
    const chartY = isScenario ? 80 : 70;
    if (isScenario) {
        doc.setFontSize(8);
        doc.setTextColor(100);
        const deduction = settings.provisionalDeduction?.toLocaleString();
        doc.text(`*Calculated using Proposed Standard Deduction of Rs. ${deduction}`, 14, chartY - 2);
    }

    // 4. Tax Savings Checklist (if taxable income > 1,200,000)
    if (result.taxableIncome > 1200000) {
        const y = isScenario ? 60 : 54;
        doc.setFontSize(11);
        doc.setTextColor(37, 99, 235);
        doc.text('Tax Savings Checklist:', 14, y);
        doc.setFontSize(9);
        doc.setTextColor(80);
        let checklistY = y + 6;
        doc.text('• Section 80D: Health Insurance Premiums', 18, checklistY);
        checklistY += 6;
        doc.text('• Section 80G: Donations to Approved Charities', 18, checklistY);
        checklistY += 6;
        doc.text('• NPS: National Pension System Contributions', 18, checklistY);
    }

    // 5. Footer Disclaimer
    doc.setFontSize(7);
    doc.setTextColor(150);
    if (isScenario) {
        const disclaimer = "DISCLAIMER: This report is for illustrative purposes based on proposed changes. Actual tax liability may differ based on final government notification.";
        doc.text(disclaimer, 105, 290, { align: 'center' });
    }

    const dataUri = doc.output('datauristring');
    doc.save(`${isScenario ? 'Scenario_' : 'Tax_'}Audit_${clientName || 'Report'}.pdf`);

    // Return base64 payload (for saving to DB)
    const base64 = dataUri.split(',')[1];
    return base64;
}


export const exportDetailedTaxReport = (result: AuditResult, clientName: string) => {
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

    // 1. Header & Branding
    doc.setFontSize(20);
    doc.setTextColor(40);
    doc.text("Strategic Tax Audit Report", 14, 22);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Client: ${clientName || 'Valued Taxpayer'}`, 14, 30);
    doc.text(`Assessment Year: 2025-26`, 14, 35);
    doc.text(`Date: ${date}`, 160, 35);

    // 2. Summary Table
    autoTable(doc, {
        startY: 45,
        head: [['Description', 'Amount (INR)']],
        body: [
            ['Total Gross Income', `Rs. ${result.totalIncome.toLocaleString('en-IN')}`],
            ['Taxable Income', `Rs. ${result.taxableIncome.toLocaleString('en-IN')}`],
            ['Tax as per Old Regime', `Rs. ${result.oldTax.toLocaleString('en-IN')}`],
            ['Tax as per New Regime', `Rs. ${result.newTax.toLocaleString('en-IN')}`],
            ['Recommended Regime', result.recommendedRegime.toUpperCase()],
        ],
        theme: 'striped',
        headStyles: { fillColor: [37, 99, 235] } // Professional Blue
    });

    const lastAutoTable = (doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable; // jsPDF autoTable plugin property

    // 3. Tax Breakdown Table
    autoTable(doc, {
        startY: (lastAutoTable?.finalY ?? 60) + 10,
        head: [['Tax Component', 'Value']],
        body: [
            ['Casual Income Tax (30%)', `Rs. ${result.casualTax?.toLocaleString('en-IN') || 0}`],
            ['Health & Education Cess', `Rs. ${result.cess.toLocaleString('en-IN')}`],
            ['Total Tax Liability', `Rs. ${result.finalLiability.toLocaleString('en-IN')}`],
            ['Net Savings', `Rs. ${result.savings.toLocaleString('en-IN')}`],
        ],
    });

    // 4. Footer
    doc.setFontSize(8);
    doc.text("Generated by VK Tax & Finance Tools - Professional Income Tax Practitioner Service", 14, 285);

    doc.save(`Tax_Audit_${clientName || 'Report'}.pdf`);

};