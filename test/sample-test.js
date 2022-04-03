const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("HelloWord", function () {
  const message = "Hello World!!";
  const secondMes = "Mas mayf";
  it('should return message ', async function () {
    const HelloWorld = await ethers.getContractFactory('HelloWorld');
    const helloWorld = await HelloWorld.deploy(message);
    await helloWorld.deployed();
    expect(await helloWorld.print()).to.be.equal(message);
    await helloWorld.updateMessage(secondMes);
    expect(await helloWorld.print()).to.be.equal(secondMes);
  });
});
