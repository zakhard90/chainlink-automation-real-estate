import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const NftModule = buildModule("NftModule", (m) => {
  const nft = m.contract("RealEstateNft", [], {});
  return { nft };
});

export default NftModule;
