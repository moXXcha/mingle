import { getPostsBySearchValue } from '@/server/post'
import React from 'react'
import { MusicCard } from './ui/MusicCard'

type Props = {
  tag: string
}
export const SearchedMusicCard = async(props: Props) => {
  const posts = await getPostsBySearchValue(props.tag)
  console.log("tag:" ,props.tag)
  return (
    <div>
      {posts.map((post, key) => (
        <MusicCard post={post} key={key} />
      ))}
    </div>
  )
}
