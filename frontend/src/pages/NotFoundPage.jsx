import MainLayout from "../components/layout/MainLayout";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <MainLayout>
      <section className="mx-auto flex min-h-[70vh] max-w-4xl flex-col items-center justify-center px-4 text-center">
        <div className="rounded-full bg-violet-100 px-5 py-2 text-sm font-semibold text-violet-700">404 Error</div>
        <h1 className="mt-6 text-5xl font-extrabold">Page not found</h1>
        <p className="mt-4 max-w-xl text-slate-600">The page you are looking for does not exist or has been moved.</p>
        <Link to="/" className="mt-8 rounded-2xl bg-violet-700 px-6 py-3 font-semibold text-white">
          Back to Home
        </Link>
      </section>
    </MainLayout>
  );
}