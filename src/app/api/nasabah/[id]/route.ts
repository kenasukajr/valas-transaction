import { NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'

interface Nasabah {
  id: number
  [key: string]: unknown
}

export async function GET(request: Request) {
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
    const data: Nasabah[] = JSON.parse(jsonData)

    const nasabah = data.find((item: Nasabah) => item.id === id)
    if (!nasabah) {
      return NextResponse.json({ error: 'Nasabah not found' }, { status: 404 })
    }

    return NextResponse.json(nasabah)
  } catch {
    return NextResponse.json({ error: 'Failed to load nasabah data' }, { status: 500 })
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
    const url = new URL(request.url)
    const idParam = url.pathname.split('/').pop()
    if (!idParam) {
      return NextResponse.json({ error: 'ID parameter is required' }, { status: 400 })
    }
    const id = parseInt(idParam, 10)
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID parameter' }, { status: 400 })
    }

    const updatedNasabah = await request.json()

    const filePath = path.resolve(process.cwd(), 'backend', 'nasabah.json')
    const jsonData = await fs.promises.readFile(filePath, 'utf-8')
    let data: Nasabah[] = JSON.parse(jsonData)

    const index = data.findIndex((nasabah: Nasabah) => nasabah.id === id)
    if (index === -1) {
      return NextResponse.json({ error: 'Nasabah not found' }, { status: 404 })
    }

    data[index] = { ...data[index], ...updatedNasabah }

    await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8')

    return NextResponse.json(data[index])
  } catch {
    return NextResponse.json({ error: 'Failed to update nasabah data' }, { status: 500 })
  }
}
