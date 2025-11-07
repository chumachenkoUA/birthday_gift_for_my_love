import { useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import type { AccentSetter, Song } from '../types'
import styles from './MusicPage.module.scss'

type MusicPageProps = {
  songs: Song[]
  onAccentChange: AccentSetter
}

const MusicPage = ({ songs, onAccentChange }: MusicPageProps) => {
  const anthem = songs[0]
  const coverImage = anthem?.image ?? '/photos/eve-ghost-avenue.jpg'
  const [isPlaying, setIsPlaying] = useState(false)
  const [showHeart, setShowHeart] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const accentStyle = useMemo(
    () => ({ '--anthem-color': anthem?.color ?? '#f8bcd8' } as CSSProperties),
    [anthem],
  )

  useEffect(() => {
    if (!anthem) return
    onAccentChange(anthem.color)
    return () => {
      onAccentChange(null)
    }
  }, [anthem, onAccentChange])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handlePlay = () => {
      setIsPlaying(true)
      setShowHeart(false)
    }

    const handlePause = () => {
      setIsPlaying(false)
    }

    const handleEnded = () => {
      setIsPlaying(false)
      setShowHeart(true)
    }

    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) {
      audio.pause()
    } else {
      void audio.play().catch(() => undefined)
    }
  }

  if (!anthem) {
    return null
  }

  return (
    <div className={styles.page} style={accentStyle} data-playing={isPlaying}>
      <div className={styles.overlay} aria-hidden="true" />
      <div className={styles.content}>
        <p className={styles.label}>Пісня, що нагадує мені тебе</p>
        <h2 className={styles.title}>{anthem.title}</h2>
        <p className={styles.subtitle}>{anthem.memory}</p>
        <div className={styles.recordPlayer}>
          <span
            className={`${styles.tonearm} ${isPlaying ? styles.tonearmActive : ''}`}
            aria-hidden="true"
          />
          <button
            type="button"
            className={`${styles.recordButton} ${isPlaying ? styles.recordButtonSpinning : ''}`}
            onClick={togglePlay}
            aria-pressed={isPlaying}
            aria-label={isPlaying ? 'Пауза' : 'Відтворити'}
          >
            <span className={styles.recordDisc}>
              <span className={styles.recordGrooves} aria-hidden="true" />
              <span className={styles.recordLabel}>
                <img src={coverImage} alt="Обкладинка треку" loading="lazy" decoding="async" />
              </span>
            </span>
            <span className={`${styles.recordBadge} ${isPlaying ? styles.recordBadgeActive : ''}`}>
              {isPlaying ? '⏸' : '▶'}
            </span>
          </button>
        </div>
        <audio ref={audioRef} src={anthem.audio} preload="auto">
          Ваш браузер не підтримує відтворення аудіо.
        </audio>
        {showHeart && (
          <div className={styles.endingHeart} aria-live="polite">
            <span />
          </div>
        )}
      </div>
    </div>
  )
}

export default MusicPage
