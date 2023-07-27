import {
    // alchemyPaymasterAndDataMiddleware,
    getChain,
    SimpleSmartContractAccount,
    UserOperationCallData,
} from "@alchemy/aa-core";
import { Alchemy, Network } from "alchemy-sdk";
import { Wallet } from "@ethersproject/wallet";
import {
    EthersProviderAdapter,
    convertWalletToAccountSigner,
} from "@alchemy/aa-ethers";

import { Contract } from "@ethersproject/contracts";

import dotenv from "dotenv";

const main = async () => {

    dotenv.config();

    const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;
    const WALLET_MNEMONIC = process.env.WALLET_MNEMONIC ?? "";
    const ENTRYPOINT_ADDRESS = process.env.ENTRYPOINT_ADDRESS ?? "";
    const ERC20_CONTRACT_ADDRESS = process.env.ERC20_CONTRACT_ADDRESS ?? "";
    const DESTINATION_ADDRESS = process.env.DESTINATION_ADDRESS ?? "";
    const SMART_ACCOUNT_ADDRESS = process.env.SMART_ACCOUNT_ADDRESS ?? "";
    const SIMPLE_ACCOUNT_FACTORY_ADDRESS =
        "0x9406Cc6185a346906296840746125a0E44976454";

    console.log({ ALCHEMY_API_KEY, WALLET_MNEMONIC, ENTRYPOINT_ADDRESS });

    if (!WALLET_MNEMONIC) {
        throw new Error("Please set the WALLET_MNEMONIC env variable");
    }
    if (!ALCHEMY_API_KEY) {
        throw new Error("Please set the ALCHEMY_API_KEY env variable");
    }
    if (!ENTRYPOINT_ADDRESS) {
        throw new Error("Please set the ENTRYPOINT_ADDRESS env variable");
    }
    if (!ERC20_CONTRACT_ADDRESS) {
        throw new Error("Please set the ERC20_CONTRACT_ADDRESS env variable");
    }

    if (!DESTINATION_ADDRESS) {
        throw new Error("Please set the DESTINATION_ADDRESS env variable");
    }



    // 1. connect to an RPC Provider and a Wallet
    const alchemy = new Alchemy({
        apiKey: ALCHEMY_API_KEY,
        network: Network.MATIC_MUMBAI,
    });
    const alchemyProvider = await alchemy.config.getProvider();
    const owner = Wallet.fromMnemonic(WALLET_MNEMONIC);
    console.log({ owner });

    // 2. Create the SimpleAccount signer
    // signer is an ethers.js Signer
    const signer = EthersProviderAdapter.fromEthersProvider(
        alchemyProvider,
        `0x${ENTRYPOINT_ADDRESS}`
    ).connectToAccount(
        (rpcClient) =>
            new SimpleSmartContractAccount({
                entryPointAddress: `0x${ENTRYPOINT_ADDRESS}`,
                chain: getChain(alchemyProvider.network.chainId),
                owner: convertWalletToAccountSigner(owner),
                factoryAddress: SIMPLE_ACCOUNT_FACTORY_ADDRESS,
                accountAddress: `0x${SMART_ACCOUNT_ADDRESS}`,
                rpcClient,
            })
    );

    console.log({ signer });

    const erc20abi = [
        "function balanceOf(address owner) view returns (uint256)",
        "function transfer(address to, uint amount)",
    ];

    const erc20 = new Contract(
        ERC20_CONTRACT_ADDRESS,
        erc20abi,
        signer
    );

    // get transfer calldata
    const calldata = erc20.interface.encodeFunctionData("transfer", [
        DESTINATION_ADDRESS,
        100,
    ]);
    console.log({ calldata });

    signer.getAddress().then((address) => console.log({ address }));

    // 3. send a user op
    const receipt = await signer.sendUserOperation(
        {
            target: ERC20_CONTRACT_ADDRESS,
            data: calldata,
            value: 0,
            gasPrice: 3e9,

        } as unknown as UserOperationCallData
    );

    console.log({ receipt });


}

main().then(() => console.log("done")).catch((e) => console.error(e));