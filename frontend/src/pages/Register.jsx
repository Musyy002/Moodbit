import { SignUp } from "@clerk/clerk-react";

export default function Register() {
    return(
      <div>
          <p>Register Here</p>
            <SignUp fallbackRedirectUrl='/dashboard'/>
      </div>
    )
  }
  