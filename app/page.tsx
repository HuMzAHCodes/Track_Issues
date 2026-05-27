import Image from 'next/image'
import Pagination from './components/Pagination'

export default function Home({searchParams}:{searchParams:{page:string}}) {
  return (
    <div> 
      <main className="flex min-h-screen flex-col items-center justify-between p-24"></main>
      
      <Pagination itemCount={100} pageSize={10} currentPage={parseInt(searchParams.page)}/>
       </div>
  )
}
