# 🚀 API Stress Test

## Project Overview

This is a **lightweight API stress testing tool** implemented in Node.js for **academic demonstration and learning**, focusing on clarity and reproducibility for easy understanding. It serves as an academic showcase to illustrate the fundamental concepts of:

* Concurrent request handling
* Measuring throughput (TPS), latency, and error rate
* Exporting structured CSV results for analysis

Unlike production-grade testing frameworks (e.g., JMeter, Locust), this project is intentionally lightweight (~200 lines of code) to make the methodology easy to understand and adapt.

**⚠️ Disclaimer:**
This repository is strictly for **educational purposes only**. Do **not** run these tests against third‑party or production systems without **explicit written permission**. Misuse can be illegal, unethical, or cause service disruption.

---

## Features / Capabilities

|                    Feature | Description                                       | Notes                                            |
| -------------------------: | ------------------------------------------------- | ------------------------------------------------ |
|   **Generic REST support** | Works with any REST endpoint configured in `.env` | Send POST requests with optional random payloads |
| **Throughput measurement** | Calculates transactions per second (TPS)          | Based on successful requests / total test time   |
|     **Latency statistics** | Captures average and maximum latency (ms)         | Measured with `perf_hooks.performance.now()`     |
|   **Error rate reporting** | Records failures and computes error percentage    | Failures counted per concurrent user task        |
|             **CSV export** | Appends structured results to `results.csv`       | Reproducible output for plotting / reporting     |
|   **Minimal dependencies** | `axios`, `dotenv`                                 | Easy to inspect & adapt                          |

---

## Requirements

* **Node.js** v16+ (v18 recommended)
* **npm** or **yarn**
* Packages:

  * `axios`
  * `dotenv`

---

## Installation

1. Clone the repository:

```bash
git clone https://github.com/taniafatmawati/api-stress-tester.git
cd api-stress-tester
```

2. Install dependencies:

```bash
npm install axios dotenv
# or
# yarn add axios dotenv
```

3. Copy example environment file and edit:

```bash
cp .env.example .env
```

Edit `.env` to point to your target API:

```env
BASE_URL=https://jsonplaceholder.typicode.com
ENDPOINT_1=/posts
ENDPOINT_2=/comments
```

> Keep endpoints limited to lab/test systems only (localhost, staging, or intentionally vulnerable test targets).

---

## Important usage notes (read first)

* **Always run from project root** (where `StressTest.js` and `.env` live).
* This tool is intentionally simple — it **does not** include advanced rate limiting, distributed load, or sophisticated ramp-up strategies. Use it only for small-scale experiments and teaching.
* The script writes `results.csv` in the project root — avoid committing this file to Git if it contains sensitive data.
* Running high concurrency locally may saturate your network or CPU — monitor system resources.
* If you need to adapt or extend the behavior, modify the `scenarios` array or `runStressTest()` in `StressTest.js`.

---

## CLI / Execution

> Examples assume you are in the project root and `.env` is configured.

### Run the stress test

```bash
node StressTest.js
```

### Example with Node path (virtual envs or specific node versions)

```bash
# If you use a specific node binary:
/usr/bin/node StressTest.js
```

**What the script does (default `StressTest.js` behavior):**

* Generates a small random payload (configurable per scenario).
* Starts N concurrent tasks (users) per scenario.
* Waits for all tasks to finish and records:

  * successful requests
  * errors
  * total test time
  * average & max latency
* Appends a CSV row to `results.csv`.

---

## Results / Output

**CSV file generated:** `results.csv`
CSV header: `API,Users,PayloadKB,Throughput,AvgLatency,MaxLatency,ErrorRate`

**Example table (for README clarity):**

| API           | Users | Payload KB | Throughput (TPS) | Avg Latency (ms) | Max Latency (ms) | Error Rate (%) |
| ------------- | ----: | ---------: | ---------------: | ---------------: | ---------------: | -------------: |
| API_Endpoint1 |   100 |        0.1 |           120.50 |            12.30 |            45.70 |           0.00 |
| API_Endpoint2 |   100 |        0.1 |            95.20 |            18.50 |            63.40 |           2.00 |

Console prints a JSON-like summary for each scenario and endpoint during execution.

---

## Script overview (`StressTest.js`)

High-level functions and behavior:

* `generatePayload(sizeKB)` — create a pseudo-random string payload of approximately `sizeKB` kilobytes.
* `callAPI(endpoint, method, payloadKB)` — sends an HTTP request using `axios` to `${BASE_URL}${endpoint}`.
* `runStressTest(apiName, endpoint, method, users, payloadKB)` — launches `users` concurrent calls, measures success/errors/latency, computes throughput and writes CSV row.
* Main execution loops through a small `scenarios` array (e.g., 10, 100, 500 users) and runs tests for `ENDPOINT_1` and `ENDPOINT_2`.

> See `StressTest.js` in the repo for the full implementation and to adapt scenarios, HTTP methods, or payload strategies.

---

## Safety & Ethics

This project is for **education and research only**. Follow these rules:

* Use **isolated lab environments** (local VMs, containers, staging servers).
* **Never** run stress tests against third-party production services without explicit written permission. This can cause downtime and legal consequences.
* Prefer intentionally vulnerable or test targets when learning (local mock servers, `jsonplaceholder.typicode.com` for harmless GETs, or your own test API).
* Do **not** commit logs, captured payloads, credentials, or any sensitive artifact to source control. Sanitize data before sharing.
* If in doubt, stop and obtain authorization before proceeding.

---

## Troubleshooting & Tips

* If `axios` requests hang, check `BASE_URL` and network reachability.
* To debug request failures, add a try/catch with `console.error(err.response?.status, err.message)` in `callAPI`.
* For very large concurrency, consider distributed tools (Locust, k6) — this repo is **not** intended to replace them.
* Use low `users` values first (10, 50) and inspect results before scaling to 100s+.
* If Node runs out of memory under high payloads, reduce `payloadKB` or increase process memory: `node --max-old-space-size=4096 StressTest.js`.

---

## Possible Extensions (ideas for academic work)

* Add `GET`, `PUT`, `DELETE` method support and per-endpoint method configuration.
* Implement a configurable load ramp-up / steady-state / cool-down schedule.
* Add more detailed percentiles (p50, p95, p99) for latency analysis.
* Integrate with plotting tools (Matplotlib via exported CSV, Excel, or a Jupyter notebook) for visualization.
* Add optional authentication headers, custom headers, or multipart payload support.
* Parallelize across multiple machines or containers for larger distributed load tests (with care & permission).

---
