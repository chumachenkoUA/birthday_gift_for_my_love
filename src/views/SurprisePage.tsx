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
  const resultRef = useRef<HTMLParagraphElement | null>(null)

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

  useEffect(() => {
    if (!showResult || !resultRef.current) return
    const animation = animate(resultRef.current, {
      opacity: [0, 1],
      scale: [0.95, 1],
      translateY: [10, 0],
      duration: 520,
      easing: 'easeOutBack',
    })

    return () => {
      animation.pause()
    }
  }, [showResult])

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

  const handleExport = () => {
    const popup = window.open('', '_blank', 'width=600,height=800')
    if (!popup) return
    popup.document.write(`<!doctype html>
<html lang="uk">
<head>
  <meta charset="utf-8" />
  <title>Медична картка любові</title>
  <style>
    body { font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; background:#fff0f6; margin:0; padding:32px; color:#5a2d3a;}
    h1 { text-align:center; }
    .card { background:white; border-radius:24px; padding:24px; box-shadow:0 20px 40px rgba(0,0,0,.08); }
    table { width:100%; border-collapse:collapse; margin-top:16px; }
    th, td { padding:12px 16px; border-bottom:1px solid #f4cfe1; text-align:left; }
    th { width:35%; color:#b13c6b; }
    footer { margin-top:24px; text-align:center; font-weight:600; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Медична картка любові</h1>
    <p><strong>Пацієнт:</strong> ${copy.headerName}</p>
    <p><strong>Діагноз:</strong> Хронічна закоханість у ${copy.headerBeloved}</p>
    <table>
      <tr><th>Симптоми</th><td>${copy.symptoms}</td></tr>
      <tr><th>Лікування</th><td>${copy.treatment}</td></tr>
      <tr><th>Прогноз</th><td>${copy.prognosis}</td></tr>
      <tr><th>Висновок</th><td>${copy.diagnosis}</td></tr>
    </table>
    <footer>Підпис лікаря: ❤️</footer>
  </div>
  <script>
    window.onload = () => { window.focus(); window.print(); };
  </script>
</body>
</html>`)
    popup.document.close()
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
        <button type="button" className={styles.exportButton} onClick={handleExport}>
          📝 Виписати рецепт
        </button>
        {isDiagnosing && (
          <div className={styles.ecg} aria-live="polite">
            <span className={styles.ecgLine} />
          </div>
        )}
        {isDiagnosing && (
          <div className={styles.progressTrack} aria-hidden="true">
            <span className={styles.progressBar} />
          </div>
        )}
        {showResult && (
          <p ref={resultRef} className={styles.result} aria-live="polite">
            {copy.diagnosis}
          </p>
        )}
      </div>
    </div>
  )
}

export default SurprisePage
