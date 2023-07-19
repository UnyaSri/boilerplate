// a fair secure multiparty lottery
// each player i choose a random number n_i and the winner is the w-th player
// where w = (n_0 + n_1 + ... + n_(N-1)) mod N

// Read a Medium article about this contract
//https://xiaohuiliu.medium.com/secure-multiparty-computations-on-bitcoin-953a64843b94

import { assert } from "console";
import { FixedArray, PubKey, Sha256, Sig, SmartContract, hash256, int2ByteString, method, prop } from "scrypt-ts";


export class Lottery extends SmartContract{
    @prop()
    readonly players : FixedArray<PubKey, 5>
    
    @prop()
    readonly nonceHashes : FixedArray<Sha256, 5>

    constructor(players : FixedArray<PubKey, 5>, nonceHashes : FixedArray<Sha256, 5>){
        super(...arguments)
        this.players = players
        this.nonceHashes = nonceHashes
    }

    @method()
    public reveal(nonce : FixedArray<bigint, 5>, sig : Sig){
        let i = 0
        let sum = 0

        for(let i = 0; i < 5; i ++){
            assert(hash256(int2ByteString(BigInt(nonce[i]))) == this.nonceHashes[i])

            sum += Number(nonce[i])
            i++ 
        }

        const winner : PubKey = this.players[sum % 5]

        assert(this.checkSig(sig, winner))
    }
}
