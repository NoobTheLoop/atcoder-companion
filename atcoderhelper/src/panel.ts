
import * as vscode from 'vscode';

import { runCpp } from './runner';

import { judge } from './judge';

import { getHtml } from './ui/html';

const axios =
    require('axios');

const fs =
    require('fs');

let currentProblemUrl =
    '';

export function setProblemUrl(
    url:string
){

    currentProblemUrl =
        url;
}

export function openTestcasePanel(
    samples: any[]
) {

    const panel =
        vscode.window.createWebviewPanel(

            'testcases',

            'Testcases',

            vscode.ViewColumn.Beside,

            {
                enableScripts: true
            }
        );

    panel.webview.html =
        getHtml(samples);

    panel.webview.onDidReceiveMessage(

        async (message) => {

            // =========================
            // SUBMIT
            // =========================
            if(
                message.type ===
                'submit'
            ){

                const editor =
                    vscode.window
                    .visibleTextEditors
                    .find(

                        (x)=>

                            x.document.uri.fsPath
                            .endsWith('.cpp')
                    );

                if(
                    !editor
                ){

                    vscode.window
                    .showErrorMessage(
                        'No cpp file open'
                    );

                    return;
                }

                const cpp =
                    editor.document
                    .uri
                    .fsPath;

                const code =
                    fs.readFileSync(

                        cpp,

                        'utf8'
                    );

                await axios.post(

                    'http://localhost:10043/submit',

                    {

                        type:'submit',

                        code:code
                    }
                );

                vscode.window
                .showInformationMessage(
                    'Submit Sent'
                );
            }

            // =========================
            // RUN
            // =========================
            if (
                message.type === 'run'
            ) {

                const workspaceFolders =
                    vscode.workspace.workspaceFolders;

                if (
                    !workspaceFolders
                ) {

                    return;
                }

                const folder =
                    workspaceFolders[0]
                    .uri.fsPath;

                const result: any =
                    await runCpp(
                        folder,
                        message.input
                    );

                // COMPILATION ERROR
                if (
                    !result.success &&
                    result.type ===
                    'compile'
                ) {

                    panel.webview.postMessage({

                        type:
                            'compile_error',

                        error:
                            result.error,

                        index:
                            message.index
                    });

                    return;
                }

                // TLE
                if (
                    !result.success &&
                    result.type ===
                    'tle'
                ) {

                    panel.webview.postMessage({

                        type:
                            'tle',

                        index:
                            message.index
                    });

                    return;
                }

                // RUNTIME ERROR
                if(
                    result.error &&
                    result.error.length > 0
                ){

                    panel.webview.postMessage({

                        type:'runtime_error',

                        error:
                            result.error,

                        index:
                            message.index
                    });

                    return;
                }

                const ok =
                    judge(
                        message.expected,
                        result.output
                    );

                panel.webview.postMessage({

                    type:'result',

                    ok:ok,

                    actual:
                        result.output,

                    index:
                        message.index
                });
            }
        }
    );
}
