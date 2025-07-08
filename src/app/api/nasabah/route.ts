import { NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'

interface Nasabah {
  id: number;
}

export async function GET() {
  try {
    const filePath = path.resolve(process.cwd(), 'backend', 'nasabah.json')
    const jsonData = await fs.promises.readFile(filePath, 'utf-8')
    const data: Nasabah[] = JSON.parse(jsonData)
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Failed to load nasabah data' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const newNasabah: any = await request.json();
    const filePath = path.resolve(process.cwd(), 'backend', 'nasabah.json');
    const jsonData = await fs.promises.readFile(filePath, 'utf-8');
    let data: any[] = JSON.parse(jsonData);

    // Cari data nasabah dengan idNumber atau name yang sama
    const matchIdx = data.findIndex((n) =>
      (n.idNumber && newNasabah.idNumber && n.idNumber === newNasabah.idNumber) ||
      (n.name && newNasabah.name && n.name === newNasabah.name)
    );

    if (matchIdx !== -1) {
      // Gabungkan array images
      const oldImages = Array.isArray(data[matchIdx].images) ? data[matchIdx].images : (data[matchIdx].image ? [data[matchIdx].image] : []);
      const newImages = Array.isArray(newNasabah.images) ? newNasabah.images : (newNasabah.image ? [newNasabah.image] : []);
      // Gabungkan dan deduplicate
      const mergedImages = Array.from(new Set([...oldImages, ...newImages].filter(Boolean)));
      // Update data lama dengan data baru, kecuali id dan transactionNumber
      data[matchIdx] = {
        ...data[matchIdx],
        ...newNasabah,
        id: data[matchIdx].id, // jaga id tetap
        transactionNumber: data[matchIdx].transactionNumber, // jaga nomor transaksi tetap
        images: mergedImages,
        image: mergedImages.length > 0 ? mergedImages[mergedImages.length - 1] : ""
      };
      await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
      return NextResponse.json(data[matchIdx], { status: 200 });
    } else {
      // Data baru, pastikan images array
      const imagesArr = Array.isArray(newNasabah.images) ? newNasabah.images : (newNasabah.image ? [newNasabah.image] : []);
      newNasabah.images = imagesArr;
      newNasabah.image = imagesArr.length > 0 ? imagesArr[imagesArr.length - 1] : "";
      data.push(newNasabah);
      await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
      return NextResponse.json(newNasabah, { status: 201 });
    }
  } catch (e) {
    return NextResponse.json({ error: 'Failed to save nasabah data' }, { status: 500 });
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

    const filePath = path.resolve(process.cwd(), 'backend', 'nasabah.json')
    const jsonData = await fs.promises.readFile(filePath, 'utf-8')
    let data: Nasabah[] = JSON.parse(jsonData)

    const initialLength = data.length
    data = data.filter((nasabah: Nasabah) => nasabah.id !== id)

    if (data.length === initialLength) {
      return NextResponse.json({ error: 'Nasabah not found' }, { status: 404 })
    }

    await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8')

    return NextResponse.json({ message: 'Nasabah deleted successfully' })
  } catch {
    return NextResponse.json({ error: 'Failed to delete nasabah data' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const updatedNasabah = await request.json();
    if (!updatedNasabah.id) {
      return NextResponse.json({ error: 'ID is required for update' }, { status: 400 });
    }
    const filePath = path.resolve(process.cwd(), 'backend', 'nasabah.json');
    const jsonData = await fs.promises.readFile(filePath, 'utf-8');
    let data: Nasabah[] = JSON.parse(jsonData);
    const index = data.findIndex((nasabah: Nasabah) => nasabah.id === updatedNasabah.id);
    if (index === -1) {
      return NextResponse.json({ error: 'Nasabah not found' }, { status: 404 });
    }
    data[index] = { ...data[index], ...updatedNasabah };
    await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return NextResponse.json(data[index]);
  } catch {
    return NextResponse.json({ error: 'Failed to update nasabah data' }, { status: 500 });
  }
}
