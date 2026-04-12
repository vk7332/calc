import hpSlabs from "../data/courtFees/HP/slabs.json";
import hpFixed from "../data/courtFees/HP/fixedFees.json";

import pbSlabs from "../data/courtFees/Punjab/slabs.json";
import pbFixed from "../data/courtFees/Punjab/fixedFees.json";

import hrSlabs from "../data/courtFees/Haryana/slabs.json";
import hrFixed from "../data/courtFees/Haryana/fixedFees.json";

import dlSlabs from "../data/courtFees/Delhi/slabs.json";
import dlFixed from "../data/courtFees/Delhi/fixedFees.json";

import upSlabs from "../data/courtFees/UP/slabs.json";
import upFixed from "../data/courtFees/UP/fixedFees.json";

import rjSlabs from "../data/courtFees/Rajasthan/slabs.json";
import rjFixed from "../data/courtFees/Rajasthan/fixedFees.json";

export function getStateFeeRules(state: string) {
    switch (state) {
        case "HP":
            return { slabs: hpSlabs, fixedFees: hpFixed };

        case "PB":
            return { slabs: pbSlabs, fixedFees: pbFixed };

        case "HR":
            return { slabs: hrSlabs, fixedFees: hrFixed };

        case "DL":
            return { slabs: dlSlabs, fixedFees: dlFixed };

        case "UP":
            return { slabs: upSlabs, fixedFees: upFixed };

        case "RJ":
            return { slabs: rjSlabs, fixedFees: rjFixed };

        default:
            return { slabs: hpSlabs, fixedFees: hpFixed };
    }
}