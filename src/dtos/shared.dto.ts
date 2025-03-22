export class Pagination {
  constructor() {}
  data: any[] | [];
  pages: number = 1;
  current: number = 1;
  previous?: string;
  next?: string;
}
