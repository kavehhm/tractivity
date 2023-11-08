import { SignIn } from "@clerk/nextjs";
 
export default function Page() {
  return <div className="flex items-center py-24 justify-center">
    
    <SignIn />
    </div>
}