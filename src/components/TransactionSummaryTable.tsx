"use client"

import React, { useState, useEffect } from "react"

interface Transaction {
  id: number;
  date: string;
  currency?: string;
  amount?: string;
  rate?: string;
  hasil?: string;
  transactionNumber?: string;
  [key: string]: any;
}

interface GroupedTransaction {
  date: string;
  transactions: Transaction[];
  summary: {
    currencies: string[];
    amounts: string[];
    totalRupiah: number;
  };
}

interface MonthGroup {
  monthYear: string;
  groups: GroupedTransaction[];
}

interface TransactionSummaryTableProps {
  nasabahId: number;
  backendUrl: string;
}

export function TransactionSummaryTable({ nasabahId, backendUrl }: TransactionSummaryTableProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, [nasabahId]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${backendUrl}/api/transactions`);
      if (response.ok) {
        const allTransactions = await response.json();
        // Filter transaksi berdasarkan nasabah ID (dari transactionNumber atau field lain)
        const nasabahTransactions = allTransactions.filter((t: Transaction) => 
          t.transactionNumber && t.transactionNumber.includes(String(nasabahId).padStart(9, '0'))
        );
        setTransactions(nasabahTransactions);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
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

    // Create grouped transactions with summaries for each date
    Object.entries(dateGroups).forEach(([date, txs]) => {
      const currencies = [...new Set(txs.map(t => t.currency).filter(Boolean) as string[])];
      const amounts = txs.map(t => t.amount || '').filter(Boolean);
      const totalRupiah = txs.reduce((sum, t) => {
        const rupiah = parseFloat(t.hasil || '0');
        return sum + (isNaN(rupiah) ? 0 : rupiah);
      }, 0);

      const groupedTransaction: GroupedTransaction = {
        date,
        transactions: txs,
        summary: {
          currencies,
          amounts,
          totalRupiah
        }
      };

      // Group by month
      const monthYear = formatMonth(txs[0].date);
      if (!monthGroups[monthYear]) {
        monthGroups[monthYear] = [];
      }
      monthGroups[monthYear].push(groupedTransaction);
    });

    // Convert to array and sort
    return Object.entries(monthGroups).map(([monthYear, groups]) => ({
      monthYear,
      groups: groups.sort((a, b) => {
        const dateA = new Date(a.transactions[0].date);
        const dateB = new Date(b.transactions[0].date);
        return dateB.getTime() - dateA.getTime();
      })
    })).sort((a, b) => {
      const dateA = new Date(a.groups[0].transactions[0].date);
      const dateB = new Date(b.groups[0].transactions[0].date);
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
        <div className="text-center py-4">Loading transaksi...</div>
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
      <h3 className="text-lg font-semibold mb-3">Riwayat Transaksi</h3>
      <div className="space-y-6">
        {monthGroups.map((monthGroup) => (
          <div key={monthGroup.monthYear}>
            {/* Month Separator */}
            <div className="bg-blue-100 text-blue-800 px-3 py-2 rounded-md font-medium text-sm mb-3">
              {monthGroup.monthYear}
            </div>
            
            {/* Date Groups */}
            <div className="space-y-3">
              {monthGroup.groups.map((group) => (
                <div key={group.date} className="border rounded-lg overflow-hidden">
                  {/* Summary Row - Clickable */}
                  <div 
                    className="bg-gray-50 p-3 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => toggleGroup(group.date)}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <div className="font-medium text-sm text-gray-700 mb-1">
                          {group.date}
                        </div>
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Currency:</span> {group.summary.currencies.join(', ')} |{' '}
                          <span className="font-medium">Amount:</span> {group.summary.amounts.join(', ')} |{' '}
                          <span className="font-medium">Total:</span> Rp {formatCurrency(group.summary.totalRupiah)}
                        </div>
                      </div>
                      <div className="ml-3">
                        <span className="text-gray-400">
                          {expandedGroups.has(group.date) ? '▼' : '▶'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedGroups.has(group.date) && (
                    <div className="border-t">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-3 py-2 text-left">No</th>
                            <th className="px-3 py-2 text-left">Currency</th>
                            <th className="px-3 py-2 text-left">Amount</th>
                            <th className="px-3 py-2 text-left">Rate</th>
                            <th className="px-3 py-2 text-right">Jumlah Rupiah</th>
                          </tr>
                        </thead>
                        <tbody>
                          {group.transactions.map((transaction, index) => (
                            <tr key={transaction.transactionNumber || index} className="border-t border-gray-100">
                              <td className="px-3 py-2">{index + 1}</td>
                              <td className="px-3 py-2">{transaction.currency || '-'}</td>
                              <td className="px-3 py-2">{transaction.amount || '-'}</td>
                              <td className="px-3 py-2">{transaction.rate || '-'}</td>
                              <td className="px-3 py-2 text-right">
                                {transaction.hasil ? `Rp ${formatCurrency(parseFloat(transaction.hasil))}` : '-'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
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
