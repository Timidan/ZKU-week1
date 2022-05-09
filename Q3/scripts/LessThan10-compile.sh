#!/bin/bash

# [assignment] create your own bash script to compile Multipler3.circom using PLONK below
cd contracts/circuits

mkdir LessThan10

if [ -f ./powersOfTau28_hez_final_10.ptau ]; then
    echo "powersOfTau28_hez_final_10.ptau already exists. Skipping."
else
    echo 'Downloading powersOfTau28_hez_final_10.ptau'
    wget https://hermez.s3-eu-west-1.amazonaws.com/powersOfTau28_hez_final_10.ptau
fi

echo 'Compiling Multiplier3 with plonk'

#compile circuit

circom LessThan10.circom --r1cs --wasm --sym -o LessThan10
snarkjs r1cs info LessThan10/LessThan10.r1cs

snarkjs plonk setup LessThan10/LessThan10.r1cs powersOfTau28_hez_final_10.ptau LessThan10/circuit_final.zkey
snarkjs zkey export verificationkey LessThan10/circuit_final.zkey LessThan10/verification_key.json
snarkjs zkey export solidityverifier LessThan10/circuit_final.zkey ../LessThan10.sol

cd ../..