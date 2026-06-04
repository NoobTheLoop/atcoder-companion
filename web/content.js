
if(

    window.atcoderHelperLoaded
){

    console.log(
        'ALREADY LOADED'
    );
}
else{

    window.atcoderHelperLoaded =
        true;

    console.log(
        'CONTENT SCRIPT LOADED'
    );

    let submitting =
        false;

    // =========================
    // AUTO SUBMIT
    // =========================
    setInterval(

        async ()=>{

            try{

                if(
                    submitting
                ){

                    return;
                }

                const response =
                    await fetch(
                        'http://localhost:10043/submit'
                    );

                const submitData =
                    await response.json();

                if(
                    submitData.type ===
                    'none'
                ){

                    return;
                }

                submitting =
                    true;

                console.log(
                    'AUTO SUBMIT'
                );

                // =========================
                // CREATE SCRIPT
                // =========================
                const script =
                    document.createElement(
                        'script'
                    );

                script.dataset.code =
                    submitData.code;

                script.src =
                    chrome.runtime.getURL(
                        'inject.js'
                    );

                script.onload = ()=>{

                    script.remove();
                };

                (
                    document.head ||
                    document.documentElement
                ).appendChild(script);

                // =========================
                // UNLOCK
                // =========================
                setTimeout(()=>{

                    submitting =
                        false;

                },5000);

            }
            catch(err){

                console.log(err);

                submitting =
                    false;
            }

        },

        3000
    );

    // =========================
    // GET SAMPLES
    // =========================
    function getSamples() {

        const sections =
            document.querySelectorAll(
                'section'
            );

        let samples = [];

        for (
            let i = 0;
            i < sections.length;
            i++
        ) {

            const h3 =
                sections[i]
                .querySelector('h3');

            if (!h3){

                continue;
            }

            if (
                h3.innerText.includes(
                    'Sample Input'
                )
            ) {

                const input =
                    sections[i]
                    .querySelector('pre')
                    ?.innerText || '';

                const output =
                    sections[i + 1]
                    ?.querySelector('pre')
                    ?.innerText || '';

                samples.push({

                    input,

                    output
                });
            }
        }

        return samples;
    }

    // =========================
    // SEND PROBLEM TO VSCODE
    // =========================
    (async ()=>{

        try{

            const data = {

                title:
                    document.querySelector(
                        'span.h2'
                    )?.innerText || 'problem',

                url:
                    location.href,

                samples:
                    getSamples()
            };

            console.log(
                'SENDING PROBLEM',
                data
            );

            const response =
                await fetch(

                    'http://localhost:10043/',

                    {

                        method:'POST',

                        headers:{

                            'Content-Type':
                                'application/json'
                        },

                        body:
                            JSON.stringify(data)
                    }
                );

            const result =
                await response.json();

            console.log(
                'PROBLEM SENT',
                result
            );
        }
        catch(err){

            console.log(err);
        }

    })();
}
