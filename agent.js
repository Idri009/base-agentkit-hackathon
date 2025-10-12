import {
  AgentKit,
  CdpWalletProvider,
  walletActionProvider,
  erc721ActionProvider,
  cdpApiActionProvider,
  cdpWalletActionProvider,
  pythActionProvider,
} from "@coinbase/agentkit";
//import {
//  tradeStrategyActionProvider, // custom provider for based hackathon
//} from "@providers/tradeStrategyActionProvider";

const erc721 = erc721ActionProvider();
const pyth = pythActionProvider();
const wallet = walletActionProvider(); // default action package: get balance, native transfer, and get wallet details
const cdp = cdpApiActionProvider({ // for providers that require API keys include them in their instantiation
  apiKeyName: process.env.CDP_API_KEY_NAME,
  apiKeyPrivateKey: process.env.CDP_API_KEY_PRIVATE_KEY?.replace(/\\n/g, "\n"),
});
//const tsp = tradeStrategyActionProvider();

const agentKit = await AgentKit.from({
  walletProvider,
  actionProviders: [erc721, pyth, wallet, cdp],
});
