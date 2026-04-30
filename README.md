<p align="center">
  <a href="https://opencode.ai">
    <picture>
      <source srcset="packages/console/app/src/asset/logo-ornate-dark.svg" media="(prefers-color-scheme: dark)">
      <source srcset="packages/console/app/src/asset/logo-ornate-light.svg" media="(prefers-color-scheme: light)">
      <img src="packages/console/app/src/asset/logo-ornate-light.svg" alt="OpenCode logo">
    </picture>
  </a>
</p>
<p align="center">The open source AI coding agent.</p>
<p align="center">
  <a href="https://opencode.ai/discord"><img alt="Discord" src="https://img.shields.io/discord/1391832426048651334?style=flat-square&label=discord" /></a>
  <a href="https://www.npmjs.com/package/opencode-ai"><img alt="npm" src="https://img.shields.io/npm/v/opencode-ai?style=flat-square" /></a>
  <a href="https://github.com/anomalyco/opencode/actions/workflows/publish.yml"><img alt="Build status" src="https://img.shields.io/github/actions/workflow/status/anomalyco/opencode/publish.yml?style=flat-square&branch=dev" /></a>
</p>

<p align="center">
  <a href="README.md">English</a> |
  <a href="README.zh.md">简体中文</a> |
  <a href="README.zht.md">繁體中文</a> |
  <a href="README.ko.md">한국어</a> |
  <a href="README.de.md">Deutsch</a> |
  <a href="README.es.md">Español</a> |
  <a href="README.fr.md">Français</a> |
  <a href="README.it.md">Italiano</a> |
  <a href="README.da.md">Dansk</a> |
  <a href="README.ja.md">日本語</a> |
  <a href="README.pl.md">Polski</a> |
  <a href="README.ru.md">Русский</a> |
  <a href="README.bs.md">Bosanski</a> |
  <a href="README.ar.md">العربية</a> |
  <a href="README.no.md">Norsk</a> |
  <a href="README.br.md">Português (Brasil)</a> |
  <a href="README.th.md">ไทย</a> |
  <a href="README.tr.md">Türkçe</a> |
  <a href="README.uk.md">Українська</a> |
  <a href="README.bn.md">বাংলা</a> |
  <a href="README.gr.md">Ελληνικά</a> |
  <a href="README.vi.md">Tiếng Việt</a>
</p>

