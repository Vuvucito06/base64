import { ThemeToggle } from "./ThemeToggle";

export default function Header() {
  return (
    <header className="p-4 bg-blue-500 dark:bg-blue-700 text-white flex justify-between items-center">
      <h1 className="text-2xl font-bold">Base64 Encoder</h1>
      <ThemeToggle />
    </header>
  );
}
