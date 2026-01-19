import Toy from "../models/Toy.js";
import User from "../models/User.js";
import Reservation from '../models/Reservation.js';

export const getAllToys = async (req, res) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      sort,
      ageGroup,
      maxAge,
      targetGroup,
      inStock,
    } = req.query;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const filters = {};

    if (search?.trim()) {
      filters.name = { $regex: search, $options: "i" };
    }

    if (category?.trim()) {
      filters.type = category;
    }

    if (targetGroup?.trim()) {
      filters.targetGroup = targetGroup;
    }

    if (inStock === "true") {
      filters.inStock = { $gt: 0 };
    }

    if (maxAge) {
      const maxAgeNum = parseInt(maxAge);
      filters.$expr = {
        $lte: [
          { $toInt: { $arrayElemAt: [{ $split: ["$ageGroup", "+"] }, 0] } },
          maxAgeNum
        ]
      };
    } else if (ageGroup?.trim()) {
      filters.ageGroup = ageGroup;
    }

    const priceFilter = {};
    if (minPrice != null && minPrice !== '' && !isNaN(Number(minPrice))) {
      priceFilter.$gte = Number(minPrice);
    }
    if (maxPrice != null && maxPrice !== '' && !isNaN(Number(maxPrice))) {
      priceFilter.$lte = Number(maxPrice);
    }
    if (Object.keys(priceFilter).length > 0) {
      filters.price = priceFilter;
    }

    const sortQuery = {};
    switch (sort) {
      case "price_asc":
        sortQuery.price = 1;
        break;
      case "price_desc":
        sortQuery.price = -1;
        break;
      case "newest":
        sortQuery.createdAt = -1;
        break;
      case "oldest":
        sortQuery.createdAt = 1;
        break;
      case "rating_desc":
        sortQuery.averageRating = -1;
        break;
      default:
        break;
    }

    const toys = await Toy.find(filters)
      .sort(sortQuery)
      .skip(skip)
      .limit(limit);

    const total = await Toy.countDocuments(filters);

    res.json({
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      items: toys,
      appliedFilters: filters,
    });

  } catch (err) {
    console.error(" getAllToys error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

export const toggleFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const toyId = req.params.id;

    const toy = await Toy.findById(toyId);
    if (!toy) {
      return res.status(404).json({ msg: "Toy not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const index = user.favorites.findIndex(
      id => id.toString() === toyId
    );

    if (index !== -1) {
      user.favorites.splice(index, 1);
      await user.save();
      return res.status(200).json({
        msg: "Toy removed from favorites",
        favorites: user.favorites,
        isFavorite: false
      });
    }

    user.favorites.push(toyId);
    await user.save();

    res.status(200).json({
      msg: "Toy added to favorites",
      favorites: user.favorites,
      isFavorite: true
    });

  } catch (err) {
    console.error(" toggleFavorite error:", err);
    res.status(500).json({ msg: "Server error", err });
  }
};

export const getFavorites = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate("favorites");

    if (!user) return res.status(404).json({ msg: "User not found" });

    res.status(200).json({ favorites: user.favorites });
  } catch (error) {
    console.error("getFavorites error:", error);
    res.status(500).json({ msg: "Server Error" });
  }
};

export const getToyById = async (req, res) => {
  try {
    const toy = await Toy.findById(req.params.id).lean();
    if (!toy) return res.status(404).json({ msg: "Toy not found" });

    if (toy.reviews?.length) {
      for (let rev of toy.reviews) {
        const user = await User.findById(rev.user);
        rev.userFullName = user?.fullName || "Anonymous";
      }
    }

    res.status(200).json(toy);
  } catch (err) {
    console.error(" getToyById error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

export const rateToy = async (req, res) => {
  try {
    const toyId = req.params.id;
    const userId = req.user.id; 
    const { rating, comment } = req.body;

    const reservation = await Reservation.findOne({
      user: userId,
      status: "arrived",
      "items.toy": toyId
    });

    if (!reservation) 
      return res.status(400).json({ message: "You cannot rate this toy yet." });

    const reservationItem = reservation.items.find(item => item.toy.toString() === toyId);
    if (!reservationItem) 
      return res.status(400).json({ message: "Toy not found in your reservation." });

    const toy = await Toy.findById(toyId);
    if (!toy) return res.status(404).json({ message: "Toy not found" });

    const user = await User.findById(userId);
    const userFullName = user?.fullName;

    if (!reservationItem.reviewed) {
      reservationItem.reviewed = true;
      await reservation.save();
    }

    const effectiveRating = reservationItem.reviewed && rating <= 0
      ? toy.reviews.find(r => r.user === userId)?.rating || 5
      : rating;

    toy.reviews.push({ user: userId, userFullName, rating: effectiveRating, comment });
    await toy.save();

    return res.status(200).json({ message: "Review submitted successfully", toy });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};