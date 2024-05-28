import { ServerDeleteDto } from './server-delete.dto';

describe('UpdateChannelDto', () => {
  it('should create a updateChannelDto object', () => {
    expect(new ServerDeleteDto(4, 'Test server name to delete')).toEqual(
      new ServerDeleteDto(4, 'Test server name to delete'),
    );
  });
});
