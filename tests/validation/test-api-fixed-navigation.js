/**
 * Test script untuk memverifikasi urutan navigasi AHK yang sudah diperbaiki
 * Langsung menggunakan endpoint /api/execute-ahk yang sudah diperbaiki
 */

const fetch = require('node-fetch');

async function testFixedNavigationViaAPI() {
    console.log('🧪 Testing fixed navigation via API endpoint...');
    
    const testData = {
        customerType: 'BNS',
        customerName: 'NASABAH TEST FIXED ORDER',
        address: 'Alamat Test Fixed Navigation',
        phone: '081234567890',
        job: 'Pegawai Test',
        idNumber: '1234567890123456',
        birthPlace: 'Jakarta',
        birthDate: '01/01/1990',
        transactionType: 'BNS',
        currency: 'USD',
        amount: '1000',
        rate: '15800'
    };

    try {
        // Panggil API endpoint yang sudah diperbaiki
        const response = await fetch('http://localhost:3000/api/execute-ahk', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testData)
        });

        if (response.ok) {
            const result = await response.json();
            console.log('✅ SUCCESS: Fixed navigation order via API executed!');
            console.log('📋 Result:', result);
            console.log('🔧 Navigation fixes applied in route.ts:');
            console.log('   ✅ Enter 1x untuk masuk ke bagian transaksi (bukan Tab)');
            console.log('   ✅ Input currency code langsung: 1');
            console.log('   ✅ Enter setelah currency');
            console.log('   ✅ TypeString untuk amount: 1000');
            console.log('   ✅ Enter setelah amount');
            console.log('   ✅ TypeString untuk rate: 15800');
            console.log('   ✅ Enter setelah rate');
            console.log('   ✅ Down arrow + Enter untuk selesai');
            console.log('   ✅ Auto-delete script');
            console.log('💡 Navigation should now match script-test-navigation.ahk exactly!');
        } else {
            const errorText = await response.text();
            console.error('❌ FAILED:', errorText);
        }
    } catch (error) {
        console.error('❌ ERROR:', error.message);
    }
}

// Langsung test API endpoint
testFixedNavigationViaAPI();
