"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCppPath = setCppPath;
exports.getCppPath = getCppPath;
exports.runCpp = runCpp;
const child_process_1 = require("child_process");
const fs = require('fs');
const path = require('path');
let currentCppPath = '';
function setCppPath(cpp) {
    currentCppPath =
        cpp;
}
function getCppPath() {
    return currentCppPath;
}
function runCpp(folder, input) {
    return new Promise((resolve) => {
        // =========================
        // CURRENT CPP FILE
        // =========================
        const cpp = currentCppPath;
        if (!cpp) {
            resolve({
                success: false,
                type: 'compile'
            });
            return;
        }
        console.log('COMPILING FILE = ', cpp);
        const cppFile = path.basename(cpp);
        // =========================
        // EXE FILE
        // =========================
        const exeName = cppFile.replace('.cpp', '.exe');
        const exe = path.join(path.dirname(cpp), exeName);
        console.log('EXE PATH = ', exe);
        // DELETE OLD EXE
        if (fs.existsSync(exe)) {
            try {
                fs.unlinkSync(exe);
            }
            catch (err) {
                console.log(err);
            }
        }
        // =========================
        // COMPILE
        // =========================
        const compile = (0, child_process_1.spawn)('g++', [
            cpp,
            '-o',
            exe,
            '-std=c++17'
        ]);
        let compileError = '';
        compile.stderr.on('data', (data) => {
            compileError +=
                data.toString();
        });
        compile.on('close', (code) => {
            // =========================
            // COMPILATION ERROR
            // =========================
            if (code !== 0) {
                console.log(compileError);
                resolve({
                    success: false,
                    type: 'compile',
                    error: compileError
                });
                return;
            }
            // =========================
            // RUN PROGRAM
            // =========================
            const run = (0, child_process_1.spawn)(exe, [], {
                cwd: path.dirname(cpp)
            });
            let output = '';
            let error = '';
            let finished = false;
            // =========================
            // TIME LIMIT
            // =========================
            const timeout = setTimeout(() => {
                if (finished) {
                    return;
                }
                finished =
                    true;
                run.kill();
                resolve({
                    success: false,
                    type: 'tle'
                });
            }, 2000);
            // STDOUT
            run.stdout.on('data', (data) => {
                output +=
                    data.toString();
            });
            // STDERR
            run.stderr.on('data', (data) => {
                error +=
                    data.toString();
            });
            // FINISH
            run.on('close', () => {
                if (finished) {
                    return;
                }
                finished =
                    true;
                clearTimeout(timeout);
                console.log('OUTPUT = ', output);
                console.log('ERROR = ', error);
                resolve({
                    success: true,
                    output: output.trim()
                });
            });
            // SEND INPUT
            run.stdin.write(input);
            run.stdin.end();
        });
    });
}
//# sourceMappingURL=runner.js.map