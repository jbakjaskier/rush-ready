import { ObjectId } from "mongodb";

export const loanCollectionName = "loans";

export interface Loan {
    _id: ObjectId;
    sentDateTime?: Date;
    createdDateTime: Date;
    completedDateTime?: Date;
    envelopeId: string;
    emailDetails : {
        emailBlurb: string;
        emailSubject: string;
    };
    status: "loan-created" | "loan-sent-to-customer" | "loan-signed-by-customer";
    representative : {
        email: string;
        name: string;
    };
    customer?: {
        customerEmail: string;
        customerFullName: string;
        customerPhoneNumber: string;
        customerDateOfBirth: string;
        customerAddress: string;
    };
    loanDetails?: {
        loanStartDate: string;
        loanEndDate: string;
        repaymentStartDate: string;
        repaymentEndDate: string;
        loanEstablishmentFees: Money;
        loanAmount: Money;
        loanTotalRepaymentAmount: Money;
        repaymentInstalmentAmount: Money;
        finalRepaymentInstalmentAmount: Money;
    }
    customerDateSigned?: Date;   
    lastUpdated: Date;
}



type Money = {
    value: number;
    currency: "aud"; //Currently we only support AUD financial providers. Must be updated later
}