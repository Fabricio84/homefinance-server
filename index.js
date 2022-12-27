import { router as transactionsRouter } from "./router.js"; // this is the new import

import express from "express";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/transactions", transactionsRouter); // this is the new line

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

// delete all other lines after this