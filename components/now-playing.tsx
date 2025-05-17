"use client"

import { useEffect, useState, useCallback } from "react"
import { Music, Clock, ExternalLink } from "lucide-react"
import Image from "next/image"

type NowPlayingResponse = {
  isPlaying: boolean
  title?: string
  artist?: string
  album?: string
  albumImageUrl?: string
  songUrl?: string
  isRecent?: boolean
  error?: string
}

const MAX_RETRIES = 3
const RETRY_DELAY = 2000 // 2 seconds

export default function NowPlaying() {
  const [data, setData] = useState<NowPlayingResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  const fetchNowPlaying = useCallback(async (retry = 0) => {
    try {
      setLoading(true)
      const timestamp = new Date().getTime()
      const res = await fetch(`/api/spotify?t=${timestamp}`, {
        cache: "no-store",
        next: { revalidate: 0 },
      })

      if (!res.ok) {
        throw new Error(`API returned ${res.status}`)
      }

      const data = await res.json()
      console.log("Spotify data:", data)

      if (data.error) {
        throw new Error(data.error)
      }

      setError(null)
      setData(data)
      setRetryCount(0) // Reset retry count on success
    } catch (error) {
      console.error("Error fetching now playing:", error)
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred"
      
      if (retry < MAX_RETRIES) {
        console.log(`Retrying... Attempt ${retry + 1} of ${MAX_RETRIES}`)
        setRetryCount(retry + 1)
        setTimeout(() => fetchNowPlaying(retry + 1), RETRY_DELAY)
      } else {
        setError(errorMessage)
        setRetryCount(0)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchNowPlaying()

    // Refresh every 15 seconds
    const interval = setInterval(() => fetchNowPlaying(), 15000)
    return () => clearInterval(interval)
  }, [fetchNowPlaying])

  return (
    <div className="max-w-3xl w-full mx-auto px-4 mb-12">
      <div
        className="card-gradient border border-gray-800 rounded-lg p-6 transition-all duration-300 hover:border-primary/50"
        onClick={() => fetchNowPlaying()}
      >
        <div className="flex items-center">
          {loading ? (
            <div className="flex items-center space-x-4 w-full">
              <div className="w-12 h-12 rounded-md bg-gray-800 animate-pulse"></div>
              <div className="flex-1">
                <div className="h-4 w-48 bg-gray-800 rounded animate-pulse mb-2"></div>
                <div className="h-3 w-32 bg-gray-800 rounded animate-pulse"></div>
              </div>
            </div>
          ) : (
            <>
              {data?.albumImageUrl ? (
                <div className="w-12 h-12 rounded-md overflow-hidden mr-4 flex-shrink-0">
                  <Image
                    src={data.albumImageUrl}
                    alt={data.album ? `${data.album} cover` : "Album cover"}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-md bg-gray-800 flex items-center justify-center mr-4 flex-shrink-0">
                  <Music className="w-6 h-6 text-gray-400" />
                </div>
              )}

              <div className="flex-1 min-w-0">
                {data?.title ? (
                  <>
                    <div className="flex items-center">
                      {data.isPlaying ? (
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                      ) : data.isRecent ? (
                        <Clock className="w-3 h-3 text-gray-400 mr-2" />
                      ) : null}

                      <a
                        href={data.songUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium hover:underline truncate flex items-center group"
                      >
                        <span className="truncate">{data.title}</span>
                        <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    </div>
                    <p className="text-xs text-gray-400 truncate">{data.artist}</p>
                  </>
                ) : (
                  <>
                    <div className="flex items-center">
                      <div className="icon-container w-8 h-8 mr-3">
                        <Music className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Nothing playing right now</p>
                        <p className="text-xs text-gray-400">No track information available</p>
                      </div>
                    </div>
                    {error && (
                      <p className="text-xs text-red-400 mt-2 truncate">
                        Error: {error}
                        {retryCount > 0 && ` (Retry ${retryCount}/${MAX_RETRIES})`}
                      </p>
                    )}
                  </>
                )}
              </div>

              {data?.isPlaying && (
                <div className="ml-auto pl-4">
                  <div className="flex space-x-1">
                    <span className="w-1 h-3 bg-green-500 rounded-full soundbar-1"></span>
                    <span className="w-1 h-5 bg-green-500 rounded-full soundbar-2"></span>
                    <span className="w-1 h-4 bg-green-500 rounded-full soundbar-3"></span>
                    <span className="w-1 h-2 bg-green-500 rounded-full soundbar-4"></span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}