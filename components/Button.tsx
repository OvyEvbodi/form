import { MouseEventHandler } from "react";

export interface ButtonProps {
  text: string;
  disabled?: boolean;
  filled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  additionalStyle?: string;
  type?: "submit" | "button" | "reset";
}

const Button = ({props}:  {props: ButtonProps}) => {
  return (
    props?.filled ?
    <button onClick={props?.onClick} className={`lg:min-w-[227px] min-h-[46px] cursor-pointer py-[11px] px-[27px] text-white font-semibold capitalize bg-cyan-700 rounded-lg hover:bg-cyan-800 transition-all ${props?.disabled && "opacity-25"} ${props?.additionalStyle}`}>{props?.text}</button> :
    <button onClick={props?.onClick} className={`lg:min-w-[227px] min-h-[46px] cursor-pointer py-[11px] px-[27px] text-cyan-800 font-semibold capitalize bg-white rounded-lg border border-cyan-800 hover:bg-cyan-800 disabled ${props?.disabled && "opacity-25"} ${props?.additionalStyle}`}>{props?.text}</button>
  )
};

export default Button;