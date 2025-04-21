import { SignInForm } from "@/components/sign-in-form"
import { Illustration } from "@/components/illustration"

export default function SignInPage() {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <div className="hidden md:flex md:w-1/2 bg-primary/5">
        <Illustration />
      </div>

      <div className="flex w-full items-center justify-center p-4 md:w-1/2 md:p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tighter text-green-600 sm:text-4xl">World Vegetable Center</h1>
            <p className="text-muted-foreground">GenBank Monitoring System</p>
          </div>

          <SignInForm />

        </div>
      </div>
    </div>
  )
}
