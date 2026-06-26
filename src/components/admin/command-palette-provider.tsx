'use client'

import { CommandPalette } from './command-palette'

export function CommandPaletteProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CommandPalette />
      {children}
    </>
  )
}
