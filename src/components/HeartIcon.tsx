import { forwardRef, useMemo } from 'react'
import styles from './HeartIcon.module.scss'

type HeartIconProps = {
  lit?: boolean
  className?: string
}

const HeartIcon = forwardRef<SVGSVGElement, HeartIconProps>(({ lit = false, className }, ref) => {
  const classes = useMemo(
    () => [styles.heartIcon, lit ? styles.heartIconLit : '', className].filter(Boolean).join(' '),
    [className, lit],
  )

  return (
    <svg ref={ref} className={classes} viewBox="0 0 64 58" role="img" aria-hidden="true">
      <path d="M32 54.5a2 2 0 0 1-1.37-.53C18.1 42.87 10 34.8 10 24.45 10 16.74 16.07 11 23.2 11c3.72 0 7.33 1.53 10 4.33C35.87 12.53 39.48 11 43.2 11 50.33 11 56.4 16.74 56.4 24.45c0 10.35-8.1 18.42-20.63 29.52a2 2 0 0 1-1.37.53Z" />
    </svg>
  )
})

HeartIcon.displayName = 'HeartIcon'

export default HeartIcon
