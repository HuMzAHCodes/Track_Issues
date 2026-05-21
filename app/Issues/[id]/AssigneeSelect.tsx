"use client"

import { User } from '@prisma/client';
import { Select } from '@radix-ui/themes'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query';
import Skeleton from 'react-loading-skeleton';


const AssigneeSelect = () => {

  const { data: Users, error, isLoading } = useQuery<User[]>({
    queryKey: ["user"],
    queryFn: () => axios.get("/api/users").then(res => res.data),
    staleTime: 60 * 1000,
    retry: 3
  })


  if (isLoading) return <Skeleton />

  if (error) return null;


  //   const [users, setusers] = useState<User[]>([]);
  //   useEffect(() => {
  //  const fetchusers = async () => {
  //      const { data } = await axios.get<User[]>("/api/users")
  //     setusers(data);
  //     }
  //      fetchusers();
  // //   }, [])


  // no need of useeffect , and useState anymore


  return (
    <Select.Root>
      <Select.Trigger placeholder="Assign..." />
      <Select.Content>
        <Select.Group>
          <Select.Label>Suggestions</Select.Label>
          {Users?.map(user => (
            <Select.Item key={user.id} value={user.id}>
              {user.name ?? "Unknown"}
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


// ─────────────────────────────────────────────────────────────────────────────
// useQuery — THE 3 THINGS WE DESTRUCTURE
// ─────────────────────────────────────────────────────────────────────────────
// data: Users  → the actual fetched data (array of users from /api/users)
//               renamed from "data" to "Users" using : for clarity
// error        → contains the error object if the request failed, null otherwise
// isLoading    → true while the request is in flight, false once done
//
// ─────────────────────────────────────────────────────────────────────────────
// useQuery PROPERTIES
// ─────────────────────────────────────────────────────────────────────────────
// queryKey: ["user"]
//   → uniquely identifies this query in the cache
//   → if two components use queryKey: ["user"], only ONE request is made
//   → TanStack shares the cached result between both components
//
// queryFn: () => axios.get("/api/users").then(res => res.data)
//   → the function that actually fetches the data
//   → can use axios, fetch, or any async library
//   → must return a Promise
//
// staleTime: 60 * 1000
//   → tells TanStack how long (in milliseconds) the cached data stays "fresh"
//   → during this time, no new request is made even if the component re-mounts
//   → after 60 seconds, the data is considered "stale" and refetched on next use
//   → without staleTime, TanStack refetches every time the component mounts
//   → 60 * 1000 = 60000ms = 60 seconds
//
// retry: 3
//   → if the request fails, TanStack automatically retries up to 3 times
//   → only after all 3 retries fail does error become non-null
//   → this is why "if(error) return null" only triggers after 3 failed attempts
//
// ─────────────────────────────────────────────────────────────────────────────
// WHY useQuery<User[]> — HOW DID WE KNOW THE TYPE?
// ─────────────────────────────────────────────────────────────────────────────
// useQuery<User[]> is a TypeScript generic — we are telling TanStack
// "the data this query returns will be an array of User objects"
//
// We knew to use User[] because:
// 1. our API route /api/users calls prisma.user.findMany()
// 2. findMany() returns an array of User objects
// 3. User is the Prisma-generated type from @prisma/client
//    it exactly matches the shape of rows in our database User table
//
// without <User[]>, TypeScript would type data as "unknown"
// with <User[]>, TypeScript knows user.id, user.name, user.email etc. exist
// and gives us full autocomplete and type safety on the Users array
// ─────────────────────────────────────────────────────────────────────────────