import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import MainLayout from "../../components/layout/MainLayout";
import {
  clearCoupon,
  createCoupon,
  getAdminCoupons,
  toggleCoupon,
} from "../../features/coupon/couponSlice";

export default function CouponManagementPage() {
  const dispatch = useDispatch();
  const { coupons = [], isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.coupon || {}
  );

  const [formData, setFormData] = useState({
    code: "",
    autoGenerate: true,
    prefix: "GP",
    discountType: "percentage",
    discountValue: 10,
    minAmount: 0,
    maxDiscount: 0,
    expiryDate: "",
    usageLimit: 0,
    firstTimeUsersOnly: false,
    festivalTag: "",
  });

  useEffect(() => {
    dispatch(getAdminCoupons());
  }, [dispatch]);

  useEffect(() => {
    if (isError && message) {
      toast.error(message);
      dispatch(clearCoupon());
    }
    if (isSuccess && message) {
      toast.success(message);
      dispatch(clearCoupon());
    }
  }, [isError, isSuccess, message, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(createCoupon(formData));
  };

  return (
    <MainLayout>
      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <h1 className="text-3xl font-extrabold text-slate-900">Coupon Management</h1>

        <form
          onSubmit={handleSubmit}
          className="mt-6 rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-red-100"
        >
          <div className="grid gap-3 md:grid-cols-3">
            <input
              value={formData.code}
              onChange={(e) => setFormData((s) => ({ ...s, code: e.target.value }))}
              placeholder="Coupon code (optional)"
              className="rounded-xl border px-3 py-2"
            />
            <input
              value={formData.prefix}
              onChange={(e) => setFormData((s) => ({ ...s, prefix: e.target.value }))}
              placeholder="Prefix"
              className="rounded-xl border px-3 py-2"
            />
            <input
              type="date"
              value={formData.expiryDate}
              onChange={(e) => setFormData((s) => ({ ...s, expiryDate: e.target.value }))}
              className="rounded-xl border px-3 py-2"
            />
            <select
              value={formData.discountType}
              onChange={(e) => setFormData((s) => ({ ...s, discountType: e.target.value }))}
              className="rounded-xl border px-3 py-2"
            >
              <option value="percentage">Percentage</option>
              <option value="flat">Flat</option>
            </select>
            <input
              type="number"
              value={formData.discountValue}
              onChange={(e) =>
                setFormData((s) => ({ ...s, discountValue: Number(e.target.value) }))
              }
              placeholder="Discount value"
              className="rounded-xl border px-3 py-2"
            />
            <input
              type="number"
              value={formData.minAmount}
              onChange={(e) =>
                setFormData((s) => ({ ...s, minAmount: Number(e.target.value) }))
              }
              placeholder="Min amount"
              className="rounded-xl border px-3 py-2"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-4 rounded-xl bg-red-700 px-4 py-2 font-semibold text-white disabled:opacity-60"
          >
            {isLoading ? "Saving..." : "Create Coupon"}
          </button>
        </form>

        <div className="mt-6 space-y-3">
          {coupons.map((coupon) => (
            <div
              key={coupon._id}
              className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-red-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold">{coupon.code}</p>
                  <p className="text-sm text-slate-500">
                    {coupon.discountType} {coupon.discountValue} · Used {coupon.usedCount}/
                    {coupon.usageLimit || "∞"}
                  </p>
                </div>
                <button
                  onClick={() => dispatch(toggleCoupon(coupon._id))}
                  className="rounded-lg border px-3 py-1 text-sm"
                >
                  {coupon.isActive ? "Deactivate" : "Activate"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </MainLayout>
  );
}
