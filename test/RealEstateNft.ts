import { ethers } from 'hardhat';
import { expect } from 'chai';
import { loadFixture, mine } from '@nomicfoundation/hardhat-toolbox/network-helpers';

describe('RealEstateNft', function () {
  async function deployRealEstateNftFixture() {
    const [owner, minter, ...otherAccounts] = await ethers.getSigners();
    const RealEstateNftFactory = await ethers.getContractFactory('RealEstateNft');
    const RealEstateNft = await RealEstateNftFactory.deploy();

    return {
      owner,
      minter,
      otherAccounts,
      RealEstateNft,
    };
  }

  it('Owner can set minter', async function () {
    const {owner, minter, RealEstateNft } = await loadFixture(deployRealEstateNftFixture);
    await expect(RealEstateNft.connect(owner).setMinter(minter.address))
      .to.emit(RealEstateNft, 'MinterUpdated')
      .withArgs(ethers.ZeroAddress, minter.address);
  });
});
