const CORRESPONDENCE = {
    ALL_DATA_RECEIVED: 'All Data Received',
    ACKNOWLEDGE_RECEIPT: 'Acknowledge receipt of request/all data',
    REQUEST_FOR_ADDITIONAL_DATA: 'Request for Additional Data',
    DETERMINATION_LETTER: 'Determination letter to FEMA',
    SUSPENDED_DUE_TO_FEE: 'Suspended Due to Fee to Data',
    AUDIT_DETERMINATION: 'Audit Determination',
    REVIEW_DETERMINATION: 'Review Determination',
    DISTRIBUTE_DETERMINATION: 'Distribute Determination',
    RECEIVE_BFE_PUBLICATION_AFFIDAVIT: 'Receive BFE Publication Affidavit',
    REQUEST_ADDITIONAL_FEE: 'Request additional fee',
} as const;

type Correspondence = typeof CORRESPONDENCE[keyof typeof CORRESPONDENCE];

export default (info: string[]) => {
    const parsedInfo: Record<string, Correspondence> = {};

    for (let i = 0; i < info.length; i++) {
        const line: string|undefined = info[i];

        if (!line) continue;

        if (line?.includes(CORRESPONDENCE.ALL_DATA_RECEIVED)) {
            const allDataReceived = line.replace(CORRESPONDENCE.ALL_DATA_RECEIVED, '').trim();
            parsedInfo[allDataReceived] = CORRESPONDENCE.ALL_DATA_RECEIVED;
        }

        if (line?.includes(CORRESPONDENCE.ACKNOWLEDGE_RECEIPT)) {
            const date: string = info[i + 2] || '';
            parsedInfo[date] = CORRESPONDENCE.ACKNOWLEDGE_RECEIPT;
        }

        if (line?.includes(CORRESPONDENCE.REQUEST_FOR_ADDITIONAL_DATA)) {
            const additionalDataRequest = line.replace(CORRESPONDENCE.REQUEST_FOR_ADDITIONAL_DATA, '').trim();
            parsedInfo[additionalDataRequest] = CORRESPONDENCE.REQUEST_FOR_ADDITIONAL_DATA;
        }

        if (line?.includes(CORRESPONDENCE.DETERMINATION_LETTER)) {
            const determination = line.replace(CORRESPONDENCE.DETERMINATION_LETTER + ' ', '');
            parsedInfo[determination] = CORRESPONDENCE.DETERMINATION_LETTER;
        }

        if (line?.includes(CORRESPONDENCE.SUSPENDED_DUE_TO_FEE)) {
            const suspendedDueToFee = line.replace(CORRESPONDENCE.SUSPENDED_DUE_TO_FEE, '').trim();
            parsedInfo[suspendedDueToFee] = CORRESPONDENCE.SUSPENDED_DUE_TO_FEE;
        }

        if (line?.includes(CORRESPONDENCE.AUDIT_DETERMINATION)) {
            const auditDetermination = line.replace(CORRESPONDENCE.AUDIT_DETERMINATION, '').trim();
            parsedInfo[auditDetermination] = CORRESPONDENCE.AUDIT_DETERMINATION;
        }

        if (line?.includes(CORRESPONDENCE.REVIEW_DETERMINATION)) {
            const reviewDetermination = line.replace(CORRESPONDENCE.REVIEW_DETERMINATION, '').trim();
            parsedInfo[reviewDetermination] = CORRESPONDENCE.REVIEW_DETERMINATION;
        }

        if (line?.includes(CORRESPONDENCE.DISTRIBUTE_DETERMINATION)) {
            const distributeDetermination = line.replace(CORRESPONDENCE.DISTRIBUTE_DETERMINATION, '').trim();
            parsedInfo[distributeDetermination] = CORRESPONDENCE.DISTRIBUTE_DETERMINATION;
        }

        if (line?.includes(CORRESPONDENCE.RECEIVE_BFE_PUBLICATION_AFFIDAVIT)) {
            const receiveBFEPublicationAffidavit = line.replace(CORRESPONDENCE.RECEIVE_BFE_PUBLICATION_AFFIDAVIT, '').trim();
            parsedInfo[receiveBFEPublicationAffidavit] = CORRESPONDENCE.RECEIVE_BFE_PUBLICATION_AFFIDAVIT;
        }

        if (line?.includes(CORRESPONDENCE.REQUEST_ADDITIONAL_FEE)) {
            const requestAdditionalFee = line.replace(CORRESPONDENCE.REQUEST_ADDITIONAL_FEE, '').trim();
            parsedInfo[requestAdditionalFee] = CORRESPONDENCE.REQUEST_ADDITIONAL_FEE;
        }
    }

    return parsedInfo;
};