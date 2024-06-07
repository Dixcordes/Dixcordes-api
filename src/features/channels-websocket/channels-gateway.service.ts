import { Injectable } from '@nestjs/common';
import { Client } from 'cassandra-driver';
import { InjectCassandra } from '@mich4l/nestjs-cassandra';
import { MessageInChannelDto } from './dto/message-channel.dto';

@Injectable()
export class ChannelsGatewayServices {
  constructor(
    @InjectCassandra()
    private readonly dbClient: Client,
  ) {}

  async saveMessage(messageInChannelDto: MessageInChannelDto) {
    try {
      if (!messageInChannelDto.author) {
        throw new Error('Author is missing');
      }
      if (!messageInChannelDto.channelName) {
        throw new Error('Channel is missing');
      }
      if (!messageInChannelDto.message) {
        throw new Error('Message is missing');
      }
      // const query = `INSERT INTO dixcordes.channel_messages (cha_id, author, channel, message) VALUES (1, '${messageInChannelDto.author}', '${messageInChannelDto.message}', '${messageInChannelDto.channelName}') IF NOT EXISTS;`;
      const result = await this.dbClient.execute(query);

      console.log(result);

      return result.rows[0];
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
