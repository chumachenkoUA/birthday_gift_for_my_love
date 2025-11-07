export type View = 'login' | 'letter' | 'music' | 'gallery' | 'surprise'

export type MenuTarget = Exclude<View, 'login'>

export type AccentSetter = (color: string | null) => void

export interface MenuItem {
  id: MenuTarget
  label: string
  note: string
}

export interface Song {
  id: string
  title: string
  memory: string
  color: string
  audio: string
  image: string
  lines?: string[]
}

export interface GalleryPhoto {
  id: string
  src: string
  alt: string
  caption: string
  revealable?: boolean
  hiddenCaption?: string
}
