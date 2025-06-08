import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center text-center pt-32">
      <h1 className="text-3xl font-bold mb-4">Not Found</h1>
      <p className="text-xl mb-6">Could not find requested resource</p>
      <Link href="/" className="text-lg text-primary-500 underline">
        Return Home
      </Link>
    </div>
  );
}
