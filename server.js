const express = require("express");
const app = express();
const PORT = process.env.PORT || 8000;

app.set("title", "Book Reviews");
app.use(express.json());

app.locals.bookReviews = require("./book_reviews.json");

app
  .get("/api/v1/books", (req, res) => {
    res.json(app.locals.bookReviews);
  })
  .post("/api/v1/books", (req, res) => {
    const newBookReview = { ...req.body };
    console.log(newBookReview);
    res.json(newBookReview);
  });

app.get("/api/v1/books/:title", (req, res) => {
  const { title } = req.params;
  const titleBookReviews = app.locals.bookReviews.filter(
    (book) => book.book.toLowerCase() === title.toLowerCase()
  );

  res.json(titleBookReviews);
});

app.listen(PORT, () => {
  console.log(`${app.get("title")} is running on http://localhost:${PORT}.`);
});
