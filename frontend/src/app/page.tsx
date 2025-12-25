import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex flex-col">
        <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400 mb-8">
          Certification Job
        </h1>
        <p className="text-xl mb-12 text-center text-gray-500">
          Navigate your career path with AI-powered certification roadmaps.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          <Link href="/tech-tree" className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 dark:hover:border-neutral-700 dark:hover:bg-neutral-800/30">
            <h2 className={`mb-3 text-2xl font-semibold`}>
              Tech Tree <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">-&gt;</span>
            </h2>
            <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
              Visualize certification relationships and requirements.
            </p>
          </Link>

          <Link href="#" className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 dark:hover:border-neutral-700 dark:hover:bg-neutral-800/30">
            <h2 className={`mb-3 text-2xl font-semibold`}>
              AI Consultant <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">-&gt;</span>
            </h2>
            <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
              Get personalized career advice based on your profile.
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
}
