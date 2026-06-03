"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalize = normalize;
exports.judge = judge;
function normalize(str) {
    return str
        .replace(/\r/g, '')
        .trim()
        .split(/\n+/)
        .map((x) => x.trim()
        .replace(/\s+/g, ' '))
        .filter((x) => x.length > 0)
        .join('\n');
}
function judge(expected, actual) {
    return (normalize(expected)
        ===
            normalize(actual));
}
//# sourceMappingURL=judge.js.map