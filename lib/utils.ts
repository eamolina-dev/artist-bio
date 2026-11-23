import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { Release } from '@/types/custom-types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function sortReleases(releases: Release[]) {
  const getChronologicalTimestamp = (release: Release) => {
    if (release.release_date) {
      const releaseDate = Date.parse(release.release_date)
      if (!Number.isNaN(releaseDate)) return releaseDate
    }

    if (release.year) {
      const releaseYear = Date.parse(`${release.year}-01-01`)
      if (!Number.isNaN(releaseYear)) return releaseYear
    }

    return Date.parse(release.created_at) || 0
  }

  return [...releases].sort((a, b) => {
    const chronologicalDifference =
      getChronologicalTimestamp(b) - getChronologicalTimestamp(a)
    if (chronologicalDifference !== 0) return chronologicalDifference

    const yearA = Number(a.year)
    const yearB = Number(b.year)
    if (Number.isFinite(yearA) && Number.isFinite(yearB) && yearA !== yearB) {
      return yearB - yearA
    }

    return Date.parse(b.created_at) - Date.parse(a.created_at)
  })
}
