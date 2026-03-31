export interface AuditResult {
    totalIncome: number;
    oldTax: number;
    newTax: number;
    savings: number;
    recommendedRegime: 'old' | 'new';
}

export const performTaxAudit = (income: number, deductions: number = 0): AuditResult => {
    // Simplistic placeholder logic for AY 2026-27 
    // We will refine these slabs as we get closer to April 30th

    const calculateNewRegime = (inc: number) => {
        if (inc <= 300000) return 0;
        if (inc <= 700000) return (inc - 300000) * 0.05;
        return (inc - 700000) * 0.10 + 20000;
    };

    const calculateOldRegime = (inc: number, ded: number) => {
        const taxable = Math.max(0, inc - ded);
        if (taxable <= 250000) return 0;
        return (taxable - 250000) * 0.20;
    };

    const oldTax = calculateOldRegime(income, deductions);
    const newTax = calculateNewRegime(income);

    return {
        totalIncome: income,
        oldTax,
        newTax,
        savings: Math.abs(oldTax - newTax),
        recommendedRegime: newTax < oldTax ? 'new' : 'old'
    };
};
export interface ProjectionResult {
    age: number;
    balance: number;
}

export const calculateNetWorthAt60 = (
    currentAge: number,
    currentSavings: number,
    monthlyInvestment: number,
    expectedReturn: number = 0.12 // Default 12% for India equity
): ProjectionResult[] => {
    const yearsToInvest = 60 - currentAge;
    const data: ProjectionResult[] = [];
    let balance = currentSavings;

    for (let i = 0; i <= yearsToInvest; i++) {
        data.push({ age: currentAge + i, balance: Math.round(balance) });
        // Annual compound with monthly additions
        balance = (balance + monthlyInvestment * 12) * (1 + expectedReturn);
    }
    return data;
};