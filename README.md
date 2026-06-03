````md
# AtCoder Companion

A competitive programming companion for AtCoder that integrates:

- VS Code
- Browser Extension
- Testcase Runner
- Auto Submit System

---

# Features

## Problem Fetching

- Fetches AtCoder problems directly into VS Code
- Automatically creates `.cpp` files
- Opens existing problem files automatically

## Testcase Panel

- Built-in testcase UI
- Run sample testcases instantly
- Verdict system:
  - AC
  - WA
  - TLE
  - CE
  - Runtime Error

## Auto Submit

- Submit directly to AtCoder from VS Code
- Browser extension automatically injects code into AtCoder editor
- Supports automatic submission workflow

## Smart Workflow

- No manual copy-paste
- No temporary testcase txt files
- Uses currently opened workspace folder
- Auto opens existing problem files

---

# Project Structure

```text
atcoder-companion/
│
├── vscode-extension/
│
└── browser-extension/
````




# Clone Repository

Run:

```bash
git clone https://github.com/NoobTheLoop/atcoder-companion.git
````

Then go inside the project:

```bash
cd atcoder-companion
```











---

# Requirements

## VS Code

Install:

* VS Code
* C++ extension

## Compiler

You must have:

```text
g++
```

installed and added to PATH.

Recommended:

* MinGW
* MSYS2

## Browser

Supported browsers:

* Chrome
* Brave

---


# Installation


# VS Code Extension

## Install from VSIX

Go to the `atcoderhelper` folder.

you will see:

atcoderhelper-0.0.1.vsix


inside the `atcoderhelper` folder.

Download/use that file.

### Install Steps

1. Open VS Code
2. Go to Extensions
3. Click `...`
4. Select:

```text
Install from VSIX
```

5. Choose:

```text
atcoderhelper-0.0.1.vsix
```




# Browser Extension

1. Open:

```text
chrome://extensions
```

2. Enable:

```text
Developer Mode
```

3. Click:

```text
Load unpacked
```

4. Select web extension folder

---

# Usage

## Open Folder

Open a folder in VS Code.

## Open AtCoder Problem

Open any AtCoder problem page.

## Click Extension Icon

The extension will:

* Fetch problem
* Create/open cpp file
* Open testcase panel

## Solve Problem

Write code in VS Code.

## Run Testcases

Use testcase panel.

## Submit

Click submit in testcase panel.

---



after making changes.

---

