import { ButtonProps } from "@/components/Button";
import { InputProps, RadioProps, SelectProps } from "@/components/Input";

const bioSectionTitle = "Bio-Data Information";
const bioSectionDesc = "Kindly ensure that you provide accurate information.";
const bankSectionTitle = "Bank Details";
const bankSectionDesc = "Please provide the bank details used during physical training at the LGA.";


const bankList: string[] = [
  "Access Bank",
  "Access Bank PLC (Diamond)",
  "Citibank Nig",
  "Ecobank Plc.",
  "Fidelity Bank Plc.",
  "First Bank of Nigeria Plc.",
  "First City Monument Bank (FCMB)",
  "Guaranty Trust Bank Plc.",
  "JAIZ Bank",
  "Keystone Bank",
  "Lotus Bank",
  "Parallax Bank",
  "Polaris Bank",
  "Premium Trust Bank",
  "Providus Bank",
  "Skye Bank",
  "Stanbic-IBTC Bank Plc",
  "Standard Chartered Bank Nigeria", 
  "Sterling Bank Plc.",
  "Taj Bank",
  "Union Bank",
  "United Bank for Africa Plc.",
  "Unity Bank Plc.",
  "Wema Bank",
  "Zenith Bank Ltd."
];

const bioTextFieldsData: InputProps[] = [
];

const bioRadioFieldsData: RadioProps [] = [
  {
    title: "What is your valid means of identification?",
    tag: "id_type",
    FieldError: false,
    name: "id_type",
    options: ["Voter's Card", "Drivers License", "National ID Card (NIN)", "International Passport"],
    required: true
  },
];

const bankTextFieldsData: InputProps[] = [
  {
    tag: "Account Name (should be same as on ID)",
    placeholder: "",
    FieldError: false,
    name: "bank_acct_name",
    id: "bank_acct_name",
    iconUrl: "/name_icon.png",
    type: "text",
    required: true,
    additionalStyle: "capitalize",
    errorMessage: "Please enter a bank account name"
  },
  {
    tag: "Account Number (NUBAN must be 10 digits)",
    placeholder: "",
    FieldError: false,
    name: "bank_acct_no",
    id: "bank_acct_no",
    iconUrl: "",
    type: "tel",
    required: true,
    pattern:"[0-9]{10}",
    errorMessage: "Please enter a valid (10 digits) account number format"
  },
  {
    tag: "Confirm Account Number",
    placeholder: "",
    FieldError: false,
    name: "confirm_bank_acct_no",
    id: "confirm_bank_acct_no",
    iconUrl: "",
    type: "tel",
    required: true,
    pattern:"[0-9]{10}",
    errorMessage: "Please ensure it matches the account number above"
  }
];

const bankSelectFieldsData: SelectProps [] = [
  {
    title: "Bank name",
    tag: "name_of_bank",
    FieldError: false,
    name: "name_of_bank",
    options: bankList,
    required: true
  },
];

const buttonInfoData: ButtonProps = {
  text: "Submit",
  type: "button",
  filled: true,
  additionalStyle: "w-full"
};

export interface IDBankVerificationFormProps {
  logoUrl?: string;
  title: string;
  description?: string;
  firstTextFields?: InputProps[];
  secondTextFields?: InputProps[];
  firstRadioFields?: RadioProps[];
  secondRadioFields?: RadioProps[];
  firstSelectFields?: SelectProps[];
  secondSelectFields?: SelectProps[];
  firstSectionTitle?: string;
  secondSectionTitle?: string;
  firstSectionDescription?: string;
  secondSectionDescription?: string;
  buttonInfo: ButtonProps;
  footerText?: string;
  footerLink: string;
  accentColour?: string;
  footerLinkText?: string;
  cautionText?: string;
} // add select fields props later

export const idBankVerificationData: IDBankVerificationFormProps = {
  title: "ID Upload Form for Payment Validation of Data Clerks and Local Guides Details",
  description: "Please complete the form below as validation.",
  logoUrl: "",
  firstSectionTitle: bioSectionTitle,
  firstSectionDescription: bioSectionDesc,
  secondSectionTitle: bankSectionTitle,
  secondSectionDescription: bankSectionDesc,
  firstTextFields: bioTextFieldsData,
  secondTextFields: bankTextFieldsData,
  firstRadioFields: bioRadioFieldsData,
  // firstSelectFields: roleSelectFieldsData,
  secondSelectFields: bankSelectFieldsData,
  buttonInfo: buttonInfoData,
  footerText: "Are you experiencing any technical issues? ",
  footerLinkText: "Contact support here",
  footerLink: "/support",
  accentColour: "cyan-800"
};
