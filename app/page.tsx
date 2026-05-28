import Image from 'next/image'
import Pagination from './components/Pagination'
import LatestIssues from './LatestIssues'
import prisma from '@/prisma/client'
import IssueSummary from './IssueSummary'
import IssueChart from './IssueChart'



// { searchParams }: { searchParams: Promise<{ page: string }> }
export default async function Home() {

 const open=await prisma.issue.count({where:{status:"OPEN"}})
  const inprogress=await prisma.issue.count({where:{status:"IN_PROGRESS"}})
   const closed=await prisma.issue.count({where:{status:"CLOSED"}})
  
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

      {/* <LatestIssues/> */}

      <IssueChart open={open}  closed={closed} inProgress={inprogress}/>
    </div>
  )
}