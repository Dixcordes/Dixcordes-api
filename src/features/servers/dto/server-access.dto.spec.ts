import { ServerAccessDto } from './server-access.dto';

describe('UpdateChannelDto', () => {
  it('should create a updateChannelDto object', () => {
    expect(new ServerAccessDto(4, 83)).toEqual(new ServerAccessDto(4, 83));
  });
});
