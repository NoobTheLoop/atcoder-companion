
import * as vscode from 'vscode';

import express = require('express');

import cors = require('cors');

import {

    openTestcasePanel,

    setProblemUrl

} from './panel';

const fs = require('fs');

const path = require('path');

let latestSubmit:any =
    null;

export function activate(
    context: vscode.ExtensionContext
) {

    console.log(
        'AtCoder Helper Active'
    );

    const app =
        express();

    app.use(cors());

    app.use(express.json());

    // =========================
    // TEST ROUTE
    // =========================
    app.get(

        '/',

        (req,res)=>{

            res.send(
                'AtCoder Helper Running'
            );
        }
    );

    // =========================
    // RECEIVE SUBMIT
    // =========================
    app.post(

        '/submit',

        (req,res)=>{

            latestSubmit =
                req.body;

            console.log(
                'SUBMIT RECEIVED'
            );

            console.log(
                latestSubmit
            );

            res.json({

                success:true
            });
        }
    );

    // =========================
    // BROWSER FETCHES SUBMIT
    // =========================
    app.get(

        '/submit',

        (req,res)=>{

            if(
                latestSubmit
            ){

                res.json(
                    latestSubmit
                );

                latestSubmit =
                    null;
            }
            else{

                res.json({

                    type:'none'
                });
            }
        }
    );

    // =========================
    // RECEIVE PROBLEM
    // =========================
    app.post(

        '/',

        async (req,res)=>{

            try{

                const data =
                    req.body;

                console.log(data);

                setProblemUrl(
                    data.url
                );

                // CHECK WORKSPACE
                const workspaceFolders =
                    vscode.workspace.workspaceFolders;

                if(
                    !workspaceFolders
                ){

                    vscode.window.showErrorMessage(
                        'Open a folder in VS Code first'
                    );

                    res.status(400).json({

                        error:
                            'No folder open'
                    });

                    return;
                }

                // ROOT FOLDER
                const folder =
                    workspaceFolders[0]
                    .uri.fsPath;

                // SAFE FILE NAME
                const safeTitle =
                    data.title.replace(

                        /[<>:"/\\\\|?*]/g,

                        '_'
                    );

                const safeCppName =
                    safeTitle
                    .replace(/\s+/g,'_');

                const cpp =
                    path.join(
                        folder,
                        safeCppName + '.cpp'
                    );

                // FILE EXISTS
                if(
                    fs.existsSync(cpp)
                ){

                    const doc =
                        await vscode.workspace.openTextDocument(
                            cpp
                        );

                    await vscode.window.showTextDocument(
                        doc
                    );
                }
                else{

                    fs.writeFileSync(

                        cpp,

`#include <bits/stdc++.h>
using namespace std;

`
                    );

                    const doc =
                        await vscode.workspace.openTextDocument(
                            cpp
                        );

                    await vscode.window.showTextDocument(
                        doc
                    );
                }

                // OPEN TESTCASE PANEL
                openTestcasePanel(
                    data.samples
                );

                res.json({

                    success:true
                });
            }
            catch(err:any){

                console.log(err);

                res.status(500).json({

                    error:err.message
                });
            }
        }
    );

    // =========================
    // START SERVER
    // =========================
    app.listen(

        10043,

        ()=>{

            console.log(
                'Listening on 10043'
            );
        }
    );
}

export function deactivate(){}
