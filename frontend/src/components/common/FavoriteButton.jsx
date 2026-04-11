import { Heart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { selectIsAuthenticated } from "../../features/auth/authSelectors";
import {
  getMyFavorites,
  isFavoriteForTripCard,
  selectFavorites,
  toggleFavorite,
} from "../../features/favorites/favoriteSlice";
import { isValidObjectId } from "../../utils/isValidObjectId";

export default function FavoriteButton({ trip, className = "" }) {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const favorites = useSelector(selectFavorites);

  const rawId = trip?._id ?? trip?.id;
  const tripId = isValidObjectId(rawId) ? String(rawId) : null;
  const favorite = isFavoriteForTripCard(favorites, trip);

  const handleToggle = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to save favorites");
      return;
    }

    if (!tripId && (!trip?.from || !trip?.to)) {
      toast.error("Trip details are missing — cannot save this route");
      return;
    }

    try {
      const result = await dispatch(
        toggleFavorite({
          tripId,
          from: trip?.from,
          to: trip?.to,
          boardingDate: trip?.journeyDate,
        })
      ).unwrap();

      toast.success(
        result.action === "added" ? "Added to favorites" : "Removed from favorites"
      );
    } catch (error) {
      await dispatch(getMyFavorites());
      toast.error(error || "Unable to update favorite");
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`inline-flex h-11 w-11 items-center justify-center rounded-full border border-red-200 bg-white/90 text-red-700 transition hover:bg-red-50 ${className}`}
      aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
      title={favorite ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart className={`h-5 w-5 ${favorite ? "fill-red-600 text-red-600" : ""}`} />
    </button>
  );
}
