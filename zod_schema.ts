import { z } from "zod";

export const FieldErrorMsgs = {
  dob: "Please enter a valid date of birth",
  phone_number: "Phone number must start with a '0' and be 11 digits",
  bank_acct_no: "Account number must be 10 digits",
  full_address: "Address must be longer than 10 characters",
  bank_acct_name: "Please check that name is more than 3 characters",
  id_file: "Please upload a valid ID of the type you chose above"
};

export const shortlistedSchema = z.object({
  firstname: z.string({required_error: "First name is required"}).trim(),
  lastname: z.string({required_error: "Last name is required"}).trim(),
  dob: z.string({required_error: "Date of birth is required"}).date(),
  phone_number: z.string({required_error: "Phone number is required"}).length(11, {message: FieldErrorMsgs.phone_number }),
  full_address: z.string({required_error: "Address is required"}).min(1, {message: FieldErrorMsgs.full_address }),
  bank_acct_name: z.string({required_error: "Bank account name is required"}).trim().min(1, {message: FieldErrorMsgs.bank_acct_name }),
  bank_acct_no: z.string({required_error: "Bank account name is required"}).length(10, {message: FieldErrorMsgs.bank_acct_no }),
  id_file: z.instanceof(File, { message: "Please choose a file" })
    .refine(file => file.size <= 2 * 1024 * 1024, {message: "File size must be 2MB or less"})
    .refine((file) => ["image/jpeg", "image/png", "image/jpg", "application/pdf"].includes(file.type), {
      message: "Please upload a valid file: JPG, PDF, PNG, or JPEG",
  })
});
