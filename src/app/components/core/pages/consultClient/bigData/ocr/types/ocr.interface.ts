export interface OcrFormInputs {
  id:string,
  value?:string,
  label?:string,
  type: string,
  options?: string;
  required:boolean;
  dependsOn?: string,
  placeholder?:string;
  mask?:string;
}
