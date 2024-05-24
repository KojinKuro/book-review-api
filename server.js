const express = require("express");
const app = express();
const PORT = process.env.PORT || 8000;

app.set("title", "Book Reviews");
app.use(express.json());

app.locals.bookReviews = require("./book_reviews.json");

app
  .get("/api/v1/review", (req, res) => {
    res.json(app.locals.bookReviews);
  })
  .post("/api/v1/review", (req, res) => {
    const newBookReview = { ...req.body };

    for (const requiredParam of [
      ["book", "string"],
      ["review", "string"],
      ["state", "string"],
      ["price", "number"],
    ]) {
      if (
        !newBookReview[requiredParam[0]] ||
        typeof newBookReview[requiredParam[0]] !== requiredParam[1]
      ) {
        return res.status(422).send({
          error: `Expected format: { book: <String>, review: <String>, state: <String>, price: <Number> }. You're missing a "${requiredParam[0]}" property.`,
        });
      }
    }

    app.locals.bookReviews.push(newBookReview);
    res.json(newBookReview);
  });

app
  .get("/api/v1/review/:number", (req, res) => {
    const { number } = req.params;
    const foundReview = app.locals.bookReviews.at(parseInt(number));
    if (!foundReview) {
      return res
        .status(404)
        .json({ message: "Error could not find that review" });
    }

    res.json(foundReview);
  })
  .put("/api/v1/review/:number", (req, res) => {
    const number = parseInt(req.params.number);
    const newReview = { ...req.body };

    for (const requiredParam of [
      ["book", "string"],
      ["review", "string"],
      ["state", "string"],
      ["price", "number"],
    ]) {
      if (
        !newReview[requiredParam[0]] ||
        typeof newReview[requiredParam[0]] !== requiredParam[1]
      ) {
        return res.status(422).send({
          error: `Expected format: { book: <String>, review: <String>, state: <String>, price: <Number> }. You're missing a "${requiredParam[0]}" property.`,
        });
      }
    }

    const oldReview = app.locals.bookReviews.splice(number, 1, newReview);
    res.json({
      message: `Successfully updated index of ${number}`,
      oldReview,
      newReview,
    });
  })
  .delete("/api/v1/review/:number", (req, res) => {
    const number = parseInt(req.params.number);
    if (number >= app.locals.bookReviews) {
      return res
        .status(404)
        .json({ message: "Error could not find that review" });
    }

    app.locals.bookReviews.splice(number, 1);
    res.send({ message: `Deleted id ${number} from the server` });
  });

app.get("/api/v1/book/:title", (req, res) => {
  const { title } = req.params;
  const titleBookReviews = app.locals.bookReviews.filter(
    (book) => book.book.toLowerCase() === title.toLowerCase()
  );

  res.json(titleBookReviews);
});

app.listen(PORT, () => {
  console.log(`${app.get("title")} is running on http://localhost:${PORT}.`);
});
