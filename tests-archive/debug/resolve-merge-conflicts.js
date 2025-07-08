const fs = require('fs');
const path = require('path');

// Daftar file yang akan dipilih versi lokal (HEAD)
const useLocalFiles = [
  'src/components/UserForm.tsx',
  'src/components/UserFormRight.tsx',
  'src/components/UserFormTransaksiMod.tsx',
  'src/components/TransactionList.tsx',
  'src/app/nasabah/page.tsx',
  'src/app/page.tsx',
  'src/app/transaksi/page.tsx',
  'src/app/valas/KursMbarateTable.tsx',
  'src/app/valas/TabelValas.tsx',
  'src/app/valas/page.tsx',
  'src/lib/valasData.ts',
  'src/utils/currencyValidation.ts',
  'backend/nasabah.json',
  'backend/transactions.json',
  'package.json',
  'tools/autohotkey/auto_type_form.ahk'
];

// Daftar file yang akan dipilih versi remote (incoming)
const useRemoteFiles = [
  'tools/server-manager/obj/Debug/net8.0-windows/ServerManager.AssemblyInfo.cs',
  'tools/server-manager/obj/Debug/net8.0-windows/ServerManager.AssemblyInfoInputs.cache',
  'tools/server-manager/obj/Debug/net8.0-windows/ServerManager.GeneratedMSBuildEditorConfig.editorconfig',
  'tools/server-manager/obj/Debug/net8.0-windows/ServerManager.assets.cache',
  'tools/server-manager/obj/ServerManager.csproj.nuget.dgspec.json',
  'tools/server-manager/obj/ServerManager.csproj.nuget.g.props',
  'tools/server-manager/obj/project.assets.json',
  'tools/server-manager/obj/project.nuget.cache'
];

function resolveConflictFile(filePath, useLocal = true) {
  const fullPath = path.resolve(filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`File tidak ditemukan: ${fullPath}`);
    return false;
  }

  try {
    const content = fs.readFileSync(fullPath, 'utf8');
    
    // Jika tidak ada conflict marker, skip
    if (!content.includes('<<<<<<<') && !content.includes('>>>>>>>')) {
      console.log(`${filePath}: Tidak ada conflict marker`);
      return true;
    }

    let resolvedContent;
    
    if (useLocal) {
      // Ambil bagian HEAD (local)
      resolvedContent = content.replace(
        /<<<<<<< HEAD\n([\s\S]*?)\n=======\n[\s\S]*?\n>>>>>>>[^\n]*\n/g,
        '$1\n'
      );
    } else {
      // Ambil bagian incoming (remote)
      resolvedContent = content.replace(
        /<<<<<<< HEAD\n[\s\S]*?\n=======\n([\s\S]*?)\n>>>>>>>[^\n]*\n/g,
        '$1\n'
      );
    }

    // Tulis kembali file yang sudah di-resolve
    fs.writeFileSync(fullPath, resolvedContent, 'utf8');
    console.log(`${filePath}: Conflict resolved (${useLocal ? 'local' : 'remote'})`);
    return true;
  } catch (error) {
    console.error(`Error resolving ${filePath}:`, error.message);
    return false;
  }
}

console.log('Memulai resolusi merge conflict...\n');

// Resolve file yang menggunakan versi lokal
console.log('Resolving files dengan versi lokal (HEAD):');
useLocalFiles.forEach(file => {
  resolveConflictFile(file, true);
});

console.log('\nResolving files dengan versi remote (incoming):');
useRemoteFiles.forEach(file => {
  resolveConflictFile(file, false);
});

console.log('\nResolusi merge conflict selesai!');
