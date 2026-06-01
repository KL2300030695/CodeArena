// ============================================
// TCS NQT Coding Platform — Problem Definitions
// All 20 problems from TCS NQT 2026 + CodeChef
// ============================================

const PROBLEMS = [
  // ── Q1: Discount Calculator ──
  {
    id: 1,
    title: "Discount Calculator",
    difficulty: "Easy",
    category: "Conditional Logic",
    tags: ["Math", "Conditionals"],
    description: `A shopping mall offers discounts to customers based on their purchase amount. Your task is to calculate the final payable amount after applying the correct discount percentage.

**Discount Rules:**
- If the purchase amount is less than 1000 → **5% discount**
- If the purchase amount is ≥ 1000 and < 5000 → **10% discount**
- If the purchase amount is ≥ 5000 → **15% discount**`,
    inputFormat: "A single integer `amount` representing the total purchase value.",
    outputFormat: "Print the final amount after discount, rounded to 2 decimal places.",
    constraints: "1 ≤ amount ≤ 10⁶",
    examples: [
      { input: "2000", output: "1800.00", explanation: "2000 lies between 1000 and 5000 → 10% discount. Discount = 200. Final = 1800.00" },
      { input: "500", output: "475.00", explanation: "500 < 1000 → 5% discount. Discount = 25. Final = 475.00" },
      { input: "6000", output: "5100.00", explanation: "6000 ≥ 5000 → 15% discount. Discount = 900. Final = 5100.00" }
    ],
    testCases: [
      { input: "2000", output: "1800.00" },
      { input: "500", output: "475.00" },
      { input: "6000", output: "5100.00" },
      { input: "1000", output: "900.00" },
      { input: "4999", output: "4499.10" },
      { input: "5000", output: "4250.00" },
      { input: "999", output: "949.05" },
      { input: "1", output: "0.95" },
      { input: "100000", output: "85000.00" },
      { input: "10000", output: "8500.00" }
    ],
    hints: [
      "Use if-elif-else to check which slab the amount falls in.",
      "Calculate discount = amount × percentage / 100, then subtract from amount."
    ],
    editorial: `Simple conditional logic. Check the slab, compute discount, subtract from original amount. Format to 2 decimal places.

**Python:**
\`\`\`python
amount = int(input())
if amount < 1000:
    discount = 0.05
elif amount < 5000:
    discount = 0.10
else:
    discount = 0.15
print(f"{amount - amount * discount:.2f}")
\`\`\``,
    boilerplate: {
      python: `amount = int(input())\n# Your code here\n`,
      javascript: `const input = require('readline').createInterface({input: process.stdin});\nlet lines = [];\ninput.on('line', l => lines.push(l));\ninput.on('close', () => {\n  const amount = parseInt(lines[0]);\n  // Your code here\n});`,
      c: `#include <stdio.h>\n\nint main() {\n    int amount;\n    scanf("%d", &amount);\n    // Your code here\n    return 0;\n}`,
      java: `import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int amount = sc.nextInt();\n        // Your code here\n    }\n}`
    }
  },

  // ── Q2: Arrange the King's Army ──
  {
    id: 2,
    title: "Arrange the King's Army",
    difficulty: "Medium",
    category: "Combinatorics",
    tags: ["DP", "Counting"],
    description: `A king wants to arrange N soldiers in a line. Soldiers are numbered 1 to R.

**Rules:**
- The arrangement must **start with soldier 1**
- The arrangement must **end with soldier 'end'**
- No two adjacent soldiers can have the same number
- Any soldier number from 1 to R can be used multiple times

Find the total number of valid arrangements of length N.`,
    inputFormat: "Three integers: `N` `R` `end`",
    outputFormat: "A single integer representing the number of valid arrangements.",
    constraints: "2 ≤ N ≤ 20, 2 ≤ R ≤ 10, 1 ≤ end ≤ R",
    examples: [
      { input: "4 4 3", output: "7", explanation: "Valid sequences of length 4 starting with 1, ending with 3: 1-2-4-3, 1-2-1-3, 1-3-1-3, 1-3-2-3, 1-3-4-3, 1-4-2-3, 1-4-1-3 → 7 total" }
    ],
    testCases: [
      { input: "4 4 3", output: "7" },
      { input: "2 2 2", output: "1" },
      { input: "3 3 1", output: "2" },
      { input: "2 5 1", output: "0" },
      { input: "2 5 3", output: "1" },
      { input: "4 3 2", output: "3" },
      { input: "5 2 1", output: "1" },
      { input: "3 4 4", output: "2" }
    ],
    hints: [
      "Use dynamic programming. Let dp[i][j] = number of ways to arrange i soldiers where the last soldier has value j.",
      "Base case: dp[1][1] = 1, dp[1][other] = 0 (must start with 1).",
      "Transition: dp[i][j] = sum(dp[i-1][k]) for all k ≠ j."
    ],
    editorial: `**DP approach:**
Let dp[i][j] = number of arrangements of length i ending with value j.

Base: dp[1][1] = 1 (starts with 1)
Transition: dp[i][j] = Σ dp[i-1][k] for all k ≠ j (no adjacent same)
Answer: dp[N][end]

**Python:**
\`\`\`python
N, R, end = map(int, input().split())
dp = [[0]*(R+1) for _ in range(N+1)]
dp[1][1] = 1
for i in range(2, N+1):
    for j in range(1, R+1):
        for k in range(1, R+1):
            if k != j:
                dp[i][j] += dp[i-1][k]
print(dp[N][end])
\`\`\``,
    boilerplate: {
      python: `N, R, end = map(int, input().split())\n# Your code here\n`,
      javascript: `const input = require('readline').createInterface({input: process.stdin});\nlet lines = [];\ninput.on('line', l => lines.push(l));\ninput.on('close', () => {\n  const [N, R, end] = lines[0].split(' ').map(Number);\n  // Your code here\n});`,
      c: `#include <stdio.h>\n\nint main() {\n    int N, R, end;\n    scanf("%d %d %d", &N, &R, &end);\n    // Your code here\n    return 0;\n}`,
      java: `import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int N = sc.nextInt(), R = sc.nextInt(), end = sc.nextInt();\n        // Your code here\n    }\n}`
    }
  },

  // ── Q3: Parking Fine Calculation ──
  {
    id: 3,
    title: "Parking Fine Calculation",
    difficulty: "Easy",
    category: "Conditional Logic",
    tags: ["Conditionals"],
    description: `A parking system calculates fines based on the number of hours a vehicle is parked.

**Fine Rules:**
- Parking time ≤ 2 hours → fine = **100**
- Parking time > 2 and ≤ 5 hours → fine = **50**
- Parking time > 5 hours → fine = **20**`,
    inputFormat: "An integer `hours` representing parking duration.",
    outputFormat: "An integer representing the fine amount.",
    constraints: "1 ≤ hours ≤ 100",
    examples: [
      { input: "4", output: "50", explanation: "4 hours lies between 2 and 5, so the fine is 50." },
      { input: "1", output: "100", explanation: "1 hour ≤ 2, so the fine is 100." },
      { input: "10", output: "20", explanation: "10 hours > 5, so the fine is 20." }
    ],
    testCases: [
      { input: "4", output: "50" },
      { input: "1", output: "100" },
      { input: "10", output: "20" },
      { input: "2", output: "100" },
      { input: "5", output: "50" },
      { input: "3", output: "50" },
      { input: "6", output: "20" },
      { input: "100", output: "20" }
    ],
    hints: ["Simple if-elif-else based on hours."],
    editorial: `\`\`\`python
hours = int(input())
if hours <= 2:
    print(100)
elif hours <= 5:
    print(50)
else:
    print(20)
\`\`\``,
    boilerplate: {
      python: `hours = int(input())\n# Your code here\n`,
      javascript: `const input = require('readline').createInterface({input: process.stdin});\nlet lines = [];\ninput.on('line', l => lines.push(l));\ninput.on('close', () => {\n  const hours = parseInt(lines[0]);\n  // Your code here\n});`,
      c: `#include <stdio.h>\n\nint main() {\n    int hours;\n    scanf("%d", &hours);\n    // Your code here\n    return 0;\n}`,
      java: `import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int hours = sc.nextInt();\n        // Your code here\n    }\n}`
    }
  },

  // ── Q4: Maximum Sum ≤ Limit ──
  {
    id: 4,
    title: "Maximum Sum of Elements ≤ Given Limit",
    difficulty: "Medium",
    category: "DP / Subset",
    tags: ["DP", "Arrays", "Knapsack"],
    description: `You are given an array of integers of size n and an integer maxSum. Find the maximum possible sum of elements from the array such that the sum ≤ maxSum. You can select any subset of elements.`,
    inputFormat: `Integer n → size of array
Array arr[n] → elements
Integer maxSum`,
    outputFormat: "A single integer: maximum possible sum ≤ maxSum.",
    constraints: "1 ≤ n ≤ 20, 1 ≤ arr[i] ≤ 10⁴, 1 ≤ maxSum ≤ 10⁵",
    examples: [
      { input: "4\n3 5 7 10\n14", output: "13", explanation: "{3,10}→13 ✅, {5,7}→12, {3,5,7}→15 ❌ (exceeds). Maximum valid sum = 13" }
    ],
    testCases: [
      { input: "4\n3 5 7 10\n14", output: "13" },
      { input: "3\n1 2 3\n6", output: "6" },
      { input: "3\n1 2 3\n5", output: "5" },
      { input: "1\n5\n3", output: "0" },
      { input: "1\n5\n5", output: "5" },
      { input: "5\n2 3 5 7 11\n20", output: "20" },
      { input: "3\n10 20 30\n25", output: "20" },
      { input: "4\n1 1 1 1\n3", output: "3" }
    ],
    hints: [
      "Since n ≤ 20, you can enumerate all 2^n subsets.",
      "For each subset, compute the sum. Track the maximum sum that doesn't exceed maxSum."
    ],
    editorial: `**Bitmask enumeration** (n ≤ 20):
\`\`\`python
n = int(input())
arr = list(map(int, input().split()))
maxSum = int(input())
best = 0
for mask in range(1 << n):
    s = sum(arr[i] for i in range(n) if mask & (1 << i))
    if s <= maxSum:
        best = max(best, s)
print(best)
\`\`\``,
    boilerplate: {
      python: `n = int(input())\narr = list(map(int, input().split()))\nmaxSum = int(input())\n# Your code here\n`,
      javascript: `const input = require('readline').createInterface({input: process.stdin});\nlet lines = [];\ninput.on('line', l => lines.push(l));\ninput.on('close', () => {\n  const n = parseInt(lines[0]);\n  const arr = lines[1].split(' ').map(Number);\n  const maxSum = parseInt(lines[2]);\n  // Your code here\n});`,
      c: `#include <stdio.h>\n\nint main() {\n    int n, maxSum;\n    scanf("%d", &n);\n    int arr[n];\n    for (int i = 0; i < n; i++) scanf("%d", &arr[i]);\n    scanf("%d", &maxSum);\n    // Your code here\n    return 0;\n}`,
      java: `import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] arr = new int[n];\n        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();\n        int maxSum = sc.nextInt();\n        // Your code here\n    }\n}`
    }
  },

  // ── Q5: Soldier Arrangement (DP) ──
  {
    id: 5,
    title: "Soldier Arrangement",
    difficulty: "Medium",
    category: "DP / Combinatorics",
    tags: ["DP", "Counting"],
    description: `Arrange N soldiers in a line. Each soldier has a value from 1 to R. Count all valid arrangements satisfying:

**Rules:**
- The first soldier must have value = **1**
- The last soldier must have value = **end**
- No two adjacent soldiers can have the same value`,
    inputFormat: "Three integers: N, R, end",
    outputFormat: "A single integer representing the number of valid arrangements.",
    constraints: "2 ≤ N ≤ 20, 2 ≤ R ≤ 10, 1 ≤ end ≤ R",
    examples: [
      { input: "4 4 3", output: "7", explanation: "Valid sequences: 1-2-4-3, 1-2-1-3, 1-3-1-3, 1-3-2-3, 1-3-4-3, 1-4-2-3, 1-4-1-3 → 7 total" }
    ],
    testCases: [
      { input: "4 4 3", output: "7" },
      { input: "2 2 2", output: "1" },
      { input: "3 3 1", output: "2" },
      { input: "5 2 1", output: "1" },
      { input: "3 4 4", output: "2" },
      { input: "2 3 1", output: "0" },
      { input: "4 3 2", output: "3" },
      { input: "2 5 3", output: "1" }
    ],
    hints: [
      "Same DP as Q2 — dp[i][j] = ways to fill i positions ending with value j.",
      "Transition: dp[i][j] = sum of dp[i-1][k] for all k ≠ j."
    ],
    editorial: `Same as Q2 — DP on position and last value.
\`\`\`python
N, R, end = map(int, input().split())
dp = [[0]*(R+1) for _ in range(N+1)]
dp[1][1] = 1
for i in range(2, N+1):
    for j in range(1, R+1):
        for k in range(1, R+1):
            if k != j:
                dp[i][j] += dp[i-1][k]
print(dp[N][end])
\`\`\``,
    boilerplate: {
      python: `N, R, end = map(int, input().split())\n# Your code here\n`,
      javascript: `const input = require('readline').createInterface({input: process.stdin});\nlet lines = [];\ninput.on('line', l => lines.push(l));\ninput.on('close', () => {\n  const [N, R, end] = lines[0].split(' ').map(Number);\n  // Your code here\n});`,
      c: `#include <stdio.h>\n\nint main() {\n    int N, R, end;\n    scanf("%d %d %d", &N, &R, &end);\n    // Your code here\n    return 0;\n}`,
      java: `import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int N = sc.nextInt(), R = sc.nextInt(), end = sc.nextInt();\n        // Your code here\n    }\n}`
    }
  },

  // ── Q6: Gym Membership Cost ──
  {
    id: 6,
    title: "Gym Membership Cost Calculation",
    difficulty: "Easy",
    category: "Conditional Logic",
    tags: ["Conditionals", "Map"],
    description: `A gym offers membership plans for specific durations with fixed prices:

| Duration | Cost |
|----------|------|
| 1 month  | ₹2000 |
| 3 months | ₹5000 |
| 6 months | ₹9000 |
| 9 months | ₹12000 |
| 12 months | ₹15000 |

If the input does not match any valid plan, print "Error".`,
    inputFormat: "An integer `n` representing the number of months.",
    outputFormat: 'Print the total membership cost if valid; otherwise print "Error".',
    constraints: "1 ≤ n ≤ 100",
    examples: [
      { input: "1", output: "2000", explanation: "1 month plan costs 2000." },
      { input: "9", output: "12000", explanation: "9 month plan costs 12000." },
      { input: "5", output: "Error", explanation: "5 is not a valid plan duration." }
    ],
    testCases: [
      { input: "1", output: "2000" },
      { input: "3", output: "5000" },
      { input: "6", output: "9000" },
      { input: "9", output: "12000" },
      { input: "12", output: "15000" },
      { input: "5", output: "Error" },
      { input: "2", output: "Error" },
      { input: "0", output: "Error" },
      { input: "100", output: "Error" },
      { input: "7", output: "Error" }
    ],
    hints: ["Use a dictionary/map to store plan: cost pairs."],
    editorial: `\`\`\`python
plans = {1: 2000, 3: 5000, 6: 9000, 9: 12000, 12: 15000}
n = int(input())
print(plans.get(n, "Error"))
\`\`\``,
    boilerplate: {
      python: `n = int(input())\n# Your code here\n`,
      javascript: `const input = require('readline').createInterface({input: process.stdin});\nlet lines = [];\ninput.on('line', l => lines.push(l));\ninput.on('close', () => {\n  const n = parseInt(lines[0]);\n  // Your code here\n});`,
      c: `#include <stdio.h>\n\nint main() {\n    int n;\n    scanf("%d", &n);\n    // Your code here\n    return 0;\n}`,
      java: `import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        // Your code here\n    }\n}`
    }
  },

  // ── Q7: Balloon Capacity (Greedy) ──
  {
    id: 7,
    title: "Balloon Capacity",
    difficulty: "Easy",
    category: "Greedy",
    tags: ["Greedy", "Sorting"],
    description: `You are given an array of people's weights and a maximum balloon capacity (maxWeight). Find the maximum number of people that can fit in the balloon. Always select lighter people first (greedy approach).`,
    inputFormat: `Integer N → number of people
Array weights[N]
Integer maxWeight`,
    outputFormat: "Print the maximum number of people.",
    constraints: "1 ≤ N ≤ 10⁵, 1 ≤ weights[i] ≤ 10⁴, 1 ≤ maxWeight ≤ 10⁶",
    examples: [
      { input: "4\n20 30 40 50\n100", output: "3", explanation: "Sorted: 20+30+40=90 ≤ 100 ✅. Adding 50 → 140 > 100 ❌. Maximum people = 3." }
    ],
    testCases: [
      { input: "4\n20 30 40 50\n100", output: "3" },
      { input: "3\n50 50 50\n100", output: "2" },
      { input: "1\n10\n5", output: "0" },
      { input: "5\n10 10 10 10 10\n50", output: "5" },
      { input: "3\n1 2 3\n10", output: "3" },
      { input: "4\n100 200 300 400\n500", output: "2" },
      { input: "1\n5\n5", output: "1" },
      { input: "6\n5 3 8 1 2 9\n15", output: "4" }
    ],
    hints: ["Sort the weights array, then greedily pick lightest people until capacity is exceeded."],
    editorial: `\`\`\`python
n = int(input())
weights = list(map(int, input().split()))
maxWeight = int(input())
weights.sort()
total, count = 0, 0
for w in weights:
    if total + w <= maxWeight:
        total += w
        count += 1
    else:
        break
print(count)
\`\`\``,
    boilerplate: {
      python: `n = int(input())\nweights = list(map(int, input().split()))\nmaxWeight = int(input())\n# Your code here\n`,
      javascript: `const input = require('readline').createInterface({input: process.stdin});\nlet lines = [];\ninput.on('line', l => lines.push(l));\ninput.on('close', () => {\n  const n = parseInt(lines[0]);\n  const weights = lines[1].split(' ').map(Number);\n  const maxWeight = parseInt(lines[2]);\n  // Your code here\n});`,
      c: `#include <stdio.h>\n\nint main() {\n    int n, maxWeight;\n    scanf("%d", &n);\n    int weights[n];\n    for (int i = 0; i < n; i++) scanf("%d", &weights[i]);\n    scanf("%d", &maxWeight);\n    // Your code here\n    return 0;\n}`,
      java: `import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] weights = new int[n];\n        for (int i = 0; i < n; i++) weights[i] = sc.nextInt();\n        int maxWeight = sc.nextInt();\n        // Your code here\n    }\n}`
    }
  },

  // ── Q8: Minimum Cost to Connect Nodes (MST) ──
  {
    id: 8,
    title: "Minimum Cost to Connect All Nodes",
    difficulty: "Hard",
    category: "Graphs",
    tags: ["Graphs", "MST", "Union-Find"],
    description: `You are given V vertices and E edges. Each edge has a source, destination, and weight. Find the minimum cost to connect all nodes using a **Minimum Spanning Tree** (Kruskal's or Prim's algorithm).`,
    inputFormat: `First line: V E
Next E lines: u v w (source, destination, weight)`,
    outputFormat: "Print: Minimum Cost: <cost>",
    constraints: "2 ≤ V ≤ 1000, 1 ≤ E ≤ V*(V-1)/2, 1 ≤ w ≤ 10⁴",
    examples: [
      { input: "4 5\n1 2 10\n1 3 6\n1 4 5\n2 4 15\n3 4 4", output: "Minimum Cost: 19", explanation: "Selected edges: 3→4=4, 1→4=5, 1→2=10. Total = 19." }
    ],
    testCases: [
      { input: "4 5\n1 2 10\n1 3 6\n1 4 5\n2 4 15\n3 4 4", output: "Minimum Cost: 19" },
      { input: "3 3\n1 2 1\n2 3 2\n1 3 3", output: "Minimum Cost: 3" },
      { input: "2 1\n1 2 5", output: "Minimum Cost: 5" },
      { input: "4 6\n1 2 1\n1 3 2\n1 4 3\n2 3 4\n2 4 5\n3 4 6", output: "Minimum Cost: 6" },
      { input: "5 7\n1 2 2\n1 3 3\n2 3 1\n2 4 4\n3 5 5\n4 5 6\n3 4 2", output: "Minimum Cost: 10" }
    ],
    hints: [
      "Kruskal's: Sort edges by weight, use Union-Find to add edges that don't create cycles.",
      "Prim's: Start from any node, always pick the cheapest edge connecting a new node."
    ],
    editorial: `**Kruskal's Algorithm:**
\`\`\`python
V, E = map(int, input().split())
edges = []
for _ in range(E):
    u, v, w = map(int, input().split())
    edges.append((w, u, v))
edges.sort()

parent = list(range(V + 1))
def find(x):
    while parent[x] != x:
        parent[x] = parent[parent[x]]
        x = parent[x]
    return x
def union(a, b):
    a, b = find(a), find(b)
    if a == b: return False
    parent[a] = b
    return True

cost = 0
for w, u, v in edges:
    if union(u, v):
        cost += w
print(f"Minimum Cost: {cost}")
\`\`\``,
    boilerplate: {
      python: `V, E = map(int, input().split())\nedges = []\nfor _ in range(E):\n    u, v, w = map(int, input().split())\n    edges.append((w, u, v))\n# Your code here\n`,
      javascript: `const input = require('readline').createInterface({input: process.stdin});\nlet lines = [];\ninput.on('line', l => lines.push(l));\ninput.on('close', () => {\n  const [V, E] = lines[0].split(' ').map(Number);\n  const edges = [];\n  for (let i = 1; i <= E; i++) {\n    const [u, v, w] = lines[i].split(' ').map(Number);\n    edges.push([w, u, v]);\n  }\n  // Your code here\n});`,
      c: `#include <stdio.h>\n\nint main() {\n    int V, E;\n    scanf("%d %d", &V, &E);\n    int edges[E][3];\n    for (int i = 0; i < E; i++) {\n        scanf("%d %d %d", &edges[i][0], &edges[i][1], &edges[i][2]);\n    }\n    // Your code here\n    return 0;\n}`,
      java: `import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int V = sc.nextInt(), E = sc.nextInt();\n        int[][] edges = new int[E][3];\n        for (int i = 0; i < E; i++) {\n            edges[i][0] = sc.nextInt();\n            edges[i][1] = sc.nextInt();\n            edges[i][2] = sc.nextInt();\n        }\n        // Your code here\n    }\n}`
    }
  },

  // ── Q9: First and Last Occurrence ──
  {
    id: 9,
    title: "First and Last Occurrence",
    difficulty: "Medium",
    category: "Binary Search",
    tags: ["Binary Search", "Arrays"],
    description: `You are given a sorted array of integers and a target value X.
1. Find the **first occurrence** of X
2. Find the **last occurrence** of X
3. Return the difference between last and first occurrence.

If target is not present, print -1.`,
    inputFormat: `Line 1: Integer N
Line 2: N space-separated sorted integers
Line 3: Target element X`,
    outputFormat: "Print: FirstOccurrence LastOccurrence Difference",
    constraints: "1 ≤ N ≤ 10⁵, -10⁵ ≤ arr[i] ≤ 10⁵",
    examples: [
      { input: "8\n1 2 2 2 3 4 5 5\n2", output: "1 3 2", explanation: "Target 2 first occurs at index 1, last at index 3. Difference = 2." }
    ],
    testCases: [
      { input: "8\n1 2 2 2 3 4 5 5\n2", output: "1 3 2" },
      { input: "5\n1 1 1 1 1\n1", output: "0 4 4" },
      { input: "5\n1 2 3 4 5\n6", output: "-1" },
      { input: "1\n5\n5", output: "0 0 0" },
      { input: "6\n1 2 3 3 3 4\n3", output: "2 4 2" },
      { input: "4\n1 1 2 2\n2", output: "2 3 1" },
      { input: "3\n5 5 5\n5", output: "0 2 2" }
    ],
    hints: [
      "Use binary search to find the first occurrence (leftmost) and last occurrence (rightmost).",
      "For first: when you find target, move right boundary left. For last: move left boundary right."
    ],
    editorial: `\`\`\`python
n = int(input())
arr = list(map(int, input().split()))
x = int(input())

def first_occ(arr, x):
    lo, hi, res = 0, len(arr)-1, -1
    while lo <= hi:
        mid = (lo+hi)//2
        if arr[mid] == x:
            res = mid
            hi = mid - 1
        elif arr[mid] < x:
            lo = mid + 1
        else:
            hi = mid - 1
    return res

def last_occ(arr, x):
    lo, hi, res = 0, len(arr)-1, -1
    while lo <= hi:
        mid = (lo+hi)//2
        if arr[mid] == x:
            res = mid
            lo = mid + 1
        elif arr[mid] < x:
            lo = mid + 1
        else:
            hi = mid - 1
    return res

f = first_occ(arr, x)
if f == -1:
    print(-1)
else:
    l = last_occ(arr, x)
    print(f, l, l - f)
\`\`\``,
    boilerplate: {
      python: `n = int(input())\narr = list(map(int, input().split()))\nx = int(input())\n# Your code here\n`,
      javascript: `const input = require('readline').createInterface({input: process.stdin});\nlet lines = [];\ninput.on('line', l => lines.push(l));\ninput.on('close', () => {\n  const n = parseInt(lines[0]);\n  const arr = lines[1].split(' ').map(Number);\n  const x = parseInt(lines[2]);\n  // Your code here\n});`,
      c: `#include <stdio.h>\n\nint main() {\n    int n, x;\n    scanf("%d", &n);\n    int arr[n];\n    for (int i = 0; i < n; i++) scanf("%d", &arr[i]);\n    scanf("%d", &x);\n    // Your code here\n    return 0;\n}`,
      java: `import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] arr = new int[n];\n        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();\n        int x = sc.nextInt();\n        // Your code here\n    }\n}`
    }
  },

  // ── Q10: Minimum Coins Required ──
  {
    id: 10,
    title: "Minimum Coins Required",
    difficulty: "Easy",
    category: "Greedy",
    tags: ["Greedy", "Math"],
    description: `Given an amount, find the minimum number of coins required using denominations: **1, 2, 5, 10, 20, 50, 100, 500**.`,
    inputFormat: "A single integer — the amount.",
    outputFormat: "A single integer — the minimum number of coins.",
    constraints: "1 ≤ amount ≤ 10⁶",
    examples: [
      { input: "93", output: "5", explanation: "50 + 20 + 20 + 2 + 1 = 93 → 5 coins" }
    ],
    testCases: [
      { input: "93", output: "5" },
      { input: "1", output: "1" },
      { input: "500", output: "1" },
      { input: "999", output: "11" },
      { input: "7", output: "2" },
      { input: "49", output: "5" },
      { input: "100", output: "1" },
      { input: "123", output: "4" },
      { input: "10", output: "1" },
      { input: "3", output: "2" }
    ],
    hints: ["Use the greedy approach: always pick the largest denomination ≤ remaining amount."],
    editorial: `\`\`\`python
amount = int(input())
coins = [500, 100, 50, 20, 10, 5, 2, 1]
count = 0
for c in coins:
    count += amount // c
    amount %= c
print(count)
\`\`\``,
    boilerplate: {
      python: `amount = int(input())\n# Your code here\n`,
      javascript: `const input = require('readline').createInterface({input: process.stdin});\nlet lines = [];\ninput.on('line', l => lines.push(l));\ninput.on('close', () => {\n  const amount = parseInt(lines[0]);\n  // Your code here\n});`,
      c: `#include <stdio.h>\n\nint main() {\n    int amount;\n    scanf("%d", &amount);\n    // Your code here\n    return 0;\n}`,
      java: `import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int amount = sc.nextInt();\n        // Your code here\n    }\n}`
    }
  },

  // ── Q11: House Robber ──
  {
    id: 11,
    title: "House Robber Problem",
    difficulty: "Medium",
    category: "Dynamic Programming",
    tags: ["DP", "Arrays"],
    description: `Given an array where each element represents money in a house, find the maximum money that can be robbed such that **no two adjacent houses** are robbed.`,
    inputFormat: `Integer N → number of houses
Array of N integers (money in each house)`,
    outputFormat: "A single integer — maximum money that can be robbed.",
    constraints: "1 ≤ N ≤ 10⁵, 0 ≤ arr[i] ≤ 10⁴",
    examples: [
      { input: "5\n2 7 9 3 1", output: "12", explanation: "Rob houses at indices 0, 2, 4 → values 2+9+1 = 12." }
    ],
    testCases: [
      { input: "5\n2 7 9 3 1", output: "12" },
      { input: "4\n1 2 3 1", output: "4" },
      { input: "1\n5", output: "5" },
      { input: "2\n1 2", output: "2" },
      { input: "3\n10 1 10", output: "20" },
      { input: "6\n2 1 1 2 1 1", output: "5" },
      { input: "4\n5 5 5 5", output: "10" },
      { input: "5\n1 100 1 100 1", output: "200" }
    ],
    hints: [
      "Classic DP: dp[i] = max(dp[i-1], dp[i-2] + arr[i])",
      "At each house, decide: skip it or rob it (adding to the best from 2 houses back)."
    ],
    editorial: `\`\`\`python
n = int(input())
arr = list(map(int, input().split()))
if n == 1:
    print(arr[0])
else:
    dp = [0] * n
    dp[0] = arr[0]
    dp[1] = max(arr[0], arr[1])
    for i in range(2, n):
        dp[i] = max(dp[i-1], dp[i-2] + arr[i])
    print(dp[n-1])
\`\`\``,
    boilerplate: {
      python: `n = int(input())\narr = list(map(int, input().split()))\n# Your code here\n`,
      javascript: `const input = require('readline').createInterface({input: process.stdin});\nlet lines = [];\ninput.on('line', l => lines.push(l));\ninput.on('close', () => {\n  const n = parseInt(lines[0]);\n  const arr = lines[1].split(' ').map(Number);\n  // Your code here\n});`,
      c: `#include <stdio.h>\n\nint main() {\n    int n;\n    scanf("%d", &n);\n    int arr[n];\n    for (int i = 0; i < n; i++) scanf("%d", &arr[i]);\n    // Your code here\n    return 0;\n}`,
      java: `import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] arr = new int[n];\n        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();\n        // Your code here\n    }\n}`
    }
  },      // ── Q12: Minimum Path Sum ──
  {
    id: 12,
    title: "Minimum Path Sum in Matrix",
    difficulty: "Medium",
    category: "Dynamic Programming",
    tags: ["DP", "Matrix"],
    description: `Given an N × M matrix, find the **minimum path sum** from top-left (0,0) to bottom-right (N-1, M-1). You can only move **right** or **down** at each step.`,
    inputFormat: `Line 1: N M (rows and columns)
Next N lines: M integers each (matrix values)`,
    outputFormat: "A single integer — the minimum path sum.",
    constraints: "1 ≤ N, M ≤ 100, 0 ≤ matrix[i][j] ≤ 100",
    examples: [
      { input: "3 3\n1 3 1\n1 5 1\n4 2 1", output: "7", explanation: "Path: 1→3→1→1→1 = 7 (top row then last column)." }
    ],
    testCases: [
      { input: "3 3\n1 3 1\n1 5 1\n4 2 1", output: "7" },
      { input: "2 3\n1 2 3\n4 5 6", output: "12" },
      { input: "1 1\n5", output: "5" },
      { input: "2 2\n1 2\n3 4", output: "7" },
      { input: "3 3\n1 1 1\n1 1 1\n1 1 1", output: "5" },
      { input: "2 2\n0 0\n0 0", output: "0" }
    ],
    hints: [
      "DP on grid: dp[i][j] = min cost to reach (i,j).",
      "dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1])"
    ],
    editorial: `\`\`\`python
N, M = map(int, input().split())
grid = []
for _ in range(N):
    grid.append(list(map(int, input().split())))
dp = [[0]*M for _ in range(N)]
dp[0][0] = grid[0][0]
for i in range(1, N):
    dp[i][0] = dp[i-1][0] + grid[i][0]
for j in range(1, M):
    dp[0][j] = dp[0][j-1] + grid[0][j]
for i in range(1, N):
    for j in range(1, M):
        dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1])
print(dp[N-1][M-1])
\`\`\``,
    boilerplate: {
      python: `N, M = map(int, input().split())\ngrid = []\nfor _ in range(N):\n    grid.append(list(map(int, input().split())))\n# Your code here\n`,
      javascript: `const input = require('readline').createInterface({input: process.stdin});\nlet lines = [];\ninput.on('line', l => lines.push(l));\ninput.on('close', () => {\n  const [N, M] = lines[0].split(' ').map(Number);\n  const grid = [];\n  for (let i = 1; i <= N; i++) grid.push(lines[i].split(' ').map(Number));\n  // Your code here\n});`,
      c: `#include <stdio.h>\n\nint main() {\n    int N, M;\n    scanf("%d %d", &N, &M);\n    int grid[N][M];\n    for (int i = 0; i < N; i++) {\n        for (int j = 0; j < M; j++) {\n            scanf("%d", &grid[i][j]);\n        }\n    }\n    // Your code here\n    return 0;\n}`,
      java: `import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int N = sc.nextInt(), M = sc.nextInt();\n        int[][] grid = new int[N][M];\n        for (int i = 0; i < N; i++) {\n            for (int j = 0; j < M; j++) {\n                grid[i][j] = sc.nextInt();\n            }\n        }\n        // Your code here\n    }\n}`
    }
  },

  // ── Q13: Number of Islands ──
  {
    id: 13,
    title: "Number of Islands",
    difficulty: "Medium",
    category: "Graphs",
    tags: ["BFS", "DFS", "Matrix"],
    description: `Given a binary matrix where **1** represents land and **0** represents water, count the number of islands. An island is a group of connected 1s (horizontally or vertically connected).`,
    inputFormat: `Line 1: N M (rows and columns)
Next N lines: M integers (0 or 1)`,
    outputFormat: "A single integer — the number of islands.",
    constraints: "1 ≤ N, M ≤ 300",
    examples: [
      { input: "4 5\n1 1 0 0 0\n1 1 0 0 0\n0 0 1 0 0\n0 0 0 1 1", output: "3", explanation: "Island 1: top-left cluster. Island 2: single 1 in middle. Island 3: two 1s at bottom-right." }
    ],
    testCases: [
      { input: "4 5\n1 1 0 0 0\n1 1 0 0 0\n0 0 1 0 0\n0 0 0 1 1", output: "3" },
      { input: "1 1\n0", output: "0" },
      { input: "1 1\n1", output: "1" },
      { input: "3 3\n1 0 1\n0 0 0\n1 0 1", output: "4" },
      { input: "3 3\n1 1 1\n1 1 1\n1 1 1", output: "1" },
      { input: "2 2\n0 0\n0 0", output: "0" },
      { input: "3 4\n1 0 1 0\n0 1 0 1\n1 0 1 0", output: "6" }
    ],
    hints: [
      "Use BFS/DFS: iterate through each cell. When you find a '1', increment count and flood-fill to mark all connected 1s.",
      "Mark visited cells by setting them to '0' or using a visited set."
    ],
    editorial: `\`\`\`python
N, M = map(int, input().split())
grid = []
for _ in range(N):
    grid.append(list(map(int, input().split())))

def dfs(i, j):
    if i < 0 or i >= N or j < 0 or j >= M or grid[i][j] == 0:
        return
    grid[i][j] = 0
    dfs(i+1, j); dfs(i-1, j); dfs(i, j+1); dfs(i, j-1)

count = 0
for i in range(N):
    for j in range(M):
        if grid[i][j] == 1:
            count += 1
            dfs(i, j)
print(count)
\`\`\``,
    boilerplate: {
      python: `N, M = map(int, input().split())\ngrid = []\nfor _ in range(N):\n    grid.append(list(map(int, input().split())))\n# Your code here\n`,
      javascript: `const input = require('readline').createInterface({input: process.stdin});\nlet lines = [];\ninput.on('line', l => lines.push(l));\ninput.on('close', () => {\n  const [N, M] = lines[0].split(' ').map(Number);\n  const grid = [];\n  for (let i = 1; i <= N; i++) grid.push(lines[i].split(' ').map(Number));\n  // Your code here\n});`,
      c: `#include <stdio.h>\n\nint main() {\n    int N, M;\n    scanf("%d %d", &N, &M);\n    int grid[N][M];\n    for (int i = 0; i < N; i++) {\n        for (int j = 0; j < M; j++) {\n            scanf("%d", &grid[i][j]);\n        }\n    }\n    // Your code here\n    return 0;\n}`,
      java: `import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int N = sc.nextInt(), M = sc.nextInt();\n        int[][] grid = new int[N][M];\n        for (int i = 0; i < N; i++) {\n            for (int j = 0; j < M; j++) {\n                grid[i][j] = sc.nextInt();\n            }\n        }\n        // Your code here\n    }\n}`
    }
  },

  // ── Q14: Transaction Monitoring ──
  {
    id: 14,
    title: "Transaction Monitoring System",
    difficulty: "Medium",
    category: "Simulation",
    tags: ["HashMap", "Logic"],
    description: `You are given N transactions. Each transaction has: Sender, Receiver, Timestamp (Integer), Amount (Integer).

**Rules:**
1. If the same Sender + Receiver pair has already appeared → print \`"error duplication transaction"\`
2. If the difference between two consecutive transaction timestamps is greater than 60 → print \`"fraud detected"\`
3. Otherwise → print \`"all transaction are valid"\`

Check rules in order: duplication first, then fraud.`,
    inputFormat: `Integer N → number of transactions
Next N lines: sender receiver timestamp amount`,
    outputFormat: `Print one of:
• "error duplication transaction"
• "fraud detected"
• "all transaction are valid"`,
    constraints: "1 ≤ N ≤ 1000",
    examples: [
      { input: "2\nA B 100 500\nA B 110 600", output: "error duplication transaction", explanation: "Pair A-B appears twice." },
      { input: "2\nA B 100 500\nC D 200 300", output: "fraud detected", explanation: "200 − 100 = 100 > 60 → fraud." }
    ],
    testCases: [
      { input: "2\nA B 100 500\nA B 110 600", output: "error duplication transaction" },
      { input: "2\nA B 100 500\nC D 200 300", output: "fraud detected" },
      { input: "2\nA B 100 500\nC D 110 300", output: "all transaction are valid" },
      { input: "3\nA B 100 500\nC D 120 300\nE F 150 200", output: "all transaction are valid" },
      { input: "3\nA B 100 500\nC D 120 300\nA B 150 200", output: "error duplication transaction" },
      { input: "1\nA B 100 500", output: "all transaction are valid" },
      { input: "3\nA B 10 100\nB C 20 200\nC D 100 300", output: "fraud detected" }
    ],
    hints: [
      "Use a Set to track sender-receiver pairs for duplication check.",
      "Compare consecutive timestamps for fraud detection."
    ],
    editorial: `\`\`\`python
n = int(input())
txns = []
for _ in range(n):
    parts = input().split()
    txns.append((parts[0], parts[1], int(parts[2]), int(parts[3])))

pairs = set()
dup = False
for s, r, t, a in txns:
    key = (s, r)
    if key in pairs:
        dup = True
        break
    pairs.add(key)

if dup:
    print("error duplication transaction")
else:
    fraud = False
    for i in range(1, len(txns)):
        if abs(txns[i][2] - txns[i-1][2]) > 60:
            fraud = True
            break
    if fraud:
        print("fraud detected")
    else:
        print("all transaction are valid")
\`\`\``,
    boilerplate: {
      python: `n = int(input())\ntxns = []\nfor _ in range(n):\n    parts = input().split()\n    txns.append(parts)\n# Your code here\n`,
      javascript: `const input = require('readline').createInterface({input: process.stdin});\nlet lines = [];\ninput.on('line', l => lines.push(l));\ninput.on('close', () => {\n  const n = parseInt(lines[0]);\n  const txns = [];\n  for (let i = 1; i <= n; i++) txns.push(lines[i].split(' '));\n  // Your code here\n});`,
      c: `#include <stdio.h>\n#include <string.h>\n\nint main() {\n    int n;\n    scanf("%d", &n);\n    char sender[n][100], receiver[n][100];\n    int timestamp[n], amount[n];\n    for (int i = 0; i < n; i++) {\n        scanf("%s %s %d %d", sender[i], receiver[i], &timestamp[i], &amount[i]);\n    }\n    // Your code here\n    return 0;\n}`,
      java: `import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        String[][] txns = new String[n][4];\n        for (int i = 0; i < n; i++) {\n            txns[i][0] = sc.next();\n            txns[i][1] = sc.next();\n            txns[i][2] = sc.next();\n            txns[i][3] = sc.next();\n        }\n        // Your code here\n    }\n}`
    }
  },

  // ── Q15: Vendor Gate Management ──
  {
    id: 15,
    title: "Vendor Registration and Gate Management",
    difficulty: "Medium",
    category: "Simulation",
    tags: ["Sets", "Simulation"],
    description: `A society maintains registered vendors. You are given a list of registered vendor IDs and a sequence of gate operations:

- **ENTRY X**: If vendor X is registered, allow entry; otherwise block.
- **CHECK X**: Count the check request.
- **EXIT X**: Remove vendor X from active vendors if present.

At the end print the counts.`,
    inputFormat: `Line 1: N (count of vendors)
Line 2: N registered vendor IDs
Line 3: M (number of operations)
Next M lines: operations`,
    outputFormat: `Print:
Active Vendors: <count>
Blocked: <count>
Checked: <count>`,
    constraints: "1 ≤ N ≤ 1000, 1 ≤ M ≤ 10000",
    examples: [
      { input: "2\n101 102\n5\nENTRY 101\nENTRY 102\nENTRY 103\nCHECK 105\nEXIT 101", output: "Active Vendors: 1\nBlocked: 1\nChecked: 1", explanation: "ENTRY 103 blocked (not registered). CHECK counted. EXIT removes 101. Active = 1." }
    ],
    testCases: [
      { input: "2\n101 102\n5\nENTRY 101\nENTRY 102\nENTRY 103\nCHECK 105\nEXIT 101", output: "Active Vendors: 1\nBlocked: 1\nChecked: 1" },
      { input: "1\n10\n3\nENTRY 10\nENTRY 20\nENTRY 30", output: "Active Vendors: 1\nBlocked: 2\nChecked: 0" },
      { input: "3\n1 2 3\n4\nENTRY 1\nENTRY 2\nEXIT 1\nEXIT 2", output: "Active Vendors: 0\nBlocked: 0\nChecked: 0" },
      { input: "2\n5 10\n3\nCHECK 5\nCHECK 10\nCHECK 15", output: "Active Vendors: 0\nBlocked: 0\nChecked: 3" }
    ],
    hints: [
      "Use a set for registered vendors and another for active vendors.",
      "Track blocked count and checked count with simple counters."
    ],
    editorial: `\`\`\`python
n = int(input())
registered = set(input().split())
m = int(input())
active = set()
blocked = 0
checked = 0
for _ in range(m):
    parts = input().split()
    op, vid = parts[0], parts[1]
    if op == "ENTRY":
        if vid in registered:
            active.add(vid)
        else:
            blocked += 1
    elif op == "CHECK":
        checked += 1
    elif op == "EXIT":
        active.discard(vid)
print(f"Active Vendors: {len(active)}")
print(f"Blocked: {blocked}")
print(f"Checked: {checked}")
\`\`\``,
    boilerplate: {
      python: `n = int(input())\nregistered = set(input().split())\nm = int(input())\n# Your code here\n`,
      javascript: `const input = require('readline').createInterface({input: process.stdin});\nlet lines = [];\ninput.on('line', l => lines.push(l));\ninput.on('close', () => {\n  const n = parseInt(lines[0]);\n  const registered = new Set(lines[1].split(' '));\n  const m = parseInt(lines[2]);\n  // Your code here\n});`,
      c: `#include <stdio.h>\n#include <string.h>\n\nint main() {\n    int n, m;\n    scanf("%d", &n);\n    char registered[n][100];\n    for (int i = 0; i < n; i++) scanf("%s", registered[i]);\n    scanf("%d", &m);\n    // Your code here\n    return 0;\n}`,
      java: `import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        String[] registered = new String[n];\n        for (int i = 0; i < n; i++) registered[i] = sc.next();\n        int m = sc.nextInt();\n        // Your code here\n    }\n}`
    }
  },

  // ── QCC1: Count Pairs Divisible by 2 ──
  {
    id: 16,
    title: "Count Pairs Divisible by 2",
    difficulty: "Easy",
    category: "Arrays",
    tags: ["Math", "Counting"],
    description: `You are given a list of N numbers. Find how many pairs (i ≠ j, i < j) add up to an **even number**. Two numbers sum to even iff both are even OR both are odd.`,
    inputFormat: `Line 1: T (test cases)
Each test case:
  Line 1: N
  Line 2: N integers`,
    outputFormat: "For each test case: the number of even-sum pairs.",
    constraints: "1 ≤ T ≤ 100, 2 ≤ N ≤ 10⁵, 0 ≤ arr[i] ≤ 10⁵",
    examples: [
      { input: "3\n4\n6 1 2 3\n6\n2 2 1 7 5 3\n2\n4 8", output: "2\n7\n1", explanation: "Case 1: pairs (6,2), (1,3) → 2. Case 3: (4,8) → 1." }
    ],
    testCases: [
      { input: "3\n4\n6 1 2 3\n6\n2 2 1 7 5 3\n2\n4 8", output: "2\n7\n1" },
      { input: "1\n3\n1 3 5", output: "3" },
      { input: "1\n3\n2 4 6", output: "3" },
      { input: "1\n4\n1 2 3 4", output: "2" },
      { input: "1\n2\n1 2", output: "0" }
    ],
    hints: [
      "Count even numbers (e) and odd numbers (o). Pairs = e*(e-1)/2 + o*(o-1)/2."
    ],
    editorial: `\`\`\`python
T = int(input())
for _ in range(T):
    n = int(input())
    arr = list(map(int, input().split()))
    e = sum(1 for x in arr if x % 2 == 0)
    o = n - e
    print(e*(e-1)//2 + o*(o-1)//2)
\`\`\``,
    boilerplate: {
      python: `T = int(input())\nfor _ in range(T):\n    n = int(input())\n    arr = list(map(int, input().split()))\n    # Your code here\n`,
      javascript: `const input = require('readline').createInterface({input: process.stdin});\nlet lines = [];\ninput.on('line', l => lines.push(l));\ninput.on('close', () => {\n  let idx = 0;\n  const T = parseInt(lines[idx++]);\n  for (let t = 0; t < T; t++) {\n    const n = parseInt(lines[idx++]);\n    const arr = lines[idx++].split(' ').map(Number);\n    // Your code here\n  }\n});`,
      c: `#include <stdio.h>\n\nint main() {\n    int T;\n    scanf("%d", &T);\n    while (T--) {\n        int n;\n        scanf("%d", &n);\n        int arr[n];\n        for (int i = 0; i < n; i++) scanf("%d", &arr[i]);\n        // Your code here\n    }\n    return 0;\n}`,
      java: `import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int T = sc.nextInt();\n        while (T-- > 0) {\n            int n = sc.nextInt();\n            int[] arr = new int[n];\n            for (int i = 0; i < n; i++) arr[i] = sc.nextInt();\n            // Your code here\n        }\n    }\n}`
    }
  },

  // ── QCC2: Row with Most 1s ──
  {
    id: 17,
    title: "Identify Row with Most 1s",
    difficulty: "Easy",
    category: "Arrays / Matrix",
    tags: ["Arrays", "Matrix"],
    description: `You are given a 2D matrix of size n × m consisting only of 0s and 1s. Find the index (0-based) of the row that contains the maximum number of 1s. On ties, return the first row. If all rows are 0s, output -1.`,
    inputFormat: `Line 1: T (test cases)
Each: n m, then n rows of m integers (0 or 1)`,
    outputFormat: "For each test case: 0-based index of row with most 1s, or -1 if all zeros.",
    constraints: "1 ≤ T ≤ 100, 1 ≤ N, M ≤ 1000",
    examples: [
      { input: "1\n3 4\n0 1 0 0\n0 1 1 0\n0 0 0 0", output: "1", explanation: "Row 0 has 1 one, row 1 has 2 ones, row 2 has 0. Maximum is row 1." }
    ],
    testCases: [
      { input: "1\n3 4\n0 1 0 0\n0 1 1 0\n0 0 0 0", output: "1" },
      { input: "1\n2 2\n0 0\n0 0", output: "-1" },
      { input: "1\n3 3\n1 1 1\n0 0 0\n1 1 0", output: "0" },
      { input: "1\n1 1\n1", output: "0" },
      { input: "2\n2 3\n1 0 1\n0 1 0\n3 2\n0 0\n1 1\n1 0", output: "0\n1" }
    ],
    hints: ["Iterate each row, count 1s, track maximum. Return index of first maximum."],
    editorial: `\`\`\`python
T = int(input())
for _ in range(T):
    n, m = map(int, input().split())
    best_row, best_count = -1, 0
    for i in range(n):
        row = list(map(int, input().split()))
        c = sum(row)
        if c > best_count:
            best_count = c
            best_row = i
    print(best_row)
\`\`\``,
    boilerplate: {
      python: `T = int(input())\nfor _ in range(T):\n    n, m = map(int, input().split())\n    # Your code here\n`,
      javascript: `const input = require('readline').createInterface({input: process.stdin});\nlet lines = [];\ninput.on('line', l => lines.push(l));\ninput.on('close', () => {\n  let idx = 0;\n  const T = parseInt(lines[idx++]);\n  for (let t = 0; t < T; t++) {\n    const [n, m] = lines[idx++].split(' ').map(Number);\n    // Your code here\n  }\n});`,
      c: `#include <stdio.h>\n\nint main() {\n    int T;\n    scanf("%d", &T);\n    while (T--) {\n        int n, m;\n        scanf("%d %d", &n, &m);\n        // Your code here\n    }\n    return 0;\n}`,
      java: `import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int T = sc.nextInt();\n        while (T-- > 0) {\n            int n = sc.nextInt(), m = sc.nextInt();\n            // Your code here\n        }\n    }\n}`
    }
  },

  // ── QCC3: Count Character Occurrences ──
  {
    id: 18,
    title: "Count Character Occurrences",
    difficulty: "Easy",
    category: "Strings",
    tags: ["Strings", "HashMap"],
    description: `Given two strings str1 and str2. For each **unique character** of str2, count how many times it appears in str1. Return the sum of all such counts.`,
    inputFormat: `Line 1: T (test cases)
Each: str1 on line 1, str2 on line 2`,
    outputFormat: "For each test case: total sum of occurrences on a new line.",
    constraints: "1 ≤ T ≤ 100, 1 ≤ |str1|, |str2| ≤ 10⁵, lowercase only",
    examples: [
      { input: "1\nhelloworld\ndo", output: "3", explanation: "'d' appears 1 time, 'o' appears 2 times in 'helloworld' → 3" }
    ],
    testCases: [
      { input: "1\nhelloworld\ndo", output: "3" },
      { input: "1\nabacabadabacaba\nabcd", output: "15" },
      { input: "1\naaa\na", output: "3" },
      { input: "1\nabc\nxyz", output: "0" },
      { input: "2\nhello\nl\nworld\no", output: "2\n1" },
      { input: "1\naaabbbccc\nabc", output: "9" }
    ],
    hints: ["Get unique chars of str2 (use set). For each, count in str1. Sum all."],
    editorial: `\`\`\`python
T = int(input())
for _ in range(T):
    str1 = input()
    str2 = input()
    unique = set(str2)
    print(sum(str1.count(c) for c in unique))
\`\`\``,
    boilerplate: {
      python: `T = int(input())\nfor _ in range(T):\n    str1 = input()\n    str2 = input()\n    # Your code here\n`,
      javascript: `const input = require('readline').createInterface({input: process.stdin});\nlet lines = [];\ninput.on('line', l => lines.push(l));\ninput.on('close', () => {\n  let idx = 0;\n  const T = parseInt(lines[idx++]);\n  for (let t = 0; t < T; t++) {\n    const str1 = lines[idx++];\n    const str2 = lines[idx++];\n    // Your code here\n  }\n});`,
      c: `#include <stdio.h>\n#include <string.h>\n\nint main() {\n    int T;\n    scanf("%d", &T);\n    while (T--) {\n        char str1[100001], str2[100001];\n        scanf("%s %s", str1, str2);\n        // Your code here\n    }\n    return 0;\n}`,
      java: `import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int T = sc.nextInt();\n        while (T-- > 0) {\n            String str1 = sc.next();\n            String str2 = sc.next();\n            // Your code here\n        }\n    }\n}`
    }
  },

  // ── QCC4: Good Number ──
  {
    id: 19,
    title: "Good Number",
    difficulty: "Easy",
    category: "Number Theory",
    tags: ["Math", "Digits"],
    description: `A **Good Number** is defined as a number that is divisible by the sum of its own digits. If N % (sum of digits of N) == 0, print "Good Number", otherwise print "Bad Number".`,
    inputFormat: `Line 1: T (test cases)
Each: a single integer N`,
    outputFormat: 'For each test case: "Good Number" or "Bad Number".',
    constraints: "1 ≤ T ≤ 100, 1 ≤ N ≤ 10⁶",
    examples: [
      { input: "3\n18\n19\n21", output: "Good Number\nBad Number\nGood Number", explanation: "18: 1+8=9, 18÷9=2 ✓. 19: 1+9=10, 19÷10≠int ✗. 21: 2+1=3, 21÷3=7 ✓." }
    ],
    testCases: [
      { input: "3\n18\n19\n21", output: "Good Number\nBad Number\nGood Number" },
      { input: "1\n1", output: "Good Number" },
      { input: "1\n10", output: "Good Number" },
      { input: "1\n11", output: "Bad Number" },
      { input: "2\n100\n99", output: "Good Number\nBad Number" },
      { input: "1\n12", output: "Good Number" }
    ],
    hints: ["Sum the digits using modulo and division. Check if N % digitSum == 0."],
    editorial: `\`\`\`python
T = int(input())
for _ in range(T):
    n = int(input())
    s = sum(int(d) for d in str(n))
    print("Good Number" if n % s == 0 else "Bad Number")
\`\`\``,
    boilerplate: {
      python: `T = int(input())\nfor _ in range(T):\n    n = int(input())\n    # Your code here\n`,
      javascript: `const input = require('readline').createInterface({input: process.stdin});\nlet lines = [];\ninput.on('line', l => lines.push(l));\ninput.on('close', () => {\n  let idx = 0;\n  const T = parseInt(lines[idx++]);\n  for (let t = 0; t < T; t++) {\n    const n = parseInt(lines[idx++]);\n    // Your code here\n  }\n});`,
      c: `#include <stdio.h>\n\nint main() {\n    int T;\n    scanf("%d", &T);\n    while (T--) {\n        int n;\n        scanf("%d", &n);\n        // Your code here\n    }\n    return 0;\n}`,
      java: `import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int T = sc.nextInt();\n        while (T-- > 0) {\n            int n = sc.nextInt();\n            // Your code here\n        }\n    }\n}`
    }
  },

  // ── QCC5: Vehicle Manufacturing ──
  {
    id: 20,
    title: "Vehicle Manufacturing",
    difficulty: "Easy",
    category: "Math / Equations",
    tags: ["Math", "Algebra"],
    description: `Given V (total vehicles) and W (total wheels), find how many two-wheelers (T) and four-wheelers (F) need to be manufactured.

**Equations:** T + F = V and 2T + 4F = W

If no valid combination exists, print -1.`,
    inputFormat: `Line 1: T (test cases)
Each: line 1 = v (vehicles), line 2 = w (wheels)`,
    outputFormat: "If valid: print two-wheelers and four-wheelers (space-separated). If invalid: print -1",
    constraints: "1 ≤ T ≤ 100, 0 ≤ v ≤ 10⁶, 0 ≤ w ≤ 4×10⁶",
    examples: [
      { input: "2\n12\n34\n10\n25", output: "7 5\n-1", explanation: "Case 1: 7+5=12, 14+20=34 ✓. Case 2: 25 is odd, impossible." }
    ],
    testCases: [
      { input: "2\n12\n34\n10\n25", output: "7 5\n-1" },
      { input: "1\n1\n2", output: "1 0" },
      { input: "1\n1\n4", output: "0 1" },
      { input: "1\n0\n0", output: "0 0" },
      { input: "1\n5\n10", output: "5 0" },
      { input: "1\n5\n20", output: "0 5" },
      { input: "1\n5\n11", output: "-1" },
      { input: "1\n3\n8", output: "2 1" }
    ],
    hints: [
      "From T + F = V and 2T + 4F = W: F = (W - 2V)/2, T = V - F.",
      "Check: F must be non-negative integer and F ≤ V."
    ],
    editorial: `\`\`\`python
tc = int(input())
for _ in range(tc):
    v = int(input())
    w = int(input())
    if (w - 2*v) < 0 or (w - 2*v) % 2 != 0:
        print(-1)
    else:
        f = (w - 2*v) // 2
        t = v - f
        if t < 0 or f < 0:
            print(-1)
        else:
            print(t, f)
\`\`\``,
    boilerplate: {
      python: `tc = int(input())\nfor _ in range(tc):\n    v = int(input())\n    w = int(input())\n    # Your code here\n`,
      javascript: `const input = require('readline').createInterface({input: process.stdin});\nlet lines = [];\ninput.on('line', l => lines.push(l));\ninput.on('close', () => {\n  let idx = 0;\n  const tc = parseInt(lines[idx++]);\n  for (let t = 0; t < tc; t++) {\n    const v = parseInt(lines[idx++]);\n    const w = parseInt(lines[idx++]);\n    // Your code here\n  }\n});`,
      c: `#include <stdio.h>\n\nint main() {\n    int tc;\n    scanf("%d", &tc);\n    while (tc--) {\n        int v, w;\n        scanf("%d %d", &v, &w);\n        // Your code here\n    }\n    return 0;\n}`,
      java: `import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int tc = sc.nextInt();\n        while (tc-- > 0) {\n            int v = sc.nextInt();\n            int w = sc.nextInt();\n            // Your code here\n        }\n    }\n}`
    }
  }
];

// Category definitions for filtering
const CATEGORIES = [
  { name: "All", icon: "", count: 20 },
  { name: "Conditional Logic", icon: "", problems: [1, 3, 6] },
  { name: "Dynamic Programming", icon: "", problems: [2, 4, 5, 11, 12] },
  { name: "Greedy", icon: "", problems: [7, 10] },
  { name: "Graphs", icon: "", problems: [8, 13] },
  { name: "Binary Search", icon: "", problems: [9] },
  { name: "Simulation", icon: "", problems: [14, 15] },
  { name: "Arrays", icon: "", problems: [16, 17] },
  { name: "Strings", icon: "", problems: [18] },
  { name: "Number Theory", icon: "", problems: [19] },
  { name: "Math", icon: "", problems: [20] }
];

// Export for use in other modules
window.PROBLEMS = PROBLEMS;
window.CATEGORIES = CATEGORIES;
