const fs = require('fs')
const solidityRegex = /pragma solidity \^\d+\.\d+\.\d+/

const verifierRegex = /contract Verifier/

let content = fs.readFileSync('./contracts/HelloWorldVerifier.sol', {
  encoding: 'utf-8',
})
let bumped = content.replace(solidityRegex, 'pragma solidity ^0.8.0')
bumped = bumped.replace(verifierRegex, 'contract HelloWorldVerifier')

fs.writeFileSync('./contracts/HelloWorldVerifier.sol', bumped)

// [assignment] add your own scripts below to modify the other verifier contracts you will build during the assignment
//groth-16
content = fs.readFileSync('./contracts/Multiplier3-groth16.sol', {
  encoding: 'utf-8',
})
bumped = content.replace(solidityRegex, 'pragma solidity ^0.8.0')
bumped = bumped.replace(verifierRegex, 'contract MultiplierGrothVerifier')

fs.writeFileSync('./contracts/Multiplier3-groth16.sol', bumped)

// //plonk
content = fs.readFileSync('./contracts/Multiplier3-plonk.sol', {
  encoding: 'utf-8',
})
bumped = content.replace(solidityRegex, 'pragma solidity ^0.8.0')
bumped = bumped.replace(verifierRegex, 'contract MultiplierPlonkVerifier')

fs.writeFileSync('./contracts/Multiplier3-plonk.sol', bumped)
