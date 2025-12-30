import React from "react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200 dark:bg-gray-900 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 pt-2 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="text-sm text-gray-500 dark:text-gray-400">Icons:</span>
          <a
            className="text-sm text-gray-600 hover:text-gray-900 hover:underline dark:text-gray-300 dark:hover:text-white"
            href="https://simpleicons.org/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit Simple Icons website"
          >
            Simple Icons
          </a>
          <a
            className="text-sm text-gray-600 hover:text-gray-900 hover:underline dark:text-gray-300 dark:hover:text-white"
            href="https://devicon.dev/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit Devicon website"
          >
            Devicon
          </a>
        </div>
        <div className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
          © {currentYear} okano-t-ww(Tatsuya Okano)
        </div>
      </div>
    </footer>
  );
}
