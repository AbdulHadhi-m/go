import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-red-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold text-red-500">GoPath</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Premium bus ticket booking experience with smooth UI and fast booking flow.
            </p>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-slate-900">Company</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li><Link to="/about" className="hover:text-red-500">About</Link></li>
              <li><Link to="/contact" className="hover:text-red-500">Contact</Link></li>
              <li><Link to="/careers" className="hover:text-red-500">Careers</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-slate-900">Support</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li><Link to="/help-center" className="hover:text-red-500">Help Center</Link></li>
              <li><Link to="/cancellation" className="hover:text-red-500">Cancellation</Link></li>
              <li><Link to="/refund-policy" className="hover:text-red-500">Refund Policy</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold text-slate-900">Newsletter</h4>
            <div className="mt-3 flex rounded-full border border-red-100 p-1">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-full px-4 py-2 text-sm outline-none"
              />
              <button className="rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white">
                Join
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-6 md:flex-row">
          <p className="text-sm text-slate-500">
            Ⓒ 2026 GoPath. All rights reserved.
          </p>

          <div className="flex items-center gap-3">
            <a
              href="#"
              className="rounded-full bg-slate-100 p-3 text-slate-600 transition hover:bg-red-500 hover:text-white"
            >
              <FaFacebookF size={14} />
            </a>
            <a
              href="#"
              className="rounded-full bg-slate-100 p-3 text-slate-600 transition hover:bg-red-500 hover:text-white"
            >
              <FaInstagram size={14} />
            </a>
            <a
              href="#"
              className="rounded-full bg-slate-100 p-3 text-slate-600 transition hover:bg-red-500 hover:text-white"
            >
              <FaTwitter size={14} />
            </a>
            {/* <a
              href="#"
              className="rounded-full bg-slate-100 p-3 text-slate-600 transition hover:bg-red-500 hover:text-white"
            >
              <FaLinkedinIn size={14} />
            </a> */}
          </div>
        </div>
      </div>
    </footer>
  );
}