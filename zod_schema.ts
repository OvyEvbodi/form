import { z } from "zod";

export const FieldErrorMsgs = {
  bank_acct_no: "Account number must be 10 digits",
  bank_acct_name: "Please check that name is more than 3 characters",
  id_file: "Please upload a valid ID of the type you chose above",
  confirm_bank_acct_no: "Please confirm account number in both fields",
};

export const shortlistedSchema = z.object({
  firstname: z.string({required_error: "First name is required"}).trim(),
  lastname: z.string({required_error: "Last name is required"}).trim(),
  dob: z.string({required_error: "Date of birth is required"}).date(),
  phone_number: z
    .string({required_error: "Phone number is required"})
    .length(11, {message: FieldErrorMsgs.phone_number }),
  whatsapp: z
    .string({required_error: "WhatsApp number is required"})
    .length(11, {message: FieldErrorMsgs.whatsapp }),
  full_address: z
    .string({required_error: "Address is required"})
    .min(1, {message: FieldErrorMsgs.full_address }),
  bank_acct_name: z
    .string({required_error: "Bank account name is required"})
    .trim().min(1, {message: FieldErrorMsgs.bank_acct_name }),
  bank_acct_no: z
    .string({required_error: "Bank account number is required"})
    .length(10, {message: FieldErrorMsgs.bank_acct_no }),
  confirm_bank_acct_no: z.
    string({required_error: "Please confirm account number in both fields"})
    .length(10, {message: FieldErrorMsgs.confirm_bank_acct_no }),
  // first_choice: z
  //   .string({required_error: "Please choose a first choice for redeployment"})
  //   .trim().min(1, {message: FieldErrorMsgs.first_choice }),

  id_file: z.instanceof(File, { message: "Please choose a file" })
    .refine(file => file.size <= 2 * 1024 * 1024, {message: "File size must be 2MB or less"})
    .refine((file) => ["image/jpeg", "image/png", "image/jpg", "application/pdf"].includes(file.type), {
      message: "Please upload a valid file: JPG, PDF, PNG, or JPEG",
  })
})
.refine(form => form.confirm_bank_acct_no === form.bank_acct_no, {message: FieldErrorMsgs.confirm_bank_acct_no, path: ["confirm_bank_acct_no"]});

export const attendanceSchema = z.object({
  firstname: z.string({required_error: "First name is required"}).trim(),
  lastname: z.string({required_error: "Last name is required"}).trim(),
  dob: z.string({required_error: "Date of birth is required"}).date(),
  phone_number: z
    .string({required_error: "Phone number is required"})
    .length(11, {message: FieldErrorMsgs.phone_number }),
  network: z
    .string({required_error: "Network provider is required"}).trim(),
  whatsapp: z
    .string({required_error: "WhatsApp number is required"})
    .length(11, {message: FieldErrorMsgs.whatsapp }),
  full_address: z
    .string({required_error: "Address is required"})
    .min(1, {message: FieldErrorMsgs.full_address }),
  bank_acct_name: z
    .string({required_error: "Bank account name is required"})
    .trim().min(1, {message: FieldErrorMsgs.bank_acct_name }),
  bank_acct_no: z
    .string({required_error: "Bank account number is required"})
    .length(10, {message: FieldErrorMsgs.bank_acct_no }),
  confirm_bank_acct_no: z.
    string({required_error: "Please confirm account number in both fields"})
    .length(10, {message: FieldErrorMsgs.confirm_bank_acct_no }),
  // first_choice: z
  //   .string({required_error: "Please choose a first choice for redeployment"})
  //   .trim().min(1, {message: FieldErrorMsgs.first_choice }),

  id_file: z.instanceof(File, { message: "Please choose a file" })
    .refine(file => file.size <= 2 * 1024 * 1024, {message: "File size must be 2MB or less"})
    .refine((file) => ["image/jpeg", "image/png", "image/jpg", "application/pdf"].includes(file.type), {
      message: "Please upload a valid file: JPG, PDF, PNG, or JPEG",
  })
})
.refine(form => form.confirm_bank_acct_no === form.bank_acct_no, {message: FieldErrorMsgs.confirm_bank_acct_no, path: ["confirm_bank_acct_no"]});

export const idUploadForPaymentSchema = z.object({
  bank_acct_name: z
    .string({required_error: "Bank account name is required"})
    .trim().min(1, {message: FieldErrorMsgs.bank_acct_name }),
  bank_acct_no: z
    .string({required_error: "Bank account number is required"})
    .length(10, {message: FieldErrorMsgs.bank_acct_no }),
  confirm_bank_acct_no: z.
    string({required_error: "Please confirm account number in both fields"})
    .length(10, {message: FieldErrorMsgs.confirm_bank_acct_no }),

  id_file: z.instanceof(File, { message: "Please choose a file" })
    .refine(file => file.size <= 4 * 1024 * 1024, {message: "File size must be 4MB or less"})
    .refine((file) => ["image/jpeg", "image/png", "image/jpg", "application/pdf"].includes(file.type), {
      message: "Please upload a valid file: JPG, PDF, PNG, or JPEG",
  })
})
.refine(form => form.confirm_bank_acct_no === form.bank_acct_no, {message: FieldErrorMsgs.confirm_bank_acct_no, path: ["confirm_bank_acct_no"]});
