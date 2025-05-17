import { NextResponse } from "next/server"
import axios from "axios"
import axiosRetry from "axios-retry"

const CLIENT_ID = "cc76b4a40cdf4265891f386e6e5153f9"
const CLIENT_SECRET = "f5826f2f802c4453a495f88c98835a13"
const REFRESH_TOKEN = "AQBZZIckSOjNMNnbHtBOlmT38bhX2s5kSPZCBdSNZm8L2m1VH66X47-DNvQImvQVQVwgF0aByrIAHwlS5119AsB1JumRvxkhDcDFWhk275FTuxEEqvT2gs68xPxKEy2W_e8"

const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64")
const NOW_PLAYING_ENDPOINT = "https://api.spotify.com/v1/me/player/currently-playing"
const RECENTLY_PLAYED_ENDPOINT = "https://api.spotify.com/v1/me/player/recently-played?limit=1"
const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token"

// Configure axios with retry mechanism
const client = axios.create()
axiosRetry(client, { 
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    return axiosRetry.isNetworkOrIdempotentRequestError(error) || error.code === 'ECONNABORTED'
  }
})

const getAccessToken = async () => {
  if (!REFRESH_TOKEN) {
    throw new Error("No refresh token available")
  }

  try {
    const response = await client.post(TOKEN_ENDPOINT, 
      new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: REFRESH_TOKEN,
      }).toString(),
      {
        headers: {
          Authorization: `Basic ${basic}`,
          "Content-Type": "application/x-www-form-urlencoded",
        }
      }
    )

    return response.data
  } catch (error) {
    console.error("Error getting access token:", error)
    if (axios.isAxiosError(error)) {
      throw new Error(`Failed to get access token: ${error.message}`)
    }
    throw error
  }
}

const getNowPlaying = async () => {
  try {
    if (!REFRESH_TOKEN) {
      return { isPlaying: false, error: "No refresh token set" }
    }

    console.log("Getting access token...")
    const { access_token } = await getAccessToken()
    console.log("Access token obtained")

    // First try to get currently playing
    console.log("Fetching currently playing...")
    try {
      const response = await client.get(NOW_PLAYING_ENDPOINT, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        }
      })

      if (response.data && response.data.item) {
        const song = response.data
        return {
          isPlaying: song.is_playing,
          title: song.item.name,
          artist: song.item.artists.map((_artist: any) => _artist.name).join(", "),
          album: song.item.album.name,
          albumImageUrl: song.item.album.images[0]?.url,
          songUrl: song.item.external_urls.spotify,
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status !== 204) {
        console.error("Error fetching now playing:", error)
      }
    }

    // If no current track, try to get recently played
    console.log("Fetching recently played...")
    try {
      const recentlyPlayed = await client.get(RECENTLY_PLAYED_ENDPOINT, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        }
      })

      if (recentlyPlayed.data && recentlyPlayed.data.items && recentlyPlayed.data.items.length > 0) {
        const item = recentlyPlayed.data.items[0].track
        return {
          isPlaying: false,
          title: item.name,
          artist: item.artists.map((_artist: any) => _artist.name).join(", "),
          album: item.album.name,
          albumImageUrl: item.album.images[0]?.url,
          songUrl: item.external_urls.spotify,
          isRecent: true,
        }
      }
    } catch (error) {
      console.error("Error fetching recently played:", error)
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to fetch recently played: ${error.message}`)
      }
      throw error
    }

    return { isPlaying: false }
  } catch (error) {
    console.error("Error in getNowPlaying:", error)
    return { 
      isPlaying: false, 
      error: error instanceof Error ? error.message : "An unexpected error occurred"
    }
  }
}

export async function GET() {
  try {
    console.log("Spotify API route called")
    const response = await getNowPlaying()
    console.log("Returning response:", response)
    return NextResponse.json(response)
  } catch (error) {
    console.error("Unhandled error in Spotify API route:", error)
    return NextResponse.json({ 
      isPlaying: false, 
      error: error instanceof Error ? error.message : "An unexpected error occurred" 
    }, { status: 500 })
  }
}