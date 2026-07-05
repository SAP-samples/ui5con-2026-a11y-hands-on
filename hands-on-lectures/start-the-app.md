# Start the app

> ⏱ **Duration:** ~2 minutes (first time ~3 min while `npm install` runs)
> 🛠 **You'll run:** `npm install` + `npm start` from inside the cloned repo
> 🤖 **Claude needed?** No.

> [!IMPORTANT]
> Every exercise in this workshop assumes the UI5 dev server is running at <http://localhost:8080/index.html> so axe DevTools has something to scan. Do this **once** now and **leave the server running for the rest of the workshop.**

## 1. Open a terminal

| OS | How to open a terminal |
| --- | --- |
| **macOS** | Press <kbd>⌘</kbd> + <kbd>Space</kbd>, type **Terminal**, press <kbd>Enter</kbd>. (Or open **Finder → Applications → Utilities → Terminal**.) |
| **Windows** | Press <kbd>Win</kbd> + <kbd>R</kbd>, type **cmd**, press <kbd>Enter</kbd> — *or* right-click the **Start** button and choose **Windows Terminal** / **PowerShell**. |

## 2. `cd` into the cloned repo

In the prerequisites you cloned the repo to your **Desktop**, so the path is the same on every machine:

| OS | Command |
| --- | --- |
| **macOS / Linux** | `cd ~/Desktop/ui5con-2026-a11y-hands-on` |
| **Windows (PowerShell / cmd)** | `cd %USERPROFILE%\Desktop\ui5con-2026-a11y-hands-on` |

> 💡 **Tip — drag-and-drop the path:** if you cloned somewhere else, open the cloned folder in **Finder** (macOS) or **File Explorer** (Windows), then drag the folder into the terminal after typing `cd ` (with a trailing space). The full path is pasted for you — press <kbd>Enter</kbd>.

**Verify** you're in the right place:

```bash
# macOS / Linux
ls package.json        # should print: package.json

# Windows (PowerShell)
dir package.json       # should list package.json
```

If the file isn't found, you're not in the project root — `cd` into the `ui5con-2026-a11y-hands-on` folder.

## 3. Install and start

From inside the cloned repo:

```bash
npm install      # installs UI5 tooling + app dependencies (~1 min, first time only)
npm start        # starts the UI5 dev server on port 8080
```

Open the app at <http://localhost:8080/index.html>. You should see the **IT Equipment Catalog** — it works, but it is **not** accessible yet.

> Open a second window of your IDE (or use a split view) so you can edit files while the app auto-reloads.

✅ Server running and the app loads? You're ready for **Exercise 1**.

---

[← Back to Prerequisites](prerequisites.md) · [Back to README](../README.md) · [Next: Exercise 1 — Heading hierarchy →](01-fix-headings.md)
