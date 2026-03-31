// Initial Tax Engine structure for ITR 2026-27
export const calculateTaxITR1 = (income: number, regime: 'old' | 'new') => {
    if (regime === 'new') {
        // Basic placeholder logic - we will expand this for ITR season
        return income > 1200000 ? income * 0.20 : income * 0.10;
    }
    return income * 0.30; // Old regime placeholder
};


export interface TaxResult {
    totalIncome: number;
    taxableIncome: number;
    baseTax: number;
    casualTax: number; // New: 30% Flat Tax
    totalTax: number;
    cess: number;
    finalLiability: number;
}


export const calculateTaxITR2 = (
    salaryIncome: number,
    casualIncome: number,
    deductions: number
): TaxResult => {
    // 1. Calculate Slab-based Tax on Regular Income
    const taxableRegular = Math.max(0, salaryIncome - deductions);
    let baseTax = 0;


    // New Tax Regime Slabs (Simplified for FY 2025-26)
    if (taxableRegular > 1500000) baseTax = 150000 + (taxableRegular - 1500000) * 0.3;
    else if (taxableRegular > 1200000) baseTax = 90000 + (taxableRegular - 1200000) * 0.2;
    else if (taxableRegular > 700000) baseTax = (taxableRegular - 700000) * 0.1;


    // 2. Calculate Flat Tax on Casual Income (ITR-2 Rule)
    const casualTax = casualIncome * 0.30;


    const totalTax = baseTax + casualTax;
    const cess = totalTax * 0.04; // 4% Health & Education Cess


    return {
        totalIncome: salaryIncome + casualIncome,
        taxableIncome: taxableRegular + casualIncome,
        baseTax,
        casualTax,
        totalTax,
        cess,
        finalLiability: totalTax + cess
    };
};

