import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { map, Observable, tap } from "rxjs";
import { environment } from "../../../../../../../environments/environment.development";

@Injectable({
  providedIn: 'root'
})

export class NotesService {

  private http = inject(HttpClient)
  private url = environment.api.url;
  public saveNote(note:string, crId:string, noteId:string) : Observable<any> {
    console.log(note, crId, noteId, 'note, crId, noteId')
    return this.http.post(`${this.url}/notes`, { note, crId, noteId });
  }

  public getNotes(crId:string) : Observable<any> {
    return this.http.get<any>(`${this.url}/notes/${crId}`).pipe(
      tap(notes => console.log('Notas carregadas', notes)),  // Debugging purposes
      map(notes => notes.map((note:any) => ({note: note.note, user: note.user, createdAt: note.createdAt, noteId:note.noteId})))
    );
  }

  public deleteNote(noteId:string, crId:string) : Observable<any> {
    return this.http.delete(`${this.url}/notes/${noteId}/${crId}`);
  }

}
