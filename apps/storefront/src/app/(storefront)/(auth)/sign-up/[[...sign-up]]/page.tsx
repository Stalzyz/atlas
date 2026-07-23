import { AuthForm } from "@/components/auth/AuthForm";

export default function SignUpPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-20">
      <div className="w-full max-w-md space-y-8">
        <AuthForm />
        
        <div className="text-center mt-8">
          <p className="text-sm text-gray-400">
            Already have an account?{" "}
            <a href="/sign-in" className="text-primary font-bold font-serif italic text-sm hover:underline">
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
