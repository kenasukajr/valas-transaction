import React, { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface BNSPaymentData {
  transactionId: string
  customerName: string
  customerPhone?: string
  currency: string
  amount: number
  exchangeRate: number
  paymentAmount: number
  transactionDate: string
  paymentStatus: 'pending' | 'completed' | 'cancelled'
  notes?: string
}

interface BNSPaymentFormProps {
  customerName: string
  currency: string
  amount: number
  exchangeRate: number
  onPaymentCalculated: (paymentAmount: number) => void
}

export default function BNSPaymentForm({ 
  customerName, 
  currency, 
  amount, 
  exchangeRate, 
  onPaymentCalculated 
}: BNSPaymentFormProps) {
  const [paymentAmount, setPaymentAmount] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [paymentData, setPaymentData] = useState<BNSPaymentData | null>(null)

  // Kalkulasi pembayaran otomatis
  useEffect(() => {
    if (amount && exchangeRate) {
      const calculated = Math.round(amount * exchangeRate)
      setPaymentAmount(calculated)
      onPaymentCalculated(calculated)
    }
  }, [amount, exchangeRate, onPaymentCalculated])

  // Fungsi untuk mendapatkan pembayaran dari API
  const fetchPaymentAmount = async () => {
    try {
      setIsLoading(true)
      setError('')
      
      const response = await fetch(`/api/bns-payment?amount=${amount}&rate=${exchangeRate}`)
      if (!response.ok) {
        throw new Error('Failed to fetch payment amount')
      }
      
      const data = await response.json()
      setPaymentAmount(parseInt(data.paymentAmount))
      onPaymentCalculated(parseInt(data.paymentAmount))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }

  // Fungsi untuk menyimpan data pembayaran
  const savePaymentData = async () => {
    try {
      setIsLoading(true)
      setError('')
      
      const response = await fetch('/api/bns-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerName,
          currency,
          amount,
          exchangeRate,
          notes: `BNS Transaction - ${currency} ${amount} @ ${exchangeRate}`
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to save payment data')
      }
      
      const data = await response.json()
      setPaymentData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          BNS Payment Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Informasi Transaksi */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Customer:</span>
            <span className="font-medium">{customerName}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Currency:</span>
            <span className="font-medium">{currency}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Amount:</span>
            <span className="font-medium">{amount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Exchange Rate:</span>
            <span className="font-medium">{exchangeRate.toLocaleString()}</span>
          </div>
        </div>

        <hr />

        {/* Payment Amount */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Payment Amount (IDR)
          </label>
          <div className="flex items-center space-x-2">
            <Input
              type="text"
              value={paymentAmount.toLocaleString('id-ID')}
              readOnly
              className="font-mono text-right"
            />
            <Button
              onClick={fetchPaymentAmount}
              disabled={isLoading}
              size="sm"
              variant="outline"
            >
              {isLoading ? 'Loading...' : 'Refresh'}
            </Button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button
            onClick={savePaymentData}
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? 'Saving...' : 'Save Payment Data'}
          </Button>
        </div>

        {/* Payment Data Display */}
        {paymentData && (
          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Transaction Saved</span>
              <Badge variant="secondary">
                {paymentData.paymentStatus}
              </Badge>
            </div>
            <div className="text-xs text-gray-600">
              ID: {paymentData.transactionId}
            </div>
            <div className="text-xs text-gray-600">
              Amount: IDR {paymentData.paymentAmount.toLocaleString('id-ID')}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Hook untuk menggunakan BNS Payment
export function useBNSPayment() {
  const [payments, setPayments] = useState<BNSPaymentData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')

  const fetchPayments = async (customerName?: string, currency?: string) => {
    try {
      setIsLoading(true)
      setError('')
      
      const params = new URLSearchParams()
      if (customerName) params.append('customerName', customerName)
      if (currency) params.append('currency', currency)
      
      const response = await fetch(`/api/bns-payment?${params}`)
      if (!response.ok) {
        throw new Error('Failed to fetch payments')
      }
      
      const data = await response.json()
      setPayments(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }

  const calculatePaymentAmount = (amount: number, rate: number): number => {
    return Math.round(amount * rate)
  }

  const formatPaymentAmount = (amount: number): string => {
    return amount.toLocaleString('id-ID')
  }

  return {
    payments,
    isLoading,
    error,
    fetchPayments,
    calculatePaymentAmount,
    formatPaymentAmount
  }
}
