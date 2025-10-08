// src/lib/spotify.ts
import querystring from "querystring";

let accessToken: string | null = null;
let tokenExpires = 0;

async function getAccessToken() {
  if (accessToken && Date.now() < tokenExpires) {
    return accessToken;
  }

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(
          process.env.SPOTIFY_CLIENT_ID +
            ":" +
            process.env.SPOTIFY_CLIENT_SECRET,
        ).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: querystring.stringify({ grant_type: "client_credentials" }),
  });

  const data = await res.json();
  accessToken = data.access_token;
  tokenExpires = Date.now() + data.expires_in * 1000;
  return accessToken;
}

export async function searchTrack(query: string) {
  const token = await getAccessToken();
  const res = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=1`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  const data = await res.json();
  if (data.tracks?.items?.length > 0) {
    const track = data.tracks.items[0];
    return {
      id: track.id,
      name: track.name,
      artists: track.artists.map((a: any) => a.name).join(", "),
      spotifyUrl: `https://open.spotify.com/embed/track/${track.id}`,
    };
  }
  return null;
}

// src/lib/spotify.ts
export function getSpotifyTrackId(url: string): string | null {
  const match = url.match(/track\/([a-zA-Z0-9]+)/);
  return match ? match[1] : null;
}

