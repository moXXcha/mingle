import React from 'react'

type Props =  {
    href: string
    text: string
}

export const Tag = (props: Props) => {
  return (
    <a href={props.href} className="text-[#6E96A5] text-base">#{props.text}</a>
  )
}
