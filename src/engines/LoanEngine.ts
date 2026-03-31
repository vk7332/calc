export interface EMIDetails {
    monthlyEmi: number;
    totalInterest: number;
    totalPayment: number;
}

export const calculateEMI = (
    principal: number,
    annualRate: number,
    tenureYears: number
): EMIDetails => {
    const monthlyRate = annualRate / (12 * 100);
    const totalMonths = tenureYears * 12;

    // EMI Formula: [P x R x (1+R)^N]/[(1+R)^N-1]
    const emi =
        (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
        (Math.pow(1 + monthlyRate, totalMonths) - 1);

    const totalPayment = emi * totalMonths;
    const totalInterest = totalPayment - principal;

    return {
        monthlyEmi: Math.round(emi),
        totalInterest: Math.round(totalInterest),
        totalPayment: Math.round(totalPayment)
    };
};