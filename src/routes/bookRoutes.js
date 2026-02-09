import express from "express";
import cloudinary from "../lib/cloudinary.js";
const router = express.Router();
import Book from "../models/Book.js";
import protectRoute from "../middleware/auth.middleware.js";

//create a book
router.post("/", protectRoute, async (req, res) => {
  try {
    const { title, caption, rating, image } = req.body;
    if (!image || !title || !caption || !rating)
      return res.status(400).json({ message: "Please provide all fields" });

    //upload the image to cloudinary
    const uploadResponse = await cloudinary.uploader.upload(image);
    //save to the database
    if (!uploadResponse)
      return res.status(400).json({ message: "Upload failed " });
    const imageUrl = uploadResponse.secure_url;
    //save to databse
    const newbook = new Book({
      title,
      caption,
      rating,
      image: imageUrl,
      user: req.user._id,
    });
    await newbook.save();
    res.status(201).json(newbook);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

//pagination => infinite loading
//get all books
router.get("/", protectRoute, async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 5;
    const skip = (page - 1) * limit;
    const books = await Book.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "username profileImage"); //descending order

    const totalBooks = await Book.countDocuments();
    res.send({
      books,
      currentPage: page,
      totalBooks: totalBooks,
      totalPages: Math.ceil(totalBooks / limit),
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", protectRoute, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(400).json({ message: "Cant find the book" });
    }

    //check if the user is the creator of the book
    if (book.user.toString() != req.user._id.toString()) {
      return res.status(401).json({ message: "unauthorized" });
    }

    //https://res.cloudinary.com/de1rm4uto/image/upload/v145353/aqappoafj.png

    //delete image from cloudinary as well

    if (book.image && book.image.includes("cloudinary")) {
      try {
        const publicId = book.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      } catch (err) {
        console.log("Error deleting image from cloudinary", err);
      }
    }

    await book.deleteOne();
    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/user", protectRoute, async (req, res) => {
  try {
    const books = await Book.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json({ books });
  } catch (err) {
    console.error(err.message);
  }
});

export default router;