[![OpenCode Terminal UI](packages/web/src/assets/lander/screenshot.png)](https://opencode.ai)

---

### Installation

```bash
# YOLO
curl -fsSL https://opencode.ai/install | bash

# Package managers
npm i -g opencode-ai@latest        # or bun/pnpm/yarn
scoop install opencode             # Windows
choco install opencode             # Windows
brew install anomalyco/tap/opencode # macOS and Linux (recommended, always up to date)
brew install opencode              # macOS and Linux (official brew formula, updated less)
sudo pacman -S opencode            # Arch Linux (Stable)
paru -S opencode-bin               # Arch Linux (Latest from AUR)
mise use -g opencode               # Any OS
nix run nixpkgs#opencode           # or github:anomalyco/opencode for latest dev branch
```

> [!TIP]
> Remove versions older than 0.1.x before installing.

### Desktop App (BETA)

OpenCode is also available as a desktop application. Download directly from the [releases page](https://github.com/anomalyco/opencode/releases) or [opencode.ai/download](https://opencode.ai/download).

| Platform              | Download                              |
| --------------------- | ------------------------------------- |
| macOS (Apple Silicon) | `opencode-desktop-darwin-aarch64.dmg` |
| macOS (Intel)         | `opencode-desktop-darwin-x64.dmg`     |
| Windows               | `opencode-desktop-windows-x64.exe`    |
| Linux                 | `.deb`, `.rpm`, or AppImage           |

```bash
# macOS (Homebrew)
brew install --cask opencode-desktop
# Windows (Scoop)
scoop bucket add extras; scoop install extras/opencode-desktop
```

#### Installation Directory

The install script respects the following priority order for the installation path:

1. `$OPENCODE_INSTALL_DIR` - Custom installation directory
2. `$XDG_BIN_DIR` - XDG Base Directory Specification compliant path
3. `$HOME/bin` - Standard user binary directory (if it exists or can be created)
4. `$HOME/.opencode/bin` - Default fallback

```bash
# Examples
OPENCODE_INSTALL_DIR=/usr/local/bin curl -fsSL https://opencode.ai/install | bash
XDG_BIN_DIR=$HOME/.local/bin curl -fsSL https://opencode.ai/install | bash
```

### Agents

OpenCode includes two built-in agents you can switch between with the `Tab` key.

- **build** - Default, full-access agent for development work
- **plan** - Read-only agent for analysis and code exploration
  - Denies file edits by default
  - Asks permission before running bash commands
  - Ideal for exploring unfamiliar codebases or planning changes

Also included is a **general** subagent for complex searches and multistep tasks.
This is used internally and can be invoked using `@general` in messages.

Learn more about [agents](https://opencode.ai/docs/agents).

### Documentation

For more info on how to configure OpenCode, [**head over to our docs**](https://opencode.ai/docs).

### Contributing

If you're interested in contributing to OpenCode, please read our [contributing docs](./CONTRIBUTING.md) before submitting a pull request.

### Building on OpenCode

If you are working on a project that's related to OpenCode and is using "opencode" as part of its name, for example "opencode-dashboard" or "opencode-mobile", please add a note to your README to clarify that it is not built by the OpenCode team and is not affiliated with us in any way.

### OpenCode-v1 (Development / Mobile Sync Mode)

This fork adds **mobile-friendly web UI** with **Tailscale support** so you can run OpenCode on your laptop and control it from your phone anywhere.

> **Important:** The wrapper script is at `packages/opencode/bin/opencode-v1.cmd` **inside the repo**. You must run it from the repo root, or use the full path.

---

#### Where is Everything?

```
C:\Users\sathv\Desktop\Opencode-v1\opencode       ← REPO ROOT (run commands from here)
├── packages/
│   ├── opencode/
│   │   ├── bin/
│   │   │   ├── opencode-v1          ← Unix wrapper
│   │   │   └── opencode-v1.cmd      ← Windows wrapper ← RUN THIS
│   │   └── src/
│   │       └── index.ts             ← Main entry point
│   └── app/
│       └── src/
│           └── entry.tsx            ← Web app entry
```

**Rule:** Always run commands from `C:\Users\sathv\Desktop\Opencode-v1\opencode` (the repo root).

---

#### Basic Terminal Usage (Same as `opencode`)

**Start TUI in current project folder:**
```cmd
:: Make sure you are in the repo root
cd C:\Users\sathv\Desktop\Opencode-v1\opencode

:: Start the TUI directly (no mobile access)
packages\opencode\bin\opencode-v1.cmd
```

**Start server for mobile + TUI access:**
```cmd
cd C:\Users\sathv\Desktop\Opencode-v1\opencode

:: Start the backend + web UI on port 4096
packages\opencode\bin\opencode-v1.cmd serve --hostname 0.0.0.0 --port 4096
```

You will see:
```
opencode server listening on http://0.0.0.0:4096
```

**Attach TUI to a running server:**
```cmd
cd C:\Users\sathv\Desktop\Opencode-v1\opencode

:: Attach TUI to the server you just started
packages\opencode\bin\opencode-v1.cmd attach http://localhost:4096
```

---

#### Common Mistake: Wrong Directory

**WRONG** — you are inside `packages\opencode` and trying to use the full path:
```cmd
C:\Users\sathv\Desktop\Opencode-v1\opencode\packages\opencode> packages\opencode\bin\opencode-v1.cmd
'packages' is not recognized as an internal or external command
```

**RIGHT** — either go back to repo root, or use relative path from where you are:
```cmd
C:\Users\sathv\Desktop\Opencode-v1\opencode\packages\opencode> bin\opencode-v1.cmd
```

Or:
```cmd
C:\Users\sathv\Desktop\Opencode-v1\opencode\packages\opencode> cd ..\..
C:\Users\sathv\Desktop\Opencode-v1\opencode> packages\opencode\bin\opencode-v1.cmd
```

---

#### Step-by-Step: Mobile Access

**1. Build the web app** (one time, from repo root):
```cmd
cd C:\Users\sathv\Desktop\Opencode-v1\opencode
cd packages\app
bun run build
cd ..\..
```

**2. Start the server** (from repo root):
```cmd
cd C:\Users\sathv\Desktop\Opencode-v1\opencode
packages\opencode\bin\opencode-v1.cmd serve --hostname 0.0.0.0 --port 4096
```

**3. Find your laptop's IP** (new terminal):
```cmd
ipconfig
:: Look for "IPv4 Address" under your WiFi adapter
:: Example: 192.168.1.42
```

**4. Open on your phone:**
- Same WiFi: `http://192.168.1.42:4096`
- Tailscale: `http://100.x.y.z:4096` (run `tailscale ip -4` to get this)

> **No CORS config needed** — Tailscale IPs and `*.ts.net` domains are auto-allowed.

---

#### Using in Your Own Project Folders

The server uses the **current working directory** as the project folder.

```cmd
:: Example: work on a different project
cd C:\Users\sathv\my-project

:: Option A: Use the full path to the wrapper
C:\Users\sathv\my-project> C:\Users\sathv\Desktop\Opencode-v1\opencode\packages\opencode\bin\opencode-v1.cmd

:: Option B: Add the bin folder to your PATH once, then just type:
C:\Users\sathv\my-project> opencode-v1.cmd
```

**To add to PATH (one time):**
```cmd
setx PATH "%PATH%;C:\Users\sathv\Desktop\Opencode-v1\opencode\packages\opencode\bin"
:: Then restart your terminal
```

---

#### Development Mode (Editing the Web UI)

If you want to change the web UI and see live reload:

**Terminal 1 — Backend** (from repo root):
```cmd
cd C:\Users\sathv\Desktop\Opencode-v1\opencode
packages\opencode\bin\opencode-v1.cmd serve --hostname 0.0.0.0 --port 4096
```

**Terminal 2 — Vite Dev Server** (from repo root):
```cmd
cd C:\Users\sathv\Desktop\Opencode-v1\opencode\packages\app
bun dev --host
```

**On your phone:** Open `http://<laptop-ip>:3000`

The Vite dev server on port 3000 proxies API calls to `localhost:4096` automatically.

---

#### Command Reference

| Command | What it does | Where to run |
|---------|-------------|--------------|
| `opencode-v1.cmd` | Start TUI in current folder | Repo root or any folder (with full path) |
| `opencode-v1.cmd serve` | Start headless server + web UI | Repo root |
| `opencode-v1.cmd attach <url>` | Attach TUI to a running server | Repo root |
| `opencode-v1.cmd web` | Start server + open browser | Repo root |
| `opencode-v1.cmd run "msg"` | One-shot command | Any folder |

---

#### Mobile Features

- **Connection status indicator** in the titlebar (green = connected, yellow = reconnecting, red = unreachable)
- **Browser notifications** with sound alerts when the agent needs your input
- **Terminal on mobile** — swipe down the drag handle to close
- **Debug bar toggle** — hidden by default on mobile, tap the console icon (bottom-left) to show
- **Aggressive logging** — open DevTools on your phone to see `[OPENCODE]` prefixed logs

---

#### Architecture

```
                    Laptop                                  Mobile
         ┌─────────────────────────────┐              ┌──────────────┐
         │  opencode-v1 serve :4096    │              │              │
         │  ┌─────────────────────┐    │◄── WiFi ────►│   Browser    │
         │  │   Backend Server    │    │   or LAN     │   Web UI     │
         │  │  (AI agent + files) │    │              │              │
         │  └─────────────────────┘    │◄─ Tailscale ─►│ Connection   │
         │           ▲                 │              │   Status     │
         │           │                 │              │ Notifications│
         │  ┌────────┴────────┐        │              │   Terminal   │
         │  │  TUI (optional) │        │              └──────────────┘
         │  │ opencode-v1     │        │
         │  │ attach :4096    │        │
         │  └─────────────────┘        │
         └─────────────────────────────┘
```

- The **backend server** is the brain — it runs the AI, manages files, and handles the terminal
- The **web UI** and **TUI** are just views — they connect to the same server
- Sessions, files, and terminal state are **fully synced** across all clients
- You can have the TUI open on your laptop AND the web UI on your phone simultaneously

---

### FAQ

#### How is this different from Claude Code?

It's very similar to Claude Code in terms of capability. Here are the key differences:

- 100% open source
- Not coupled to any provider. Although we recommend the models we provide through [OpenCode Zen](https://opencode.ai/zen), OpenCode can be used with Claude, OpenAI, Google, or even local models. As models evolve, the gaps between them will close and pricing will drop, so being provider-agnostic is important.
- Out-of-the-box LSP support
- A focus on TUI. OpenCode is built by neovim users and the creators of [terminal.shop](https://terminal.shop); we are going to push the limits of what's possible in the terminal.
- A client/server architecture. This, for example, can allow OpenCode to run on your computer while you drive it remotely from a mobile app, meaning that the TUI frontend is just one of the possible clients.

---

**Join our community** [Discord](https://discord.gg/opencode) | [X.com](https://x.com/opencode)
