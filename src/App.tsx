import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import './App.scss'
import { galleryPhotos, letterContent, menuItems, SECRET_DATE, songs, surpriseCopy } from './data/content'
import type { MenuTarget, View } from './types'
import NavigationTabs from './components/NavigationTabs'
import LoginScreen from './views/LoginScreen'
import LetterPage from './views/LetterPage'
import MusicPage from './views/MusicPage'
import GalleryPage from './views/GalleryPage'
import SurprisePage from './views/SurprisePage'

const LETTER_AUDIO = '/audio/piano.mp3'
const SMILE_IMAGE = '/photos/smile.jpg'

function App() {
  const [view, setView] = useState<View>('login')
  const [dateInput, setDateInput] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isHeartLit, setIsHeartLit] = useState(false)
  const [showGreeting, setShowGreeting] = useState(false)
  const [accentColor, setAccentColor] = useState<string | null>(null)
  const timersRef = useRef<Array<ReturnType<typeof setTimeout>>>([])

  const digitsInSecret = useMemo(() => SECRET_DATE.replace(/\D/g, '').length, [])

  useEffect(() => {
    return () => {
      timersRef.current.forEach(clearTimeout)
    }
  }, [])

  useEffect(() => {
    if (view === 'login') {
      setAccentColor(null)
    }
  }, [view])

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
    }
  }, [dateInput])

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
        />
      ) : (
        <div className="mainLayout">
          <NavigationTabs active={view} items={menuItems} onSelect={handleSelectTab} />
          <div className="tabContent">{renderContent()}</div>
        </div>
      )}
    </div>
  )
}

export default App
