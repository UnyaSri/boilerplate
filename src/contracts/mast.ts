import { assert } from 'console'
import {
    ByteString,
    method,
    prop,
    Sha256,
    SmartContract,
    sha256,
    Utils,
    hash256,
    SigHash,
} from 'scrypt-ts'
import { MerklePath, MerkleProof } from 'scrypt-ts-lib'

// Merklized Abstract Syntax Trees/Merklized Alternative Script Trees
export class MAST extends SmartContract {
    @prop()
    merkleRoot: Sha256

    constructor(merkleRoot: Sha256) {
        super(...arguments)
        this.merkleRoot = merkleRoot
    }

    @method(SigHash.ANYONECANPAY_SINGLE)
    public main(branchScript: ByteString, merklePath: MerkleProof) {
        // validate branchScript is from the merkle tree
        assert(
            MerklePath.calcMerkleRoot(sha256(branchScript), merklePath) ==
                this.merkleRoot
        )

        // "P2SH": use branch script as the new locking script, while maintaining value
        const out = Utils.buildOutput(branchScript, this.ctx.utxo.value)
        assert(hash256(out) == this.ctx.hashOutputs, 'hashOutputs mismatch')
    }
}