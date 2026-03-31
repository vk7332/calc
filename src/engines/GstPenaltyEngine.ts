export interface PenaltyResult {
    daysDelayed: number;
    interest: number;
    lateFee: number;
    totalPenalty: number;
}

export const calculateGstPenalties = (
    netTaxCash: number,
    dueDate: string,
    filingDate: string,
    isNilReturn: boolean = false
): PenaltyResult => {
    const due = new Date(dueDate);
    const filing = new Date(filingDate);

    // Calculate days delayed
    const diffTime = filing.getTime() - due.getTime();
    const daysDelayed = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    if (daysDelayed === 0) {
        return { daysDelayed: 0, interest: 0, lateFee: 0, totalPenalty: 0 };
    }

    // 1. Interest Calculation (18% p.a. on Net Tax)
    // Formula: (Tax * 18% * Days) / 365
    const interest = (netTaxCash * 0.18 * daysDelayed) / 365;

    // 2. Late Fee Calculation
    // Standard: ₹50/day | Nil: ₹20/day
    const dailyRate = isNilReturn ? 20 : 50;
    let lateFee = daysDelayed * dailyRate;

    // Cap late fees (Simplified: Max ₹5000 for standard, ₹500 for Nil)
    const maxLateFee = isNilReturn ? 500 : 5000;
    lateFee = Math.min(lateFee, maxLateFee);

    return {
        daysDelayed,
        interest: Math.round(interest),
        lateFee,
        totalPenalty: Math.round(interest + lateFee)
    };
};