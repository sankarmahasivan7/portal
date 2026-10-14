"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sandbox_1 = require("./sandbox");
describe('Isolated Sandbox Execution Engine', () => {
    beforeAll(async () => {
        const availability = await (0, sandbox_1.checkCompilerAvailability)();
        console.log('Detected compiler availability in test:', availability);
    });
    test('executes Python code successfully', async () => {
        const res = await (0, sandbox_1.runIsolatedJob)({
            language: 'python',
            code: `import sys\na, b = map(int, sys.stdin.read().split())\nprint(a + b)`,
            testCases: [
                { input: '4 7', expectedOutput: '11', isHidden: false },
                { input: '100 250', expectedOutput: '350', isHidden: true }
            ]
        });
        expect(res.success).toBe(true);
        expect(res.verdict).toBe('Accepted');
        expect(res.passedTests).toBe(2);
        expect(res.totalTests).toBe(2);
    });
    test('detects Python Wrong Answer', async () => {
        const res = await (0, sandbox_1.runIsolatedJob)({
            language: 'python',
            code: `print(42)`,
            testCases: [{ input: '4 7', expectedOutput: '11', isHidden: false }]
        });
        expect(res.success).toBe(true);
        expect(res.verdict).toBe('Wrong Answer');
        expect(res.passedTests).toBe(0);
    });
    test('detects Python Runtime Error', async () => {
        const res = await (0, sandbox_1.runIsolatedJob)({
            language: 'python',
            code: `x = 1 / 0`,
            testCases: [{ input: '', expectedOutput: '0', isHidden: false }]
        });
        expect(res.verdict).toBe('Runtime Error');
    });
    test('detects infinite loop Timeout (Time Limit Exceeded)', async () => {
        const res = await (0, sandbox_1.runIsolatedJob)({
            language: 'python',
            code: `while True:\n    pass`,
            testCases: [{ input: '', expectedOutput: '0', isHidden: false }],
            timeLimitMs: 1500
        });
        expect(res.verdict).toBe('Time Limit Exceeded');
    }, 10000);
    test('executes C program successfully', async () => {
        const res = await (0, sandbox_1.runIsolatedJob)({
            language: 'c',
            code: `#include <stdio.h>\nint main() {\n    int a, b;\n    if (scanf("%d %d", &a, &b) == 2) printf("%d\\n", a + b);\n    return 0;\n}`,
            testCases: [
                { input: '5 9', expectedOutput: '14', isHidden: false }
            ]
        });
        expect(res.success).toBe(true);
        expect(res.verdict).toBe('Accepted');
        expect(res.passedTests).toBe(1);
    }, 15000);
    test('detects C Compilation Error', async () => {
        const res = await (0, sandbox_1.runIsolatedJob)({
            language: 'c',
            code: `int main() { syntax error here }`,
            testCases: [{ input: '', expectedOutput: '', isHidden: false }]
        });
        expect(res.verdict).toBe('Compilation Error');
        expect(res.compileOutput).toBeDefined();
    }, 15000);
});
