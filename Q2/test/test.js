const { expect } = require('chai')
const { ethers } = require('hardhat')
const fs = require('fs')
const { groth16, plonk } = require('snarkjs')

function unstringifyBigInts(o) {
  if (typeof o == 'string' && /^[0-9]+$/.test(o)) {
    return BigInt(o)
  } else if (typeof o == 'string' && /^0x[0-9a-fA-F]+$/.test(o)) {
    return BigInt(o)
  } else if (Array.isArray(o)) {
    return o.map(unstringifyBigInts)
  } else if (typeof o == 'object') {
    if (o === null) return null
    const res = {}
    const keys = Object.keys(o)
    keys.forEach((k) => {
      res[k] = unstringifyBigInts(o[k])
    })
    return res
  } else {
    return o
  }
}

describe('HelloWorld', function () {
  let Verifier
  let verifier

  beforeEach(async function () {
    Verifier = await ethers.getContractFactory(
      'contracts/HelloWorldVerifier.sol:HelloWorldVerifier',
    )
    verifier = await Verifier.deploy()
    await verifier.deployed()
  })

  it('Should return true for correct proof', async function () {
    //[assignment] Add comments to explain what each line is doing
    //This enters the two private inputs into the circuit
    const { proof, publicSignals } = await groth16.fullProve(
      { a: '1', b: '2' },
      'contracts/circuits/HelloWorld/HelloWorld_js/HelloWorld.wasm',
      'contracts/circuits/HelloWorld/circuit_final.zkey',
    )
    //prints out the public output from the circuit
    console.log('1x2 =', publicSignals[0])

    const editedPublicSignals = unstringifyBigInts(publicSignals)
    const editedProof = unstringifyBigInts(proof)
    //generate solidity compliant arguments
    const calldata = await groth16.exportSolidityCallData(
      editedProof,
      editedPublicSignals,
    )

    const argv = calldata
      .replace(/["[\]\s]/g, '')
      .split(',')
      .map((x) => BigInt(x).toString())

    const a = [argv[0], argv[1]]
    const b = [
      [argv[2], argv[3]],
      [argv[4], argv[5]],
    ]
    const c = [argv[6], argv[7]]
    const Input = argv.slice(8)
    //pass in formatted inputs to solidity contract
    expect(await verifier.verifyProof(a, b, c, Input)).to.be.true
  })
  it('Should return false for invalid proof', async function () {
    let a = [0, 0]
    let b = [
      [0, 0],
      [0, 0],
    ]
    let c = [0, 0]
    let d = [0]
    expect(await verifier.verifyProof(a, b, c, d)).to.be.false
  })
})

describe('Multiplier3 with Groth16', function () {
  let Verifier
  let verifier
  beforeEach(async function () {
    //[assignment] insert your script
    Verifier = await ethers.getContractFactory('MultiplierGrothVerifier')
    verifier = await Verifier.deploy()
    await verifier.deployed()
  })

  it('Should return true for correct proof', async function () {
    //[assignment] insert your script here
    const { proof, publicSignals } = await groth16.fullProve(
      { a: '1', b: '2', c: '3' },
      'contracts/circuits/Multiplier3-groth/Multiplier3_js/Multiplier3.wasm',
      'contracts/circuits/Multiplier3-groth/circuit_final.zkey',
    )

    console.log('1*2*3=', publicSignals[0])

    const editedPublicSignals = unstringifyBigInts(publicSignals)
    const editedProof = unstringifyBigInts(proof)

    const calldata = await groth16.exportSolidityCallData(
      editedProof,
      editedPublicSignals,
    )
    const argv = calldata
      .replace(/["[\]\s]/g, '')
      .split(',')
      .map((x) => BigInt(x).toString())

    const a = [argv[0], argv[1]]
    const b = [
      [argv[2], argv[3]],
      [argv[4], argv[5]],
    ]
    const c = [argv[6], argv[7]]
    const Input = argv.slice(8)

    expect(await verifier.verifyProof(a, b, c, Input)).to.be.true
  })
  it('Should return false for invalid proof', async function () {
    //[assignment] insert your script here
    let a = [0, 0]
    let b = [
      [0, 0],
      [0, 0],
    ]
    let c = [0, 0]
    let d = [0]
    expect(await verifier.verifyProof(a, b, c, d)).to.be.false
  })
})

describe('Multiplier3 with PLONK', function () {
  let Verifier
  let verifier
  beforeEach(async function () {
    //[assignment] insert your script here
    Verifier = await ethers.getContractFactory('PlonkVerifier')
    verifier = await Verifier.deploy()
    await verifier.deployed()
  })

  it('Should return true for correct proof', async function () {
    //[assignment] insert your script here
    const { proof, publicSignals } = await plonk.fullProve(
      { a: '1', b: '2', c: '3' },
      'contracts/circuits/Multiplier3-plonk/Multiplier3_js/Multiplier3.wasm',
      'contracts/circuits/Multiplier3-plonk/circuit_final.zkey',
    )

    console.log('1*2*3=', publicSignals[0])

    const text = fs.readFileSync(
      'contracts/circuits/Multiplier3-plonk/call.txt',
      'utf-8',
    )
    const calldata = text.split(',')
    //console.log(calldata);
    expect(await verifier.verifyProof(calldata[0], JSON.parse(calldata[1]))).to
      .be.true
  })
  it('Should return false for invalid proof', async function () {
    const text = fs.readFileSync(
      'contracts/circuits/Multiplier3-plonk/call.txt',
      'utf-8',
    )
    const nulldata =
      '0x00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000011647579636577746665796575646b746563000000000000000000000000000000'
    //[assignment] insert your script here
    expect(await verifier.verifyProof(nulldata, [1, 5, 6, 6])).to.be.true
  })
})
