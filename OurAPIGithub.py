from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Query
import requests

# cd \Users\kayle\PycharmProjects\Spotifiers5.1env
# source venv/scripts/activate

# uvicorn OurAPI:app --reload



def get_access_token(client_id, client_secret):
    token_endpoint = "https://accounts.spotify.com/api/token"
    headers = {
        "Content-Type": "application/x-www-form-urlencoded"
    }
    payload = {
        "grant_type": "client_credentials",
        "client_id": client_id,
        "client_secret": client_secret
    }
    response = requests.post(token_endpoint, headers=headers, data=payload)

    if response.status_code == 200:
        return response.json()['access_token']
    else:
        response.raise_for_status()


def get_artist_data(access_token, artist_name):
    search_endpoint = "https://api.spotify.com/v1/search"
    headers = {
        "Authorization": f"Bearer {access_token}"
    }
    params = {
        "q": artist_name,
        "type": "artist",
        "limit": 1
    }
    response = requests.get(search_endpoint, headers=headers, params=params)

    if response.status_code == 200:
        return response.json()['artists']['items'][0]
    else:
        response.raise_for_status()


def get_top_tracks(access_token, artist_id):
    top_tracks_endpoint = f"https://api.spotify.com/v1/artists/{artist_id}/top-tracks"
    headers = {
        "Authorization": f"Bearer {access_token}"
    }
    params = {
        "market": "ES"  # You can change this to another market if needed
    }
    response = requests.get(top_tracks_endpoint, headers=headers, params=params)

    if response.status_code == 200:
        tracks = response.json()['tracks']
        return tracks[:3]  # Return the top 3 tracks
    else:
        response.raise_for_status()


app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins. For production, you should specify your frontend's URL.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root(artist_name: str = Query(..., description="Name of the artist to search for")):
    CLIENT_ID = "a5b771d489954d1081a424d5c348a08b"
    CLIENT_SECRET = "88cffd9d943f4700b4362b149455fa0c"

    access_token = get_access_token(CLIENT_ID, CLIENT_SECRET)
    artist_data = get_artist_data(access_token, artist_name)
    return {"message": artist_data}


@app.get("/top-tracks")
def get_artist_top_tracks(artist_name: str = Query(..., description="Name of the artist to fetch top tracks for")):
    CLIENT_ID = ""
    CLIENT_SECRET = ""

    access_token = get_access_token(CLIENT_ID, CLIENT_SECRET)
    artist_data = get_artist_data(access_token, artist_name)
    artist_id = artist_data["id"]
    top_tracks = get_top_tracks(access_token, artist_id)

    return {"top_tracks": top_tracks}
