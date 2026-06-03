
(function(){

    console.log(
        'INJECT JS RUNNING'
    );

    const current =
        document.currentScript;

    const code =
        current.dataset.code;

    try{

        // =========================
        // MONACO EDITOR
        // =========================
        if(
            window.monaco
        ){

            console.log(
                'MONACO DETECTED'
            );

            const model =
                window.monaco
                .editor
                .getModels()[0];

            model.setValue(
                code
            );
        }

        // =========================
        // ACE EDITOR
        // =========================
        else if(
            window.ace
        ){

            console.log(
                'ACE DETECTED'
            );

            const editorDiv =
                document.querySelector(
                    '.ace_editor'
                );

            if(
                !editorDiv
            ){

                alert(
                    'ACE editor not found'
                );

                return;
            }

            const editor =
                window.ace.edit(
                    editorDiv
                );

            editor.setValue(
                code,
                -1
            );
        }

        else{

            alert(
                'No editor detected'
            );

            return;
        }

        console.log(
            'CODE SET'
        );

        // =========================
        // SUBMIT
        // =========================
        setTimeout(()=>{

            const submit =
                document.querySelector(
                    '#submit'
                );

            if(
                submit
            ){

                console.log(
                    'CLICKING SUBMIT'
                );

                submit.click();

                console.log(
                    'SUBMITTED'
                );
            }
            else{

                alert(
                    'Submit button not found'
                );
            }

        },1500);

    }
    catch(err){

        console.log(err);

        alert(
            'Injection failed'
        );
    }

})();
