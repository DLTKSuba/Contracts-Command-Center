/// <reference types="vite/client" />

interface Window {
  /** Set by `index-cc.html` before the app bundle loads; enables Command Center floating nav. */
  __COSTPOINT_COMMAND_CENTER_NAV__?: boolean
}

declare module '*.css' {
  const src: string
  export default src
}

declare module '@deltek/harmony-components/styles/*.css' {
  const src: string
  export default src
}

declare module '@harmony-data/icon-manifest.json' {
  const value: {
    cp?: Record<string, { source?: string; svg?: string }>
    vp?: Record<string, { source?: string; svg?: string }>
    ppm?: Record<string, { source?: string; svg?: string }>
    maconomy?: Record<string, { source?: string; svg?: string }>
  }
  export default value
}
