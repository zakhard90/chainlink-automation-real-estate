import { ethers } from 'hardhat';
import { expect } from 'chai';
import { loadFixture } from '@nomicfoundation/hardhat-toolbox/network-helpers';

describe('RealEstateNft', function () {
  async function deployRealEstateNftFixture() {
    const [owner, minter, user, ...otherAccounts] = await ethers.getSigners();
    const RealEstateNftFactory = await ethers.getContractFactory('RealEstateNft');
    const RealEstateNft = await RealEstateNftFactory.deploy();
    const zeroAddress = ethers.ZeroAddress;

    return {
      owner,
      minter,
      user,
      otherAccounts,
      RealEstateNft,
      zeroAddress,
    };
  }

  it('Owner can set minter', async function () {
    const { owner, minter, RealEstateNft } = await loadFixture(deployRealEstateNftFixture);
    await expect(RealEstateNft.connect(owner).setMinter(minter.address))
      .to.emit(RealEstateNft, 'MinterUpdated')
      .withArgs(ethers.ZeroAddress, minter.address);
    expect(await RealEstateNft.minter()).to.equal(minter.address);
  });

  it('Owner cannot set zero address as minter', async function () {
    const { owner, zeroAddress, RealEstateNft } = await loadFixture(deployRealEstateNftFixture);
    expect(await RealEstateNft.owner()).to.equal(owner.address);
    expect(RealEstateNft.connect(owner).setMinter(zeroAddress)).to.be.revertedWithCustomError(
      RealEstateNft,
      'InvalidAddress'
    );
  });

  it('Non-owner cannot set minter', async function () {
    const { user, RealEstateNft } = await loadFixture(deployRealEstateNftFixture);
    expect(await RealEstateNft.owner()).to.not.equal(user.address);
    expect(RealEstateNft.connect(user).setMinter(user)).to.be.revertedWithCustomError(
      RealEstateNft,
      'OwnableUnauthorizedAccount'
    );
  });

  it('Minter can mint an NFT', async function () {
    const { owner, minter, user, RealEstateNft } = await loadFixture(deployRealEstateNftFixture);
    const expectedId = 1;

    await expect(RealEstateNft.connect(owner).setMinter(minter.address))
      .to.emit(RealEstateNft, 'MinterUpdated')
      .withArgs(ethers.ZeroAddress, minter.address);

    await expect(RealEstateNft.connect(minter).safeMint(user.address))
      .to.emit(RealEstateNft, 'Transfer')
      .withArgs(ethers.ZeroAddress, user.address, expectedId);
  });

  it('Non-minter cannot mint an NFT', async function () {
    const { owner, minter, user, RealEstateNft } = await loadFixture(deployRealEstateNftFixture);

    await expect(RealEstateNft.connect(owner).setMinter(minter.address))
      .to.emit(RealEstateNft, 'MinterUpdated')
      .withArgs(ethers.ZeroAddress, minter.address);

    expect(RealEstateNft.connect(user).safeMint(user.address)).to.be.revertedWithCustomError(
      RealEstateNft,
      'NotAllowed'
    );
  });
});
