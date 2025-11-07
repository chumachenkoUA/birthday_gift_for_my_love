import { useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import type { AccentSetter, Song } from '../types'
import styles from './MusicPage.module.scss'

type MusicPageProps = {
  songs: Song[]
  onAccentChange: AccentSetter
}

const LINE_INTERVAL = 16000

const MusicPage = ({ songs, onAccentChange }: MusicPageProps) => {
  const anthem = songs[0]
  const lines = anthem?.lines ?? []
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentLineIndex, setCurrentLineIndex] = useState(0)
  const [showHeart, setShowHeart] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const lineTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

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
      setCurrentLineIndex(0)
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

  useEffect(() => {
    if (!lines.length || !isPlaying) {
      if (lineTimerRef.current) {
        clearInterval(lineTimerRef.current)
      }
      return
    }

    lineTimerRef.current = setInterval(() => {
      setCurrentLineIndex((prev) => (prev + 1) % lines.length)
    }, LINE_INTERVAL)

    return () => {
      if (lineTimerRef.current) {
        clearInterval(lineTimerRef.current)
      }
    }
  }, [isPlaying, lines.length])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) {
      audio.pause()
    } else {
      void audio.play().catch(() => undefined)
    }
  }

  const displayedLine = lines[currentLineIndex] ?? anthem?.memory ?? 'Наша мелодія про кохання'

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
        <button type="button" className={styles.playButton} onClick={togglePlay} aria-pressed={isPlaying}>
          <span>{isPlaying ? 'Пауза' : 'Play'}</span>
        </button>
        <audio ref={audioRef} src={anthem.audio} preload="auto">
          Ваш браузер не підтримує відтворення аудіо.
        </audio>
        <div className={styles.lineTicker} aria-live="polite">
          <span className={styles.lineText}>{displayedLine}</span>
        </div>
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
