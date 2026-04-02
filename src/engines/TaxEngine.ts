import { AuditResult, TaxSettings } from '@/types/client';

export interface TaxResult {
    totalIncome: number;
    taxableIncome: number;
    oldTax: number;            // Matches AuditResult
    newTax: number;            // Matches AuditResult
    recommendedRegime: 'old' | 'new'; // Matches AuditResult
    savings: number;           // Matches AuditResult
    casualTax: number;         // For internal ITR-2 breakdown
    cess: number;
    finalLiability: number;
}

// AY 2026-27 Old Regime Slabs (with 80C/80D deduction breakdown)
interface OldRegimeBreakdown {
    slabTax: number;
    after80C: number;
    after80D: number;
    totalTax: number;
}

const MAX_80C = 150000;
const MAX_80D = 50000;

export const calculateOldSlabs = (grossIncome: number, deductions80C: number = 0, deductions80D: number = 0): OldRegimeBreakdown => {
    // Apply 80C and 80D caps
    const allowed80C = Math.min(deductions80C, MAX_80C);
    const allowed80D = Math.min(deductions80D, MAX_80D);
    const taxableAfter80C = Math.max(0, grossIncome - allowed80C);
    const taxableAfter80D = Math.max(0, taxableAfter80C - allowed80D);

    // AY 2026-27 slabs
    let slabTax = 0;
    if (taxableAfter80D > 1500000) {
        slabTax = (taxableAfter80D - 1500000) * 0.3 + 250000 * 0.05 + 500000 * 0.2 + 500000 * 0.3;
    } else if (taxableAfter80D > 1000000) {
        slabTax = (taxableAfter80D - 1000000) * 0.3 + 250000 * 0.05 + 500000 * 0.2;
    } else if (taxableAfter80D > 500000) {
        slabTax = (taxableAfter80D - 500000) * 0.2 + 250000 * 0.05;
    } else if (taxableAfter80D > 250000) {
        slabTax = (taxableAfter80D - 250000) * 0.05;
    }

    return {
        slabTax: Math.round(slabTax),
        after80C: Math.round(taxableAfter80C),
        after80D: Math.round(taxableAfter80D),
        totalTax: Math.round(slabTax)
    };
};

const calculateNewSlabs = (taxableSalary: number): number => {
    if (taxableSalary <= 250000) return 0;
    let tax = 0;
    if (taxableSalary <= 500000) tax = (taxableSalary - 250000) * 0.05;
    else if (taxableSalary <= 750000) tax = (250000 * 0.05) + (taxableSalary - 500000) * 0.1;
    else if (taxableSalary <= 1000000) tax = (250000 * 0.05) + (250000 * 0.1) + (taxableSalary - 750000) * 0.15;
    else if (taxableSalary <= 1250000) tax = (250000 * 0.05) + (250000 * 0.1) + (250000 * 0.15) + (taxableSalary - 1000000) * 0.2;
    else if (taxableSalary <= 1500000) tax = (250000 * 0.05) + (250000 * 0.1) + (250000 * 0.15) + (250000 * 0.2) + (taxableSalary - 1250000) * 0.25;
    else tax = (250000 * 0.05) + (250000 * 0.1) + (250000 * 0.15) + (250000 * 0.2) + (250000 * 0.25) + (taxableSalary - 1500000) * 0.3;
    return tax;
};

export const calculateTaxITR2 = (
    netSalary: number,
    casualIncome: number,
    deductions: number,
    settings: TaxSettings
): AuditResult => {

    // Use the dynamic Standard Deduction from settings
    const baseTaxableSalary = Math.max(0, netSalary - settings.standardDeduction - deductions);
    const totalIncome = baseTaxableSalary + casualIncome;

    const taxableSalary = Math.max(0, netSalary - (settings.isComparisonMode && settings.provisionalDeduction ? settings.provisionalDeduction : settings.standardDeduction) - deductions);

    // 1. Calculate Old Regime Tax (Using settings for rebate)

    // For full breakdown, you may want to pass actual 80C/80D values in future
    let oldBreakdown = calculateOldSlabs(baseTaxableSalary);
    let oldTaxBase = oldBreakdown.totalTax;
    if (totalIncome <= settings.rebateLimitOld) oldTaxBase = 0;

    // 2. Calculate New Regime Tax (Using settings for rebate)
    let newTaxBase = calculateNewSlabs(taxableSalary);
    if (totalIncome <= settings.rebateLimitNew) newTaxBase = 0;

    // 3. Apply Dynamic Cess
    const finalOldTax = oldTaxBase + (oldTaxBase * settings.cessRate);
    const finalNewTax = newTaxBase + (newTaxBase * settings.cessRate);

    return {
        totalIncome,
        taxableIncome: taxableSalary,
        oldTax: Math.round(finalOldTax),
        newTax: Math.round(finalNewTax),
        recommendedRegime: finalNewTax < finalOldTax ? 'new' : 'old',
        savings: Math.max(0, Math.round(finalOldTax - finalNewTax)),
        cess: Math.round(Math.min(finalOldTax, finalNewTax) * settings.cessRate),
        finalLiability: Math.round(Math.min(finalOldTax, finalNewTax))
    };
};
