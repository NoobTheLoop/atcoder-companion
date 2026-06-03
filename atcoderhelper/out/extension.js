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
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const express = require("express");
const cors = require("cors");
const panel_1 = require("./panel");
const runner_1 = require("./runner");
const fs = require('fs');
const path = require('path');
let latestCode = null;
let latestSubmit = null;
function activate(context) {
    console.log('AtCoder Helper Active');
    const app = express();
    app.use(cors());
    app.use(express.json());
    // =========================
    // TEST ROUTE
    // =========================
    app.get('/', (req, res) => {
        res.send('AtCoder Helper Running');
    });
    // =========================
    // GET CURRENT CODE
    // =========================
    app.get('/code', (req, res) => {
        try {
            const editor = vscode.window
                .activeTextEditor;
            if (!editor) {
                res.json({
                    success: false
                });
                return;
            }
            const cpp = editor.document
                .uri
                .fsPath;
            console.log('ACTIVE CPP = ', cpp);
            if (!cpp.endsWith('.cpp')) {
                res.json({
                    success: false
                });
                return;
            }
            const code = fs.readFileSync(cpp, 'utf8');
            res.json({
                success: true,
                code: code
            });
        }
        catch (err) {
            console.log(err);
            res.json({
                success: false
            });
        }
    });
    // =========================
    // STORE CURRENT CODE
    // =========================
    app.post('/code', (req, res) => {
        latestCode =
            req.body;
        console.log('CODE STORED');
        res.json({
            success: true
        });
    });
    // =========================
    // GET CURRENT CODE
    // =========================
    app.get('/code', (req, res) => {
        if (latestCode) {
            res.json(latestCode);
        }
        else {
            res.json({
                type: 'none'
            });
        }
    });
    // =========================
    // RECEIVE SUBMIT REQUEST
    // =========================
    app.post('/submit', (req, res) => {
        latestSubmit =
            req.body;
        console.log('SUBMIT RECEIVED');
        console.log(latestSubmit);
        res.json({
            success: true
        });
    });
    // =========================
    // BROWSER FETCHES SUBMIT
    // =========================
    app.get('/submit', (req, res) => {
        if (latestSubmit) {
            res.json(latestSubmit);
            latestSubmit =
                null;
        }
        else {
            res.json({
                type: 'none'
            });
        }
    });
    // =========================
    // RECEIVE PROBLEM
    // =========================
    app.post('/', async (req, res) => {
        try {
            const data = req.body;
            console.log(data);
            (0, panel_1.setProblemUrl)(data.url);
            // CHECK WORKSPACE
            const workspaceFolders = vscode.workspace.workspaceFolders;
            if (!workspaceFolders) {
                vscode.window.showErrorMessage('Open a folder in VS Code first');
                res.status(400).json({
                    error: 'No folder open'
                });
                return;
            }
            // ROOT = OPENED FOLDER
            const folder = workspaceFolders[0]
                .uri.fsPath;
            // SAFE FILE NAME
            const safeTitle = data.title.replace(/[<>:"/\\\\|?*]/g, '_');
            const safeCppName = safeTitle
                .replace(/\s+/g, '_');
            const cpp = path.join(folder, safeCppName + '.cpp');
            // =========================
            // SAVE CURRENT CPP
            // =========================
            (0, runner_1.setCppPath)(cpp);
            console.log('SET CPP PATH = ', cpp);
            // =========================
            // FILE EXISTS
            // =========================
            if (fs.existsSync(cpp)) {
                const doc = await vscode.workspace.openTextDocument(cpp);
                await vscode.window.showTextDocument(doc);
            }
            else {
                fs.writeFileSync(cpp, `#include <bits/stdc++.h>
using namespace std;

`);
                const doc = await vscode.workspace.openTextDocument(cpp);
                await vscode.window.showTextDocument(doc);
            }
            // =========================
            // OPEN TESTCASE PANEL
            // =========================
            (0, panel_1.openTestcasePanel)(data.samples);
            res.json({
                success: true
            });
        }
        catch (err) {
            console.log(err);
            res.status(500).json({
                error: err.message
            });
        }
    });
    // =========================
    // START SERVER
    // =========================
    app.listen(10043, () => {
        console.log('Listening on 10043');
    });
}
function deactivate() { }
//# sourceMappingURL=extension.js.map