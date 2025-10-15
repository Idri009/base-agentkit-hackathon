# Based Barcelona Hackathon — Base Agent Framework

> Giving every AI agent a crypto wallet 🪙  
> Built with [Coinbase AgentKit](https://github.com/coinbase/agentkit) and designed for the **Based Barcelona Hackathon**.

---

## Requirements

You will need an **API key** — either from **OpenAI**, **Groq**, or another supported provider.

- Get a **free limited key** at [https://console.groq.com/keys](https://console.groq.com/keys)
- You may also use [OpenAI](https://platform.openai.com/api-keys)

---

## Quickstart Guide

Follow the official [Coinbase AgentKit Quickstart](https://github.com/coinbase/agentkit?tab=readme-ov-file#-quickstart).

There’s also a quick guide video linked in the repo.

When prompted, choose the **default options** for all setup questions.

---

### Example Setup Prompts

```text
✔ Project name: … onchain-agent
✔ Choose a framework: › Langchain
✔ Choose a network family: › Ethereum Virtual Machine (EVM)
✔ Choose network type: › Mainnet
✔ Choose a network: › base-mainnet
✔ Choose a wallet provider: › CDPSmartWallet (default)

 █████   ██████  ███████ ███    ██ ████████    ██   ██ ██ ████████ 
██   ██ ██       ██      ████   ██    ██       ██  ██  ██    ██    
███████ ██   ███ █████   ██ ██  ██    ██       █████   ██    ██    
██   ██ ██    ██ ██      ██  ██ ██    ██       ██  ██  ██    ██    
██   ██  ██████  ███████ ██   ████    ██       ██   ██ ██    ██    


cd onchain-agent
npm install

mv .env.local .env

# Choose one of the following LLM providers
OPENAI_API_KEY=sk-...             # get from https://platform.openai.com/api-keys
GROQ_API_KEY=...                  # get from https://console.groq.com/keys

# Coinbase Developer Platform
CDP_API_KEY_ID=...
CDP_API_KEY_SECRET=...
CDP_WALLET_SECRET=...             # create under Wallets -> Wallet Secret


# Build & Run

If you are not installing from scratch, make sure Next.js and React are installed:

npm install 

/usr/bin/nodejs node_modules/.bin/next build
/usr/bin/nodejs node_modules/.bin/next start


## Extra

Learn the Core Concepts

Before extending, read:
👉 AgentKit Core Concepts

🧩 Custom Action Providers

Pay close attention to Agent Actions — these are key for creating your own custom Action Providers.

Custom providers in app/providers/ , note the actions and annotations

Notes

The framework supports LangChain agents with Coinbase Smart Wallets.

You can integrate with EVM-compatible networks via CDP.

To persist strategies, data, or chain events — see app/api/strategies/ and app/providers/.




