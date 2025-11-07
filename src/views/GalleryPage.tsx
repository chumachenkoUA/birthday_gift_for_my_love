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
  const [activeIndex, setActiveIndex] = useState(0)
  const cardRef = useRef<HTMLElement | null>(null)
  const isSwitchingRef = useRef(false)
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    onAccentChange(GALLERY_ACCENT)
    return () => {
      onAccentChange(null)
    }
  }, [onAccentChange])

  useEffect(() => {
    if (!cardRef.current) return
    const animation = animate(cardRef.current, {
      translateY: [16, 0],
      opacity: [0, 1],
      easing: 'easeOutQuad',
      duration: 420,
      complete: () => {
        isSwitchingRef.current = false
      },
    })
    return () => {
      animation.pause()
    }
  }, [activeIndex])

  useEffect(() => {
    if (activeIndex >= photos.length) {
      setActiveIndex(0)
    }
  }, [activeIndex, photos.length])

  useEffect(() => {
    return () => {
      if (holdTimerRef.current) {
        clearTimeout(holdTimerRef.current)
      }
    }
  }, [])

  const currentPhoto = photos[activeIndex]
  const totalPhotos = photos.length
  const handleReveal = (id: string) => {
    setRevealed((prev) => ({ ...prev, [id]: true }))
    window.requestAnimationFrame(() => {
      if (!cardRef.current) return
      animate(cardRef.current, {
        scale: [0.95, 1],
        rotate: [-1.2, 0],
        duration: 480,
        easing: 'easeOutBack',
      })
    })
  }

  const handleRevealPressStart = (id: string) => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current)
    }
    holdTimerRef.current = setTimeout(() => {
      handleReveal(id)
      holdTimerRef.current = null
    }, 450)
  }

  const handleRevealPressEnd = (id: string) => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current)
      holdTimerRef.current = null
      handleReveal(id)
    }
  }

  const cancelRevealHold = () => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current)
      holdTimerRef.current = null
    }
  }

  const changeSlide = (step: number) => {
    if (totalPhotos <= 1 || isSwitchingRef.current) return
    const node = cardRef.current
    if (!node) {
      setActiveIndex((prev) => (prev + step + totalPhotos) % totalPhotos)
      return
    }
    isSwitchingRef.current = true
    animate(node, {
      opacity: [1, 0],
      translateX: step > 0 ? [0, -18] : [0, 18],
      duration: 220,
      easing: 'easeInQuad',
      complete: () => {
        setActiveIndex((prev) => (prev + step + totalPhotos) % totalPhotos)
      },
    })
  }

  const goToPrev = () => changeSlide(-1)

  const goToNext = () => changeSlide(1)

  const isRevealed = !currentPhoto.revealable || revealed[currentPhoto.id]

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>Фото і спогади</h2>
      <div className={styles.viewer}>
        <button
          type="button"
          className={`${styles.navButton} ${styles.navButtonPrev}`}
          onClick={goToPrev}
          disabled={totalPhotos <= 1}
          aria-label="Попереднє фото"
        >
          ‹
        </button>
        <figure
          ref={(element) => {
            cardRef.current = element
          }}
          className={`${styles.photo} ${currentPhoto.revealable ? styles.photoSecret : ''} ${
            isRevealed ? styles.photoRevealed : ''
          }`}
        >
          <div className={styles.frame}>
            <img
              src={currentPhoto.src}
              alt={currentPhoto.alt}
              loading="lazy"
              decoding="async"
              className={`${styles.image} ${isRevealed ? '' : styles.imageBlurred}`}
            />
            {currentPhoto.revealable && !isRevealed && (
              <button
                type="button"
                className={styles.revealButton}
                onClick={() => handleReveal(currentPhoto.id)}
                onPointerDown={() => handleRevealPressStart(currentPhoto.id)}
                onPointerUp={() => handleRevealPressEnd(currentPhoto.id)}
                onPointerLeave={cancelRevealHold}
                aria-label="Розкрити приховану історію"
              >
                Розкрити
                <span className={styles.secretHint}>Торкнись і утримуй</span>
              </button>
            )}
            <span className={`${styles.perforation} ${styles.perforationTop}`} aria-hidden="true" />
            <span className={`${styles.perforation} ${styles.perforationBottom}`} aria-hidden="true" />
          </div>
          <figcaption className={styles.caption}>
            {isRevealed ? currentPhoto.hiddenCaption ?? currentPhoto.caption : currentPhoto.caption}
          </figcaption>
        </figure>
        <button
          type="button"
          className={`${styles.navButton} ${styles.navButtonNext}`}
          onClick={goToNext}
          disabled={totalPhotos <= 1}
          aria-label="Наступне фото"
        >
          ›
        </button>
      </div>
      <p className={styles.counter}>
        Фото {activeIndex + 1} / {totalPhotos}
      </p>
    </div>
  )
}

export default GalleryPage
