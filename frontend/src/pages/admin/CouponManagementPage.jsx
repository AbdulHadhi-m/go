import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import {
  clearCoupon,
  createCoupon,
  getAdminCoupons,
  toggleCoupon,
} from "../../features/coupon/couponSlice";
import axiosInstance from "../../services/axiosInstance";

// Helper for test durations
const getFutureDate = (type) => {
  const now = dayjs();
  switch (type) {
    case "1m": return now.add(1, "minute").format("YYYY-MM-DDTHH:mm");
    case "5m": return now.add(5, "minute").format("YYYY-MM-DDTHH:mm");
    case "10m": return now.add(10, "minute").format("YYYY-MM-DDTHH:mm");
    case "1h": return now.add(1, "hour").format("YYYY-MM-DDTHH:mm");
    case "1d": return now.add(1, "day").format("YYYY-MM-DDTHH:mm");
    default: return "";
  }
};

export default function CouponManagementPage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { coupons = [], isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.coupon || {}
  );

  const initialForm = {
    code: "",
    description: "",
    autoGenerate: true,
    prefix: "GP",
    discountType: "percentage",
    discountValue: 10,
    minAmount: 0,
    maxDiscount: 0,
    startDate: dayjs().format("YYYY-MM-DDTHH:mm"),
    expiryDate: dayjs().add(7, "day").format("YYYY-MM-DDTHH:mm"),
    usageLimit: 0,
    perUserLimit: 1,
    firstTimeUsersOnly: false,
  };

  const [formData, setFormData] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [localLoading, setLocalLoading] = useState(false);

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
      setFormData(initialForm);
      setEditingId(null);
      dispatch(clearCoupon());
      dispatch(getAdminCoupons()); // Refresh
    }
  }, [isError, isSuccess, message, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      try {
        setLocalLoading(true);
        await axiosInstance.put(`/coupons/${editingId}`, formData);
        toast.success("Coupon updated successfully");
        setEditingId(null);
        setFormData(initialForm);
        dispatch(getAdminCoupons());
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to update coupon");
      } finally {
        setLocalLoading(false);
      }
    } else {
      await dispatch(createCoupon(formData));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
      try {
        setLocalLoading(true);
        await axiosInstance.delete(`/coupons/${id}`);
        toast.success("Coupon deleted successfully");
        dispatch(getAdminCoupons());
      } catch (err) {
        toast.error(err.response?.data?.message || "Cannot delete used coupon");
      } finally {
        setLocalLoading(false);
      }
    }
  };

  const handleEdit = (coupon) => {
    setEditingId(coupon._id);
    setFormData({
      code: coupon.code,
      description: coupon.description || "",
      autoGenerate: false,
      prefix: "",
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minAmount: coupon.minAmount,
      maxDiscount: coupon.maxDiscount,
      startDate: dayjs(coupon.startDate).format("YYYY-MM-DDTHH:mm"),
      expiryDate: dayjs(coupon.expiryDate).format("YYYY-MM-DDTHH:mm"),
      usageLimit: coupon.usageLimit,
      perUserLimit: coupon.perUserLimit || 1,
      firstTimeUsersOnly: coupon.firstTimeUsersOnly,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const setTestExpiry = (type) => {
    setFormData((s) => ({ ...s, expiryDate: getFutureDate(type) }));
  };

  return (
    <div className="animate-in fade-in zoom-in-95 duration-200">
      <section className="mx-auto w-full max-w-none">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Coupon Configuration</h2>

        <form
          onSubmit={handleSubmit}
          className="mt-6 rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-red-100"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">
              {editingId ? "Edit Coupon" : "Create New Coupon"}
            </h2>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setFormData(initialForm);
                }}
                className="text-sm font-semibold text-rose-600"
              >
                Cancel Edit
              </button>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <div className="col-span-2">
              <label className="mb-1 block text-sm font-medium">Coupon Code / Prefix</label>
              <div className="flex gap-2">
                <input
                  value={formData.code}
                  onChange={(e) => setFormData((s) => ({ ...s, code: e.target.value.toUpperCase() }))}
                  placeholder="Leave empty to auto-generate"
                  className="w-full rounded-xl border px-3 py-2 uppercase"
                  disabled={editingId}
                />
                {!editingId && (
                  <input
                    value={formData.prefix}
                    onChange={(e) => setFormData((s) => ({ ...s, prefix: e.target.value }))}
                    placeholder="Prefix (GP)"
                    className="w-24 rounded-xl border px-3 py-2 shrink-0"
                  />
                )}
              </div>
            </div>

            <div className="col-span-2">
              <label className="mb-1 block text-sm font-medium">Description</label>
              <input
                value={formData.description}
                onChange={(e) => setFormData((s) => ({ ...s, description: e.target.value }))}
                placeholder="Holiday special offer..."
                className="w-full rounded-xl border px-3 py-2"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Discount Type</label>
              <select
                value={formData.discountType}
                onChange={(e) => setFormData((s) => ({ ...s, discountType: e.target.value }))}
                className="w-full rounded-xl border px-3 py-2"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="flat">Flat (₹)</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Discount Value</label>
              <input
                type="number"
                value={formData.discountValue}
                onChange={(e) => setFormData((s) => ({ ...s, discountValue: Number(e.target.value) }))}
                className="w-full rounded-xl border px-3 py-2"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Min Booking Amount (₹)</label>
              <input
                type="number"
                value={formData.minAmount}
                onChange={(e) => setFormData((s) => ({ ...s, minAmount: Number(e.target.value) }))}
                className="w-full rounded-xl border px-3 py-2"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Max Discount (₹)</label>
              <input
                type="number"
                value={formData.maxDiscount}
                onChange={(e) => setFormData((s) => ({ ...s, maxDiscount: Number(e.target.value) }))}
                className="w-full rounded-xl border px-3 py-2"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Total Usage Limit</label>
              <input
                type="number"
                value={formData.usageLimit}
                onChange={(e) => setFormData((s) => ({ ...s, usageLimit: Number(e.target.value) }))}
                placeholder="0 = unlimited"
                className="w-full rounded-xl border px-3 py-2"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Per-User Limit</label>
              <input
                type="number"
                value={formData.perUserLimit}
                onChange={(e) => setFormData((s) => ({ ...s, perUserLimit: Number(e.target.value) }))}
                className="w-full rounded-xl border px-3 py-2"
              />
            </div>

            <div className="col-span-2">
               <label className="mb-1 block text-sm font-medium">Start & Expiry Time</label>
               <div className="flex gap-2">
                 <input
                   type="datetime-local"
                   value={formData.startDate}
                   onChange={(e) => setFormData((s) => ({ ...s, startDate: e.target.value }))}
                   className="w-full rounded-xl border px-3 py-2"
                 />
                 <input
                   type="datetime-local"
                   value={formData.expiryDate}
                   onChange={(e) => setFormData((s) => ({ ...s, expiryDate: e.target.value }))}
                   className="w-full rounded-xl border px-3 py-2"
                 />
               </div>
            </div>
            
            <div className="col-span-4 mt-1 rounded-lg bg-orange-50 p-2">
              <span className="mr-3 text-xs font-bold text-orange-700">Quick Test Durations:</span>
              <div className="flex flex-wrap gap-2 text-xs mt-1">
                <button type="button" onClick={() => setTestExpiry("1m")} className="rounded bg-white px-2 py-1 border border-orange-200">1 Min</button>
                <button type="button" onClick={() => setTestExpiry("5m")} className="rounded bg-white px-2 py-1 border border-orange-200">5 Mins</button>
                <button type="button" onClick={() => setTestExpiry("10m")} className="rounded bg-white px-2 py-1 border border-orange-200">10 Mins</button>
                <button type="button" onClick={() => setTestExpiry("1h")} className="rounded bg-white px-2 py-1 border border-orange-200">1 Hour</button>
                <button type="button" onClick={() => setTestExpiry("1d")} className="rounded bg-white px-2 py-1 border border-orange-200">1 Day</button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || localLoading}
            className="mt-5 w-full md:w-auto rounded-xl bg-red-700 px-6 py-3 font-semibold text-white transition hover:bg-red-800 disabled:opacity-60"
          >
            {isLoading || localLoading ? "Saving..." : editingId ? "Save Changes" : "Create Coupon"}
          </button>
        </form>

        <div className="mt-8 rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-red-100 overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase text-slate-700">
              <tr>
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Value</th>
                <th className="px-4 py-3">Duration</th>
                <th className="px-4 py-3">Limits</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((coupon) => (
                <tr key={coupon._id} className="border-b hover:bg-slate-50">
                  <td className="px-4 py-4 font-bold text-slate-900">{coupon.code}</td>
                  <td className="px-4 py-4 capitalize">{coupon.discountType}</td>
                  <td className="px-4 py-4">
                    {coupon.discountType === "percentage" ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`}
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-xs">
                      <div><span className="font-semibold text-[10px] text-green-600">START:</span> {dayjs(coupon.startDate).format("DD MMM, HH:mm")}</div>
                      <div><span className="font-semibold text-[10px] text-rose-600">EXP:</span> {dayjs(coupon.expiryDate).format("DD MMM, HH:mm")}</div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-xs">
                      <div>Used: {coupon.usedCount} / {coupon.usageLimit || "∞"}</div>
                      <div>Per User: {coupon.perUserLimit || 1}</div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${coupon.isActive ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-700"}`}>
                      {coupon.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                       <button
                        onClick={() => dispatch(toggleCoupon(coupon._id))}
                        className="text-blue-600 hover:text-blue-800"
                        title="Toggle Status"
                      >
                         Toggle
                      </button>
                      <button
                        onClick={() => handleEdit(coupon)}
                        className="text-amber-600 hover:text-amber-800"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(coupon._id)}
                        className="text-rose-600 hover:text-rose-800"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {coupons.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center text-slate-500">
                    No coupons found. Create one above!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
