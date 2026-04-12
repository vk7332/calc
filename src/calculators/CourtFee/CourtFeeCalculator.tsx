import { calculateSlabEngine } from "../../engines/courtFee/CourtFeeSlabEngine";
import { getStateFeeRules } from "../../services/CourtFeeService";
import {
    CourtFeeInput,
    CourtFeeResult,
    FeeRules,
} from "../../types/courtFeeTypes";
import { useState, ReactNode } from "react";
import FeeBreakdown from "./FeeBreakdown";
import CaseDetailsForm from "./CaseDetailsForm";

interface CaseDetailsFormProps {
    onCalculate: (formData: any) => void;
}

export default function CourtFeeCalculator() {
    const [result, setResult] = useState<any>(null);

    const handleCalculate = (formData: any) => {
        const res = CourtFeeCalculatorEngine.calculate(formData);
        setResult(res);
    };

    return (
        <div className="p-4">
            <CaseDetailsForm onCalculate={handleCalculate} />
            {result && <FeeBreakdown data={result} />}
        </div>
    );
}

export class CourtFeeCalculatorEngine {
    static calculate(input: CourtFeeInput): CourtFeeResult {
        const { slabs, fixedFees }: FeeRules = getStateFeeRules(input.state);

        let courtFee = 0;

        // ==============================
        // 1. COURT FEE CALCULATION
        // ==============================

        switch (input.caseType) {
            case "moneySuit":
            case "propertySuit":
                courtFee = calculateSlabEngine(
                    input.amount,
                    slabs.moneySuit
                );
                break;

            case "declaratorySuit":
                courtFee = fixedFees.declaratorySuit;
                break;

            case "injunctionSuit":
                courtFee = fixedFees.injunctionSuit;
                break;

            case "appeal":
                courtFee = fixedFees.appeal || 0;
                break;

            case "execution":
                courtFee = fixedFees.execution || 0;
                break;

            default:
                courtFee = 0;
        }

        // ==============================
        // 2. ADDITIONAL FEES
        // ==============================

        const filingFee = fixedFees.filingFee || 0;

        const processFee =
            (input.defendants || 0) * (fixedFees.processFee || 0);

        const applicationFee =
            (input.applications || 0) * (fixedFees.applicationFee || 0);

        const affidavitFee =
            (input.affidavits || 0) * (fixedFees.affidavitFee || 0);

        const notaryFee =
            (input.notaryDocs || 0) * (fixedFees.notaryFee || 0);

        const vakalatnamaFee = input.vakalatnama
            ? (fixedFees.vakalatnama || 0) +
            (fixedFees.advocateWelfare || 0)
            : 0;

        // ==============================
        // 3. TOTAL CALCULATION
        // ==============================

        const total =
            courtFee +
            filingFee +
            processFee +
            applicationFee +
            affidavitFee +
            notaryFee +
            vakalatnamaFee;

        return {
            courtFee,
            filingFee,
            processFee,
            applicationFee,
            affidavitFee,
            notaryFee,
            vakalatnamaFee,
            total,
        };
    }
}