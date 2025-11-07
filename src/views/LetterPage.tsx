import { useEffect, useRef, useState } from 'react'
import { animate } from 'animejs'
import type { AccentSetter } from '../types'
import styles from './LetterPage.module.scss'

type LetterPageProps = {
  onAccentChange: AccentSetter
  letter: string
  audioSrc: string
  smileImage: string
}

const LETTER_ACCENT = '#f9cedf'
const TYPEWRITER_DELAY = 52
const SMILE_DURATION = 6000

const LetterPage = ({ onAccentChange, letter, audioSrc, smileImage }: LetterPageProps) => {
  const [displayedText, setDisplayedText] = useState('')
  const [showSmile, setShowSmile] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const typeTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const smileTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const sheetRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    onAccentChange(LETTER_ACCENT)
    return () => {
      onAccentChange(null)
      if (typeTimerRef.current) {
        clearInterval(typeTimerRef.current)
      }
      if (smileTimerRef.current) {
        clearTimeout(smileTimerRef.current)
      }
    }
  }, [onAccentChange])

  useEffect(() => {
    setDisplayedText('')
    let index = 0

    typeTimerRef.current = setInterval(() => {
      if (index >= letter.length) {
        if (typeTimerRef.current) {
          clearInterval(typeTimerRef.current)
        }
        return
      }
      const nextChar = letter.charAt(index)
      setDisplayedText((prev) => prev + nextChar)
      index += 1
    }, TYPEWRITER_DELAY)

    return () => {
      if (typeTimerRef.current) {
        clearInterval(typeTimerRef.current)
      }
    }
  }, [letter])

  useEffect(() => {
    if (!audioRef.current) return
    const playAudio = () => {
      void audioRef.current?.play().catch(() => undefined)
    }
    playAudio()
  }, [])

  useEffect(() => {
    if (!audioRef.current) return
    audioRef.current.muted = isMuted
  }, [isMuted])

  useEffect(() => {
    if (!sheetRef.current) return
    const animation = animate(sheetRef.current, {
      opacity: [0, 1],
      translateY: [12, 0],
      duration: 620,
      easing: 'easeOutQuad',
    })

    return () => {
      animation.pause()
    }
  }, [])

  const handleSmileReveal = () => {
    if (smileTimerRef.current) {
      clearTimeout(smileTimerRef.current)
    }
    setShowSmile(true)
    smileTimerRef.current = setTimeout(() => {
      setShowSmile(false)
    }, SMILE_DURATION)
  }

  const isDone = displayedText === letter
  const toggleMute = () => {
    setIsMuted((prev) => !prev)
  }

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>Мій лист до тебе</h2>
      <div ref={sheetRef} className={styles.sheet}>
        <p className={styles.typewriter}>
          {displayedText}
          <span className={`${styles.cursor} ${isDone ? styles.cursorDone : ''}`}>|</span>
        </p>
      </div>
      <div className={styles.controlsRow}>
        <button type="button" className={styles.sparkleButton} onClick={handleSmileReveal}>
          ✨ Натисни, якщо хочеш усміхнутись
        </button>
        <button
          type="button"
          className={styles.muteButton}
          onClick={toggleMute}
          aria-pressed={isMuted}
          aria-label={isMuted ? 'Увімкнути звук' : 'Вимкнути звук'}
        >
          {isMuted ? '🔇 Тихий режим' : '🔊 Зі звуком'}
        </button>
      </div>
      {showSmile && (
        <div className={styles.smilePopup} role="status">
          <div className={styles.confettiLayer}>
            {Array.from({ length: 12 }).map((_, index) => (
              <span key={index} className={`${styles.confetti} ${styles[`confetti${(index % 4) + 1}`]}`} />
            ))}
          </div>
          <p>Люблю тебе</p>
          <img src={smileImage} alt="Наша посмішка" loading="lazy" decoding="async" />
        </div>
      )}
      <audio ref={audioRef} src={audioSrc} loop className={styles.srOnly} />
    </div>
  )
}

export default LetterPage
