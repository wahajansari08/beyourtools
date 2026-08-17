export default function Footer() {
  return (
    <footer className="border-t border-ink-700">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-xs text-mist-400 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>Jsonifyr — JSON tools that run entirely in your browser. Nothing you paste is uploaded.</p>
        <p>&copy; {new Date().getFullYear()} Jsonifyr</p>
      </div>
    </footer>
  );
}
