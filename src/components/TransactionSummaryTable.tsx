"use client"

import React, { useState, useEffect } from "react"
import axios from "axios"

interface Transaction {
  id: number;
  date: string;
  currency?: string;
  amount?: number;
  rate?: number;
  rupiahEquivalent?: number;
  transactionNumber?: string;
  name?: string;
  idNumber?: string;
  phone?: string;
  [key: string]: any;
}

interface CurrencyGroup {
  currency: string;
  totalAmount: number;
  transactions: Transaction[];
  totalRupiah: number;
}

interface GroupedTransaction {
  date: string;
  currencyGroups: CurrencyGroup[];
  dailyTotalRupiah: number;
}

interface MonthGroup {
  monthYear: string;
  groups: GroupedTransaction[];
  monthlyTotalRupiah: number;
}

interface TransactionSummaryTableProps {
  nasabahId: number;
  backendUrl: string;
}

export function TransactionSummaryTable({ nasabahId, backendUrl }: TransactionSummaryTableProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('Component initialized');
  const [fetchInProgress, setFetchInProgress] = useState(false);

  console.log(`🔄 [${new Date().toISOString()}] TransactionSummaryTable rendered with props:`, { 
    nasabahId, backendUrl, fetchInProgress 
  });
  console.log(`🔄 [${new Date().toISOString()}] Current state:`, { 
    loading, error, transactionsCount: transactions.length 
  });

  useEffect(() => {
    console.log(`🎯 [${new Date().toISOString()}] useEffect triggered. Props:`, { 
      nasabahId, backendUrl, fetchInProgress 
    });
    
    if (nasabahId && backendUrl && !fetchInProgress) {
      console.log(`🔄 [${new Date().toISOString()}] Starting fetchTransactions due to props change`);
      fetchTransactions();
    } else {
      console.log(`⚠️ [${new Date().toISOString()}] Skipping fetch. Missing props or fetch in progress:`, { 
        nasabahId, backendUrl, fetchInProgress 
      });
      if (!fetchInProgress) {
        setLoading(false);
      }
    }
    
    // DEBUG ONLY: Fallback timeout untuk debug loading stuck (60 detik)
    const debugTimeout = setTimeout(() => {
      if (loading) {
        console.warn(`🐛 [${new Date().toISOString()}] DEBUG: Component stuck loading for 60 seconds`);
        console.warn('Current state:', { loading, fetchInProgress, error, transactions: transactions.length });
        setLoading(false);
        setError('DEBUG: Loading stuck - silakan refresh halaman');
      }
    }, 60000);
    
    return () => {
      console.log('🧹 Cleaning up useEffect');
      clearTimeout(debugTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nasabahId, backendUrl]);

  const fetchTransactions = async () => {
    if (fetchInProgress) {
      console.log(`⚠️ [${new Date().toISOString()}] fetchTransactions already in progress, skipping`);
      return;
    }
    
    try {
      const startTime = new Date().toISOString();
      console.log(`🚀 [${startTime}] Starting fetchTransactions with:`, { nasabahId, backendUrl });
      setFetchInProgress(true);
      setLoading(true);
      setError(null);
      setDebugInfo('Fetching data...');
      
      // GUNAKAN RELATIVE URL untuk di-proxy oleh Next.js (bypass CORS)
      const timestamp = Date.now();
      const nasabahUrl = `/api/nasabah?t=${timestamp}`;
      const transactionsUrl = `/api/transactions?t=${timestamp}`;
      
      console.log('📍 Using RELATIVE URLs (Next.js proxy) with cache busting:', { nasabahUrl, transactionsUrl });
      
      console.log(`📡 [${new Date().toISOString()}] Fetching nasabah data from:`, nasabahUrl);
      setDebugInfo(`Fetching nasabah from: ${nasabahUrl}`);
      
      // Fetch natural tanpa timeout - biarkan browser handle
      const nasabahResponse = await fetch(nasabahUrl, {
        method: 'GET',
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
        },
      });
      
      console.log(`✅ [${new Date().toISOString()}] Nasabah response status:`, nasabahResponse.status);
      setDebugInfo(`Nasabah response: ${nasabahResponse.status}`);
      
      if (!nasabahResponse.ok) {
        throw new Error(`Failed to fetch nasabah data: ${nasabahResponse.status} ${nasabahResponse.statusText}`);
      }
      
      const allNasabah = await nasabahResponse.json();
      console.log('📊 All nasabah data:', allNasabah.length, 'records');
      setDebugInfo(`Found ${allNasabah.length} nasabah records`);
      
      const currentNasabah = allNasabah.find((n: any) => n.id === nasabahId);
      
      if (!currentNasabah) {
        throw new Error(`Nasabah not found with ID: ${nasabahId}. Available IDs: ${allNasabah.map((n: any) => n.id).join(', ')}`);
      }
      
      console.log('👤 Current nasabah found:', {
        id: currentNasabah.id,
        name: currentNasabah.name,
        idNumber: currentNasabah.idNumber,
        phone: currentNasabah.phone
      });
      setDebugInfo(`Found nasabah: ${currentNasabah.name}`);
      
      // Fetch transactions dengan timeout
      console.log(`📡 [${new Date().toISOString()}] Fetching transactions from:`, transactionsUrl);
      setDebugInfo(`Fetching transactions from: ${transactionsUrl}`);
      
      // Fetch natural tanpa timeout - biarkan browser handle
      const response = await fetch(transactionsUrl, {
        method: 'GET',
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
        },
      });
      
      console.log(`✅ [${new Date().toISOString()}] Transactions response status:`, response.status);
      setDebugInfo(`Transactions response: ${response.status}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch transactions: ${response.status} ${response.statusText}`);
      }
      
      const allTransactions = await response.json();
      console.log(`📊 [${new Date().toISOString()}] All transactions count:`, allTransactions.length);
      setDebugInfo(`Processing ${allTransactions.length} transactions`);
      
      // Filter transaksi berdasarkan kesamaan data nasabah (name, idNumber, phone)
      // Hanya ambil transaksi yang punya data valas (currency, amount, rate)
      const nasabahTransactions = allTransactions.filter((t: Transaction) => {
        const nameMatch = t.name && currentNasabah.name && t.name === currentNasabah.name;
        const idNumberMatch = t.idNumber && currentNasabah.idNumber && t.idNumber === currentNasabah.idNumber;
        const phoneMatch = t.phone && currentNasabah.phone && t.phone === currentNasabah.phone;
        const hasValasData = t.currency && (t.amount !== undefined && t.amount !== null) && t.rate;
        
        if (nameMatch && idNumberMatch && phoneMatch) {
          console.log('🎯 Transaction match found:', {
            id: t.id,
            transactionNumber: t.transactionNumber,
            currency: t.currency,
            amount: t.amount,
            rate: t.rate,
            hasValasData
          });
        }
        
        return nameMatch && idNumberMatch && phoneMatch && hasValasData;
      });
      
      console.log('🎉 Found valid valas transactions for nasabah:', nasabahTransactions.length);
      setDebugInfo(`Found ${nasabahTransactions.length} valid valas transactions`);
      
      if (nasabahTransactions.length > 0) {
        console.log('📋 Sample transactions:', nasabahTransactions.slice(0, 3).map((t: Transaction) => ({
          id: t.id,
          currency: t.currency,
          amount: t.amount,
          rate: t.rate,
          rupiahEquivalent: t.rupiahEquivalent
        })));
      }
      
      setTransactions(nasabahTransactions);
      const endTime = new Date().toISOString();
      console.log(`🎉 [${endTime}] Successfully loaded ${nasabahTransactions.length} transactions`);
      setDebugInfo(`Completed - ${nasabahTransactions.length} transactions loaded`);
    } catch (error: any) {
      const errorTime = new Date().toISOString();
      console.error(`❌ [${errorTime}] Error in fetchTransactions:`, error);
      setError(error.message || 'Unknown error occurred');
      setDebugInfo(`Error: ${error.message}`);
    } finally {
      const finalTime = new Date().toISOString();
      console.log(`🏁 [${finalTime}] Setting loading to false and fetchInProgress to false`);
      setLoading(false);
      setFetchInProgress(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric'
    });
  };

  const formatMonth = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', {
      month: 'long',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID').format(amount);
  };

  const groupTransactionsByMonth = (): MonthGroup[] => {
    const monthGroups: { [key: string]: GroupedTransaction[] } = {};

    // Group by date first
    const dateGroups: { [key: string]: Transaction[] } = {};
    transactions.forEach(transaction => {
      const date = formatDate(transaction.date);
      if (!dateGroups[date]) {
        dateGroups[date] = [];
      }
      dateGroups[date].push(transaction);
    });

    // Create grouped transactions with currency grouping for each date
    Object.entries(dateGroups).forEach(([date, txs]) => {
      // Group by currency within each date
      const currencyGroups: { [key: string]: Transaction[] } = {};
      txs.forEach(tx => {
        const currency = tx.currency || 'UNKNOWN';
        if (!currencyGroups[currency]) {
          currencyGroups[currency] = [];
        }
        currencyGroups[currency].push(tx);
      });

      // Create currency groups with totals
      const processedCurrencyGroups: CurrencyGroup[] = Object.entries(currencyGroups).map(([currency, transactions]) => {
        const totalAmount = transactions.reduce((sum, tx) => sum + (tx.amount || 0), 0);
        const totalRupiah = transactions.reduce((sum, tx) => sum + (tx.rupiahEquivalent || 0), 0);
        
        return {
          currency,
          totalAmount,
          transactions,
          totalRupiah
        };
      });

      const dailyTotalRupiah = processedCurrencyGroups.reduce((sum, group) => sum + group.totalRupiah, 0);

      const groupedTransaction: GroupedTransaction = {
        date,
        currencyGroups: processedCurrencyGroups,
        dailyTotalRupiah
      };

      // Group by month
      const monthYear = formatMonth(txs[0].date);
      if (!monthGroups[monthYear]) {
        monthGroups[monthYear] = [];
      }
      monthGroups[monthYear].push(groupedTransaction);
    });

    // Convert to array and sort with monthly totals
    return Object.entries(monthGroups).map(([monthYear, groups]) => {
      const monthlyTotalRupiah = groups.reduce((sum, group) => sum + group.dailyTotalRupiah, 0);
      
      return {
        monthYear,
        groups: groups.sort((a, b) => {
          const dateA = new Date(a.currencyGroups[0]?.transactions[0]?.date || new Date());
          const dateB = new Date(b.currencyGroups[0]?.transactions[0]?.date || new Date());
          return dateB.getTime() - dateA.getTime();
        }),
        monthlyTotalRupiah
      };
    }).sort((a, b) => {
      const dateA = new Date(a.groups[0]?.currencyGroups[0]?.transactions[0]?.date || new Date());
      const dateB = new Date(b.groups[0]?.currencyGroups[0]?.transactions[0]?.date || new Date());
      return dateB.getTime() - dateA.getTime();
    });
  };

  const toggleGroup = (date: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(date)) {
      newExpanded.delete(date);
    } else {
      newExpanded.add(date);
    }
    setExpandedGroups(newExpanded);
  };

  if (loading) {
    return (
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-3">Riwayat Transaksi</h3>
        <div className="text-center py-4">
          <div className="animate-pulse">Loading transaksi... (ID: {nasabahId})</div>
          <div className="text-xs text-gray-500 mt-2">Debug: {debugInfo}</div>
          <div className="text-xs text-gray-500">Backend: {backendUrl}</div>
          <div className="text-xs text-blue-600 mt-1">URL yang digunakan: http://localhost:5000</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-3">Riwayat Transaksi</h3>
        <div className="text-red-500 text-center py-4">Error: {error}</div>
      </div>
    );
  }

  const monthGroups = groupTransactionsByMonth();

  if (monthGroups.length === 0) {
    return (
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-3">Riwayat Transaksi</h3>
        <div className="text-gray-500 text-center py-4">Belum ada transaksi valas</div>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-3 text-gray-800">Riwayat Transaksi Valas</h3>
      <div className="space-y-6">
        {monthGroups.map((monthGroup) => (
          <div key={monthGroup.monthYear} className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Month Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3">
              <div className="flex justify-between items-center">
                <h4 className="text-lg font-semibold">{monthGroup.monthYear}</h4>
                <div className="text-sm bg-blue-500 bg-opacity-30 px-3 py-1 rounded-full">
                  Total: Rp {formatCurrency(monthGroup.monthlyTotalRupiah)}
                </div>
              </div>
            </div>
            
            {/* Date Groups */}
            <div className="divide-y divide-gray-200">
              {monthGroup.groups.map((group) => (
                <div key={group.date} className="bg-white">
                  {/* Date Summary Row - Clickable */}
                  <div 
                    className="bg-gray-50 p-4 cursor-pointer hover:bg-gray-100 transition-colors border-l-4 border-blue-500"
                    onClick={() => toggleGroup(group.date)}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800 mb-2 text-base">
                          📅 {group.date}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          {group.currencyGroups.map((currencyGroup) => (
                            <div key={currencyGroup.currency} className="bg-white p-3 rounded-lg shadow-sm border">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <span className="inline-block w-3 h-3 rounded-full bg-blue-500"></span>
                                  <span className="font-bold text-gray-700">{currencyGroup.currency}</span>
                                </div>
                                <span className="text-xs text-gray-500">{currencyGroup.transactions.length} transaksi</span>
                              </div>
                              <div className="mt-2">
                                <div className="text-lg font-bold text-gray-800">
                                  {formatCurrency(currencyGroup.totalAmount)}
                                </div>
                                <div className="text-sm text-gray-600">
                                  = Rp {formatCurrency(currencyGroup.totalRupiah)}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-3 text-right">
                          <span className="text-lg font-bold text-green-600">
                            Total Hari: Rp {formatCurrency(group.dailyTotalRupiah)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <span className="text-gray-400 text-xl">
                          {expandedGroups.has(group.date) ? '▼' : '▶'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedGroups.has(group.date) && (
                    <div className="border-t bg-gray-50">
                      {group.currencyGroups.map((currencyGroup) => (
                        <div key={currencyGroup.currency} className="p-4 border-b border-gray-200 last:border-b-0">
                          <div className="mb-3">
                            <h5 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                              <span className="inline-block w-4 h-4 rounded-full bg-blue-500"></span>
                              <span>{currencyGroup.currency}</span>
                              <span className="text-sm text-gray-500">
                                (Total: {formatCurrency(currencyGroup.totalAmount)} = Rp {formatCurrency(currencyGroup.totalRupiah)})
                              </span>
                            </h5>
                          </div>
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead className="bg-white">
                                <tr className="border-b-2 border-gray-200">
                                  <th className="px-4 py-3 text-left font-semibold text-gray-700">No</th>
                                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Nomor Transaksi</th>
                                  <th className="px-4 py-3 text-right font-semibold text-gray-700">Amount</th>
                                  <th className="px-4 py-3 text-right font-semibold text-gray-700">Rate</th>
                                  <th className="px-4 py-3 text-right font-semibold text-gray-700">Jumlah Rupiah</th>
                                </tr>
                              </thead>
                              <tbody className="bg-white">
                                {currencyGroup.transactions.map((transaction, index) => (
                                  <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3 text-gray-600">{index + 1}</td>
                                    <td className="px-4 py-3">
                                      <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs font-medium">
                                        {transaction.transactionNumber || '-'}
                                      </span>
                                    </td>
                                    <td className="px-4 py-3 text-right font-medium text-gray-800">
                                      {transaction.amount ? formatCurrency(transaction.amount) : '-'}
                                    </td>
                                    <td className="px-4 py-3 text-right font-medium text-gray-800">
                                      {transaction.rate ? formatCurrency(transaction.rate) : '-'}
                                    </td>
                                    <td className="px-4 py-3 text-right font-bold text-green-600">
                                      {transaction.rupiahEquivalent ? `Rp ${formatCurrency(transaction.rupiahEquivalent)}` : '-'}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
