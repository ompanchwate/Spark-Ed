
import { ThemeToggle } from "./components/ThemeToggle";

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="flex justify-end mb-8">
        <ThemeToggle />
      </div>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Welcome to My Next.js App</h1>
        <p className="text-lg mb-4">
          This is a Next.js application with dark mode support. Click the theme toggle button in the top right corner to switch between light and dark modes.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Light and Dark Mode</h2>
            <p className="text-gray-700 dark:text-gray-300">
              The app automatically detects your system preference and can be manually toggled.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Responsive Design</h2>
            <p className="text-gray-700 dark:text-gray-300">
              The layout is fully responsive and adapts to different screen sizes.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
