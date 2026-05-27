import Image from 'next/image'
import Pagination from './components/Pagination'
import LatestIssues from './LatestIssues'



// { searchParams }: { searchParams: Promise<{ page: string }> }
export default async function Home() {
  
  //  await it first, THEN destructure
  // const { page } = await searchParams;

  return (
    <div>
      {/* <main className="flex min-h-screen flex-col items-center justify-between p-24"></main> */}

      {/* <Pagination
        itemCount={100}
        pageSize={10}
        currentPage={parseInt(page || '1')}
      /> */}

      <LatestIssues/>
    </div>
  )
}