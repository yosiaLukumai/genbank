import Link from "next/link"

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8 text-center">
        <h1 className="text-3xl font-bold">Create an account</h1>
        <p className="text-muted-foreground">
          This is a placeholder page. The sign-up form would be similar to the sign-in form.
        </p>
        <Link
          href="/sign-in"
          className="inline-block rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
        >
          Back to sign in
        </Link>
      </div>
    </div>
  )
}
