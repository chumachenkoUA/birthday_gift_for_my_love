import { useEffect, useRef } from 'react'
import type { KeyboardEvent } from 'react'
import { animate } from 'animejs'
import HeartIcon from '../components/HeartIcon'
import styles from './LoginScreen.module.scss'

type LoginScreenProps = {
  dateInput: string
  onDateChange: (value: string) => void
  onSubmit: () => void
  onInputKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void
  isHeartLit: boolean
  errorMessage: string
  showGreeting: boolean
  canSubmit: boolean
}

const LoginScreen = ({
  dateInput,
  onDateChange,
  onSubmit,
  onInputKeyDown,
  isHeartLit,
  errorMessage,
  showGreeting,
  canSubmit,
}: LoginScreenProps) => {
  const portalRef = useRef<HTMLDivElement | null>(null)
  const heartRef = useRef<SVGSVGElement | null>(null)
  const greetingRef = useRef<HTMLParagraphElement | null>(null)
  const pulseRef = useRef<ReturnType<typeof animate> | null>(null)
  const glowRef = useRef<ReturnType<typeof animate> | null>(null)

  useEffect(() => {
    if (!portalRef.current) return
    const idle = animate(portalRef.current, {
      scale: [0.97, 1.03],
      duration: 2600,
      direction: 'alternate',
      easing: 'easeInOutSine',
      loop: true,
    })

    return () => {
      idle.pause()
    }
  }, [])

  useEffect(() => {
    const heart = heartRef.current
    const portal = portalRef.current
    if (!heart || !portal) return

    if (isHeartLit) {
      glowRef.current?.pause()
      pulseRef.current?.pause()

      animate(heart, {
        scale: [0.94, 1.18],
        duration: 700,
        easing: 'easeOutElastic(1, .6)',
      })

      glowRef.current = animate(portal, {
        boxShadow: [
          '0 22px 55px rgba(242, 120, 162, 0.32)',
          '0 50px 95px rgba(242, 120, 162, 0.55)',
        ],
        scale: [1, 1.08],
        duration: 520,
        easing: 'easeOutQuad',
      })

      pulseRef.current = animate(heart, {
        scale: [1.08, 1.18],
        direction: 'alternate',
        duration: 950,
        easing: 'easeInOutSine',
        loop: true,
      })
    } else {
      pulseRef.current?.pause()
      glowRef.current?.pause()
      pulseRef.current = null
      glowRef.current = null

      animate(heart, {
        scale: 1,
        duration: 320,
        easing: 'easeOutQuad',
      })

      animate(portal, {
        boxShadow: '0 22px 55px rgba(242, 120, 162, 0.32)',
        scale: 1,
        duration: 320,
        easing: 'easeOutQuad',
      })
    }

    return () => {
      pulseRef.current?.pause()
      glowRef.current?.pause()
      pulseRef.current = null
      glowRef.current = null
    }
  }, [isHeartLit])

  useEffect(() => {
    if (!showGreeting || !greetingRef.current) return
    const animation = animate(greetingRef.current, {
      translateY: [12, 0],
      opacity: [0, 1],
      duration: 620,
      easing: 'easeOutQuad',
    })

    return () => {
      animation.pause()
    }
  }, [showGreeting])

  return (
    <div className={styles.loginScreen}>
      <div ref={portalRef} className={`${styles.heartPortal} ${isHeartLit ? styles.heartPortalLit : ''}`}>
        <HeartIcon ref={heartRef} lit={isHeartLit} />
      </div>
      <h1 className={styles.title}>Назви нашу особливу дату</h1>
      <p className={styles.hint}>Введи її у форматі дд.мм.рррр — і серце загориться.</p>
      <div className={styles.inputRow}>
        <input
          value={dateInput}
          onChange={(event) => onDateChange(event.target.value)}
          onKeyDown={onInputKeyDown}
          placeholder="дд.мм.рррр"
          inputMode="numeric"
          maxLength={10}
          className={styles.input}
        />
        <button type="button" onClick={onSubmit} disabled={!canSubmit} className={styles.submitButton}>
          Відкрити
        </button>
      </div>
      {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
      {showGreeting && (
        <p ref={greetingRef} className={styles.greeting}>
          Вітаю, моя кохана 💖
        </p>
      )}
    </div>
  )
}

export default LoginScreen
