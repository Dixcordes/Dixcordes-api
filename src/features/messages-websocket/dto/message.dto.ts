export class MessageDto {
  from: string;
  to: string;
  content: string;
  dateSend: Date;

  constructor(from: string, to: string, content: string, dateSend: Date) {
    this.from = from;
    this.to = to;
    this.content = content;
    this.dateSend = dateSend;
  }
}
