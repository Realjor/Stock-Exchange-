import { describe, expect, it, vi } from "vitest";
import { Engine } from "../trade/Engine";

import { CREATE_ORDER } from "../types/fromapi";
vi.mock("../RedisManager", () => ({
    RedisManager: {
      getInstance: () => ({
        publishMessage: vi.fn(),
        sendToApi: vi.fn(),
        pushMessage: vi.fn()
      })
    }
}));

describe("Engine", () => {
    //TODO: How to test the singleton class RedisManager directly?
    it("Publishes Trade updates", () => {
        const engine = new Engine();
        const publishSpy = vi.spyOn(engine as any, "publishWsTrades");
        engine.process({
            message: {
                type: CREATE_ORDER,
                data: {
                    market: "TATA_INR",
                    price: "1000",
                    quantity: "1",
                    side: "buy",
                    userId: "1"
                }
            },
            clientId: "1"
        });
        engine.process({
            message: {
                type: CREATE_ORDER,
                data: {
                    market: "TATA_INR",
                    price: "1001",
                    quantity: "1",
                    side: "sell",
                    userId: "2"
                }
            },
            clientId: "1"
        });
        
        expect(publishSpy).toHaveBeenCalledTimes(2);

    });
});