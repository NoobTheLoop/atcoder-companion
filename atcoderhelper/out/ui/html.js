"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHtml = getHtml;
const styles_1 = require("./styles");
const script_1 = require("./script");
function getHtml(samples) {
    let cards = '';
    for (let i = 0; i < samples.length; i++) {
        cards += `

        <div class="card">

            <div
                class="header"

                style="
                    display:flex;
                    justify-content:space-between;
                    align-items:center;
                "
            >

                <h2>
                    ▼ TC ${i + 1}
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
                        id="miniVerdict${i}"
                    >
                        Waiting
                    </div>

                    <button
                        id="runBtn${i}"
                    >
                        ▶ Run
                    </button>

                    <button
                        id="deleteBtn${i}"
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
                    id="input${i}"
                >${samples[i].input}</textarea>

                <div class="label">
                    Expected Output
                </div>

                <textarea
                    id="expected${i}"
                >${samples[i].output}</textarea>

                <div class="label">
                    Your Output
                </div>

                <textarea
                    id="actual${i}"
                    readonly
                ></textarea>

                <div
                    class="verdict"
                    id="verdict${i}"
                >
                    Waiting...
                </div>

            </div>

        </div>
        `;
    }
    return `
    <!DOCTYPE html>

    <html>

    <head>

        <style>

            ${styles_1.styles}

        </style>

    </head>

    <body>

        <div class="top">

            <div class="title">
                Testcases
            </div>

            <div
                style="
                    display:flex;
                    gap:10px;
                "
            >

                <button
                    id="addBtn"
                >
                    ➕ Add
                </button>

                <button
                    id="runAllBtn"
                >
                    ▶ Run All
                </button>

                <button
                    id="submitBtn"
                >
                    🚀 Submit
                </button>

            </div>

        </div>

        ${cards}

        <script>

            ${script_1.script}

        </script>

    </body>

    </html>
    `;
}
//# sourceMappingURL=html.js.map