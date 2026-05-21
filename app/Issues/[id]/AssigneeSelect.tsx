"use client"

import { User } from '@prisma/client';
import { Select } from '@radix-ui/themes'
import axios from 'axios';
import React, { useEffect, useState } from 'react'


const AssigneeSelect = () => {

  
  const [users, setusers] = useState<User[]>([]);


  
  useEffect(() => {

    const fetchusers = async () => {
    
      const { data } = await axios.get<User[]>("/api/users")

      
      setusers(data);
    }

    fetchusers();

  }, [])


  return (
    // Select.Root — wrapper that manages open/close state of the dropdown
    <Select.Root>

      {/* Select.Trigger — the button the user clicks to open the dropdown
          placeholder shows when no option is selected yet */}
      <Select.Trigger placeholder="Assign..." />

      {/* Select.Content — the dropdown panel that appears on click */}
      <Select.Content>

        {/* Select.Group — groups related items together visually */}
        <Select.Group>

          {/* Select.Label — non-selectable heading shown above the items */}
          <Select.Label>Suggestions</Select.Label>

          {/* Select.Item — each selectable option in the dropdown
              value = what gets submitted/stored (user id)
              children = what the user sees (user name) */}
          {users.map(user => (
            <Select.Item key={user.id} value={user.id}>
              {user.name}
            </Select.Item>
          ))}

        </Select.Group>
      </Select.Content>

    </Select.Root>
  )
}

export default AssigneeSelect








// useState stores the list of users fetched from the API
  // starts as an empty array — gets populated once the API responds
  // whenever setusers() is called, React re-renders the component with new data






  // useEffect runs AFTER the component mounts (appears on screen)
  // the empty [] dependency array means it only runs ONCE — not on every re-render
  // this is the correct place to fetch data in a client component





      // axios.get hits our /api/users endpoint (server side)
      // server runs prisma.user.findMany() and returns users as JSON
      // <User[]> tells TypeScript what shape the response data will be





      // store the fetched users in state — triggers a re-render
      // Select.Item list below gets populated with real data


