import { ethers } from 'hardhat';
import { expect } from 'chai';
import { loadFixture } from '@nomicfoundation/hardhat-toolbox/network-helpers';

describe('Minter', function () {
  async function deployMinterFixture() {
    const [owner, forwarder, user, ...otherAccounts] = await ethers.getSigners();
    const MinterFactory = await ethers.getContractFactory('Minter');
    const Minter = await MinterFactory.deploy();
    const zeroAddress = ethers.ZeroAddress;

    return {
      owner,
      forwarder,
      user,
      otherAccounts,
      Minter,
      zeroAddress,
    };
  }

  it('Owner can set forwarder', async function () {
    const { owner, forwarder, Minter } = await loadFixture(deployMinterFixture);
    await expect(Minter.connect(owner).setForwarder(forwarder.address))
      .to.emit(Minter, 'ForwarderUpdated')
      .withArgs(ethers.ZeroAddress, forwarder.address);
    expect(await Minter.forwarder()).to.equal(forwarder.address);
  });

  it('Owner cannot set zero address as forwarder', async function () {
    const { owner, zeroAddress, Minter } = await loadFixture(deployMinterFixture);
    expect(await Minter.owner()).to.equal(owner.address);
    expect(Minter.connect(owner).setForwarder(zeroAddress)).to.be.revertedWithCustomError(Minter, 'InvalidAddress');
  });

  it('Non-owner cannot set forwarder', async function () {
    const { user, Minter } = await loadFixture(deployMinterFixture);
    expect(await Minter.owner()).to.not.equal(user.address);
    expect(Minter.connect(user).setForwarder(user)).to.be.revertedWithCustomError(Minter, 'OwnableUnauthorizedAccount');
  });

  it('Check log returns correct values', async function () {
    const { user, Minter } = await loadFixture(deployMinterFixture);

    const mockBytes = ethers.zeroPadValue('0xabcd', 32);
    const logUserAddress = ethers.zeroPadValue(user.address, 32);
    const logData = {
      index: 0,
      timestamp: 1705555555,
      txHash: mockBytes,
      blockNumber: 12345,
      blockHash: mockBytes,
      source: '0x1234567890123456789012345678901234567890',
      topics: [ethers.id('MockEvent(address,bytes)'),logUserAddress , mockBytes],
      data: ethers.toUtf8Bytes('Mock log data bytes'),
    };
    const { upkeepNeeded, performData } = await Minter.checkLog(logData, mockBytes);
    
    expect(upkeepNeeded).to.equal(true);
    expect(performData).to.equal(logUserAddress);
  });

  it('Forwarder can perform upkeep', async function () {
    const { owner, forwarder, user, Minter } = await loadFixture(deployMinterFixture);

    const mockLog = {
      topics: [ethers.id('MockEvent(address,bytes)'), ethers.zeroPadValue(user.address, 32)],
    };

    const logSender = ethers.getAddress(ethers.stripZerosLeft(mockLog.topics[1]));
    const data = ethers.AbiCoder.defaultAbiCoder().encode(['address'], [logSender]);

    await expect(Minter.connect(owner).setForwarder(forwarder.address))
      .to.emit(Minter, 'ForwarderUpdated')
      .withArgs(ethers.ZeroAddress, forwarder.address);

    await expect(Minter.connect(forwarder).performUpkeep(data)).to.emit(Minter, 'MintedBy').withArgs(logSender);
  });

  it('Non-forwarder cannot perform upkeep', async function () {
    const { owner, forwarder, user, Minter } = await loadFixture(deployMinterFixture);

    await expect(Minter.connect(owner).setForwarder(forwarder.address))
      .to.emit(Minter, 'ForwarderUpdated')
      .withArgs(ethers.ZeroAddress, forwarder.address);

    expect(Minter.connect(user).performUpkeep(user.address)).to.be.revertedWithCustomError(Minter, 'NotAllowed');
  });
});
