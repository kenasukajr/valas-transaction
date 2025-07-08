-- Database schema untuk BNS Payments
-- Tabel untuk menyimpan data pembayaran khusus transaksi BNS

CREATE TABLE IF NOT EXISTS bns_payments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    transaction_id VARCHAR(50) UNIQUE NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20),
    currency VARCHAR(10) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    exchange_rate DECIMAL(10,2) NOT NULL,
    payment_amount DECIMAL(15,2) NOT NULL, -- Jumlah pembayaran dalam Rupiah
    transaction_date DATETIME NOT NULL,
    payment_status ENUM('pending', 'completed', 'cancelled') DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Index untuk optimasi query
CREATE INDEX idx_customer_name ON bns_payments(customer_name);
CREATE INDEX idx_transaction_date ON bns_payments(transaction_date);
CREATE INDEX idx_currency ON bns_payments(currency);
CREATE INDEX idx_payment_status ON bns_payments(payment_status);

-- Tabel untuk menyimpan konfigurasi pembayaran BNS
CREATE TABLE IF NOT EXISTS bns_payment_config (
    id INT PRIMARY KEY AUTO_INCREMENT,
    currency VARCHAR(10) NOT NULL,
    base_fee DECIMAL(10,2) DEFAULT 0,
    percentage_fee DECIMAL(5,4) DEFAULT 0,
    min_payment DECIMAL(15,2) DEFAULT 0,
    max_payment DECIMAL(15,2) DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Data default untuk konfigurasi
INSERT INTO bns_payment_config (currency, base_fee, percentage_fee, min_payment, max_payment) VALUES
('USD', 0, 0, 0, 999999999),
('EUR', 0, 0, 0, 999999999),
('GBP', 0, 0, 0, 999999999),
('AUD', 0, 0, 0, 999999999),
('CAD', 0, 0, 0, 999999999),
('CHF', 0, 0, 0, 999999999),
('JPY', 0, 0, 0, 999999999),
('SGD', 0, 0, 0, 999999999);
