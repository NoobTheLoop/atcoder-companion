"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.script = void 0;
exports.script = `

const vscode =
    acquireVsCodeApi();

let testcaseCount =
    document.querySelectorAll(
        '.card'
    ).length;

// attach buttons
for(
    let i = 0;
    i < testcaseCount;
    i++
){

    attachRunButton(i);

    attachDeleteButton(i);

    attachCollapse(i);
}

// OPEN FIRST TESTCASE
const first =
    document.querySelector(
        '.card'
    );

if(first){

    first.classList.add(
        'open'
    );
}

// SUBMIT BUTTON
document
.getElementById(
    'submitBtn'
)
.onclick = ()=>{

    vscode.postMessage({

        type:'submit'
    });
};

// ADD TESTCASE
document
.getElementById(
    'addBtn'
)
.onclick = ()=>{

    const index =
        testcaseCount;

    const container =
        document.createElement(
            'div'
        );

    container.className =
        'card open';

    container.innerHTML = \`

        <div
            class="header"

            style="
                display:flex;
                justify-content:space-between;
                align-items:center;
            "
        >

            <h2>
                ▼ TC \${document.querySelectorAll('.card').length + 1}
            </h2>

            <div
                style="
                    display:flex;
                    align-items:center;
                    gap:10px;
                "
            >

                <div
                    class="miniVerdict"
                    id="miniVerdict\${index}"
                >
                    Waiting
                </div>

                <button
                    id="runBtn\${index}"
                >
                    ▶ Run
                </button>

                <button
                    id="deleteBtn\${index}"
                >
                    🗑 Delete
                </button>

            </div>

        </div>

        <div class="content">

            <div class="label">
                Input
            </div>

            <textarea
                id="input\${index}"
            ></textarea>

            <div class="label">
                Expected Output
            </div>

            <textarea
                id="expected\${index}"
            ></textarea>

            <div class="label">
                Your Output
            </div>

            <textarea
                id="actual\${index}"
                readonly
            ></textarea>

            <div
                class="verdict"
                id="verdict\${index}"
            >
                Waiting...
            </div>

        </div>
    \`;

    document.body.appendChild(
        container
    );

    attachRunButton(index);

    attachDeleteButton(index);

    attachCollapse(index);

    testcaseCount++;

    refreshNumbers();
};

// RUN ALL
document
.getElementById(
    'runAllBtn'
)
.onclick = async ()=>{

    for(
        let i = 0;
        i < testcaseCount;
        i++
    ){

        const btn =
            document.getElementById(
                'runBtn' + i
            );

        if(
            btn &&
            btn.closest('.card')
        ){

            await runSingle(i);
        }
    }
};

// RUN BUTTON
function attachRunButton(index){

    const btn =
        document.getElementById(
            'runBtn' + index
        );

    if(!btn){

        return;
    }

    btn.onclick = async (e)=>{

        e.stopPropagation();

        await runSingle(index);
    };
}

// DELETE BUTTON
function attachDeleteButton(index){

    const btn =
        document.getElementById(
            'deleteBtn' + index
        );

    if(!btn){

        return;
    }

    btn.onclick = (e)=>{

        e.stopPropagation();

        const card =
            btn.closest('.card');

        if(card){

            card.remove();
        }

        refreshNumbers();
    };
}

// COLLAPSE
function attachCollapse(index){

    const card =
        document
        .getElementById(
            'runBtn' + index
        )
        .closest('.card');

    const header =
        card.querySelector(
            '.header'
        );

    if(!header){

        return;
    }

    header.onclick = ()=>{

        card.classList.toggle(
            'open'
        );

        const title =
            header.querySelector(
                'h2'
            );

        if(
            card.classList.contains(
                'open'
            )
        ){

            title.innerText =
                title.innerText.replace(
                    '▶',
                    '▼'
                );
        }
        else{

            title.innerText =
                title.innerText.replace(
                    '▼',
                    '▶'
                );
        }
    };
}

// REFRESH NUMBERS
function refreshNumbers(){

    const cards =
        document.querySelectorAll(
            '.card'
        );

    for(
        let i = 0;
        i < cards.length;
        i++
    ){

        const title =
            cards[i]
            .querySelector('h2');

        if(title){

            const open =
                cards[i]
                .classList.contains(
                    'open'
                );

            title.innerText =
                (open ? '▼ ' : '▶ ')
                + 'TC '
                + (i + 1);
        }
    }
}

// RUN SINGLE
function runSingle(index){

    return new Promise((resolve)=>{

        const inputBox =
            document
            .getElementById(
                'input' + index
            );

        const expectedBox =
            document
            .getElementById(
                'expected' + index
            );

        const actualBox =
            document
            .getElementById(
                'actual' + index
            );

        const verdict =
            document
            .getElementById(
                'verdict' + index
            );

        const miniVerdict =
            document
            .getElementById(
                'miniVerdict' + index
            );

        if(
            !inputBox ||
            !expectedBox ||
            !actualBox ||
            !verdict
        ){

            resolve();

            return;
        }

        const input =
            inputBox.value;

        const expected =
            expectedBox.value;

        verdict.innerText =
            'Running...';

        verdict.style.background =
            '#854d0e';

        miniVerdict.innerText =
            'Running';

        miniVerdict.style.background =
            '#854d0e';

        const handler = (event)=>{

            const message =
                event.data;

            if(
                message.index !== index
            ){

                return;
            }

            if(
                message.type ===
                'result'
            ){

                actualBox.value =
                    message.actual;

                const card =
                    verdict.closest(
                        '.card'
                    );

                const title =
                    card.querySelector(
                        'h2'
                    );

                if(
                    message.ok
                ){

                    verdict.innerText =
                        '✅ Passed';

                    verdict.style.background =
                        '#14532d';

                    miniVerdict.innerText =
                        '✅ Passed';

                    miniVerdict.style.background =
                        '#14532d';

                    // collapse testcase
                    if(card){

                        card.classList.remove(
                            'open'
                        );
                    }

                    if(title){

                        title.innerText =
                            title.innerText.replace(
                                '▼',
                                '▶'
                            );
                    }
                }
                else{

                    verdict.innerText =
                        '❌ Failed';

                    verdict.style.background =
                        '#7f1d1d';

                    miniVerdict.innerText =
                        '❌ Failed';

                    miniVerdict.style.background =
                        '#7f1d1d';

                    // keep testcase open
                    if(card){

                        card.classList.add(
                            'open'
                        );
                    }

                    if(title){

                        title.innerText =
                            title.innerText.replace(
                                '▶',
                                '▼'
                            );
                    }
                }

                window.removeEventListener(
                    'message',
                    handler
                );

                resolve();
            }

            if(
                message.type ===
                'compile_error'
            ){

                verdict.innerText =
                    '❌ Compilation Error';

                verdict.style.background =
                    '#7f1d1d';

                miniVerdict.innerText =
                    '❌ CE';

                miniVerdict.style.background =
                    '#7f1d1d';

                window.removeEventListener(
                    'message',
                    handler
                );

                resolve();
            }

            if(
                message.type ===
                'tle'
            ){

                verdict.innerText =
                    '⏰ Time Limit Exceeded';

                verdict.style.background =
                    '#7f1d1d';

                miniVerdict.innerText =
                    '⏰ TLE';

                miniVerdict.style.background =
                    '#7f1d1d';

                window.removeEventListener(
                    'message',
                    handler
                );

                resolve();
            }
        };

        window.addEventListener(
            'message',
            handler
        );

        vscode.postMessage({

            type:'run',

            input:input,

            expected:expected,

            index:index
        });
    });
}

`;
//# sourceMappingURL=script.js.map