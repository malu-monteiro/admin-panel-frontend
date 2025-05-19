export function Footer() {
  return (
    <footer className="w-full py-10 text-center text-sm text-muted-foreground">
      <p className="mb-2">
        Built with 💜 by{" "}
        <a
          href="https://github.com/malu-monteiro"
          className="underline hover:text-primary transition-colors"
        >
          malu-monteiro
        </a>
      </p>
      <p className="text-xs">
        &copy; {new Date().getFullYear()} All rights reserved.
      </p>
    </footer>
  );
}
