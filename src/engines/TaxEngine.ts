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

const calculateOldSlabs = (taxableSalary: number): number => {
    if (taxableSalary <= 250000) return 0;
    let tax = 0;
    if (taxableSalary <= 500000) tax = (taxableSalary - 250000) * 0.05;
    else if (taxableSalary <= 1000000) tax = (250000 * 0.05) + (taxableSalary - 500000) * 0.2;
    else tax = (250000 * 0.05) + (500000 * 0.2) + (taxableSalary - 1000000) * 0.3;
    return tax;
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
    let oldTaxBase = calculateOldSlabs(baseTaxableSalary);
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
