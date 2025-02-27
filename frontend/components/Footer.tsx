export default function Footer() {
  return (
    <footer className="border-t">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className=""></div>
          <p className="mb-4 md:mb-0">
            <span className="text-muted-foreground">Developed by </span>
            <a
              href={"https://linktr.ee/ansh3839"}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="text-light underline underline-offset-2">
                Ansh
              </span>
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
