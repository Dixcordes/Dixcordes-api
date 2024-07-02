import { Injectable } from '@nestjs/common';
import { Client } from 'cassandra-driver';
import { InjectCassandra } from '@mich4l/nestjs-cassandra';
import { MessageInChannelDto } from './dto/message-channel.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ChannelsGatewayServices {
  constructor(
    @InjectCassandra()
    private readonly dbClient: Client,
  ) {}

  async saveMessage(messageInChannelDto: MessageInChannelDto) {
    try {
      const newUuid = uuidv4();
      if (!messageInChannelDto.author) {
        throw new Error('Author is missing');
      }
      if (!messageInChannelDto.channelName) {
        throw new Error('Channel is missing');
      }
      if (!messageInChannelDto.content) {
        throw new Error('Content is missing');
      }
      const query = `INSERT INTO dixcordes.channel_messages (id, author, channel, content) VALUES (${newUuid}, '${messageInChannelDto.author}', '${messageInChannelDto.channelName}', '${messageInChannelDto.content}');`;
      const result = await this.dbClient.execute(query, {
        consistency: 1,
      });
      return result.rows;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
