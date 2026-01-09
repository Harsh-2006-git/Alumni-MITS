import { GoogleGenerativeAI } from "@google/generative-ai";

async function test() {
    try {
        const ai = new GoogleGenerativeAI(undefined);
        console.log("AI object keys:", Object.keys(ai));
        console.log("typeof ai.getGenerativeModel:", typeof ai.getGenerativeModel);
    } catch (err) {
        console.error("Test failed:", err);
    }
}

test();
