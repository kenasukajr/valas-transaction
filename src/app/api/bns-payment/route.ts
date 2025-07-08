import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

interface BNSPaymentRequest {
  customerName: string
  customerPhone?: string
  currency: string
  amount: number
  exchangeRate: number
  paymentAmount: number  // Jumlah pembayaran dari field halaman utama
  transactionDate?: string
  notes?: string
}

interface BNSPaymentData {
  transactionId: string
  customerName: string
  customerPhone?: string
  currency: string
  amount: number
  exchangeRate: number
  rupiahAmount: number      // Jumlah rupiah (amount * rate)
  paymentAmount: number     // Jumlah pembayaran dari field
  changeAmount: number      // Kembalian (payment - rupiah)
  transactionDate: string
  paymentStatus: 'pending' | 'completed' | 'cancelled'
  notes?: string
}

// Simulasi database storage (dalam production, gunakan database real)
const BNS_PAYMENTS_FILE = path.join(process.cwd(), 'data', 'bns_payments.json')

async function ensureDataDirectory() {
  const dataDir = path.join(process.cwd(), 'data')
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
}

async function loadBNSPayments(): Promise<BNSPaymentData[]> {
  try {
    await ensureDataDirectory()
    const data = await fs.readFile(BNS_PAYMENTS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

async function saveBNSPayments(payments: BNSPaymentData[]) {
  await ensureDataDirectory()
  await fs.writeFile(BNS_PAYMENTS_FILE, JSON.stringify(payments, null, 2))
}

function generateTransactionId(): string {
  const now = new Date()
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '')
  const timeStr = now.toTimeString().slice(0, 8).replace(/:/g, '')
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `BNS${dateStr}${timeStr}${random}`
}

function calculatePaymentDetails(amount: number, rate: number, payment: number) {
  const rupiahAmount = Math.round(amount * rate)
  const changeAmount = payment - rupiahAmount
  return { rupiahAmount, changeAmount }
}

// GET - Ambil data pembayaran berdasarkan customer atau currency
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const customerName = searchParams.get('customerName')
    const currency = searchParams.get('currency')
    const amount = searchParams.get('amount')
    const rate = searchParams.get('rate')
    
    const payments = await loadBNSPayments()
    
    // Jika hanya ingin kalkulasi pembayaran
    if (amount && rate) {
      const payment = searchParams.get('payment')
      const paymentAmount = payment ? parseFloat(payment) : parseFloat(amount) * parseFloat(rate)
      const details = calculatePaymentDetails(parseFloat(amount), parseFloat(rate), paymentAmount)
      
      return NextResponse.json({ 
        rupiahAmount: details.rupiahAmount.toString(),
        paymentAmount: paymentAmount.toString(),
        changeAmount: details.changeAmount.toString(),
        formattedRupiah: details.rupiahAmount.toLocaleString('id-ID'),
        formattedPayment: paymentAmount.toLocaleString('id-ID'),
        formattedChange: details.changeAmount.toLocaleString('id-ID')
      })
    }
    
    // Filter berdasarkan parameter
    let filteredPayments = payments
    
    if (customerName) {
      filteredPayments = filteredPayments.filter(p => 
        p.customerName.toLowerCase().includes(customerName.toLowerCase())
      )
    }
    
    if (currency) {
      filteredPayments = filteredPayments.filter(p => 
        p.currency.toUpperCase() === currency.toUpperCase()
      )
    }
    
    return NextResponse.json(filteredPayments)
  } catch (error) {
    console.error('Error fetching BNS payments:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Buat data pembayaran baru
export async function POST(req: NextRequest) {
  try {
    const body: BNSPaymentRequest = await req.json()
    
    // Validasi input
    if (!body.customerName || !body.currency || !body.amount || !body.exchangeRate || !body.paymentAmount) {
      return NextResponse.json({ 
        error: 'Missing required fields: customerName, currency, amount, exchangeRate, paymentAmount' 
      }, { status: 400 })
    }
    
    const payments = await loadBNSPayments()
    const details = calculatePaymentDetails(body.amount, body.exchangeRate, body.paymentAmount)
    
    // Buat data pembayaran baru
    const newPayment: BNSPaymentData = {
      transactionId: generateTransactionId(),
      customerName: body.customerName,
      customerPhone: body.customerPhone,
      currency: body.currency.toUpperCase(),
      amount: body.amount,
      exchangeRate: body.exchangeRate,
      rupiahAmount: details.rupiahAmount,
      paymentAmount: body.paymentAmount,
      changeAmount: details.changeAmount,
      transactionDate: body.transactionDate || new Date().toISOString(),
      paymentStatus: 'pending',
      notes: body.notes
    }
    
    payments.push(newPayment)
    await saveBNSPayments(payments)
    
    return NextResponse.json(newPayment, { status: 201 })
  } catch (error) {
    console.error('Error creating BNS payment:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Update status pembayaran
export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const transactionId = searchParams.get('transactionId')
    
    if (!transactionId) {
      return NextResponse.json({ error: 'Transaction ID is required' }, { status: 400 })
    }
    
    const body = await req.json()
    const payments = await loadBNSPayments()
    
    const paymentIndex = payments.findIndex(p => p.transactionId === transactionId)
    if (paymentIndex === -1) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
    }
    
    // Update payment
    payments[paymentIndex] = { ...payments[paymentIndex], ...body }
    await saveBNSPayments(payments)
    
    return NextResponse.json(payments[paymentIndex])
  } catch (error) {
    console.error('Error updating BNS payment:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
