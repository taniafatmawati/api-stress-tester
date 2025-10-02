// StressTest.js
// Generic API Stress Testing Tool (Academic Showcase)
// Demonstrates throughput, latency, and error rate measurement

require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const { performance } = require('perf_hooks');

// --- Helper: Generate random payload ---
function generatePayload(sizeKB) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const size = sizeKB * 1024;
    return Array.from({ length: size }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
}

// --- Generic API Call Function ---
async function callAPI(endpoint, method, payloadKB) {
    const url = `${process.env.BASE_URL}${endpoint}`;
    const data = payloadKB > 0 ? { payload: generatePayload(payloadKB) } : {};

    await axios({
        method,
        url,
        data
    });
}

// --- Stress Test Function ---
async function runStressTest(apiName, endpoint, method, users, payloadKB) {
    let success = 0, errors = 0, totalLatency = 0, maxLatency = 0;

    const tasks = Array.from({ length: users }, async () => {
        const start = performance.now();
        try {
            await callAPI(endpoint, method, payloadKB);
            success++;
        } catch {
            errors++;
        } finally {
            const latency = performance.now() - start;
            totalLatency += latency;
            if (latency > maxLatency) maxLatency = latency;
        }
    });

    const t0 = performance.now();
    await Promise.all(tasks);
    const totalTime = (performance.now() - t0) / 1000;

    const throughput = (success / totalTime).toFixed(2);
    const avgLatency = (totalLatency / (success || 1)).toFixed(2);
    const errorRate = ((errors / users) * 100).toFixed(2);

    const result = { apiName, users, payloadKB, throughput, avgLatency, maxLatency: maxLatency.toFixed(2), errorRate };

    // Save CSV
    const header = "API,Users,PayloadKB,Throughput,AvgLatency,MaxLatency,ErrorRate\n";
    if (!fs.existsSync("results.csv")) fs.writeFileSync("results.csv", header);
    fs.appendFileSync("results.csv", `${apiName},${users},${payloadKB},${throughput},${avgLatency},${result.maxLatency},${errorRate}\n`);

    console.log(result);
}

// --- Main Execution ---
(async () => {
    console.log("Starting API stress tests...");

    const scenarios = [
        { users: 10, payloadKB: 0.1 },
        { users: 100, payloadKB: 0.1 },
        { users: 500, payloadKB: 0.1 }
    ];

    // Example: two endpoints from .env
    for (const s of scenarios) {
        await runStressTest("API_Endpoint1", process.env.ENDPOINT_1, "POST", s.users, s.payloadKB);
        await runStressTest("API_Endpoint2", process.env.ENDPOINT_2, "POST", s.users, s.payloadKB);
    }

    console.log("Done. Results saved to results.csv");
})();
