import { SpotifyService } from '../services/spotify.service.service';
import { Component} from '@angular/core';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage{
  artistName: string = '';
  artists: any[] = [];
  placeholderImage: string = 'assets/placeholder.png';

  constructor(private spotifyService: SpotifyService) {}

 

  async searchArtist() {
    if (!this.artistName.trim()) return;

    try {
      await this.spotifyService.authorize();

      this.spotifyService.searchArtist(this.artistName).subscribe({
        next: (response) => {
          const artists = response.artists.items;

          this.artists = artists.map((artist: any) => ({
            id: artist.id,
            name: artist.name,
            image: artist.images?.[0]?.url || this.placeholderImage,
            genre: artist.genres?.[0] || 'Desconhecido',
            followers: artist.followers?.total || 'Não disponível',
            popularity: artist.popularity || 'Não disponível',
            topTracks: [],
            albums: [],
          }));

          this.artists.forEach((artist) => {
            // Top Tracks
            this.spotifyService.getArtistTopTracks(artist.id).subscribe({
              next: (tracks) => {
                artist.topTracks = tracks.tracks.slice(0, 10).map((track: any) => ({
                  name: track.name,
                  image: track.album.images?.[0]?.url || this.placeholderImage,
                }));
              },
              error: (err) => console.error(`Erro ao carregar as músicas de ${artist.name}:`, err),
            });

            // Albums
            this.spotifyService.getArtistAlbums(artist.id).subscribe({
              next: (albums) => {
                artist.albums = albums.items.map((album: any) => ({
                  name: album.name,
                  image: album.images?.[0]?.url || this.placeholderImage,
                  releaseDate: album.release_date || 'Desconhecida',
                }));
              },
              error: (err) => console.error(`Erro ao carregar os álbuns de ${artist.name}:`, err),
            });
          });
        },
        error: (err) => console.error('Erro ao buscar artistas:', err),
      });
    } catch (error) {
      console.error('Erro na autorização do Spotify:', error);
    }
  }
}
