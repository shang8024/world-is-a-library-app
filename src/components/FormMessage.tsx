import React from 'react'
import { AiFillExclamationCircle } from "react-icons/ai";
import { RxCheckCircled } from "react-icons/rx";

type FormMessageProps = {
    message?: string
}

const FormError = ({message}: FormMessageProps) => {
  if (!message) return null
  return (
    <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive">
        <AiFillExclamationCircle className='w-4 h-4'/>
        {message}
    </div>
  )
}

const FormSuccess = ({ message }: FormMessageProps) => {
  if (!message) return null;

  return (
    <div className="bg-emerald-500/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-emerald-500">
      <RxCheckCircled className="w-4 h-4"/>
      <p>{message}</p>
    </div>
  );
};

export { FormError, FormSuccess };