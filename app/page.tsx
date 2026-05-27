import Image from 'next/image'
import Pagination from './components/Pagination'

// ✅ make the component async so we can await searchParams
export default async function Home({ searchParams }: { searchParams: Promise<{ page: string }> }) {
  
  // ✅ await it first, THEN destructure
  const { page } = await searchParams;

  return (
    <div>
      <main className="flex min-h-screen flex-col items-center justify-between p-24"></main>

      <Pagination
        itemCount={100}
        pageSize={10}
        currentPage={parseInt(page || '1')}
      />
    </div>
  )
}