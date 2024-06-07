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

  async getLastId() {
    try {
      const query = 'SELECT * FROM channel_messages';
      const result = await this.dbClient.execute(query, {
        consistency: 1,
      });
      let channelId = 0;
      const channelIdArrayIteration: number[] = [];
      if (result.rows.length === 0) {
        return 0;
      }
      for (let i = 0; i < result.rowLength; i++) {
        channelId = result.rows[i].cha_id;
        channelIdArrayIteration.push(channelId);
      }
      const channelIdArrayIterationShorted = channelIdArrayIteration
        .slice()
        .sort((a, b) => a - b);
      return channelIdArrayIterationShorted[
        channelIdArrayIterationShorted.length - 1
      ];
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

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
      this.getLastId();
      const lastId = await this.getLastId();
      const query = `INSERT INTO dixcordes.channel_messages (cha_id, author, channel, message) VALUES (${
        lastId + 1
      }, '${messageInChannelDto.author}', '${messageInChannelDto.message}', '${
        messageInChannelDto.channelName
      }');`;
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
