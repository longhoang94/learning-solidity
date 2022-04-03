const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Sample Token", function () {
    let sampleToken;
    const amount = 100;
    let [accA, accB, accC] = [];
    const totalSupply = 10000;
    beforeEach(async () => {
        [accA, accB, accC] = await ethers.getSigners();
        const SampleToken = await ethers.getContractFactory("SampleToken");
        sampleToken = await SampleToken.deploy();
        await sampleToken.deployed();
    })

    describe("Transfer", function () {
        it('should revert if transfer > 10000 ', async function () {
            await expect(sampleToken.transfer(accB.address, 10001)).to.be.reverted;
        });

        it('work correctly', async function () {
            let transferTx = await sampleToken.transfer(accB.address, amount);
            expect(await sampleToken.balanceOf(accA.address)).to.be.equal(totalSupply - amount);
            expect(await sampleToken.balanceOf(accB.address)).to.be.equal(amount);
            await expect(transferTx).to.emit(sampleToken, "Transfer").withArgs(accA.address, accB.address, amount);
        });
    });

    describe("Transfer From", function () {
        it('should revert if ... ', async function () {
            await expect(sampleToken.transferFrom(accA.address, accB.address, 10001)).to.be.reverted;
        });

        it('should revert if ... ', async function () {
            await expect(sampleToken.transferFrom(accA.address, accB.address, 2)).to.be.reverted;
        });

        it('work correctly', async function () {
            let approveTx = await sampleToken.approve(accB.address, amount);
            let transferFromTx = await sampleToken.connect(accB).transferFrom(accA.address, accB.address, amount);
            expect(await sampleToken.balanceOf(accA.address)).to.be.equal(totalSupply - amount);
            expect(await sampleToken.balanceOf(accB.address)).to.be.equal(amount);
            await expect(approveTx).to.emit(sampleToken, "Approval").withArgs(accA.address, accB.address, amount);
            await expect(transferFromTx).to.emit(sampleToken, "Transfer").withArgs(accA.address, accB.address, amount);
        });
    });

    describe("Approve", function () {
        it('work correctly', async function () {
            let approveTx = await sampleToken.approve(accC.address, amount);
            expect(await sampleToken.allowance(accA.address, accC.address)).to.be.equal(amount);
            await expect(approveTx).to.emit(sampleToken, "Approval").withArgs(accA.address, accC.address, amount);
        });
    });

    describe("common", function () {

        it('balance account A should return value ', async function () {
            expect(await sampleToken.balanceOf(accA.address)).to.be.equal(totalSupply);
        });

        it('balance account B should return value ', async function () {
            expect(await sampleToken.balanceOf(accB.address)).to.be.equal(0);
        });

        it('allowance acc A to acc B should return value ', async function () {
            expect(await sampleToken.allowance(accA.address, accB.address)).to.be.equal(0);
        });
    });
});
