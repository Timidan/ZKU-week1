cd contracts/circuits/Multiplier3-plonk


# generate witness
node "Multiplier3_js/generate_witness.js" Multiplier3_js/Multiplier3.wasm input.json witness.wtns

# generate proof
snarkjs plonk prove circuit_final.zkey witness.wtns proof.json public.json

# verify proof
snarkjs plonk verify verification_key.json public.json proof.json

# generate call
snarkjs zkey export soliditycalldata public.json proof.json > call.txt