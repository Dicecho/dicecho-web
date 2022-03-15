export interface IModDto {
  _id: string,
  title: string,
  description: string,
  origin: string,
  coverUrl: string,
  moduleType: string,
  imageUrls: Array<string>,
}

export interface IModDetailDto {
  _id: string,
  title: string,
  description: string,
  origin: string,
  coverUrl: string,
  moduleType: string,
}