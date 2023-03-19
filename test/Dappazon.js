const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};
const ID = 1;
const NAME = "Shoes";
const CATEGORY = "Clothing";
const IMAGE =
  "https://ipfs.io/ipfs/QmTYEboq8raiBs7GTUg2yLXB3PMz6HuBNgNfSZBx5Msztg/shoes.jpg";
const COST = tokens(1);
const RATING = 4;
const STOCK = 5;
describe("Dappazon", () => {
  let dappazon;
  let deployer;
  let buyer;
  beforeEach(async () => {
    // setup Account
    [deployer, buyer] = await ethers.getSigners();

    // Deploy contract
    const Dappazon = await ethers.getContractFactory("Dappazon");
    dappazon = await Dappazon.deploy();
  });

  describe("Deployment", () => {
    it("Sets the owner", async () => {
      expect(await dappazon.owner()).to.equal(deployer.address);
    });
  });

  describe("Listing", () => {
    let transaction;

    beforeEach(async () => {
      transaction = await dappazon
        .connect(deployer)
        .list(1, "Shoes", "Clothing", "Image", 1, 4, 5);

      await transaction.wait();
    });
    it("Returns item attributes", async () => {
      const item = await dappazon.items(1);
      expect(item.id).to.equal(1);
    });
  });

  describe("buy", () => {
    let transaction;
    beforeEach(async () => {
      // List a item
      transaction = await dappazon
        .connect(deployer)
        .list(ID, NAME, CATEGORY, IMAGE, COST, RATING, STOCK);
      await transaction.wait();

      // Buy a item
      transaction = await dappazon.connect(buyer).buy(ID, { value: COST });
      await transaction.wait();
    });
  });
});
