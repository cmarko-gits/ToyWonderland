import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: String,         
      required: true,
    },
    rating: {
      type: Number,         
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const toySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      required: true,
      enum: ["puzzle", "picture book", "figure", "character", "vehicles", "pleated", "other"],


},

    ageGroup: {
      type: String,     
      required: true,
    },

    targetGroup: {
      type: String,
      required: true,
      enum: ["devojčica", "dečak", "svi"],
    },

    productionDate: {
      type: Date,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    image: {
      type: String,     
      default: "",
    },

    inStock: {
      type: Number,
      default: 0,
    },

    reviews: [reviewSchema], 
  },
  { timestamps: true }
);

const Toy = mongoose.model("Toys", toySchema);

export default Toy;
