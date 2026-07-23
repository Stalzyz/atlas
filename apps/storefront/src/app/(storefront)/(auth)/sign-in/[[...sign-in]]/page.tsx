import { AuthForm } from "@/components/auth/AuthForm";

export default function SignInPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-20">
      <div className="w-full max-w-md space-y-8">
        <AuthForm />
        
        <div className="text-center mt-8">
          <p className="mt-8 text-center text-xs text-gray-500">
          By signing in, you agree to our <br />
          <a href="/policies/terms-and-conditions" className="text-charcoal font-bold hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/policies/privacy-policy" className="text-charcoal font-bold hover:underline">
            Privacy Policy
          </a>
        </p>
        </div>
      </div>
    </div>
  );
}
