// src/engines/courtFee/CourtFeeCalculatorEngine.ts

import slabs from "../../data/courtFees/HP/slabs.json";
import fixedFees from "../../data/courtFees/HP/fixedFees.json";

export function calculateCourtFee(input: any) {

    class CourtFeeCalculatorEngine {
        static calculate(amount: number): number {
            if (amount <= 0) return 0;
            return Math.round(amount * 0.05);
        }
    }
    const {
        suitValue,
        suitType,
        includeFiling,
        includeApplication,
        includeNotary,
    } = input;

    let courtFee = 0;

    // 🧠 SLAB CALCULATION
    // ...existing code...
    if (suitType === "money") {
        for (const slab of slabs) {
            if (suitValue <= slab.limit) {
                courtFee =
                    (suitValue - slab.previousLimit) * slab.rate;
                break;
            }
        }
    }
    // ...existing code...

    // 🧾 FIXED SUITS
    if (suitType === "declaration") {
        courtFee = 98;
    }

    if (suitType === "general") {
        courtFee = 48;
    }

    // 📦 OTHER FEES
    const filingFee = includeFiling ? 20 : 0;
    const applicationFee = includeApplication ? 20 : 0;
    const affidavitFee = 20;
    const processFee = 1.5;
    const vakalatnama = 45;
    const notaryFee = includeNotary ? 55 : 0;

    const total =
        courtFee +
        filingFee +
        applicationFee +
        affidavitFee +
        processFee +
        vakalatnama +
        notaryFee;

    return {
        courtFee,
        filingFee,
        applicationFee,
        affidavitFee,
        processFee,
        vakalatnama,
        notaryFee,
        total,
    };
}

const [options, setOptions] = useState({
    includeFiling: true,
    includeApplication: true,
    includeNotary: false,
});
