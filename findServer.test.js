const { expect } = require('chai');
const {findServer} = require('./index.js');

describe('findServer', () => {
  it('should return an object with the following properties', async () => {
    const server = await findServer('localhost', 1433);

    expect(server).to.not.be.undefined;
    expect(server).to.have.property('serverName');
    expect(server).to.have.property('serverVersion');
    expect(server).to.have.property('build');
    expect(server).to.have.property('fileVersion');
    expect(server).to.have.property('description');
    expect(server).to.have.property('link');
    expect(server).to.have.property('releaseDate');
    expect(server).to.have.property('updateInfo');
  });
});