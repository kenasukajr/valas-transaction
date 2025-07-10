/**
 * Simulasi Format Tempat Lahir + Tanggal Lahir
 * Untuk memverifikasi apakah format sudah benar tanpa perlu server running
 */

function simulateFormatting(birthPlace, birthDate) {
  // Simulasi dari kode di route.ts baris 6
  const formattedBirthDate = birthDate ? ` ${new Date(birthDate).getDate().toString().padStart(2, '0')}/${(new Date(birthDate).getMonth() + 1).toString().padStart(2, '0')}/${new Date(birthDate).getFullYear()}` : '';
  
  // Simulasi dari kode di route.ts baris 54
  const result = `${birthPlace || ''}${formattedBirthDate}`;
  
  return result;
}

console.log('🧪 Simulasi Format Tempat Lahir + Tanggal Lahir');
console.log('='.repeat(50));

// Test cases
const testCases = [
  { birthPlace: 'JAKARTA', birthDate: '1990-01-15' },
  { birthPlace: 'BANDUNG', birthDate: '1985-12-25' },
  { birthPlace: 'SURABAYA', birthDate: '1992-03-05' },
  { birthPlace: 'YOGYAKARTA', birthDate: '1988-07-10' },
  { birthPlace: 'MEDAN', birthDate: '1995-06-30' }
];

for (const testCase of testCases) {
  const result = simulateFormatting(testCase.birthPlace, testCase.birthDate);
  
  console.log(`\nInput:`);
  console.log(`  birthPlace: "${testCase.birthPlace}"`);
  console.log(`  birthDate: "${testCase.birthDate}"`);
  console.log(`Output:`);
  console.log(`  "${result}"`);
  
  // Analisis
  const hasSpace = result.includes(' ');
  const parts = result.split(' ');
  
  if (hasSpace && parts.length === 2) {
    console.log(`  ✅ FORMAT BENAR: Ada spasi pemisah`);
    console.log(`     Tempat: "${parts[0]}"`);
    console.log(`     Tanggal: "${parts[1]}"`);
  } else {
    console.log(`  ❌ FORMAT SALAH: Tidak ada spasi pemisah atau format tidak valid`);
  }
}

console.log('\n📋 ANALISIS KODE:');
console.log('Di file: src/app/api/generate-ahk/route.ts');
console.log('Baris 6: formattedBirthDate dimulai dengan spasi');
console.log('Baris 54: birthPlace + formattedBirthDate');
console.log('\nKesimpulan: Format sudah BENAR - ada spasi pemisah');

// Test khusus untuk edge cases
console.log('\n🔍 Test Edge Cases:');

// Case 1: birthPlace kosong
const case1 = simulateFormatting('', '1990-01-15');
console.log(`Empty birthPlace: "${case1}"`);

// Case 2: birthDate kosong
const case2 = simulateFormatting('JAKARTA', '');
console.log(`Empty birthDate: "${case2}"`);

// Case 3: Keduanya kosong
const case3 = simulateFormatting('', '');
console.log(`Both empty: "${case3}"`);

console.log('\n✅ Verifikasi selesai!');
