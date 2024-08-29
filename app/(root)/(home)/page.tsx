import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <Button variant="outline">Button</Button>
      <Link href={"/"} className={buttonVariants({ variant: "outline" })}>
        Click here
      </Link>
      <Button asChild size={"lg"}>
        <Link href="/login">Login</Link>
      </Button>
    </div>
  );
}
