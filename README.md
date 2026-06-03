# .copilot Harness

Multi-agent orchestration harness for GitHub Copilot CLI. Self-contained - no external dependencies beyond the Copilot CLI itself.

## Setup

**Prerequisites:** Node.js 18+ and GitHub Copilot CLI installed.

```bash
# 1. Clone this repo to your home directory as ~/.copilot
git clone https://github.com/Yntrinzix/Copilot.git ~/.copilot

# 2. Build the MCP server (required - won't work without this)
cd ~/.copilot/mcp-servers/brain
npm install
npm run build

# 3. Configure Azure DevOps (optional - only if your team uses ADO)
# Edit ~/.copilot/mcp-config.json and set:
#   AZURE_DEVOPS_ORG_URL → your org URL
#   AZURE_DEVOPS_PAT → your personal access token

# 4. Start Copilot CLI (from any project directory)
copilot

# 5. Verify everything loaded
/agent
# Should list: architect, dark-architect, frontend, backend, etc.
```

**Important:** The folder MUST be named `.copilot` inside your user home directory. This is where Copilot CLI looks for global agents, skills, hooks, and MCP config.

| OS | Home Directory | Full Path |
|----|----------------|-----------|
| Windows | `C:\Users\YourUsername\` | `C:\Users\YourUsername\.copilot` |
| macOS | `/Users/YourUsername/` | `/Users/YourUsername/.copilot` |
| Linux | `/home/YourUsername/` | `/home/YourUsername/.copilot` |

To find yours, run `echo $HOME` (macOS/Linux) or `echo %USERPROFILE%` (Windows).

**If you skip step 2**, the brain MCP tools (knowledge, sessions, workflows) won't be available. Agents and skills still work, but you lose persistent memory.

## Structure

```
.copilot/
├── instructions.md          <- Global instructions (always loaded)
├── hooks.json               <- Safety guards (pre/post tool-use)
├── mcp-config.json          <- MCP server registration
├── signal.json              <- Signal tripwire (empty = all clear)
├── agents/                  <- Specialized agent definitions
│   ├── architect.agent.md
│   ├── dark-architect.agent.md
│   ├── frontend.agent.md
│   ├── backend.agent.md
│   ├── quality-assurance.agent.md
│   ├── designer.agent.md
│   ├── protobuf-engineer.agent.md
│   ├── tester.agent.md
│   ├── github-agent.agent.md
│   └── ticket-triage.agent.md
├── skills/                  <- Workflow skills (loaded on keyword trigger)
│   ├── tournament/          <- Adversarial design review (3 rounds)
│   ├── deathmatch/          <- Extended tournament with redemption (5 rounds)
│   ├── wargame/             <- Multi-party negotiation analysis
│   ├── vectorstorm/         <- Structured brainstorm with ranked options
│   ├── storyboard/          <- Narrative motion/animation design
│   ├── grill-me/            <- Relentless design interview
│   └── systematic-debugging/ <- Root cause investigation protocol
├── steering/                <- Context-specific instructions (loaded via MCP)
├── knowledge/               <- Persistent discoveries and session notes
│   ├── sessions/
│   ├── projects/
│   └── workflow/
└── mcp-servers/brain/       <- MCP server (knowledge, workflow, signals)
```

## How It Works

1. **instructions.md** is always loaded by Copilot CLI
2. **Agents** are invoked with @mention (e.g., `@architect design a billing API`)
3. **Skills** trigger on keywords (say "tournament" to start adversarial review)
4. **MCP tools** provide persistent state: knowledge search, session continuity, workflow orchestration, signal tripwire
5. **Hooks** block destructive operations automatically

## Keyword Triggers

| Say This | What Happens |
|----------|--------------|
| tournament | 3-round adversarial design review |
| deathmatch | 5-round extended review with redemption |
| wargame | Multi-party negotiation game theory |
| vectorstorm | Structured brainstorm with 3-5 distinct options |
| storyboard | Narrative animation/motion design |
| grill me | Relentless design interview |

## Agent Roster

| Agent | Role | Access |
|-------|------|--------|
| @architect | System design, API design | Read + analyze |
| @dark-architect | Adversarial review, find flaws | Read + analyze |
| @frontend | TypeScript/Next.js/React implementation | Full |
| @backend | C#/.NET 8/gRPC implementation | Full |
| @quality-assurance | Critical code review | Read-only |
| @designer | UI/UX design | Full |
| @protobuf-engineer | Proto schema design | Full |
| @tester | Test writing, negative paths | Full |
| @github-agent | PR creation, branch management | Shell |
| @ticket-triage | Work item readiness check | Read + analyze |

## For Teams

This folder is designed to be shared. Each team member:
1. Copies `.copilot/` to their home directory
2. Runs `npm install && npm run build` in the MCP server
3. Starts using Copilot CLI with the full harness

The `knowledge/` directory starts empty. It builds up per-user over time via MCP tools.
