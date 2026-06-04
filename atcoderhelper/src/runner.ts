
import { spawn } from 'child_process';

const fs =
    require('fs');

const path =
    require('path');

const vscode =
    require('vscode');

export function runCpp(
    folder:string,
    input:string
){

    return new Promise((resolve)=>{

        // =========================
        // CURRENT OPEN CPP FILE
        // =========================
        const editor =
            vscode.window
            .visibleTextEditors
            .find(

                (x:any)=>

                    x.document.uri.fsPath
                    .endsWith('.cpp')
            );

        if(
            !editor
        ){

            resolve({

                success:false,

                type:'compile'
            });

            return;
        }

        const cpp =
            editor.document
            .uri
            .fsPath;

        console.log(
            'COMPILING FILE = ',
            cpp
        );

        const cppFile =
            path.basename(cpp);

        // =========================
        // EXE FILE
        // =========================
        const exeName =
            cppFile.replace(
                '.cpp',
                '.exe'
            );

        const exe =
            path.join(
                path.dirname(cpp),
                exeName
            );

        console.log(
            'EXE PATH = ',
            exe
        );

        // =========================
        // DELETE OLD EXE
        // =========================
        if(
            fs.existsSync(exe)
        ){

            try{

                fs.unlinkSync(exe);
            }
            catch(err){

                console.log(err);
            }
        }

        // =========================
        // COMPILE
        // =========================
        const compile =
            spawn(

                'g++',

                [

                    cpp,

                    '-o',

                    exe,

                    '-std=c++17'
                ]
            );

        let compileError =
            '';

        compile.stderr.on(

            'data',

            (data:any)=>{

                compileError +=
                    data.toString();
            }
        );

        compile.on(

            'close',

            (code:any)=>{

                // =========================
                // COMPILATION ERROR
                // =========================
                if(
                    code !== 0
                ){

                    console.log(
                        compileError
                    );

                    resolve({

                        success:false,

                        type:'compile',

                        error:
                            compileError
                    });

                    return;
                }

                // =========================
                // RUN PROGRAM
                // =========================
                const run =
                    spawn(

                        exe,

                        [],

                        {

                            cwd:
                                path.dirname(cpp)
                        }
                    );

                let output =
                    '';

                let error =
                    '';

                let finished =
                    false;

                // =========================
                // TIME LIMIT
                // =========================
                const timeout =
                    setTimeout(()=>{

                        if(
                            finished
                        ){

                            return;
                        }

                        finished =
                            true;

                        run.kill();

                        resolve({

                            success:false,

                            type:'tle'
                        });

                    },2000);

                // =========================
                // STDOUT
                // =========================
                run.stdout.on(

                    'data',

                    (data:any)=>{

                        output +=
                            data.toString();
                    }
                );

                // =========================
                // STDERR
                // =========================
                run.stderr.on(

                    'data',

                    (data:any)=>{

                        error +=
                            data.toString();
                    }
                );

                // =========================
                // FINISH
                // =========================
                run.on(

                    'close',

                    ()=>{

                        if(
                            finished
                        ){

                            return;
                        }

                        finished =
                            true;

                        clearTimeout(
                            timeout
                        );

                        console.log(
                            'OUTPUT = ',
                            output
                        );

                        console.log(
                            'ERROR = ',
                            error
                        );

                        resolve({

                            success:true,

                            output:
                                output.trim()
                        });
                    }
                );

                // =========================
                // SEND INPUT
                // =========================
                run.stdin.write(
                    input
                );

                run.stdin.end();
            }
        );
    });
}
