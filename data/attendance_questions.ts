import { ButtonProps } from "@/components/Button";
import { InputProps, RadioProps, SelectProps } from "@/components/Input";

const bioSectionTitle = "Bio-Data Information";
const bioSectionDesc = "Kindly ensure that you provide accurate information.";
const bankSectionTitle = "Bank Details";
const bankSectionDesc = "Please provide your account details for payment. You are required to provide only bank details from conventional banks. The system will reject accounts from MFB, wallet, and other payment platforms.";


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
  {
    tag: "First Name (as it appears on your ID)",
    placeholder: "Enter first name",
    FieldError: false,
    name: "firstname",
    id: "firstname",
    iconUrl: "/name_icon.png",
    type: "text",
    required: true,
    additionalStyle: "capitalize",
    errorMessage: "Please enter a first name"
  },
  {
    tag: "Middle name (optional)",
    placeholder: "Enter middle name",
    FieldError: false,
    name: "middlename",
    id: "middlename",
    iconUrl: "/name_icon.png",
    type: "text",
    required: false,
    additionalStyle: "capitalize",
    errorMessage: "Please enter a valid middle name"
  },
  {
    tag: "Last Name (as it appears on your ID)",
    placeholder: "Enter last name",
    FieldError: false,
    name: "lastname",
    id: "lastname",
    iconUrl: "/name_icon.png",
    type: "text",
    required: true,
    additionalStyle: "capitalize",
    errorMessage: "Please enter a last name"
  },
  {
    tag: "Date of Birth",
    placeholder: "",
    FieldError: false,
    name: "dob",
    id: "dob",
    iconUrl: "",
    type: "date",
    required: true,
    max: "2007-03-01",
    errorMessage: "Please enter a valid date of birth (dd/mm/yyyy)"
  },
  {
    tag: "Phone Number (must be same phone number used during application)",
    placeholder: "e.g 08045678910",
    FieldError: false,
    name: "phone_number",
    id: "phone_number",
    iconUrl: "/number_icon.png",
    type: "tel",
    required: true,
    pattern:"^0[0-9]{10}",
    errorMessage: "Number must start with 0 and be 11 digits"
  },
  {
    tag: "WhatsApp Number",
    placeholder: "e.g 08045678910",
    FieldError: false,
    name: "whatsapp",
    id: "whatsapp",
    iconUrl: "/number_icon.png",
    type: "tel",
    required: true,
    pattern:"^0[0-9]{10}",
    errorMessage: "Number must start with 0 and be 11 digits"
  },
  {
    tag: "Email Address",
    placeholder: "Enter your email",
    FieldError: false,
    name: "email",
    id: "email",
    iconUrl: "",
    type: "email",
    required: false,
    errorMessage: "Please enter a valid email"
  },
  {
    tag: "Full Residential Address",
    placeholder: "Enter your address",
    FieldError: false,
    name: "full_address",
    id: "full_address",
    iconUrl: "",
    type: "text",
    required: true,
    errorMessage: "Please enter an address"
  }
];

const bioRadioFieldsData: RadioProps [] = [
  {
    title: "Gender",
    tag: "gender",
    FieldError: false,
    name: "gender",
    options: ["Male", "Female"],
    required: true
  },
  {
    title: "What is your valid means of identification?",
    tag: "id_type",
    FieldError: false,
    name: "id_type",
    options: ["Voter's Card", "Drivers License", "National ID Card (NIN)", "International Passport"],
    required: true
  },
  {
    title: "Choose your network provider",
    tag: "network",
    FieldError: false,
    name: "network",
    options: ["MTN", "Airtel", "Glo", "9Mobile"],
    required: true,
  },
];

// const roleSelectFieldsData: SelectProps [] = [
//   {
//     title: "Are you willing to be reassigned to a role other than the one applied for?",
//     tag: "willing_to_be_reassigned",
//     FieldError: false,
//     name: "willing_to_be_reassigned",
//     options: ["Yes", "No"],
//     required: true
//   },
// ];

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

export interface IEVFormProps {
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

export const attendanceData: IEVFormProps = {
  title: "Attendance Form LGA Assistants",
  description: "Please complete the attendance form below as validation.",
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
