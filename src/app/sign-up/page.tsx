import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="">
      <h1>新規登録</h1>
        <div className="flex justify-center">
          <SignUp routing="hash" fallbackRedirectUrl="/dashboard"/>
        </div>
    </div>
  );
}