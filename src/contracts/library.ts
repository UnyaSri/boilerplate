import {assert} from 'console'
import {
   prop,
   SmartContractLib,
   SmartContract,
   method,

export class L extends SmartContractLib{

@prop()
x : bigint
@prop()
a : bigint
@prop()
b : bigint


constructor(x : bigint, a : bigint, b : bigint){
   super(...arguments)
   this.x = a + b

}

@method()
f () : bigint{
return this.x
}

}

export class Test extends SmartContract{
@prop()
x : bigint

@prop()
l : L
constructor(x:bigint, l:L){

super(...arguments)
this.x = x
this.l = l
}

  @method()
  public unlock(x : bigint){
  assert(this.l.f() == x + this.x,'not equal')
  }
}
