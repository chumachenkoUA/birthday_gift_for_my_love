import { useEffect, useRef, useState } from 'react'
import { animate } from 'animejs'
import type { AccentSetter, Song } from '../types'
import styles from './MusicPage.module.scss'

type MusicPageProps = {
  songs: Song[]
  onAccentChange: AccentSetter
}

const MusicPage = ({ songs, onAccentChange }: MusicPageProps) => {
  const [activeSong, setActiveSong] = useState<Song>(songs[0])
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const playerRef = useRef<HTMLDivElement | null>(null)
  const tracksRef = useRef<HTMLDivElement | null>(null)
  const trackAnimationsRef = useRef<Array<ReturnType<typeof animate>>>([])

  useEffect(() => {
    onAccentChange(activeSong.color)
  }, [activeSong, onAccentChange])

  useEffect(() => {
    return () => {
      onAccentChange(null)
    }
  }, [onAccentChange])

  useEffect(() => {
    if (!playerRef.current) return
    playerRef.current.style.opacity = '0'
    const animation = animate(playerRef.current, {
      translateY: [-6, 0],
      opacity: [0, 1],
      duration: 520,
      easing: 'easeOutQuad',
    })

    return () => {
      animation.pause()
    }
  }, [])

  useEffect(() => {
    if (!playerRef.current) return
    const animation = animate(playerRef.current, {
      keyframes: [
        { opacity: 0.4, translateY: 12 },
        { opacity: 1, translateY: 0 },
      ],
      duration: 420,
      easing: 'easeOutQuad',
    })

    return () => {
      animation.pause()
    }
  }, [activeSong])

  useEffect(() => {
    if (!tracksRef.current) return
    const cards = Array.from(tracksRef.current.querySelectorAll('button'))
    if (!cards.length) return

    trackAnimationsRef.current.forEach((animation) => animation.pause())
    trackAnimationsRef.current = cards.map((card, index) =>
      animate(card, {
        opacity: [0, 1],
        translateY: [14, 0],
        duration: 420,
        delay: index * 80,
        easing: 'easeOutQuad',
      }),
    )

    return () => {
      trackAnimationsRef.current.forEach((animation) => animation.pause())
      trackAnimationsRef.current = []
    }
  }, [songs])

  useEffect(() => {
    if (!audioRef.current) {
      return
    }
    void audioRef.current.play().catch(() => undefined)
  }, [activeSong])

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>Плеєр спогадів</h2>
      <div className={styles.layout}>
        <div ref={tracksRef} className={styles.tracks}>
          {songs.map((song) => (
            <button
              type="button"
              key={song.id}
              className={`${styles.songCard} ${song.id === activeSong.id ? styles.songCardActive : ''}`}
              onClick={() => setActiveSong(song)}
            >
              <div className={styles.songCover} style={{ backgroundImage: `url(${song.image})` }} aria-hidden="true" />
              <div className={styles.songInfo}>
                <strong>{song.title}</strong>
                <span>{song.memory}</span>
              </div>
            </button>
          ))}
        </div>
        <div ref={playerRef} className={styles.player}>
          <p className={styles.now}>Зараз грає:</p>
          <h3 className={styles.songTitle}>{activeSong.title}</h3>
          <p className={styles.memory}>{activeSong.memory}</p>
          <audio
            ref={audioRef}
            key={activeSong.audio}
            className={styles.audio}
            controls
            autoPlay
            src={activeSong.audio}
          >
            Ваш браузер не підтримує відтворення аудіо.
          </audio>
        </div>
      </div>
    </div>
  )
}

export default MusicPage
