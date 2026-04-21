import { Button, Table } from "@radix-ui/themes";
import Link from 'next/link';
import prisma from '@/prisma/client';
import IssueStatusBadge from "../components/IssueStatusBadge";
import delay from "delay"
import IssueActions from "./issueactions";
const IssuesPage = async () => {

  const issues = await prisma.issue.findMany();
  delay(120000)

  return (
    <div>

     <IssueActions/>

      <Table.Root variant="surface">

        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Issues</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="hidden md:table-cell">Status</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="hidden md:table-cell">Created</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {issues.map((issue) => (
            <Table.Row key={issue.id}>

              <Table.Cell>
                <Link href={`/Issues/${issue.id}`}>   {issue.title}</Link>
              
                {/* On mobile, show status badge below the title */}
                <div className="block md:hidden">
                  <IssueStatusBadge status={issue.status} />
                </div>
              </Table.Cell>

              {/* On desktop, show status and date in separate columns */}
              <Table.Cell className="hidden md:table-cell">
                <IssueStatusBadge status={issue.status} />
              </Table.Cell>

              <Table.Cell className="hidden md:table-cell">
                {issue.createdAt.toDateString()}
              </Table.Cell>

            </Table.Row>
          ))}
        </Table.Body>

      </Table.Root>

    </div>
  )
}

export default IssuesPage;