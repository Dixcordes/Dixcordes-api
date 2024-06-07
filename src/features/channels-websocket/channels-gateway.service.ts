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
      const query = `INSERT INTO dixcordes.channel_messages (cha_id, author, channel, message) VALUES (8, '${messageInChannelDto.author}', '${messageInChannelDto.message}', '${messageInChannelDto.channelName}');`;
      const result = await this.dbClient.execute(query, {
        consistency: 1,
      });

      console.log(result.rows);

      return result.rows;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
