import { Header } from '@/component/ui/Header'
import { MusicCard } from '@/component/ui/MusicCard'
import { Search } from '@/component/ui/Search'
import { Tag } from '@/component/ui/Tag'
import React from 'react'

const page = () => {
  const tagsTest = [
    {
      text: "tag",
      url: "/test"
    }
  ]
  return (
    <MusicCard musicName='RatPark' userName='moCha' musicDescription='概要概要概要概要概要概要概要概要概要概要' tags={tagsTest}/>
  )
}

export default page