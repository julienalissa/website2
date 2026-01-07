import Link from "next/link";

export default function NotFound() {
  return (
    <div className="bg-white min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-serif font-medium text-charleston-green mb-4 tracking-tight">404</h1>
        <h2 className="text-2xl font-serif font-medium text-text-dark mb-4">
          Page Not Found
        </h2>
        <p className="text-text-body mb-8">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link href="/" className="btn-primary">
          Return Home
        </Link>
      </div>
    </div>
  );
}







