import { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { animate } from 'animejs'
import './App.scss'
import { galleryPhotos, letterContent, menuItems, SECRET_DATE, songs, surpriseCopy } from './data/content'
import type { MenuItem, MenuTarget, View } from './types'
import NavigationTabs from './components/NavigationTabs'
import LoginScreen from './views/LoginScreen'
import { withBase } from './utils/assetPath'

const LetterPage = lazy(() => import('./views/LetterPage'))
const MusicPage = lazy(() => import('./views/MusicPage'))
const GalleryPage = lazy(() => import('./views/GalleryPage'))
const SurprisePage = lazy(() => import('./views/SurprisePage'))

const LETTER_AUDIO = withBase('audio/piano.mp3')
const SMILE_IMAGE = withBase('photos/smile.jpg')
const SECRET_ITEM: MenuItem = {
  id: 'surprise',
  label: '💖 Секретний кабінет',
  note: 'Відкривається після двох розділів',
}

function App() {
  const [view, setView] = useState<View>('login')
  const [dateInput, setDateInput] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isHeartLit, setIsHeartLit] = useState(false)
  const [showGreeting, setShowGreeting] = useState(false)
  const [accentColor, setAccentColor] = useState<string | null>(null)
  const [isLocked, setIsLocked] = useState(false)
  const [focusSignal, setFocusSignal] = useState(0)
  const [visited, setVisited] = useState<Record<MenuTarget, boolean>>({
    letter: false,
    music: false,
    gallery: false,
    surprise: false,
  })
  const timersRef = useRef<Array<ReturnType<typeof setTimeout>>>([])
  const lockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const contentRef = useRef<HTMLDivElement | null>(null)

  const digitsInSecret = useMemo(() => SECRET_DATE.replace(/\D/g, '').length, [])

  useEffect(() => {
    return () => {
      timersRef.current.forEach(clearTimeout)
      if (lockTimerRef.current) {
        clearTimeout(lockTimerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (view === 'login') {
      setAccentColor(null)
    } else {
      setVisited((prev) => (prev[view] ? prev : { ...prev, [view]: true }))
    }
  }, [view])

  const unlockedCoreCount = useMemo(() => {
    const keys: Array<Exclude<MenuTarget, 'surprise'>> = ['letter', 'music', 'gallery']
    return keys.filter((key) => visited[key]).length
  }, [visited])

  const canShowSecret = unlockedCoreCount >= 2

  useEffect(() => {
    if (view === 'surprise' && !canShowSecret) {
      setView(menuItems[0].id)
    }
  }, [canShowSecret, view])

  const formatDateInput = useCallback((value: string) => {
    const digitsOnly = value.replace(/\D/g, '').slice(0, 8)
    const parts: string[] = []
    if (digitsOnly.length > 0) {
      parts.push(digitsOnly.slice(0, 2))
    }
    if (digitsOnly.length >= 3) {
      parts.push(digitsOnly.slice(2, 4))
    }
    if (digitsOnly.length >= 5) {
      parts.push(digitsOnly.slice(4, 8))
    }
    return parts.join('.')
  }, [])

  const handleDateChange = useCallback(
    (value: string) => {
      setDateInput(formatDateInput(value))
      setErrorMessage('')
      setShowGreeting(false)
      setIsHeartLit(false)
    },
    [formatDateInput],
  )

  const resetTimers = () => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
  }

  const handleAccess = useCallback(() => {
    if (isLocked) {
      return
    }
    const preparedInput = dateInput.replace(/\D/g, '')
    const target = SECRET_DATE.replace(/\D/g, '')

    if (preparedInput === target) {
      setErrorMessage('')
      resetTimers()
      setIsHeartLit(true)

      timersRef.current.push(
        setTimeout(() => {
          setShowGreeting(true)
        }, 600),
      )

      timersRef.current.push(
        setTimeout(() => {
          setView(menuItems[0].id)
          setDateInput('')
          setShowGreeting(false)
          setIsHeartLit(false)
        }, 2400),
      )
    } else {
      setErrorMessage('Ой, здається, дата не збігається. Спробуй ще раз ❤️')
      setIsHeartLit(false)
      setShowGreeting(false)
      setFocusSignal((prev) => prev + 1)
      setIsLocked(true)
      if (lockTimerRef.current) {
        clearTimeout(lockTimerRef.current)
      }
      lockTimerRef.current = setTimeout(() => {
        setIsLocked(false)
      }, 1800)
    }
  }, [dateInput, isLocked])

  const handleSubmitKey = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        event.preventDefault()
        handleAccess()
      }
    },
    [handleAccess],
  )

  const handleSelectTab = useCallback((target: MenuTarget) => {
    setView(target)
  }, [])

  const accentStyle = useMemo(
    () =>
      accentColor
        ? {
            background: `linear-gradient(140deg, rgba(255, 233, 243, 0.95) 0%, ${accentColor} 100%)`,
          }
        : undefined,
    [accentColor],
  )

  const canSubmit = dateInput.replace(/\D/g, '').length === digitsInSecret

  useEffect(() => {
    if (view === 'login') return
    const container = contentRef.current
    if (!container) return
    container.style.opacity = '0'
    const animation = animate(container, {
      opacity: [0, 1],
      translateY: [14, 0],
      duration: 520,
      easing: 'easeOutQuad',
    })

    return () => {
      animation.pause()
    }
  }, [view])

  const tabs = useMemo(() => (canShowSecret ? [...menuItems, SECRET_ITEM] : menuItems), [canShowSecret])

  const renderContent = () => {
    switch (view) {
      case 'letter':
        return (
          <LetterPage
            letter={letterContent}
            audioSrc={LETTER_AUDIO}
            smileImage={SMILE_IMAGE}
            onAccentChange={setAccentColor}
          />
        )
      case 'music':
        return <MusicPage songs={songs} onAccentChange={setAccentColor} />
      case 'gallery':
        return <GalleryPage photos={galleryPhotos} onAccentChange={setAccentColor} />
      case 'surprise':
        return <SurprisePage copy={surpriseCopy} onAccentChange={setAccentColor} />
      default:
        return null
    }
  }

  return (
    <div className="appShell" style={accentStyle}>
      {view === 'login' ? (
        <LoginScreen
          dateInput={dateInput}
          onDateChange={handleDateChange}
          onSubmit={handleAccess}
          onInputKeyDown={handleSubmitKey}
          isHeartLit={isHeartLit}
          errorMessage={errorMessage}
          showGreeting={showGreeting}
          canSubmit={canSubmit}
          isLocked={isLocked}
          focusSignal={focusSignal}
        />
      ) : (
        <div className="mainLayout">
          <NavigationTabs
            active={view}
            items={tabs}
            onSelect={handleSelectTab}
            getPanelId={(target) => `tab-panel-${target}`}
          />
          <div
            ref={contentRef}
            className="tabContent"
            role="tabpanel"
            id={`tab-panel-${view}`}
            aria-labelledby={`tab-${view}`}
          >
            <Suspense fallback={<div className="tabLoader">Завантаження любові...</div>}>{renderContent()}</Suspense>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
