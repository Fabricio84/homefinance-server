import { Router } from "express";
import DynamoDb from "cyclic-dynamodb";
import TransactionData  from "./types/TransactionData";

// Initialize Express router
export const router = Router();

// Initialize AWS DynamoDB
const db = DynamoDb(process.env.CYCLIC_DB);
const transactionsCollection = db.collection("transactions");

router.get("/", async (req, res) => {
  const { results: transactionsMetadata } = await transactionsCollection.list();

  const transactions = await Promise.all(
    transactionsMetadata.map(
      async ({ key }) => (await transactionsCollection.get(key)).props
    )
  );

  res.send(transactions);
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const { props: transaction } = await transactionsCollection.get(id);
    res.send(transaction);
  } catch (e) {
    console.log(e.message, `Item with ID ${id} does not exist.`);
    res.sendStatus(404);
  }
});

router.post("/", async (req, res) => {
  const transactionData = req.body;

  try {
    // Make sure transaction data exists
    if (!req.body) {
      throw new Error();
    }

    // Make sure transaction data contains all required fields
    const transactionObject = TransactionData.check(transactionData);

    // Generate ID and Handle for transaction
    const transactionId = uuidv4();

    // Create full transaction object
    const transaction = {
      ...transactionObject,
      id: transactionId,
    };

    // Save transaction object
    await transactionsCollection.set(transactionId, transaction);

    res.send(transaction);
  } catch (e) {
    res.sendStatus(400);
  }
});

router.patch("/:id", async (req, res) => {
  const transactionId = req.params.id;
  const newData = req.body || {};

  try {
    const { props: oldtransaction } = await transactionsCollection.get(
      transactionId
    );
    const transaction = {
      ...oldtransaction,
      ...newData,
    };

    // Save new transaction object
    await transactionsCollection.set(transactionId, newData);

    res.send(transaction);
  } catch (e) {
    console.log(e.message);
    res.sendStatus(404);
  }
});

router.delete("/:id", async (req, res) => {
  const transactionId = req.params.id;

  try {
    await transactionsCollection.delete(transactionId);

    res.send({
      id: transactionId,
    });
  } catch (e) {
    console.log(e.message);
    res.sendStatus(404);
  }
});
