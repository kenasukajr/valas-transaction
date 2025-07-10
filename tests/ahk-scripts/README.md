# AHK Test Scripts

Folder ini berisi script AutoHotkey untuk testing dan validasi fungsionalitas aplikasi.

## File Scripts

### Testing Scripts
- `test-bnb-navigation-fixed.ahk` - Test navigasi antar transaksi BNB
- `test-bns-navigation-fixed.ahk` - Test navigasi antar transaksi BNS  
- `test-no-filedelete.ahk` - Test compatibility tanpa FileDelete
- `ahk-v2-environment-test.ahk` - Test environment AHK v2

### Debug Scripts
- `debug-generator-output.ahk` - Debug output generator
- Script debug lainnya untuk troubleshooting

## Cara Penggunaan

1. **Install AutoHotkey v2**: Download dari https://www.autohotkey.com/v2/
2. **Double-click script** yang ingin dijalankan
3. **Pastikan aplikasi target** sudah berjalan (untuk test navigasi)

## Test Categories

### BNB (Buy Note Bank) Testing
- Multiple transaction navigation
- Currency code validation
- Timing optimization

### BNS (Buy Note Sell) Testing  
- Inter-transaction navigation
- Payment flow testing
- Special navigation for >8 rows

### Environment Testing
- AHK v2 compatibility
- Window detection
- Script execution

## Notes
- Script menggunakan syntax AHK v2
- Compatible dengan AHK v1 (sebagian besar)
- Test mode: Menggunakan Notepad jika aplikasi target tidak ditemukan
