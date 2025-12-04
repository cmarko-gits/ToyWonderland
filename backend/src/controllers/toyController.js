import Toy from "../models/Toy.js";



export const getAllToys = async (req, res) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      sort,
      ageGroup,
      targetGroup,
      inStock,
    } = req.query;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const filters = {};

    // 🔍 SEARCH
    if (search?.trim()) {
      filters.name = { $regex: search, $options: "i" };
    }

    // 📌 CATEGORY
    if (category?.trim()) {
      filters.type = category;
    }

    // 👶 AGE GROUP
    if (ageGroup?.trim()) {
      filters.ageGroup = ageGroup;
    }

    // 🎯 TARGET GROUP
    if (targetGroup?.trim()) {
      filters.targetGroup = targetGroup;
    }

    // 📦 IN STOCK
    if (inStock === "true") {
      filters.inStock = { $gt: 0 }; // samo filteri ako true
    }
    // ako je false ili undefined → ne filtriraj, prikaži sve

    // 💰 PRICE RANGE
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

    // 🔽 SORTING
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
        sortQuery.averageRating = -1; // ako dodaš virtual
        break;
      default:
        break;
    }

    // 🧸 FETCH TOYS
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
    console.error("❌ getAllToys error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};
export const getToyById = async (req, res) => {
  try {
    const toy = await Toy.findById(req.params.id);
    if (!toy) return res.status(404).json({ msg: "Toy not found" });
    res.status(200).json(toy);
  } catch (err) {
    console.error("❌ getToyById error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};
