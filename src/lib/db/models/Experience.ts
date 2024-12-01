import { MaybeString } from "@/lib/common";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type Experience = {
    experienceId: string;
    experienceTitle: string;
    experienceDescription: string;
    experienceExtendedDescription: string;
    prices : (Money & {
        label: string;
    })[];
    experiencesImages: string[];
    experienceLocation: Address;
}

type Address = {
    city: MaybeString;
    country: MaybeString;
    postCode : MaybeString;
    addressLine: MaybeString;
    latitude: number;
    longitude: number;
}

type Money = {
    currency: string;
    amount: number;
}