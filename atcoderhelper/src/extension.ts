
import * as vscode from 'vscode';

import express = require('express');

import cors = require('cors');

import {

    openTestcasePanel,

    setProblemUrl

} from './panel';

import {

    setCppPath,

    getCppPath

} from './runner';

const fs = require('fs');

const path = require('path');

let latestCode:any =
    null;


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
    // GET CURRENT CODE
    // =========================
    
app.get(

    '/code',

    (req,res)=>{

        try{

            const editor =
                vscode.window
                .activeTextEditor;

            if(
                !editor
            ){

                res.json({

                    success:false
                });

                return;
            }

            const cpp =
                editor.document
                .uri
                .fsPath;

            console.log(
                'ACTIVE CPP = ',
                cpp
            );

            if(
                !cpp.endsWith('.cpp')
            ){

                res.json({

                    success:false
                });

                return;
            }

            const code =
                fs.readFileSync(

                    cpp,

                    'utf8'
                );

            res.json({

                success:true,

                code:code
            });
        }
        catch(err){

            console.log(err);

            res.json({

                success:false
            });
        }
    }
);

// =========================
// STORE CURRENT CODE
// =========================
app.post(

    '/code',

    (req,res)=>{

        latestCode =
            req.body;

        console.log(
            'CODE STORED'
        );

        res.json({

            success:true
        });
    }
);

// =========================
// GET CURRENT CODE
// =========================
app.get(

    '/code',

    (req,res)=>{

        if(
            latestCode
        ){

            res.json(
                latestCode
            );
        }
        else{

            res.json({

                type:'none'
            });
        }
    }
);




    // =========================
    // RECEIVE SUBMIT REQUEST
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

                // ROOT = OPENED FOLDER
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

                // =========================
                // SAVE CURRENT CPP
                // =========================
                setCppPath(cpp);

                console.log(
                    'SET CPP PATH = ',
                    cpp
                );

                // =========================
                // FILE EXISTS
                // =========================
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

                // =========================
                // OPEN TESTCASE PANEL
                // =========================
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
