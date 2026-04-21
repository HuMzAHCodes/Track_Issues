import prisma from '@/prisma/client'
import { notFound } from 'next/navigation'
import { number } from 'zod';

interface props {
  params: Promise<{ id: string }>
}

const IssueDetailPage = async ({ params }: props) => {

    // if(typeof (await params).id !=="number") notFound();

  // In Next.js 15, params is a Promise and must be awaited
  const { id } = await params;

  const issue = await prisma.issue.findUnique({
    where: { id: parseInt(id) }
  })

  if (!issue) notFound();

  return (
    <div>
      <p>{issue!.title}</p>
      <p>{issue!.description}</p>
      <p>{issue!.status}</p>
      <p>{issue!.createdAt.toDateString()}</p>
    </div>
  )
}

export default IssueDetailPage;