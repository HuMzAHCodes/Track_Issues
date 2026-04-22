import IssueStatusBadge from '@/app/components/IssueStatusBadge';
import { Box, Card, Flex, Heading } from '@radix-ui/themes';
import React from 'react'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const LoadingIdPage = () => {
  return (
    
    <Box className='max-w-xl'>
         {/* <Skeleton/> */}
      <Flex className="space-x-3" my="2">
        {/* // that component to display the color  */}
        <Skeleton/>
      </Flex>

      {/* radix ui componet */}
     <Skeleton/>

       <Card className='prose' mt="4"/>  
        
        <Skeleton count={3}/>
      
     
    </Box>
  )
}

export default LoadingIdPage;