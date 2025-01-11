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

  it('Should allow owner to withdraw', async function () {
    const { user, owner, price, PropertyAgent } = await loadFixture(deployPropertyAgentFixture);
    const ethAmount = price;

    // Send ETH to contract
    await user.sendTransaction({
      to: PropertyAgent.getAddress(),
      value: ethAmount,
    });

    const initialBalance = await ethers.provider.getBalance(owner.address);

    // Withdraw
    const tx = await PropertyAgent.connect(owner).withdraw();
    const receipt = await tx.wait();

    const gasCost = receipt!.gasUsed * receipt!.gasPrice;
    const finalBalance = await ethers.provider.getBalance(owner.address);
    expect(finalBalance - initialBalance).to.equal(ethAmount - BigInt(gasCost));
  });

  it('Should emit withdrawal event', async function () {
    const { user, owner, price, PropertyAgent } = await loadFixture(deployPropertyAgentFixture);
    const ethAmount = price;

    await user.sendTransaction({
      to: PropertyAgent.getAddress(),
      value: ethAmount,
    });

    await expect(PropertyAgent.connect(owner).withdraw())
      .to.emit(PropertyAgent, 'WithdrawalMade')
      .withArgs(owner.address, ethAmount);
  });

  it('Should revert if caller is not owner', async function () {
    const { owner, user, PropertyAgent } = await loadFixture(deployPropertyAgentFixture);
    expect(await PropertyAgent.owner()).to.not.be.equal(user.address);
    await expect(PropertyAgent.connect(user).withdraw()).to.be.revertedWithCustomError(
      PropertyAgent,
      'OwnableUnauthorizedAccount'
    );
  });

  it('Should revert if contract has no balance', async function () {
    const { owner, PropertyAgent } = await loadFixture(deployPropertyAgentFixture);
    await expect(PropertyAgent.connect(owner).withdraw())
      .to.emit(PropertyAgent, 'WithdrawalMade')
      .withArgs(owner.address, 0);
  });
});
