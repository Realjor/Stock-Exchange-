// @ts-ignore
import { describe, expect, it, vi } from "vittest";
import { Engine } from "../trade/Engine";
import { ReddisManager } from "../redismanager";
import { CREATE_ORDER } from "../types/fromapi";


vi.mock("../RedisManager", () => ({
    ReddisManager: {
      getInstance: () => ({
        publishMessage: vi.fn(),
        sendToApi: vi.fn(),
        pushMessage: vi.fn()
      })
    }
}));


describe("Engine", () => {

    it("Publishes Trade updates", () => {
        const engine = new Engine();
        const publishSpy = vi.spyOn(engine, "publishWsTrades");
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