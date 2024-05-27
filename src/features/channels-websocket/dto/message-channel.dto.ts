export class MessageInChannelDto {
  channelName: string;
  message: string;
  author: string;

  constructor(channelName: string, message: string, author: string) {
    this.channelName = channelName;
    this.message = message;
    this.author = author;
  }
}
