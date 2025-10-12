## Based Barcelona Hackathon.
#
# You will need an API key, either from openAi groq or similar
# A free limited quota key can be obtained at https://console.groq.com/keys

# Base Agent Framework

# Follow the quickstart guide https://github.com/coinbase/agentkit?tab=readme-ov-file#-quickstart
#
# There is also a quick guide video here
#
# Choose the default option for each question

#
#  █████   ██████  ███████ ███    ██ ████████    ██   ██ ██ ████████ 
# ██   ██ ██       ██      ████   ██    ██       ██  ██  ██    ██    
# ███████ ██   ███ █████   ██ ██  ██    ██       █████   ██    ██    
# ██   ██ ██    ██ ██      ██  ██ ██    ██       ██  ██  ██    ██    
# ██   ██  ██████  ███████ ██   ████    ██       ██   ██ ██    ██    
#                                                                   
# Giving every AI agent a crypto wallet
#
#
# ✔ Project name: … onchain-agent
# ✔ Choose a framework: › Langchain
# ✔ Choose a network family: › Ethereum Virtual Machine (EVM)
# ✔ Choose network type: › Mainnet
# ✔ Choose a network: › base-mainnet
# ✔ Choose a wallet provider:
#   - CDPSmartWallet: Uses Coinbase Developer Platform (CDP)'s Smart Wallet.
#   - CDPEvmWallet: Uses Coinbase Developer Platform (CDP)'s EVM wallet.
#   - Viem: Client-side Ethereum wallet.
#   - Privy: Authentication and wallet infrastructure.
# › CDPSmartWallet (default)
# ✔ Creating onchain-agent...
#
# ...
# What's Next?
# 
# To get started, run the following commands:
#
#  - cd onchain-agent
#  - npm install    // You may get many security warnings, can be ignored
#
#  - # Open .env.local and configure your API keys
#  - mv .env.local .env   //  <-- IMPORTANT <-- <--
#
#  Setup your environment variables and mentioned in the README inside onchain-agent, for speed pasting below
#
# Get keys from OpenAI Platform: https://platform.openai.com/api-keys
# Get keys from CDP Portal: https://portal.cdp.coinbase.com/
# Optionally provide a private key, otherwise one will be generated
#
# REQUIRED - you can either use OPENAI OR GROQ, but you need an API key
# If you want to use another provider you need to enable it in app/api/agent/create-agent.ts
# 
# OPENAI_API_KEY= // get at https://platform.openai.com/api-keys
# GROQ_API_KEY= // get at https://console.groq.com/keys
# CDP_API_KEY_ID= // create here https://portal.cdp.coinbase.com/
# CDP_API_KEY_SECRET= // also listed in the creation above
# CDP_WALLET_SECRET= // missing in docs, see here https://docs.cdp.coinbase.com/api-reference/v2/authentication#wallet-secret
#                       In the first section 1. Create Wallet Secret , access portal link -> Wallets -> Wallet Secret
#
# At this point we will differ slightly from the instructions, instead of npm run dev, we build a production server
# if you are not installing from scratch (not using the based barcelona repo) you need to install next and react
#
# npm install next react react-dom @langchain/groq --save
#
# - build the system
#
# /usr/bin/nodejs node_modules/.bin/next build
#
# - start the server 
#
# /usr/bin/nodejs node_modules/.bin/next start
#
# access on 3000
#
# You should now be able to chat to your chatbot, try for example asking it for some memecoins on base and their prices.
#
# Before we continue we should brush up on some important core concepts, access
# https://docs.cdp.coinbase.com/agent-kit/core-concepts/agents-actions
#
# In particular understand the Agent Actions, we will use this heavily in creating our own custom Action Provider.
#
# A custom provider has been created in the repository at 





