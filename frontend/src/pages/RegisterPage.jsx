import MainLayout from "../components/layout/MainLayout";
import RegisterForm from "../components/auth/RegisterForm";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';


export default function RegisterPage() {
  return (
    <MainLayout>
      <section className="mx-auto flex min-h-[90vh] max-w-7xl items-center px-4 py-10 md:px-6">
        <div className="grid w-full overflow-hidden rounded-[2rem] bg-white shadow-2xl shadow-violet-100 ring-1 ring-violet-100 md:grid-cols-2">
          <div className="hidden bg-gradient-to-br from-violet-500 via-violet-400 to-violet-400 p-10 text-white md:flex md:flex-col md:justify-between">
            <div>
              <span className="inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur">
                Create secure account
              </span>

              <h2 className="mt-6 text-4xl font-extrabold leading-tight">
                Join a smarter and smoother booking experience
              </h2>

              <p className="mt-4 max-w-md text-white/80">
                Create your account to book buses faster, manage trips, save routes, and enjoy premium travel features.
              </p>
            </div>

            {/* <div className="space-y-4">
              <div className="rounded-3xl bg-white/10 p-4 backdrop-blur">
                <p className="text-sm font-semibold">Included in auth flow</p>
                <p className="mt-1 text-sm text-white/80">
                  Register, login, me, logout, cookie JWT, Google OAuth.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white/10 p-4 text-sm">Easy Signup</div>
                <div className="rounded-2xl bg-white/10 p-4 text-sm">Google Login</div>
                <div className="rounded-2xl bg-white/10 p-4 text-sm">JWT Cookie</div>
                <div className="rounded-2xl bg-white/10 p-4 text-sm">Redux Toolkit</div>
              </div>
            </div> */}
            
            <DotLottieReact
      src="https://lottie.host/511b8831-fb48-4d2a-ac85-d71e77632a9c/Quad6Efj4G.lottie"
      loop
      autoplay
    />


          </div>

          <div className="p-8 md:p-10 lg:p-12">
            <RegisterForm />
          </div>
        </div>
      </section>
    </MainLayout>
  );
}