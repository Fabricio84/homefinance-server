import { Record, String, Number } from "runtypes";

// Type for new bikes
const Money = Record({
  amount: Number,
  currencyCode: String,
});

const TransactionData = Record({
  data: String,
  operacao: String,
  parcela: Number,
  parcelaFinal: Number,
  categoria: String,
  valor: Money
});

export default TransactionData;
