import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../../../../../environments/environment.development";

@Injectable({
  providedIn: 'root'
})

export class NotesService {

  private http = inject(HttpClient)
  private url = environment.api.url;
  public saveNote(note:string, crId:string) : Observable<any> {
    return this.http.post(`${this.url}/notes`, { note,crId });
  }

  public getNotes(crId:string) : Observable<any> {
    return this.http.get(`${this.url}/notes/${crId}`);
  }

}
