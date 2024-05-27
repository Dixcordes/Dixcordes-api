import { ServerDto } from './server.dto';

describe('UpdateChannelDto', () => {
  it('should create a updateChannelDto object', () => {
    expect(new ServerDto('Test server name', null, false)).toEqual(
      new ServerDto('Test server name', null, false),
    );
  });
});
