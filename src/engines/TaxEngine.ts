import { AuditResult, TaxSettings } from '@/types/client';

export interface DetailedTaxResult extends AuditResult {
    oldBreakdown: {
        taxableIncome: number;
        slabTax: number;
        rebate87A: number;
        surcharge: number;
        marginalRelief: number;
        cess: number;
        total: number;
    };
    newBreakdown: {
        taxableIncome: number;
        slabTax: number;
        rebate87A: number;
        surcharge: number;
        marginalRelief: number;
        cess: number;
        total: number;
    };
}

const ROUND = (val: number) => Math.round(val);

/**
 * AY 2026-27 New Regime Slabs (Finance Act 2024 / Budget 2025 Updates)
 * 0 - 3L: Nil
 * 3L - 7L: 5%
 * 7L - 10L: 10%
 * 10L - 12L: 15%
 * 12L - 15L: 20%
 * Above 15L: 30%
 */
const calculateNewSlabTax = (income: number): number => {
    if (income <= 300000) return 0;
    let tax = 0;
    if (income > 1500000) tax += (income - 1500000) * 0.3 + 300000 * 0.2 + 200000 * 0.15 + 300000 * 0.1 + 400000 * 0.05;
    else if (income > 1200000) tax += (income - 1200000) * 0.2 + 200000 * 0.15 + 300000 * 0.1 + 400000 * 0.05;
    else if (income > 1000000) tax += (income - 1000000) * 0.15 + 300000 * 0.1 + 400000 * 0.05;
    else if (income > 700000) tax += (income - 700000) * 0.1 + 400000 * 0.05;
    else if (income > 300000) tax += (income - 300000) * 0.05;
    return tax;
};

/**
 * AY 2026-27 Old Regime Slabs (Standard)
 * 0 - 2.5L: Nil
 * 2.5L - 5L: 5%
 * 5L - 10L: 20%
 * Above 10L: 30%
 */
const calculateOldSlabTax = (income: number, ageGroup: 'Normal' | 'Senior' | 'Super'): number => {
    let limit = 250000;
    if (ageGroup === 'Senior') limit = 300000;
    if (ageGroup === 'Super') limit = 500000;

    if (income <= limit) return 0;
    let tax = 0;
    
    if (income > 1000000) {
        tax += (income - 1000000) * 0.3 + 500000 * 0.2 + (1000000 - 500000 - (limit > 500000 ? 0 : 500000 - limit)) * 0.2 + (500000 - limit) * 0.05;
        // Simplified for standard individual (limit 2.5L):
        if (limit === 250000) tax = (income - 1000000) * 0.3 + 100000 + 12500;
        else if (limit === 300000) tax = (income - 1000000) * 0.3 + 100000 + 10000;
        else if (limit === 500000) tax = (income - 1000000) * 0.3 + 100000;
    } else if (income > 500000) {
        tax += (income - 500000) * 0.2 + (500000 - limit) * 0.05;
    } else {
        tax += (income - limit) * 0.05;
    }
    return tax;
};

const calculateSurcharge = (tax: number, income: number, regime: 'old' | 'new'): { surcharge: number, marginalRelief: number } => {
    let rate = 0;
    let limit = 5000000;
    
    if (income > 50000000) rate = regime === 'new' ? 0.25 : 0.37;
    else if (income > 20000000) rate = 0.25;
    else if (income > 10000000) rate = 0.15;
    else if (income > 5000000) rate = 0.10;

    if (rate === 0) return { surcharge: 0, marginalRelief: 0 };

    let surcharge = tax * rate;
    
    // Marginal Relief Calculation (Simplified logic)
    // MR = (Tax on Income + Surcharge) - (Tax on Limit + Surcharge on Limit + (Income - Limit))
    // This is a complex area, providing a base MR logic:
    let taxAtLimit = 0;
    if (regime === 'new') taxAtLimit = calculateNewSlabTax(limit);
    else taxAtLimit = calculateOldSlabTax(limit, 'Normal'); // Default to normal for MR check

    let surchargeAtLimit = 0; // Surcharge at the previous limit is always lower or zero
    if (limit === 10000000) surchargeAtLimit = taxAtLimit * 0.10;
    // ... more complex checks usually needed here for each tier

    let totalTaxWithSurcharge = tax + surcharge;
    let cap = taxAtLimit + surchargeAtLimit + (income - limit);
    
    let marginalRelief = Math.max(0, totalTaxWithSurcharge - cap);
    
    return { surcharge, marginalRelief };
};

