const { expect } = require('chai')
const { ethers } = require('hardhat')
const fs = require('fs')
const { groth16, plonk } = require('snarkjs')

describe('LessThan10', function () {
  let Verifier
  let verifier

  beforeEach(async function () {
    Verifier = await ethers.getContractFactory('PlonkVerifier')
    verifier = await Verifier.deploy()
    await verifier.deployed()
  })

  it('Should return an output', async function () {
    //[assignment] Add comments to explain what each line is doing
    //This enters the two private inputs into the circuit
    const { proof, publicSignals } = await plonk.fullProve(
      { in: '10' },
      'contracts/circuits/LessThan10/LessThan10_js/LessThan10.wasm',
      'contracts/circuits/LessThan10/circuit_final.zkey',
    )

    console.log(publicSignals[0])

    // const text = fs.readFileSync(
    //   'contracts/circuits/Multiplier3-plonk/call.txt',
    //   'utf-8',
    // )
    // const calldata = text.split(',')
  })
})
