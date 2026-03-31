export interface GstResult {
    outputTax: { igst: number; cgst: number; sgst: number };
    itcUtilized: { igst: number; cgst: number; sgst: number };
    netCashPayable: { igst: number; cgst: number; sgst: number; total: number };
    remainingItc: { igst: number; cgst: number; sgst: number };
}

export const calculateNetGst = (
    output: { igst: number; cgst: number; sgst: number },
    itc: { igst: number; cgst: number; sgst: number }
): GstResult => {
    let remIgstLiability = output.igst;
    let remCgstLiability = output.cgst;
    let remSgstLiability = output.sgst;

    let remIgstItc = itc.igst;
    let remCgstItc = itc.cgst;
    let remSgstItc = itc.sgst;

    // 1. Use IGST ITC to pay IGST, then CGST, then SGST
    const igstToIgst = Math.min(remIgstLiability, remIgstItc);
    remIgstLiability -= igstToIgst;
    remIgstItc -= igstToIgst;

    const igstToCgst = Math.min(remCgstLiability, remIgstItc);
    remCgstLiability -= igstToCgst;
    remIgstItc -= igstToCgst;

    const igstToSgst = Math.min(remSgstLiability, remIgstItc);
    remSgstLiability -= igstToSgst;
    remIgstItc -= igstToSgst;

    // 2. Use CGST ITC to pay CGST, then IGST (Rule: CGST cannot pay SGST)
    const cgstToCgst = Math.min(remCgstLiability, remCgstItc);
    remCgstLiability -= cgstToCgst;
    remCgstItc -= cgstToCgst;

    const cgstToIgst = Math.min(remIgstLiability, remCgstItc);
    remIgstLiability -= cgstToIgst;
    remCgstItc -= cgstToIgst;

    // 3. Use SGST ITC to pay SGST, then IGST (Rule: SGST cannot pay CGST)
    const sgstToSgst = Math.min(remSgstLiability, remSgstItc);
    remSgstLiability -= sgstToSgst;
    remSgstItc -= sgstToSgst;

    const sgstToIgst = Math.min(remIgstLiability, remSgstItc);
    remIgstLiability -= sgstToIgst;
    remSgstItc -= sgstToIgst;

    return {
        outputTax: output,
        itcUtilized: {
            igst: itc.igst - remIgstItc,
            cgst: itc.cgst - remCgstItc,
            sgst: itc.sgst - remSgstItc,
        },
        netCashPayable: {
            igst: remIgstLiability,
            cgst: remCgstLiability,
            sgst: remSgstLiability,
            total: remIgstLiability + remCgstLiability + remSgstLiability,
        },
        remainingItc: {
            igst: remIgstItc,
            cgst: remCgstItc,
            sgst: remSgstItc,
        },
    };
};