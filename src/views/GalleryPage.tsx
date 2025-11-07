import { useEffect, useRef, useState } from 'react'
import { animate } from 'animejs'
import type { AccentSetter, GalleryPhoto } from '../types'
import styles from './GalleryPage.module.scss'

type GalleryPageProps = {
  photos: GalleryPhoto[]
  onAccentChange: AccentSetter
}

const GALLERY_ACCENT = '#f6d5f7'

const GalleryPage = ({ photos, onAccentChange }: GalleryPageProps) => {
  const [revealed, setRevealed] = useState<Record<string, boolean>>({})
  const filmstripRef = useRef<HTMLDivElement | null>(null)
  const photoRefs = useRef<Record<string, HTMLElement | null>>({})

  useEffect(() => {
    onAccentChange(GALLERY_ACCENT)
    return () => {
      onAccentChange(null)
    }
  }, [onAccentChange])

  useEffect(() => {
    if (!filmstripRef.current) return
    const figures = Array.from(filmstripRef.current.querySelectorAll('figure'))
    if (!figures.length) return
    const animations = figures.map((figure, index) =>
      animate(figure, {
        translateY: [14, 0],
        opacity: [0, 1],
        delay: index * 120,
        easing: 'easeOutQuad',
        duration: 520,
      }),
    )
    return () => {
      animations.forEach((animation) => animation.pause())
    }
  }, [photos])

  const handleReveal = (id: string) => {
    setRevealed((prev) => ({ ...prev, [id]: true }))
    window.requestAnimationFrame(() => {
      const target = photoRefs.current[id]
      if (!target) return
      animate(target, {
        scale: [0.95, 1],
        rotate: [-1.2, 0],
        duration: 480,
        easing: 'easeOutBack',
      })
    })
  }

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>Фото і спогади</h2>
      <div ref={filmstripRef} className={styles.filmstrip} role="list">
        {photos.map((photo) => {
          const isRevealed = !photo.revealable || revealed[photo.id]
          return (
            <figure
              key={photo.id}
              ref={(element) => {
                photoRefs.current[photo.id] = element
              }}
              className={`${styles.photo} ${photo.revealable ? styles.photoSecret : ''} ${
                isRevealed ? styles.photoRevealed : ''
              }`}
            >
              <div className={styles.frame}>
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className={`${styles.image} ${isRevealed ? '' : styles.imageBlurred}`}
                />
                {photo.revealable && !isRevealed && (
                  <button type="button" className={styles.revealButton} onClick={() => handleReveal(photo.id)}>
                    Розкрити
                  </button>
                )}
                <span className={`${styles.perforation} ${styles.perforationTop}`} aria-hidden="true" />
                <span className={`${styles.perforation} ${styles.perforationBottom}`} aria-hidden="true" />
              </div>
              <figcaption className={styles.caption}>
                {isRevealed ? photo.hiddenCaption ?? photo.caption : photo.caption}
              </figcaption>
            </figure>
          )
        })}
      </div>
    </div>
  )
}

export default GalleryPage
