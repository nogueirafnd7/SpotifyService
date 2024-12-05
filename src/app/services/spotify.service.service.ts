import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
  private clientId = 'f683f6391fc14bee87f4b5df4291e99a'; // Insira o seu client_id
  private clientSecret = '778104d913bc4a35a5eca75c166ef320'; // Insira o seu client_secret
  private tokenUrl = 'https://accounts.spotify.com/api/token';
  private apiUrl = 'https://api.spotify.com/v1';

  private token: string | null = null;

  constructor(private http: HttpClient) {}

  private getToken(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization:
        'Basic ' + btoa(`${this.clientId}:${this.clientSecret}`)
    });
    const body = new URLSearchParams();
    body.set('grant_type', 'client_credentials');

    return this.http.post(this.tokenUrl, body.toString(), { headers });
  }

  async authorize() {
    if (!this.token) {
      const response = await this.getToken().toPromise();
      this.token = response?.access_token;
    }
  }

  searchArtist(query: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/search?q=${query}&type=artist`, {
      headers: { Authorization: `Bearer ${this.token}` }
    });
  }

  getArtistTopTracks(artistId: string): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/artists/${artistId}/top-tracks?market=US`,
      {
        headers: { Authorization: `Bearer ${this.token}` }
      }
    );
  }

  getArtistAlbums(artistId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/artists/${artistId}/albums?include_groups=album`, {
      headers: { Authorization: `Bearer ${this.token}` }
    });
  }
  
  

}
