import { BankDataType } from "@/app/api/bank_verification/route";


const BankInfo = ({props}: {props: BankDataType}) => {
  return (
    <tr className={`even:bg-white ${props.message !== "Valid" && "text-red-800"}`}>
      <td data-label="Serial No." >{props.idx}</td>
      <td data-label="Telephone" >{props.phone_number}</td>
      <td data-label="Account No." >{props.account_number}</td>
      <td data-label="Name" >{props.name}</td>
      <td data-label="N-name" >{props.nuban_acc_name}</td>
      <td data-label="Bank">{props.bank_name}</td>
      <td data-label="N-bank" >{props.nuban_bank_name}</td>
      <td data-label="Status">{props.message}</td>
    </tr>
  )
};

export const InvalidBankInfo = ({props}: {props: BankDataType}) => {
  return (
    <tr className={`even:bg-white ${props.message !== "Valid" && "text-red-800"}`}>
      <td data-label="Serial No.">{props.idx}</td>
      <td data-label="Telephone" >{props.phone_number}</td>
      <td data-label="Account No." >{props.account_number}</td>
      <td data-label="Name" >{props.name}</td>
      <td data-label="Bank" >{props.bank_name}</td>
      <td data-label="Status" >{props.message}</td>
    </tr>
  )
};


export default BankInfo