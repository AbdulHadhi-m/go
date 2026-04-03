import MainLayout from "../components/layout/MainLayout";
import LoginForm from "../components/auth/LoginForm";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";



export default function LoginPage() {
  return (
    <MainLayout>
      <section className="mx-auto flex min-h-[90vh] max-w-7xl items-center px-4 py-10 md:px-6">
        <div className="grid w-full overflow-hidden rounded-[2rem] bg-white shadow-2xl shadow-violet-100 ring-1 ring-violet-100 md:grid-cols-2">
          <div className="hidden bg-gradient-to-br from-violet-400 via-violet-400 to-violet-400 p-10 text-white md:flex md:flex-col md:justify-between">
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