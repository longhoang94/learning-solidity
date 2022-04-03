const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PETTY", function () {
    let petty;
    let amount = ethers.utils.parseUnits("100", "ether");
    let [accA, accB, accC] = [];
    let address0 = 0x0000000000000000000000000000000000000000;
    let uri = "facebook.com/";
    beforeEach(async () => {
        [accA, accB, accC] = await ethers.getSigners();
        const Petty = await ethers.getContractFactory("Petty");
        petty = await Petty.deploy();
        await petty.deployed();
    })

    describe("updateBaseTokenURI", function () {
        it('update base URI correctly', async function () {
            await petty.mint(accA.address);
            await petty.updateBaseTokenURI(uri);
            await expect(petty.tokenURI(1)).to.be.equal(uri + '1');
        });
    });

    describe("mint", function () {
        it('revert when address[0]', async function () {
            await expect(petty.mint(address0)).to.be.revertedWith("ERC172: mint to the zero address");
        });

        it('mint nft', async function () {
            let mintTx = await petty.mint(accA.address);
            await expect(mintTx).to.be.emit(petty, "Transfer").withArgs(address0, accA.address, 1);
            expect(await petty.balance(accA.address)).to.be.equal(1);
            expect(await petty.ownerOf(accA.address)).to.be.equal(accA.address);
            let mintTxB = await petty.mint(accA.address);
            await expect(mintTxB).to.be.emit(petty, "Transfer").withArgs(address0, accA.address, 2);
            expect(await petty.balance(accA.address)).to.be.equal(2);
            expect(await petty.ownerOf(accA.address)).to.be.equal(accA.address);
        });
    });

});