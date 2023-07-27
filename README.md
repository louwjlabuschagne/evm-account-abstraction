# Account Abstraction

## Introduction


## Deployments

```bash
curl $RPC_URL \
-X POST \
-H "Content-Type: application/json" \
-d '{"jsonrpc":"2.0","method":"eth_supportedEntryPoints","params":[],"id":0}'

> {"jsonrpc":"2.0","id":0,"result":["0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789"]}
```

- Testnet Entrypoint: `0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789`
- Mainnnet Entrypoint: `0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789`


## The Bundler APIs

+ the good stuff: https://docs.alchemy.com/reference/bundler-api-endpoints


## Gas Manager 

### Policies

https://docs.alchemy.com/reference/gas-manager-admin-api-endpoints

+ Create Policy: `POST https://manage.g.alchemy.com/api/gasManager/policy`
+ Get Policy: `GET https://manage.g.alchemy.com/api/gasManager/policy/{id}`
+ Delete Policy: `DELETE https://manage.g.alchemy.com/api/gasManager/policy/{id}`
+ Replace Policy: `PUT https://manage.g.alchemy.com/api/gasManager/policy/{id}`
+ Get All Policies: `GET https://manage.g.alchemy.com/api/gasManager/policies`
+ Update Policy Status: `PUT https://manage.g.alchemy.com/api/gasManager/policy/{id}/status`
+ Get Policy Stats: `GET https://manage.g.alchemy.com/api/gasManager/policy/{id}/stats`

### How to Sponsor a User Operation

1. Create a Gas Policy
2. Get paymasterAndData using `alchemy_requestGasAndPaymasterAndData`
3. Send the sponsored user operation - Once you get the `paymasterAndData`, you can use this to sponsor your `userOp`

### Gas Manager Deployment Addresses
Deployment addresses of Sponsoring Gas Manager ( Paymaster )
Polygon	0x4Fd9098af9ddcB41DA48A1d78F91F1398965addc	Polygon Deployment
Polygon Mumbai	0xC03Aac639Bb21233e0139381970328dB8bcEeB67	Polygon Mumbai Deployment


## AA-SDK?

```bash
curl --request POST \
     --url https://polygon-mumbai.g.alchemy.com/v2/WyHHe2ODdsPW95WxUMO_iXMvB2Hu0aWz \
     --header 'accept: application/json' \
     --header 'content-type: application/json' \
     --data '
{
  "id": 1,
  "jsonrpc": "2.0",
  "method": "eth_sendUserOperation",
  "params": [
    {
      "sender": "0x0be71941D041a32fe7DF4A61Eb2fCff3b03502C0",
      "nonce": "0x2a",
      "initCode": "0x",
      "callData": "0xb61d27f60000000000000000000000000be71941d041a32fe7df4a61eb2fcff3b03502c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000004d087d28800000000000000000000000000000000000000000000000000000000",
      "callGasLimit": "0x338C",
      "verificationGasLimit": "0xff",
      "preVerificationGas": "0xf458",
      "maxFeePerGas": "0x69682F14",
      "maxPriorityFeePerGas": "0x69682F00",
      "signature": "0xff",
      "paymasterAndData": "0xc03aac639bb21233e0139381970328db8bceeb67fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000000000000000000007aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1c"
    },
    "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789"
  ]
}
' 
```