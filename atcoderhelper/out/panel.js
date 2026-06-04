"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.setProblemUrl = setProblemUrl;
exports.openTestcasePanel = openTestcasePanel;
const vscode = __importStar(require("vscode"));
const runner_1 = require("./runner");
const judge_1 = require("./judge");
const html_1 = require("./ui/html");
const axios = require('axios');
const fs = require('fs');
let currentProblemUrl = '';
function setProblemUrl(url) {
    currentProblemUrl =
        url;
}
function openTestcasePanel(samples) {
    const panel = vscode.window.createWebviewPanel('testcases', 'Testcases', vscode.ViewColumn.Beside, {
        enableScripts: true
    });
    panel.webview.html =
        (0, html_1.getHtml)(samples);
    panel.webview.onDidReceiveMessage(async (message) => {
        // =========================
        // SUBMIT
        // =========================
        if (message.type ===
            'submit') {
            const editor = vscode.window
                .visibleTextEditors
                .find((x) => x.document.uri.fsPath
                .endsWith('.cpp'));
            if (!editor) {
                vscode.window
                    .showErrorMessage('No cpp file open');
                return;
            }
            const cpp = editor.document
                .uri
                .fsPath;
            const code = fs.readFileSync(cpp, 'utf8');
            await axios.post('http://localhost:10043/submit', {
                type: 'submit',
                code: code
            });
            vscode.window
                .showInformationMessage('Submit Sent');
        }
        // =========================
        // RUN
        // =========================
        if (message.type === 'run') {
            const workspaceFolders = vscode.workspace.workspaceFolders;
            if (!workspaceFolders) {
                return;
            }
            const folder = workspaceFolders[0]
                .uri.fsPath;
            const result = await (0, runner_1.runCpp)(folder, message.input);
            // COMPILATION ERROR
            if (!result.success &&
                result.type ===
                    'compile') {
                panel.webview.postMessage({
                    type: 'compile_error',
                    error: result.error,
                    index: message.index
                });
                return;
            }
            // TLE
            if (!result.success &&
                result.type ===
                    'tle') {
                panel.webview.postMessage({
                    type: 'tle',
                    index: message.index
                });
                return;
            }
            // RUNTIME ERROR
            if (result.error &&
                result.error.length > 0) {
                panel.webview.postMessage({
                    type: 'runtime_error',
                    error: result.error,
                    index: message.index
                });
                return;
            }
            const ok = (0, judge_1.judge)(message.expected, result.output);
            panel.webview.postMessage({
                type: 'result',
                ok: ok,
                actual: result.output,
                index: message.index
            });
        }
    });
}
//# sourceMappingURL=panel.js.map