import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Heart, MapPin, Ticket } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import MainLayout from "../components/layout/MainLayout";
import {
  clearFavoriteState,
  getMyFavorites,
  removeFavorite,
  selectFavoriteState,
  selectFavorites,
} from "../features/favorites/favoriteSlice";
import { isValidObjectId } from "../utils/isValidObjectId";
import BusCard from "../components/bus/BusCard";

export default function FavoritesPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const favorites = useSelector(selectFavorites);
  const { isLoading, isError, message } = useSelector(selectFavoriteState);

  useEffect(() => {
    dispatch(getMyFavorites());
  }, [dispatch]);

  useEffect(() => {
    if (isError && message) {
      toast.error(message);
      dispatch(clearFavoriteState());
    }
  }, [isError, message, dispatch]);

  const handleRemove = async (favoriteId) => {
    if (!isValidObjectId(favoriteId)) {
      toast.error("Invalid favorite — refreshing list");
      dispatch(getMyFavorites());
      return;
    }
    try {
      const response = await dispatch(removeFavorite(favoriteId)).unwrap();
      toast.success(response.message || "Removed from favorites");
    } catch (error) {
      toast.error(error || "Failed to remove favorite");
    }
  };

  return (
    <MainLayout>
      <section className="min-h-screen bg-gradient-to-b from-red-50 via-white to-red-50">
        <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
          <div className="mb-8 rounded-[2rem] bg-gradient-to-r from-red-700 via-red-700 to-red-700 p-6 text-white shadow-xl shadow-red-200">
            <h1 className="text-3xl font-extrabold md:text-4xl">My Favorite Routes</h1>
            <p className="mt-2 text-white/85">
              Save routes you love and book them faster next time.
            </p>
          </div>

          {isLoading ? (
            <div className="rounded-[2rem] bg-white p-8 text-center shadow-sm ring-1 ring-red-100">
              <p className="text-slate-600">Loading favorites...</p>
            </div>
          ) : favorites.length === 0 ? (
            <div className="rounded-[2rem] bg-white p-10 text-center shadow-sm ring-1 ring-red-100">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <Heart className="text-red-700" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">No favorites yet</h2>
              <p className="mt-2 text-slate-500">
                Add routes from search results to see them here.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {favorites.map((favorite) => (
                <div key={favorite._id} className="flex flex-col gap-2">
                  <div className="flex justify-end pr-2">
                    <button
                      type="button"
                      onClick={() => handleRemove(favorite._id)}
                      className="inline-flex items-center gap-1 rounded bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-100 hover:text-rose-700 transition shadow-sm border border-rose-100"
                    >
                      Remove Route
                    </button>
                  </div>
                  <div className="w-full">
                    {favorite.trip ? (
                      <BusCard bus={favorite.trip} />
                    ) : (
                      <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-red-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-red-500">
                            Route Only Favorite
                          </p>
                          <h2 className="mt-2 text-2xl font-extrabold text-slate-900">
                            {favorite.from} → {favorite.to}
                          </h2>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/search-results?from=${encodeURIComponent(
                                favorite.from
                              )}&to=${encodeURIComponent(favorite.to)}`
                            )
                          }
                          className="rounded-2xl bg-red-700 px-6 py-3 font-semibold text-white shadow-md hover:bg-red-800 transition"
                        >
                          Search Route
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
}
