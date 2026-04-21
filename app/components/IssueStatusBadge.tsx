import { Status } from '@prisma/client'
import { Badge } from '@radix-ui/themes'
import React from 'react'




interface props{
    status:Status
}



const statusMap: Record<
  Status, 
  { label: string, color: 'red' | 'violet' | 'green' }> = {
  OPEN: { label: 'Open', color: 'red' },
  IN_PROGRESS: { label: 'In Progress', color: 'violet' },
  CLOSED: { label: 'Closed', color: 'green' }
};





const IssueStatusBadge = ({ status }: props) => {
  return (
    <Badge color={statusMap[status].color}>
      {statusMap[status].label}
    </Badge>
  )
}

export default IssueStatusBadge



//statusMap is a lookup table that maps each Status enum value to its
// corresponding display label and badge color.
// Instead of writing if/else or switch statements every time we need
// to display a status, we just do statusMap[status].label or statusMap[status].color
//
// Record<Status, {...}> means:
// "this object must have a key for EVERY value of the Status enum"
// So if we add a new status to the database, TypeScript will force us to handle it here too




    // color is typed as a union of these 3 specific strings, NOT just "string"
    // because Radix UI's Badge component only accepts these exact color values.
    // If we used "string", TypeScript would allow any string like "purple" or "banana"
    // which would cause a runtime error since Radix doesn't recognize them.
    // This way TypeScript catches invalid colors at compile time, not at runtime.




// in PRISMA , we don,t need to EXPLICITLY define the type of our model ( database ), here
// it was "Status"
