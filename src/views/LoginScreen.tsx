import { useEffect, useRef } from 'react'
import type { KeyboardEvent } from 'react'
import { animate, createTimeline } from 'animejs'
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
  const introRef = useRef<HTMLDivElement | null>(null)
  const formRef = useRef<HTMLDivElement | null>(null)
  const errorRef = useRef<HTMLParagraphElement | null>(null)
  const pulseRef = useRef<ReturnType<typeof animate> | null>(null)
  const heartSequenceRef = useRef<ReturnType<typeof createTimeline> | null>(null)
  const entryTimelineRef = useRef<ReturnType<typeof createTimeline> | null>(null)

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
    const portal = portalRef.current
    const intro = introRef.current
    const form = formRef.current
    if (!portal || !intro || !form) return

    const introElements = Array.from(intro.children)
    entryTimelineRef.current?.pause()

    entryTimelineRef.current = createTimeline({
      autoplay: true,
    })
      .add(portal, {
        opacity: [0, 1],
        translateY: [-10, 0],
        scale: [0.92, 1],
        duration: 560,
        easing: 'easeOutQuad',
      })
      .add(
        introElements,
        {
          opacity: [0, 1],
          translateY: [16, 0],
          duration: 420,
          delay: (_element: unknown, index: number) => index * 90,
          easing: 'easeOutQuad',
        },
        '-=260',
      )
      .add(
        form,
        {
          opacity: [0, 1],
          translateY: [22, 0],
          duration: 520,
          easing: 'easeOutQuad',
        },
        '-=160',
      )

    return () => {
      entryTimelineRef.current?.pause()
      entryTimelineRef.current = null
    }
  }, [])

  useEffect(() => {
    const heart = heartRef.current
    const portal = portalRef.current
    if (!heart || !portal) return

    if (isHeartLit) {
      heartSequenceRef.current?.pause()
      pulseRef.current?.pause()

      heartSequenceRef.current = createTimeline({
        autoplay: true,
      })
        .add(heart, {
          scale: [0.94, 1.12],
          duration: 420,
          easing: 'easeOutBack',
        })
        .add(
          portal,
          {
            boxShadow: [
              '0 22px 55px rgba(242, 120, 162, 0.32)',
              '0 55px 110px rgba(242, 120, 162, 0.55)',
            ],
            scale: [1, 1.08],
            duration: 520,
            easing: 'easeOutQuad',
          },
          '-=300',
        )

      pulseRef.current = animate(heart, {
        scale: [1.05, 1.16],
        direction: 'alternate',
        duration: 1400,
        delay: 180,
        easing: 'easeInOutSine',
        loop: true,
      })
    } else {
      pulseRef.current?.pause()
      heartSequenceRef.current?.pause()
      pulseRef.current = null
      heartSequenceRef.current = createTimeline({
        autoplay: true,
      })
        .add(heart, {
          scale: 1,
          duration: 360,
          easing: 'easeOutQuad',
        })
        .add(
          portal,
          {
            boxShadow: '0 22px 55px rgba(242, 120, 162, 0.32)',
            scale: 1,
            duration: 360,
            easing: 'easeOutQuad',
          },
          '-=320',
        )
    }

    return () => {
      pulseRef.current?.pause()
      heartSequenceRef.current?.pause()
      pulseRef.current = null
      heartSequenceRef.current = null
    }
  }, [isHeartLit])

  useEffect(() => {
    if (!showGreeting || !greetingRef.current) return
    const animation = animate(greetingRef.current, {
      keyframes: [
        { opacity: 0, translateY: 12, scale: 0.94 },
        { opacity: 1, translateY: 0, scale: 1 },
      ],
      duration: 620,
      easing: 'easeOutBack',
    })

    return () => {
      animation.pause()
    }
  }, [showGreeting])

  useEffect(() => {
    if (!errorMessage || !errorRef.current) return
    const animation = animate(errorRef.current, {
      opacity: [0, 1],
      translateY: [-6, 0],
      duration: 320,
      easing: 'easeOutQuad',
    })

    return () => {
      animation.pause()
    }
  }, [errorMessage])

  return (
    <div className={styles.loginScreen}>
      <div ref={portalRef} className={`${styles.heartPortal} ${isHeartLit ? styles.heartPortalLit : ''}`}>
        <HeartIcon ref={heartRef} lit={isHeartLit} />
      </div>
      <div ref={introRef} className={styles.intro}>
        <h1 className={styles.title}>Назви нашу особливу дату</h1>
        <p className={styles.hint}>Введи її у форматі дд.мм.рррр — і серце загориться.</p>
      </div>
      <div ref={formRef} className={styles.inputRow}>
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
      {errorMessage && (
        <p ref={errorRef} className={styles.errorMessage}>
          {errorMessage}
        </p>
      )}
      {showGreeting && (
        <p ref={greetingRef} className={styles.greeting}>
          Вітаю, моя кохана 💖
        </p>
      )}
    </div>
  )
}

export default LoginScreen
