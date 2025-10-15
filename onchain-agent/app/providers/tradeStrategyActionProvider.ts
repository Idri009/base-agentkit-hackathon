// app/providers/tradeStrategyActionProvider.js
import fs from "fs";
import path from "path";
import { ActionProvider, CreateAction, Network} from "@coinbase/agentkit";
import { z, ZodTypeAny } from "zod";
import { broadcastStrategy } from "@/app/utils/strategyBroadcast";


// define the trading message
interface Strategy {
    id: string;
    symbol: string;
    contract: string;
    chainId: string;
    frequency: string;
    risk: string;
    active: boolean;
    createdAt: number;
    meta?: Record<string, unknown>;
}

// Define schema for a trade strategy
export const AddStrategySchema = z.object({
  symbol: z.string().describe("Trading symbol, e.g. BTC/USD"),
  contract: z.string().describe("Contract Address, e.g. 0x..."),
  chainId: z.string().describe("Chain ID, e.g. 8453"),
  frequency: z.string().describe("Trading frequency: low | medium | high"),
  risk: z.string().describe("Risk level: low | medium | high"),
  active: z.boolean().default(true).describe("Whether the strategy is active"),
  meta: z.record(z.string(), z.unknown()).optional().describe("Extra metadata for strategy"),
});
export const ListStrategiesSchema = z.object({});
export const RemoveStrategySchema = z.object({
  id: z.string().describe("ID of the strategy to remove"),
});
export const UpdateStrategySchema = AddStrategySchema.extend({
  id: z.string().describe("ID of the strategy to update"),
});

// fifo
const DATA_DIR = path.resolve("./data");
const STRATEGY_FILE = path.join(DATA_DIR, "strategies.json");

// ensure storage exists
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(STRATEGY_FILE)) fs.writeFileSync(STRATEGY_FILE, "[]", "utf8");

export class TradeStrategyActionProvider extends ActionProvider {

    // required for ts , wg :/
    running: boolean;
    _interval: NodeJS.Timeout | null;
    supportsNetwork: (network: Network) => boolean;

    constructor() {

        console.log("DEBUG - INIT TradeStrategyActionProvider")

        super("tradeStrategy", []);
        this.supportsNetwork = (network: Network) => true;

        this.running = false;
        this._interval = null;

    }

    @CreateAction({
      name: "addStrategy",
      description: `
        Adds a new trading strategy to persistent storage.
        Each strategy includes a symbol, frequency, risk level, and metadata.
      `,
      schema: AddStrategySchema,
    })
    async addStrategy(args = {
      symbol: "",
      contract: "",
      chainId: "",
      frequency: "medium",
      risk: "medium",
      active: false,
      meta: {}
    }) {
        const strategies = readStrategies();
        const newStrat = {
            id: Date.now().toString(),
            symbol: args.symbol || undefined,
            contract: args.contract || undefined,
            chainId: args.chainId || undefined,
            frequency: args.frequency || "medium",
            risk: args.risk || "medium",
            active: args.active !== false,
            createdAt: Date.now(),
            meta: args.meta || {},
        };
        if (!(newStrat.symbol && newStrat.contract && newStrat.chainId)) {
            throw new Error("addStrategy requires { symbol, contract, chainId }", { cause: newStrat });
        }
        strategies.push(newStrat);
        console.log("addStrategy newStrat",newStrat);
        writeStrategies(strategies);
        console.log("addStrategy strategies",strategies);

        broadcastStrategy(strategies);

        console.log("TradeStrategyActionProvider - adding new strategy", strategies)
        return JSON.stringify({ message: "Strategy added", strategy: newStrat });
    }

    @CreateAction({
      name: "listStrategies",
      description: "Lists all stored trading strategies.",
      schema: ListStrategiesSchema,
    })
    async listStrategies() {
        console.log("DEBUG - TradeStrategyActionProvider : listStrategies");
        const strategies = readStrategies();
        return JSON.stringify({ strategies });
    }

    @CreateAction({
      name: "removeStrategy",
      description: "Removes a strategy by its ID.",
      schema: RemoveStrategySchema,
    })
    async removeStrategy(args: { id: string | number } = { id: "" }) {
        const { id } = args;
        console.log("DEBUG - TradeStrategyActionProvider : removeStrategy", id);
        if (!id) throw new Error("removeStrategy requires { id }");
        let strategies = readStrategies();
        const before = strategies.length;
        strategies = strategies.filter((s:{id:string}) => s.id !== id);
        writeStrategies(strategies);
        broadcastStrategy(strategies);
        console.log("strategies",strategies);

        return JSON.stringify({
            message: "Strategy removed",
            id,
            removed: before - strategies.length,
        });
    }

    @CreateAction({
      name: "updateStrategy",
      description: "Updates a strategy’s configuration by ID.",
      schema: UpdateStrategySchema,
    })
    async updateStrategy(args: { id: string | number } = { id: "" }) {
        const { id } = args;
        console.log("DEBUG - TradeStrategyActionProvider : updateStrategy", id);
        if (!id) throw new Error("updateStrategy requires { id }");
        const strategies = readStrategies();
        const idx = strategies.findIndex((s:{id:string}) => s.id === id);
        if (idx === -1) throw new Error("Strategy not found");
        strategies[idx] = { ...strategies[idx], ...args, id };
        writeStrategies(strategies);
        broadcastStrategy(strategies);
        return JSON.stringify({ message: "Strategy updated", strategy: strategies[idx] });
    }

    // lightweight background loop (safe for a long-running Node process).
    runLoop(intervalMs = 60_000) {

        if (this.running) return;
        this.running = true;
        console.log("TradeStrategyActionProvider: starting loop every", intervalMs, "ms");
        this._interval = setInterval(() => {
          const strategies = readStrategies().filter((s:{id:string,active:boolean}) => s.active !== false);
          for (const s of strategies) {
            // <-- placeholder: do your price check / signal logic here
            console.log(`[tradeStrategy loop] eval ${s.id} symbol=${s.symbol} freq=${s.frequency} risk=${s.risk}`);
            // Example: publish to Redis / call execution action / write a signal file
          }
        }, intervalMs);

    }

    stopLoop() {

        if (this._interval) clearInterval(this._interval);
        this.running = false;
        this._interval = null;

    }

}

function readStrategies() {

    try {
      const raw = fs.readFileSync(STRATEGY_FILE, "utf8");
      return JSON.parse(raw || "[]");
    } catch (e) {
      console.error("readStrategies error", e);
      return [];
    }

}

function writeStrategies(arr: Strategy[]) {

    try {
      fs.writeFileSync(STRATEGY_FILE, JSON.stringify(arr, null, 2), "utf8");
    } catch (e) {
      console.error("writeStrategies error", e);
    }

}

export const tradeStrategyActionProvider = () => {
    const p = new TradeStrategyActionProvider();
    p.runLoop();
    return p;
};

