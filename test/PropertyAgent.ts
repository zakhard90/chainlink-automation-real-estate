import { ethers } from 'hardhat';
import { expect } from 'chai';
import { loadFixture } from '@nomicfoundation/hardhat-toolbox/network-helpers';

describe('PropertyAgent', function () {
  async function deployPropertyAgentFixture() {
    const [owner, user, ...otherAccounts] = await ethers.getSigners();
    const PropertyAgentFactory = await ethers.getContractFactory('PropertyAgent');
    const price = ethers.parseEther('52.2');
    const PropertyAgent = await PropertyAgentFactory.deploy(price);
    const zeroAddress = ethers.ZeroAddress;

    return {
      owner,
      user,
      otherAccounts,
      price,
      PropertyAgent,
      zeroAddress,
    };
  }

  it('Buyer can purchase property with correct price value', async function () {
    const { user, price, PropertyAgent } = await loadFixture(deployPropertyAgentFixture);
    await expect(user.sendTransaction({ to: PropertyAgent.getAddress(), value: price }))
      .to.emit(PropertyAgent, 'PropertyPurchased')
      .withArgs(user.address);
  });

  it('Buyer cannot purchase property with incorrect price value', async function () {
    const { user, price, PropertyAgent } = await loadFixture(deployPropertyAgentFixture);
    const incorrectPrice = price - 1n;
    await expect(
      user.sendTransaction({ to: PropertyAgent.getAddress(), value: incorrectPrice })
    ).to.be.revertedWithCustomError(PropertyAgent, 'IncorrectValue');
  });

  it('Buyer cannot purchase property if already purchased', async function () {
    const { user, price, PropertyAgent } = await loadFixture(deployPropertyAgentFixture);

    await expect(user.sendTransaction({ to: PropertyAgent.getAddress(), value: price }))
      .to.emit(PropertyAgent, 'PropertyPurchased')
      .withArgs(user.address);

    expect(await PropertyAgent.isPurchased()).to.equal(true);

    await expect(user.sendTransaction({ to: PropertyAgent.getAddress(), value: price })).to.be.revertedWithCustomError(
      PropertyAgent,
      'PropertyAlreadyPurchased'
    );
  });
});
