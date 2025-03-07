import { KeyValuePipe, NgClass, NgFor, NgIf, SlicePipe } from "@angular/common";
import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: 'app-layout-table',
  templateUrl: './table.component.html',
  imports: [NgIf, NgFor, KeyValuePipe, SlicePipe],
  standalone: true
})

export class TableComponent implements OnInit {

  @Input() tableContent: any = []
  public processedTableContent: any[] = [];
  public key : any[]= []
  public upIcon= true;
  @Input() visibleItems = 4;
  public showArrowIcon = false;

  public showMore() {
    this.visibleItems += 10;
    if (this.visibleItems > Object.keys(this.tableContent).length) {
      this.visibleItems = Object.keys(this.tableContent).length;
    }
  }

  public showLess(){
    this.visibleItems = Math.max(this.visibleItems - 10, 4);
    if (this.visibleItems < 4) {
      this.visibleItems = 4;
    }
    this.key = Object.keys(this.tableContent).slice(0, this.visibleItems);
  }

  ngOnInit(): void {
    if(Object.keys(this.tableContent).length > this.visibleItems){
      this.showArrowIcon = true
    }
  }

  public updateVisibilityQuantity() {
    this.upIcon = !this.upIcon
      if(Object.keys(this.tableContent).length === this.visibleItems){
       this.showLess()
      } else {
        this.showMore()
      }
  }

  public isAObjectValue(contentToCheck:any):boolean{
    return typeof this.tableContent[Object.keys(this.tableContent)[0]] === 'object'
  }


 public transformTypeDistribution(typeDistribution: any) {
    return Object.entries(typeDistribution);
  }

  protected capitalizeWords(text:string | any) : string {
    return text
        .toLowerCase()
        .split(' ')
        .map((word:any) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}



}