export const calculateTaxITR2 = (
    totalIncome: number,
    lotteryWinnings: number,
    deductions: number,
    settings: TaxSettings,
    ageGroup: 'Normal' | 'Senior' | 'Super' = 'Normal'
): DetailedTaxResult => {
    
    const incomeExcludingLottery = totalIncome - lotteryWinnings;
    const lotteryTax = lotteryWinnings * 0.30;

    // --- NEW REGIME ---
    const taxableNew = Math.max(0, totalIncome - settings.standardDeduction);
    let slabTaxNew = calculateNewSlabTax(Math.max(0, incomeExcludingLottery - settings.standardDeduction));
    let rebate87ANew = 0;
    if (taxableNew <= 700000) rebate87ANew = slabTaxNew;
    // Marginal rebate for new regime (income slightly above 7L)
    else if (taxableNew > 700000 && taxableNew <= 727770) rebate87ANew = slabTaxNew - (taxableNew - 700000);

    let baseTaxNew = slabTaxNew - rebate87ANew + lotteryTax;
    const { surcharge: surNew, marginalRelief: mrNew } = calculateSurcharge(baseTaxNew, taxableNew, 'new');
    let taxBeforeCessNew = baseTaxNew + surNew - mrNew;
    let cessNew = taxBeforeCessNew * 0.04;

    // --- OLD REGIME ---
    const taxableOld = Math.max(0, totalIncome - settings.standardDeduction - deductions);
    let slabTaxOld = calculateOldSlabTax(Math.max(0, incomeExcludingLottery - settings.standardDeduction - deductions), ageGroup);
    let rebate87AOld = 0;
    if (taxableOld <= 500000) rebate87AOld = Math.min(slabTaxOld, 12500);

    let baseTaxOld = slabTaxOld - rebate87AOld + lotteryTax;
    const { surcharge: surOld, marginalRelief: mrOld } = calculateSurcharge(baseTaxOld, taxableOld, 'old');
    let taxBeforeCessOld = baseTaxOld + surOld - mrOld;
    let cessOld = taxBeforeCessOld * 0.04;

    const finalOld = ROUND(taxBeforeCessOld + cessOld);
    const finalNew = ROUND(taxBeforeCessNew + cessNew);

    return {
        totalIncome,
        taxableIncome: taxableNew, // Displaying new taxable by default
        oldTax: finalOld,
        newTax: finalNew,
        recommendedRegime: finalNew < finalOld ? 'new' : 'old',
        savings: Math.max(0, finalOld - finalNew),
        cess: ROUND(cessNew),
        finalLiability: Math.min(finalOld, finalNew),
        oldBreakdown: {
            taxableIncome: taxableOld,
            slabTax: ROUND(slabTaxOld),
            rebate87A: ROUND(rebate87AOld),
            surcharge: ROUND(surOld),
            marginalRelief: ROUND(mrOld),
            cess: ROUND(cessOld),
            total: finalOld
        },
        newBreakdown: {
            taxableIncome: taxableNew,
            slabTax: ROUND(slabTaxNew),
            rebate87A: ROUND(rebate87ANew),
            surcharge: ROUND(surNew),
            marginalRelief: ROUND(mrNew),
            cess: ROUND(cessNew),
            total: finalNew
        }
    };
};
