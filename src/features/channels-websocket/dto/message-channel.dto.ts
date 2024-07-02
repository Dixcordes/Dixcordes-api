export class MessageInChannelDto {
  channelName: string;
  content: string;
  author: string;

  constructor(channelName: string, content: string, author: string) {
    this.channelName = channelName;
    this.content = content;
    this.author = author;
  }
}
