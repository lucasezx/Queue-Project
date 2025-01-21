/**
 * You should implement a class BankAccount that supports the following methods:
 * - deposit(amount) - deposits the given amount in the bank account.
 * - withdraw(amount) - withdraws the given amount from the bank account.
 * - getBalance() - returns the current balance of the bank account.
 * - transfer(amount, targetAccount) - transfers the given amount to the targetAccount.
 * - getStatement(since) - returns the statement of the bank account since a given date.
 *
 * The bank account should get a unique account number when it is created.
 * The bank account should have a currency.
 * The balance should not be visible from the outside.
 */

const TRANSFER_TAX = 2;
const CONVERSION_TAX = {
  USD: 1,
  EUR: 1.2,
  BRL: 0.2,
  JPY: 0.01,
};

const NEGATIVE_BALANCE_LIMIT = -500;

class BankAccount {
  static #nextAccountNumber = 1;

  currency;

  transactions;

  accountNumber;

  #balance;

  constructor(currency, transferLimit = 5000) {
    this.transferLimit = transferLimit;
    this.#balance = 0;
    this.currency = currency;
    this.accountNumber = BankAccount.#nextAccountNumber++;
    this.transactions = [];
  }
  deposit(amount) {
    if (amount < 0) {
      throw new Error("Invalid amount");
  }
        
    this.#updateBalance(amount);
    this.#addTransaction("deposit", amount);
  }

  withdraw(amount) {
    if (this.#balance - (amount + TRANSFER_TAX) < NEGATIVE_BALANCE_LIMIT) {
      throw new Error("Negative balance limit exceeded");
    }

    this.#updateBalance(-amount);
    this.#addTransaction("withdraw", amount);
  }

  getBalance() {
    return this.#balance;
  }
transfer(amount, targetAccount) {
    
    let conversionDetails = {
        originalAmount: amount,
        transferTax: TRANSFER_TAX,
        amountAfterTax: amount - TRANSFER_TAX,
    };


    if (this.currency !== targetAccount.currency) {
        const conversionRate = CONVERSION_TAX[targetAccount.currency];
        const convertedAmount = amount * conversionRate;
        conversionDetails = {
            originalAmount: amount,
            convertedAmount,
            conversionRate,
            targetCurrency: targetAccount.currency,
        };
        amount = convertedAmount;
    } 

    if (amount > this.transferLimit) {
        throw new Error(`Transfer limit exceeded: ${this.transferLimit}`);
    }

    if (this.#balance - (amount + TRANSFER_TAX) < NEGATIVE_BALANCE_LIMIT) {
        throw new Error("Negative balance limit exceeded");
    }

    this.#updateBalance(-TRANSFER_TAX);
    this.#updateBalance(-amount);
    targetAccount.#updateBalance(amount);

    this.transactions.push({
        date: new Date(),
        type: "transfer",
        amount,
        balance: this.#balance,
        targetAccountNumber: targetAccount.getAccountNumber(),
        conversionDetails,
    });
}
  getStatement(since) {
    return this.transactions.filter((transaction) => transaction.date >= since);
  }

  getAccountNumber() {
    return this.accountNumber;
  }

  #addTransaction(type, amount) {
    const transaction = {
      date: new Date(),
      type,
      amount,
      balance: this.#balance,
    };
    this.transactions.push(transaction);
  }

  #updateBalance(amount) {
    this.#balance += amount;
  }

  toString() {
    const averageDeposit =
      this.transactions
        .filter((transaction) => transaction.type === "deposit")
        .reduce(
          (accumulator, transaction) => accumulator + transaction.amount,
          0
        ) /
      this.transactions.filter((transaction) => transaction.type === "deposit")
        .length;

    return `Account Number: '${this.accountNumber}'
Currency: '${this.currency}'
Balance: $ ${this.#balance.toFixed(2)}
Last modified: ${this.transactions[
      this.transactions.length - 1
    ].date.toISOString()}
Average deposit: $ ${averageDeposit.toFixed(2)}`;
  }
}

// code for testing the back account
const johnsAccount = new BankAccount("USD");
johnsAccount.deposit(1502);

console.log(johnsAccount.getBalance()); // 100

johnsAccount.withdraw(50);
console.log(johnsAccount.getBalance()); // 50

const mikesAccount = new BankAccount("USD");
johnsAccount.transfer(1200, mikesAccount);
console.log(johnsAccount.getBalance()); // 30
console.log(mikesAccount.getBalance()); // 20

johnsAccount.deposit(10);
console.log(johnsAccount.getBalance()); // 40

console.log(johnsAccount.getStatement(new Date(2021, 1, 1)));
/*
[
  { date: new Date(2021, 1, 1), type: 'deposit', amount: 100, balance: 100 },
  { date: new Date(2021, 1, 1), type: 'withdraw', amount: 50, balance: 50 },
  { date: new Date(2021, 1, 1), type: 'transfer', amount: 20, balance: 30, targetAccountNumber: 'XXXX' },
  { date: new Date(2021, 1, 1), type: 'deposit', amount: 10, balance: 40 }
]
*/

//
const rodriAccount = new BankAccount("USD");
johnsAccount.transfer(758, rodriAccount);
console.log(johnsAccount.getBalance());
console.log(rodriAccount.getBalance());
//

console.log(johnsAccount.toString());
/*
Account Number: 'XXXX'
Currency: 'USD'
Balance: $ 40.00
Last modified: 2021-01-01T00:00:00.000Z
Average deposit: $ 55.00
*/
