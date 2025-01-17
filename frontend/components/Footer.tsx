import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className=""></div>
          <p className="mb-4 md:mb-0">
            <span className="text-muted-foreground">Developed by </span>
            <span className="text-light">Ansh</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
