"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.styles = void 0;
exports.styles = `

body{

    background:#0f172a;

    color:white;

    font-family:Arial;

    padding:14px;

    font-size:14px;
}

.card{

    background:#1e293b;

    padding:14px;

    border-radius:14px;

    margin-top:14px;
}

.top{

    display:flex;

    justify-content:space-between;

    align-items:center;

    margin-bottom:14px;
}

.title{

    font-size:22px;

    font-weight:bold;
}

.header{

    cursor:pointer;

    user-select:none;
}

.content{

    display:none;

    margin-top:12px;
}

.card.open .content{

    display:block;
}

textarea{

    width:100%;

    height:85px;

    margin-top:6px;

    background:#020617;

    color:white;

    border:none;

    border-radius:10px;

    padding:10px;

    resize:none;

    font-size:14px;

    box-sizing:border-box;
}

.label{

    margin-top:14px;

    margin-bottom:4px;

    color:#cbd5e1;

    font-weight:bold;

    font-size:14px;
}

.verdict{

    margin-top:16px;

    padding:10px;

    border-radius:10px;

    background:#334155;

    color:white;

    font-weight:bold;

    text-align:center;

    font-size:14px;
}

.miniVerdict{

    padding:6px 10px;

    border-radius:8px;

    background:#334155;

    font-size:13px;

    font-weight:bold;
}

[id^="runBtn"],
#runAllBtn,
#submitBtn,
#addBtn{

    background:#22c55e;

    color:white;

    border:none;

    padding:8px 14px;

    border-radius:10px;

    cursor:pointer;

    font-weight:bold;

    transition:0.2s;

    font-size:14px;
}

[id^="runBtn"]:hover,
#runAllBtn:hover,
#submitBtn:hover,
#addBtn:hover{

    opacity:0.9;

    transform:scale(1.03);
}

[id^="deleteBtn"]{

    background:#dc2626;

    color:white;

    border:none;

    padding:8px 14px;

    border-radius:10px;

    cursor:pointer;

    font-weight:bold;

    transition:0.2s;

    font-size:14px;
}

[id^="deleteBtn"]:hover{

    opacity:0.9;

    transform:scale(1.03);
}

h2{

    font-size:18px;

    margin:0;
}

`;
//# sourceMappingURL=styles.js.map