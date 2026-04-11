import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import MainLayout from "../components/layout/MainLayout";
import LoginForm from "../components/auth/LoginForm";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function LoginPage() {
  return (
    <MainLayout>
      <section className="mx-auto flex min-h-[90vh] max-w-7xl flex-col justify-center px-4 py-10 md:px-6">
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200/90 bg-white text-slate-700 shadow-sm ring-1 ring-slate-200/60 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
            aria-label="Back to home"
            title="Back to home"
          >
            <ArrowLeft size={22} strokeWidth={2.25} />
          </Link>
        </div>

        <div className="grid w-full overflow-hidden rounded-[2rem] bg-white shadow-2xl shadow-red-100 ring-1 ring-red-100 md:grid-cols-2">
          <div className="hidden bg-gradient-to-br from-red-400 via-red-400 to-red-400 p-10 text-white md:flex md:flex-col md:justify-between">
            <div>
              <span className="inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur">
                Secure access
              </span>

              <h2 className="mt-6 text-4xl font-extrabold leading-tight">
                Welcome back to your premium travel space
              </h2>

              <p className="mt-4 max-w-md text-white/80">
                Sign in to manage tickets, bookings, wallets, offers, and your upcoming journeys.
              </p>
            </div>

          

              <div className="w-full max-w-md mx-auto">
               <DotLottieReact
               src="https://lottie.host/8fcaaecd-1433-4e66-8d5c-04c07b6816b9/Q72F7qMvtd.lottie"
               loop
               autoplay
               />
              </div>

          </div>

          <div className="p-8 md:p-10 lg:p-12">
            <LoginForm />
          </div>
        </div>
      </section>
    </MainLayout>
  );
}