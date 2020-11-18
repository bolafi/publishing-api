const mongoose = require("mongoose");
const slugify = require("slugify");

const PublisherSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      unique: true,
      trim: true,
      maxlenght: [50, "Name can not be more than 50 characters"],
    },
    slug: String,
    description: {
      type: String,
      required: [true, "Please add a discription"],
      unique: true,
      trim: true,
      maxlenght: [500, "Descrt"],
    },
    website: {
      type: String,
      match: [
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
        "Please use a valid URL with HTTP or HTTPS",
      ],
    },
    phone: {
      type: String,
      maxlenght: [20, "Phone number can not be longer than 20"],
    },
    email: {
      type: String,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please use a valid URL with HTTP or HTTPS",
      ],
    },
    address: {
      type: String,
      required: [true, "Please add an address"],
    },
    averageRating: {
      type: Number,
      min: [1, "Rating must be at least 1"],
      max: [10, "Rating must can not be more than 10"],
    },
    genres: {
      type: [String],
      required: true,
      enum: [
        "MYTH",
        "ROMANCE",
        "NOVEL",
        "FICTION",
        "BIOGRAPHY",
        "FAIRY-TALE",
        "DRAMA",
        "HISTORY",
      ],
    },
    photo: {
      type: String,
      default: "no-photo.jpg",
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
  {
    timestamps: true,
  }
);

// Mongoose middleware to create slug
PublisherSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// Cascade delete books when a publisher is deleted|| does not make sence if books stays

PublisherSchema.pre("remove", async function (next) {
  console.log(`Books being removed from Publisher ${this._id}`.yellow.inverse);
  await this.model("Book").deleteMany({ publisher: this._id });

  next();
});

// Reverse populate with virtuals
PublisherSchema.virtual("books", {
  ref: "Book",
  localField: "_id",
  foreignField: "publisher",
  justOne: false,
});
module.exports = mongoose.model("Publisher", PublisherSchema);
