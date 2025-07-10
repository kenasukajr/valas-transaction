const testData = {
    // Test 1: Single transaction in main data
    singleMain: {
        name: 'Test Single Main',
        currency: 'USD',
        amount: 100,
        rate: 15000,
        transactionType: 'BNB'
    },
    
    // Test 2: Multiple transactions in array
    multipleArray: {
        name: 'Test Multiple Array',
        transactionType: 'BNB',
        transactions: [
            { currency: 'USD', amount: 100, rate: 15000 },
            { currency: 'EUR', amount: 50, rate: 17000 },
            { currency: 'GBP', amount: 25, rate: 19000 }
        ]
    },
    
    // Test 3: Mixed data (should prioritize array)
    mixed: {
        name: 'Test Mixed',
        currency: 'USD', // Should be ignored
        amount: 999,     // Should be ignored
        rate: 999,       // Should be ignored
        transactionType: 'BNB',
        transactions: [
            { currency: 'EUR', amount: 75, rate: 17500 },
            { currency: 'GBP', amount: 30, rate: 19500 }
        ]
    }
};

console.log('=== MULTIPLE TRANSACTIONS TEST ===');

Object.keys(testData).forEach(testName => {
    console.log(`\n--- Test: ${testName} ---`);
    const data = testData[testName];
    
    console.log('Input data:', JSON.stringify(data, null, 2));
    
    // Simulate the logic from generate-ahk/route.ts
    const transactions = [];
    
    // Priority 1: Array transactions
    if (data.transactions && Array.isArray(data.transactions)) {
        data.transactions.forEach((transaction, index) => {
            console.log(`  Processing transaction ${index + 1}:`, transaction);
            if (transaction.currency && transaction.amount && transaction.rate) {
                transactions.push(transaction);
                console.log(`    ✓ Added transaction ${index + 1}`);
            } else {
                console.log(`    ✗ Skipped transaction ${index + 1} - missing fields`);
            }
        });
    }
    
    // Priority 2: Main data fallback
    if (transactions.length === 0 && data.currency && data.amount && data.rate) {
        transactions.push({
            currency: data.currency,
            amount: data.amount,
            rate: data.rate
        });
        console.log('  ✓ Using fallback single transaction from main data');
    }
    
    console.log(`Result: ${transactions.length} transactions to process`);
    transactions.forEach((t, i) => {
        console.log(`  ${i+1}. ${t.currency} ${t.amount} @ ${t.rate}`);
    });
});

console.log('\n=== TEST EXPECTED RESULTS ===');
console.log('singleMain: Should process 1 transaction (USD 100 @ 15000)');
console.log('multipleArray: Should process 3 transactions (USD, EUR, GBP)'); 
console.log('mixed: Should process 2 transactions (EUR, GBP) - ignore main data');
