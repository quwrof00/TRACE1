export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-deep-space">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-satellite-cyan mb-4">404</h1>
        <p className="text-xl text-white mb-8">Page not found</p>
        <a
          href="/"
          className="px-6 py-3 bg-satellite-cyan text-deep-space rounded-lg hover:bg-opacity-80 transition-all"
        >
          Go Home
        </a>
      </div>
    </div>
  );
}