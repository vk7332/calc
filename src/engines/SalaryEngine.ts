export interface SalaryBreakup {
    grossSalary: number;
    standardDeduction: number;
    professionalTax: number;
    entertainmentAllowance: number;
    netSalary: number;
}

export const calculateSalaryIncome = (
    basic: number,
    hra: number,
    specialAllowance: number,

    isProfessionalTaxPaid: boolean = true
): SalaryBreakup => {
    const grossSalary = basic + hra + specialAllowance;
    const standardDeduction = 50000; // Fixed for FY 2025-26
    const professionalTax = isProfessionalTaxPaid ? 2500 : 0;

    const netSalary = Math.max(0, grossSalary - standardDeduction - professionalTax);

    return {
        grossSalary,
        standardDeduction,
        professionalTax,
        entertainmentAllowance: 0, // Usually for Govt employees
        netSalary
    };
};