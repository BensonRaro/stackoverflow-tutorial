import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return <SignIn signUpFallbackRedirectUrl={"/"} signUpUrl="/sign-up" />;
}
