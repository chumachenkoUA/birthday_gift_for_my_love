import { useEffect, useRef, useState } from 'react'
import { animate } from 'animejs'
import type { AccentSetter } from '../types'
import styles from './SurprisePage.module.scss'

type SurpriseCopy = {
  headerName: string
  headerBeloved: string
  symptoms: string
  treatment: string
  prognosis: string
  diagnosis: string
}

type SurprisePageProps = {
  onAccentChange: AccentSetter
  copy: SurpriseCopy
}

const SURPRISE_ACCENT = '#ffd1dc'
const DIAGNOSIS_DURATION = 2600

const SurprisePage = ({ onAccentChange, copy }: SurprisePageProps) => {
  const [isDiagnosing, setIsDiagnosing] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const diagnoseTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const cardRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    onAccentChange(SURPRISE_ACCENT)
    return () => {
      onAccentChange(null)
      if (diagnoseTimer.current) {
        clearTimeout(diagnoseTimer.current)
      }
    }
  }, [onAccentChange])

  useEffect(() => {
    if (!cardRef.current) return
    const animation = animate(cardRef.current, {
      opacity: [0, 1],
      translateY: [18, 0],
      duration: 580,
      easing: 'easeOutQuad',
    })

    return () => {
      animation.pause()
    }
  }, [])

  const runDiagnosis = () => {
    if (isDiagnosing) return
    setIsDiagnosing(true)
    setShowResult(false)
    if (diagnoseTimer.current) {
      clearTimeout(diagnoseTimer.current)
    }
    diagnoseTimer.current = setTimeout(() => {
      setShowResult(true)
      setIsDiagnosing(false)
    }, DIAGNOSIS_DURATION)
  }

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>Медична картка любові</h2>
      <div ref={cardRef} className={styles.card}>
        <header className={styles.header}>
          <h3>Медична карта пацієнта: {copy.headerName}</h3>
          <p>Діагноз: Хронічна закоханість у {copy.headerBeloved} 💘</p>
        </header>
        <table className={styles.table}>
          <tbody>
            <tr>
              <th scope="row">Симптоми</th>
              <td>{copy.symptoms}</td>
            </tr>
            <tr>
              <th scope="row">Лікування</th>
              <td>{copy.treatment}</td>
            </tr>
            <tr>
              <th scope="row">Прогноз</th>
              <td>{copy.prognosis}</td>
            </tr>
          </tbody>
        </table>
        <button type="button" className={styles.diagnoseButton} onClick={runDiagnosis} disabled={isDiagnosing}>
          {isDiagnosing ? 'Діагностика...' : '🧠 Провести діагностику'}
        </button>
        {isDiagnosing && (
          <div className={styles.ecg} aria-live="polite">
            <span className={styles.ecgLine} />
          </div>
        )}
        {showResult && <p className={styles.result}>{copy.diagnosis}</p>}
      </div>
    </div>
  )
}

export default SurprisePage
