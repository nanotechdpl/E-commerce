import { ReactNode } from 'react'

export interface navItem {
  id: number
  title: string
  url: string
  icon?: ReactNode
  image?: string
}
