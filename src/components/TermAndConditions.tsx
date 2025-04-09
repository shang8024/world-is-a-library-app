import { Checkbox } from "@/components/ui/checkbox";
export default function TermsAndConditionsCheckBox() {
    return (
      <div className="flex items-center space-x-2">
        <Checkbox id="terms" className='size-3.5' required/>
        <label
            htmlFor="terms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Accept {" "}
          <a href="#" className="underline underline-offset-4">
            terms and conditions
          </a>
        </label>
      </div>
    )
}