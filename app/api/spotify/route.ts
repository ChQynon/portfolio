import { NextResponse } from "next/server"

const CLIENT_ID = "cc76b4a40cdf4265891f386e6e5153f9"
const CLIENT_SECRET = "f5826f2f802c4453a495f88c98835a13"
const REFRESH_TOKEN = "AQBZZIckSOjNMNnbHtBOlmT38bhX2s5kSPZCBdSNZm8L2m1VH66X47-DNvQImvQVQVwgF0aByrIAHwlS5119AsB1JumRvxkhDcDFWhk275FTuxEEqvT2gs68xPxKEy2W_e8"

const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64")
const NOW_PLAYING_ENDPOINT = "https://api.spotify.com/v1/me/player/currently-playing"
const RECENTLY_PLAYED_ENDPOINT = "https://api.spotify.com/v1/me/player/recently-played?limit=1"
const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token"

const getAccessToken = async () => {
  if (!REFRESH_TOKEN) {
    throw new Error("No refresh token available")
  }

  try {
    // Можно также использовать предоставленный Access Token напрямую
    // const accessToken = "BQDhupxU7XALnDMna9zZL_9Q0VSMXzKjLu1Bdsstf_2PmhLG2fyFede_3EAzMXTpC6_7DlOVNnpEAm7VlMvDEVO1QdhJ3mtkjkH3T5VDhHjeHy9DiTk77Qan-PHA88RGmpO0ib4GT1ndQoy5NfwloqpX547MKeATAYL2xvL8tqalRhSFGgpw0-JDUBEbwpfKzjGnJbY2eK18dosNkUbxT-jlvslyV0ZY4Czhr0E4dM-krz5lyoiYYw";
    // return { access_token: accessToken };
    
    const response = await fetch(TOKEN_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Basic ${basic}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: REFRESH_TOKEN,
      }),
      cache: "no-store",
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Token request failed: ${response.status} - ${errorText}`)
    }

    return response.json()
  } catch (error) {
    console.error("Error getting access token:", error)
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
    const response = await fetch(NOW_PLAYING_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      cache: "no-store",
    })

    console.log("Now playing response status:", response.status)

    // If no current track, try to get recently played
    if (response.status === 204 || response.status > 400) {
      console.log("No current track, fetching recently played...")
      const recentlyPlayed = await fetch(RECENTLY_PLAYED_ENDPOINT, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        cache: "no-store",
      })

      console.log("Recently played response status:", recentlyPlayed.status)

      if (recentlyPlayed.status === 200) {
        const data = await recentlyPlayed.json()
        console.log("Recently played data:", JSON.stringify(data).substring(0, 200) + "...")

        if (data && data.items && data.items.length > 0) {
          const item = data.items[0].track
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
      } else {
        const errorText = await recentlyPlayed.text()
        console.error("Recently played error:", errorText)
        return { isPlaying: false, error: `Recently played request failed: ${recentlyPlayed.status}` }
      }

      return { isPlaying: false }
    }

    if (response.status !== 200) {
      const errorText = await response.text()
      console.error("Now playing error:", errorText)
      return { isPlaying: false, error: `Now playing request failed: ${response.status}` }
    }

    const song = await response.json()
    console.log("Now playing data:", JSON.stringify(song).substring(0, 200) + "...")

    if (!song.item) {
      return { isPlaying: false, error: "No item in response" }
    }

    const isPlaying = song.is_playing
    const title = song.item.name
    const artist = song.item.artists.map((_artist: any) => _artist.name).join(", ")
    const album = song.item.album.name
    const albumImageUrl = song.item.album.images[0]?.url
    const songUrl = song.item.external_urls.spotify

    return {
      album,
      albumImageUrl,
      artist,
      isPlaying,
      songUrl,
      title,
    }
  } catch (error) {
    console.error("Error fetching now playing:", error)
    return { isPlaying: false, error: String(error) }
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
    return NextResponse.json({ isPlaying: false, error: String(error) }, { status: 500 })
  }
}
