import { BankDataType } from "@/app/api/bank_verification/route";


const BankInfo = ({props}: {props: BankDataType}) => {
  return (
    <tr className={`even:bg-white ${props.message !== "Valid" && "text-red-800"}`}>
      <td>{props.idx}</td>
      <td>{props.phone_number}</td>
      <td>{props.account_number}</td>
      <td>{props.name}</td>
      <td>{props.nuban_acc_name}</td>
      <td>{props.bank_name}</td>
      <td>{props.nuban_bank_name}</td>
      <td>{props.message}</td>
    </tr>
  )
};
export const InvalidBankInfo = ({props}: {props: BankDataType}) => {
  return (
    <tr className={`even:bg-white ${props.message !== "Valid" && "text-red-800"}`}>
      <td>{props.idx}</td>
      <td>{props.phone_number}</td>
      <td>{props.account_number}</td>
      <td>{props.name}</td>
      <td>{props.bank_name}</td>
      <td>{props.message}</td>
    </tr>
  )
};


export default BankInfo