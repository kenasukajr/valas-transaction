; Auto-generated AutoHotkey scr    ; Data pembayaran BNS (akan diambil dari field halaman utama)
    paymentData := {}
    paymentData["JumlahRupiah"] := transactionData["Amount"] * transactionData["Rate"]  ; 15750000
    paymentData["Pembayaran"] := "16000000"  ; Dari field di halaman utama - akan diambil otomatis
    paymentData["Kembalian"] := paymentData["Pembayaran"] - paymentData["JumlahRupiah"]  ; 250000
    
    ; Debug: Tampilkan data pembayaran
    ; MsgBox, Debug Payment Data:`nJumlah Rupiah: %paymentData["JumlahRupiah"]%`nPembayaran: %paymentData["Pembayaran"]%`nKembalian: %paymentData["Kembalian"]%o input form data
^t::
{
    ; === RESET HALAMAN KE POSISI NETRAL ===
    ; Tunggu 2 detik untuk memastikan program MBA siap sempurna
    Sleep, 2000
    
    ; Pilih jenis transaksi
    jenisTransaksi := "BNS" ; Ganti ke "BNS" jika ingin tes BNS
    
    ; Tekan tombol R untuk reset halaman hanya untuk BNB
    if (jenisTransaksi = "BNB") {
        Send, r
        Sleep, 1000
    }

    ; Data to input
    data := {}
    data["Nama Lengkap"] := "PUJI PURNAWAN"
    data["Alamat"] := "VILLA BANGUNTAPAN 2 NO E5 SAMPANGAN WIROKERTEN BANGUNTAPAN BANTUL YOGY"
    data["Nomor Telepon"] := "085878813372"
    data["Pekerjaan"] := "SWASTA"
    data["Nomor Identitas"] := "3401121406910001"
    data["Tempat Tanggal Lahir"] := "MAGELANG 14-06-1991"
    
    ; Data transaksi untuk kalkulasi pembayaran BNS
    transactionData := {}
    transactionData["Currency"] := "USD"
    transactionData["Amount"] := "1000"
    transactionData["Rate"] := "15750"
    
    ; Data pembayaran BNS (akan diambil dari field halaman utama)
    paymentData := {}
    paymentData["JumlahRupiah"] := transactionData["Amount"] * transactionData["Rate"]  ; 15750000
    paymentData["Pembayaran"] := "16000000"  ; Contoh: Dari field di halaman utama 
    paymentData["Kembalian"] := paymentData["Pembayaran"] - paymentData["JumlahRupiah"]  ; 250000
    
    ; Note: Dalam implementasi nyata, nilai pembayaran akan diambil dari API yang
    ; menerima data dari field "Pembayaran Rp" di halaman utama

    TypeString(str) {
        Loop Parse, str
        {
            Send %A_LoopField%
            Sleep 5
        }
    }

    if (jenisTransaksi = "BNS") {
        Send {Right}
        Sleep 200
        Send {Enter}
        Sleep 300
    }
    ; Jika BNB, langsung lanjut input

    keys := ["Nama Lengkap", "Alamat", "Nomor Telepon", "Pekerjaan", "Nomor Identitas", "Tempat Tanggal Lahir"]
    for index, key in keys
    {
        TypeString(data[key])
        Sleep 200
        Send {Tab}
        Sleep 200
    }
    
    ; === NAVIGASI KE BAGIAN TRANSAKSI ===
    ; Tunggu setelah selesai isi data nasabah
    Sleep, 1000
    
    ; Enter untuk masuk ke bagian transaksi
    Send, {Enter}
    Sleep, 1500
    
    ; === SELESAI TRANSAKSI - BERBEDA UNTUK BNB DAN BNS ===
    if (jenisTransaksi = "BNS") {
        ; === SELESAI TRANSAKSI BNS ===
        ; Tidak ada transaksi lagi - Enter 1x dan stop (pembayaran dihilangkan sementara)
        Send, {Enter}
        Sleep, 200
        
        ; Script selesai - pembayaran navigation dihilangkan sementara
        ; (Pembayaran akan ditambahkan kembali nanti)
    } else {
        ; === SELESAI TRANSAKSI BNB ===
        ; Implementasi baru: Enter 2x → Down 1x → Enter 1x → 1s delay → Reset R
        ; Setelah transaksi BNB selesai dan tidak ada data yang diinput lagi
        Send, {Enter}
        Sleep, 200
        Send, {Enter}
        Sleep, 200
        
        ; Tekan panah ke bawah 1x untuk navigasi selanjutnya
        Send, {Down}
        Sleep, 300
        
        ; Tekan Enter 1x setelah panah bawah
        Send, {Enter}
        Sleep, 300
        
        ; Jeda 1 detik sebelum reset
        Sleep, 1000
        
        ; Tekan tombol R 1x untuk reset ke menu utama
        Send, r
        Sleep, 500
    }
    
    ; Tunggu sebentar sebelum script selesai
    Sleep, 1000
    
    FileDelete, %A_ScriptFullPath%
    ExitApp
}
