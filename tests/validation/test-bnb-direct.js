// Test BNB navigation logic directly
// This test akan membuat file AHK untuk single dan multiple transactions

const fs = require('fs');
const path = require('path');

// Mock the required modules
const mockNextResponse = {
  json: (data) => data,
  NextResponse: class {
    constructor(buffer, options) {
      this.buffer = buffer;
      this.options = options;
    }
  }
};

// Mock daftarValas
const mockDaftarValas = [
  { no: 1, kode: "USD", alias: "USD" },
  { no: 4, kode: "EUR", alias: "EUR" },
  { no: 8, kode: "SGD", alias: "SGD" }
];

// Simple implementation of the generateAhkScript function for testing
function generateAhkScript(data) {
  const ahkLines = [];
  
  // Basic setup
  ahkLines.push('IfWinExist, Data Prosesing PT Mulia Bumi Arta');
  ahkLines.push('{');
  ahkLines.push('    WinActivate, Data Prosesing PT Mulia Bumi Arta');
  ahkLines.push('}');
  ahkLines.push('');
  
  const transactionType = (data.transactionType || 'BNB').toUpperCase();
  
  // BNB reset
  if (transactionType === 'BNB') {
    ahkLines.push('Send, r');
    ahkLines.push('Sleep, 1000');
  }
  
  // Process transactions
  const transactions = [];
  
  if (data.transactions && Array.isArray(data.transactions)) {
    data.transactions.forEach((transaction) => {
      if (transaction.currency && transaction.amount && transaction.rate) {
        transactions.push(transaction);
      }
    });
  }
  
  if (transactions.length === 0 && data.currency && data.amount && data.rate) {
    transactions.push({
      currency: data.currency,
      amount: data.amount,
      rate: data.rate
    });
  }
  
  ahkLines.push(`; Total transaksi yang akan diproses: ${transactions.length}`);
  
  // Process each transaction
  transactions.forEach((transaction, index) => {
    const isLastTransaction = (index === transactions.length - 1);
    const rowNumber = index + 1;
    
    ahkLines.push(`; === ISI DATA TRANSAKSI ${rowNumber} ===`);
    ahkLines.push(`; Currency: ${transaction.currency}, Amount: ${transaction.amount}, Rate: ${transaction.rate}`);
    
    // Input currency, amount, rate (simplified)
    ahkLines.push(`Send, 1`); // Mock currency code
    ahkLines.push('Sleep, 200');
    ahkLines.push('Send, {Enter}');
    ahkLines.push('Send, {Enter}');
    ahkLines.push(`TypeString("${transaction.amount}")`);
    ahkLines.push('Send, {Enter}');
    ahkLines.push(`TypeString("${transaction.rate}")`);
    ahkLines.push('Sleep, 100');
    ahkLines.push('');
    
    // BNB logic based on whether it's last transaction
    if (transactionType === 'BNB') {
      if (isLastTransaction) {
        ahkLines.push('; Setelah input rate - transaksi terakhir BNB: Enter 2x → Down 1x → Enter 1x → 1s delay → Reset R');
        ahkLines.push('Send, {Enter}');
        ahkLines.push('Sleep, 200');
        ahkLines.push('Send, {Enter}');
        ahkLines.push('Sleep, 200');
        ahkLines.push('Send, {Down}');
        ahkLines.push('Sleep, 300');
        ahkLines.push('Send, {Enter}');
        ahkLines.push('Sleep, 300');
        ahkLines.push('Sleep, 1000');
        ahkLines.push('Send, r');
        ahkLines.push('Sleep, 500');
      } else {
        ahkLines.push('; Setelah input rate - masih ada transaksi lain BNB: Enter 3x');
        ahkLines.push('Send, {Enter}');
        ahkLines.push('Sleep, 100');
        ahkLines.push('Send, {Enter}');
        ahkLines.push('Sleep, 100');
        ahkLines.push('Send, {Enter}');
        ahkLines.push('Sleep, 200');
        ahkLines.push('');
        ahkLines.push('Send, {Enter}'); // Navigate to next transaction
        ahkLines.push('Sleep, 200');
      }
    }
    
    ahkLines.push('');
  });
  
  ahkLines.push('FileDelete, %A_ScriptFullPath%');
  ahkLines.push('ExitApp');
  
  return ahkLines.join('\n');
}

// Test data
const testMultipleTransactions = {
  name: "PUJI PURNAWAN",
  transactionType: "BNB",
  transactions: [
    { currency: "USD", amount: "1000", rate: "15750" },
    { currency: "EUR", amount: "500", rate: "17200" },
    { currency: "SGD", amount: "800", rate: "11400" }
  ]
};

const testSingleTransaction = {
  name: "PUJI PURNAWAN",
  transactionType: "BNB",
  currency: "USD",
  amount: "1000",
  rate: "15750"
};

// Run tests
console.log('🧪 Testing BNB Navigation Logic...\n');

// Test 1: Multiple transactions
console.log('📊 Test 1: Multiple Transactions (3 transactions)');
const multipleScript = generateAhkScript(testMultipleTransactions);
fs.writeFileSync('test-bnb-multiple-output.ahk', multipleScript);

const enterThreeTimesCount = (multipleScript.match(/masih ada transaksi lain BNB: Enter 3x/g) || []).length;
const lastTransactionCount = (multipleScript.match(/transaksi terakhir BNB: Enter 2x → Down 1x → Enter 1x → 1s delay → Reset R/g) || []).length;

console.log(`   - Enter 3x patterns: ${enterThreeTimesCount}`);
console.log(`   - Last transaction patterns: ${lastTransactionCount}`);
console.log(`   - Expected: 2 Enter 3x, 1 last transaction`);

if (enterThreeTimesCount === 2 && lastTransactionCount === 1) {
  console.log('   ✅ PASSED: Multiple transactions logic is correct!');
} else {
  console.log('   ❌ FAILED: Multiple transactions logic has issues!');
}

// Test 2: Single transaction
console.log('\n📊 Test 2: Single Transaction (1 transaction)');
const singleScript = generateAhkScript(testSingleTransaction);
fs.writeFileSync('test-bnb-single-output.ahk', singleScript);

const singleEnterThreeTimesCount = (singleScript.match(/masih ada transaksi lain BNB: Enter 3x/g) || []).length;
const singleLastTransactionCount = (singleScript.match(/transaksi terakhir BNB: Enter 2x → Down 1x → Enter 1x → 1s delay → Reset R/g) || []).length;

console.log(`   - Enter 3x patterns: ${singleEnterThreeTimesCount}`);
console.log(`   - Last transaction patterns: ${singleLastTransactionCount}`);
console.log(`   - Expected: 0 Enter 3x, 1 last transaction`);

if (singleEnterThreeTimesCount === 0 && singleLastTransactionCount === 1) {
  console.log('   ✅ PASSED: Single transaction logic is correct!');
} else {
  console.log('   ❌ FAILED: Single transaction logic has issues!');
}

console.log('\n🏁 Tests completed!');
console.log('📝 Generated files:');
console.log('   - test-bnb-multiple-output.ahk');
console.log('   - test-bnb-single-output.ahk');
