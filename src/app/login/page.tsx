import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <>
      <div className="mt=8">
        <h2>ログインページ</h2>
        <div className="flex justify-center">
          <SignIn routing="hash" fallbackRedirectUrl="/dashboard" />
        </div>
      </div>
    </>
  )
}