import { NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'

interface Transaction {
  id: number
}

export async function GET() {
  try {
    const filePath = path.resolve(process.cwd(), 'backend', 'transactions.json')
    const jsonData = await fs.promises.readFile(filePath, 'utf-8')
    const data: Transaction[] = JSON.parse(jsonData)
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Failed to load transactions data' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const newTransaction: any = await request.json();
    const filePath = path.resolve(process.cwd(), 'backend', 'transactions.json');
    const jsonData = await fs.promises.readFile(filePath, 'utf-8');
    let data: any[] = JSON.parse(jsonData);

    // Cari transaksi dengan idNumber atau name yang sama
    const matchIdx = data.findIndex((t) =>
      (t.idNumber && newTransaction.idNumber && t.idNumber === newTransaction.idNumber) ||
      (t.name && newTransaction.name && t.name === newTransaction.name)
    );

    if (matchIdx !== -1) {
      // Gabungkan array images
      const oldImages = Array.isArray(data[matchIdx].images) ? data[matchIdx].images : (data[matchIdx].image ? [data[matchIdx].image] : []);
      const newImages = Array.isArray(newTransaction.images) ? newTransaction.images : (newTransaction.image ? [newTransaction.image] : []);
      // Gabungkan dan deduplicate
      const mergedImages = Array.from(new Set([...oldImages, ...newImages].filter(Boolean)));
      // Update data lama dengan data baru, kecuali id dan transactionNumber
      data[matchIdx] = {
        ...data[matchIdx],
        ...newTransaction,
        id: data[matchIdx].id, // jaga id tetap
        transactionNumber: data[matchIdx].transactionNumber, // jaga nomor transaksi tetap
        images: mergedImages,
        image: mergedImages.length > 0 ? mergedImages[mergedImages.length - 1] : ""
      };
      await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
      return NextResponse.json(data[matchIdx], { status: 200 });
    } else {
      // Data baru, pastikan images array
      const imagesArr = Array.isArray(newTransaction.images) ? newTransaction.images : (newTransaction.image ? [newTransaction.image] : []);
      newTransaction.images = imagesArr;
      newTransaction.image = imagesArr.length > 0 ? imagesArr[imagesArr.length - 1] : "";
      data.push(newTransaction);
      await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
      return NextResponse.json(newTransaction, { status: 201 });
    }
  } catch (e) {
    return NextResponse.json({ error: 'Failed to save transaction data' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url)
    const idParam = url.pathname.split('/').pop()
    if (!idParam) {
      return NextResponse.json({ error: 'ID parameter is required' }, { status: 400 })
    }
    const id = parseInt(idParam, 10)
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID parameter' }, { status: 400 })
    }

    const filePath = path.resolve(process.cwd(), 'backend', 'transactions.json')
    const jsonData = await fs.promises.readFile(filePath, 'utf-8')
    let data: Transaction[] = JSON.parse(jsonData)

    const initialLength = data.length
    data = data.filter((transaction: Transaction) => transaction.id !== id)

    if (data.length === initialLength) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 })
    }

    await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8')

    return NextResponse.json({ message: 'Transaction deleted successfully' })
  } catch {
    return NextResponse.json({ error: 'Failed to delete transaction data' }, { status: 500 })
  }
}
