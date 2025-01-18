import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ModeToggle";

export default function Navbar() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-primary">
          Ship-it
        </Link>

        <nav>
          <ul className="flex space-x-4 items-center">
            <li>
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary"
              >
                Pricing
              </Link>
            </li>

            <li>
              <Button variant="outline">Log in</Button>
            </li>
            <li>
              <ModeToggle />
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
