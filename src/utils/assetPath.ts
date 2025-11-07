export const withBase = (assetPath: string) => {
  const base = import.meta.env.BASE_URL ?? '/'
  const normalized = assetPath.replace(/^\/+/, '')
  return `${base}${normalized}`
}

export const assetUrl = withBase
