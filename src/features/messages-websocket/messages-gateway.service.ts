import { InjectCassandra } from '@mich4l/nestjs-cassandra';
import { Injectable } from '@nestjs/common';
import { Client } from 'cassandra-driver';

@Injectable()
export class MessagesGatewayServices {
  constructor(
    @InjectCassandra()
    private readonly dbClient: Client,
  ) {}
}
