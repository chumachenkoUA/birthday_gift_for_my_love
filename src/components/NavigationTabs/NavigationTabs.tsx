import { useCallback, useEffect, useRef } from 'react'
import { animate } from 'animejs'
import type { MenuItem, MenuTarget } from '../../types'
import styles from './NavigationTabs.module.scss'

export type NavigationTabsProps = {
  items: MenuItem[]
  active: MenuTarget
  onSelect: (target: MenuTarget) => void
  getPanelId?: (target: MenuTarget) => string
}

const NavigationTabs = ({ items, active, onSelect, getPanelId }: NavigationTabsProps) => {
  const indicatorRef = useRef<HTMLSpanElement | null>(null)
  const tabsRef = useRef<Array<HTMLButtonElement | null>>([])
  const entryAnimationsRef = useRef<Array<ReturnType<typeof animate>>>([])

  const animateIndicator = useCallback(() => {
    const indicator = indicatorRef.current
    if (!indicator) return

    const activeIndex = items.findIndex((item) => item.id === active)
    const activeTab = tabsRef.current[activeIndex]
    if (!activeTab || !activeTab.parentElement) return

    const tabRect = activeTab.getBoundingClientRect()
    const parentRect = activeTab.parentElement.getBoundingClientRect()
    const translateX = tabRect.left - parentRect.left
    const width = tabRect.width

    indicator.style.setProperty('opacity', '1')

    animate(indicator, {
      translateX,
      width,
      duration: 380,
      easing: 'easeOutQuad',
    })
  }, [active, items])

  useEffect(() => {
    animateIndicator()
  }, [animateIndicator])

  useEffect(() => {
    const handleResize = () => {
      animateIndicator()
    }
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [animateIndicator])

  useEffect(() => {
    const tabs = tabsRef.current.filter((tab): tab is HTMLButtonElement => Boolean(tab))
    if (!tabs.length) return

    entryAnimationsRef.current.forEach((animation) => animation.pause())
    entryAnimationsRef.current = tabs.map((tab, index) =>
      animate(tab, {
        opacity: [0, 1],
        translateY: [10, 0],
        duration: 420,
        delay: index * 80,
        easing: 'easeOutQuad',
      }),
    )

    return () => {
      entryAnimationsRef.current.forEach((animation) => animation.pause())
      entryAnimationsRef.current = []
    }
  }, [items])

  useEffect(() => {
    const activeIndex = items.findIndex((item) => item.id === active)
    const activeTab = tabsRef.current[activeIndex]
    if (!activeTab) return

    const animation = animate(activeTab, {
      keyframes: [
        { scale: 0.98, opacity: 0.85 },
        { scale: 1.02, opacity: 1 },
        { scale: 1, opacity: 1 },
      ],
      duration: 420,
      easing: 'easeOutQuad',
    })

    return () => {
      animation.pause()
    }
  }, [active, items])

  return (
    <div className={styles.tabsWrapper}>
      <div className={styles.tabs} role="tablist" aria-orientation="horizontal">
        <span ref={indicatorRef} className={styles.indicator} />
        {items.map((item, index) => {
          const isActive = item.id === active
          const tabId = `tab-${item.id}`
          const controlsId = getPanelId?.(item.id)
          return (
            <button
              type="button"
              key={item.id}
              ref={(element) => {
                tabsRef.current[index] = element
              }}
              className={`${styles.tab} ${isActive ? styles.tabActive : ''}`}
              onClick={() => onSelect(item.id)}
              role="tab"
              id={tabId}
              aria-selected={isActive}
              aria-controls={controlsId}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className={styles.label}>{item.label}</span>
              <span className={styles.note}>{item.note}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default NavigationTabs
