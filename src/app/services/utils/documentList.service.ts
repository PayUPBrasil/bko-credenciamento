import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})

export class DocumentListService {
  private documentList = []

  public getDocumentList() {
    return this.documentList;
  }

}
