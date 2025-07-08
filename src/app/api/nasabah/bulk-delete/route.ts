import { NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'

interface Nasabah {
  id: number
}

export async function POST(request: Request) {
  try {
    const { ids }: { ids: number[] } = await request.json()
    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'IDs array is required' }, { status: 400 })
    }

    const filePath = path.resolve(process.cwd(), 'backend', 'nasabah.json')
    const jsonData = await fs.promises.readFile(filePath, 'utf-8')
    let data: Nasabah[] = JSON.parse(jsonData)

    const initialLength = data.length
    data = data.filter((nasabah: Nasabah) => !ids.includes(nasabah.id))

    if (data.length === initialLength) {
      return NextResponse.json({ error: 'No matching nasabah found to delete' }, { status: 404 })
    }

    await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8')

    return NextResponse.json({ message: 'Nasabah deleted successfully' })
  } catch {
    return NextResponse.json({ error: 'Failed to bulk delete nasabah data' }, { status: 500 })
  }
}
