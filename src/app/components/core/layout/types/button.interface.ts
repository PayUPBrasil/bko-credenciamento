export interface Button {
  title: string,
  color: string,
  type?:string,
  bg_color: string,
  aria_label: string,
  disabled:boolean,
  loadingStatus:string,
  routerLink?:string | null
}
