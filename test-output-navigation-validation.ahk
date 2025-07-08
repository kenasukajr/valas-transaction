; === DATA DIRI ===
; Nama: Test Nasabah Navigation

; === NAVIGASI KE BAGIAN TRANSAKSI ===
; Total transaksi: 10

; === ISI DATA TRANSAKSI 1 ===
; Currency: USD, Code: 1
Send, 1
Send, {Enter}
Send, {Enter}
TypeString("1000")
Send, {Enter}
TypeString("15000")
Send, {Enter}

; === NAVIGASI KE BARIS TRANSAKSI 2 (NORMAL) ===
; Enter 2x untuk navigasi ke baris transaksi berikutnya
Send, {Enter}
Sleep, 200
Send, {Enter}
Sleep, 200

; === ISI DATA TRANSAKSI 2 ===
; Currency: EUR, Code: 4
Send, 4
Send, {Enter}
Send, {Enter}
TypeString("2000")
Send, {Enter}
TypeString("17000")
Send, {Enter}

; === NAVIGASI KE BARIS TRANSAKSI 3 (NORMAL) ===
; Enter 2x untuk navigasi ke baris transaksi berikutnya
Send, {Enter}
Sleep, 200
Send, {Enter}
Sleep, 200

; === ISI DATA TRANSAKSI 3 ===
; Currency: GBP, Code: 5
Send, 5
Send, {Enter}
Send, {Enter}
TypeString("3000")
Send, {Enter}
TypeString("19000")
Send, {Enter}

; === NAVIGASI KE BARIS TRANSAKSI 4 (NORMAL) ===
; Enter 2x untuk navigasi ke baris transaksi berikutnya
Send, {Enter}
Sleep, 200
Send, {Enter}
Sleep, 200

; === ISI DATA TRANSAKSI 4 ===
; Currency: AUD, Code: 2
Send, 2
Send, {Enter}
Send, {Enter}
TypeString("4000")
Send, {Enter}
TypeString("11000")
Send, {Enter}

; === NAVIGASI KE BARIS TRANSAKSI 5 (NORMAL) ===
; Enter 2x untuk navigasi ke baris transaksi berikutnya
Send, {Enter}
Sleep, 200
Send, {Enter}
Sleep, 200

; === ISI DATA TRANSAKSI 5 ===
; Currency: CAD, Code: 3
Send, 3
Send, {Enter}
Send, {Enter}
TypeString("5000")
Send, {Enter}
TypeString("12000")
Send, {Enter}

; === NAVIGASI KE BARIS TRANSAKSI 6 (NORMAL) ===
; Enter 2x untuk navigasi ke baris transaksi berikutnya
Send, {Enter}
Sleep, 200
Send, {Enter}
Sleep, 200

; === ISI DATA TRANSAKSI 6 ===
; Currency: CHF, Code: 6
Send, 6
Send, {Enter}
Send, {Enter}
TypeString("6000")
Send, {Enter}
TypeString("16000")
Send, {Enter}

; === NAVIGASI KE BARIS TRANSAKSI 7 (NORMAL) ===
; Enter 2x untuk navigasi ke baris transaksi berikutnya
Send, {Enter}
Sleep, 200
Send, {Enter}
Sleep, 200

; === ISI DATA TRANSAKSI 7 ===
; Currency: JPY, Code: 9
Send, 9
Send, {Enter}
Send, {Enter}
TypeString("7000")
Send, {Enter}
TypeString("110")
Send, {Enter}

; === NAVIGASI KE BARIS TRANSAKSI 8 (SETELAH BARIS 7) ===
; Setelah transaksi ke-7, navigasi berbeda: Enter 2x + Panah Atas 1x + Enter
Send, {Enter}
Sleep, 200
Send, {Enter}
Sleep, 200
; Tekan panah atas 1x untuk navigasi khusus setelah baris 7
Send, {Up}
Sleep, 200
Send, {Enter}
Sleep, 200

; === ISI DATA TRANSAKSI 8 ===
; Currency: SGD, Code: 8
Send, 8
Send, {Enter}
Send, {Enter}
TypeString("8000")
Send, {Enter}
TypeString("11500")
Send, {Enter}

; === NAVIGASI KE BARIS TRANSAKSI 9 (SETELAH BARIS 7) ===
; Setelah transaksi ke-7, navigasi berbeda: Enter 2x + Panah Atas 1x + Enter
Send, {Enter}
Sleep, 200
Send, {Enter}
Sleep, 200
; Tekan panah atas 1x untuk navigasi khusus setelah baris 7
Send, {Up}
Sleep, 200
Send, {Enter}
Sleep, 200

; === ISI DATA TRANSAKSI 9 ===
; Currency: HKD, Code: 7
Send, 7
Send, {Enter}
Send, {Enter}
TypeString("9000")
Send, {Enter}
TypeString("1900")
Send, {Enter}

; === NAVIGASI KE BARIS TRANSAKSI 10 (SETELAH BARIS 7) ===
; Setelah transaksi ke-7, navigasi berbeda: Enter 2x + Panah Atas 1x + Enter
Send, {Enter}
Sleep, 200
Send, {Enter}
Sleep, 200
; Tekan panah atas 1x untuk navigasi khusus setelah baris 7
Send, {Up}
Sleep, 200
Send, {Enter}
Sleep, 200

; === ISI DATA TRANSAKSI 10 ===
; Currency: NZD, Code: 10
Send, 10
Send, {Enter}
Send, {Enter}
TypeString("10000")
Send, {Enter}
TypeString("10000")
Send, {Enter}
