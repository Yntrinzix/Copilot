import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import MiniSearch from "minisearch";
import { readFileSync, readdirSync, writeFileSync, existsSync, statSync, mkdirSync, unlinkSync } from "fs";
import { join, relative } from "path";

const COPILOT_ROOT = process.env.COPILOT_ROOT || join(process.env.HOME || process.env.USERPROFILE || "", ".copilot");
const KNOWLEDGE_DIR = join(COPILOT_ROOT, "knowledge");
const SIGNAL_FILE = join(COPILOT_ROOT, "signal.json");
const SESSION_FILE = join(COPILOT_ROOT, "session-state.json");
const STEERING_DIR = join(COPILOT_ROOT, "steering");

// Knowledge index
const index = new MiniSearch<{ id: string; path: string; title: string; content: string }>({
  fields: ["title", "content", "path"],
  storeFields: ["path", "title", "content"],
  searchOptions: { prefix: true, fuzzy: 0.2, boost: { title: 3, path: 1.5 } },
});

function indexKnowledge() {
  if (!existsSync(KNOWLEDGE_DIR)) return;
  const docs: Array<{ id: string; path: string; title: string; content: string }> = [];
  function walk(dir: string) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) { if (entry.name !== ".git") walk(full); }
      else if (entry.name.endsWith(".md") && entry.name !== ".gitkeep") {
        const content = readFileSync(full, "utf-8");
        const title = entry.name.replace(".md", "");
        const relPath = relative(KNOWLEDGE_DIR, full).replace(/\\/g, "/");
        docs.push({ id: relPath, path: relPath, title, content });
      }
    }
  }
  walk(KNOWLEDGE_DIR);
  if (docs.length) index.addAll(docs);
}

indexKnowledge();

const server = new Server({ name: "brain", version: "1.0.0" }, { capabilities: { tools: {} } });

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    { name: "knowledge_search", description: "Search knowledge base for past decisions and discoveries", inputSchema: { type: "object", properties: { query: { type: "string", description: "Search terms - can be natural language or keywords" }, limit: { type: "number", description: "Max results (default 5)" } }, required: ["query"] } },
    { name: "knowledge_add", description: "Store a new discovery in knowledge base", inputSchema: { type: "object", properties: { name: { type: "string", description: "Short descriptive name (kebab-case, e.g. 'billing-api-port-conflict')" }, content: { type: "string", description: "The knowledge to store (markdown)" }, category: { type: "string", enum: ["session", "project", "workflow"], description: "Where to file it: session (temporal notes), project (codebase discoveries), workflow (cross-project patterns)" } }, required: ["name", "content"] } },
    { name: "knowledge_list", description: "List all knowledge entries, optionally filtered by category", inputSchema: { type: "object", properties: { category: { type: "string", enum: ["session", "project", "workflow", "shared", "all"], description: "Filter by category (default: all)" } } } },
    { name: "knowledge_prune", description: "Find stale, duplicate, or outdated knowledge entries. Returns candidates for removal.", inputSchema: { type: "object", properties: { older_than_days: { type: "number", description: "Flag entries not modified in N days (default: 90)" } } } },
    { name: "knowledge_delete", description: "Delete a knowledge entry by path", inputSchema: { type: "object", properties: { path: { type: "string", description: "Relative path within knowledge/ (e.g. sessions/old-session.md)" } }, required: ["path"] } },
    { name: "signal_read", description: "Check for critical alerts before destructive actions", inputSchema: { type: "object", properties: {} } },
    { name: "signal_write", description: "Write a critical signal for other agents", inputSchema: { type: "object", properties: { status: { type: "string" }, reason: { type: "string" }, author: { type: "string" } }, required: ["status", "reason", "author"] } },
    { name: "session_save", description: "Save session state for continuity", inputSchema: { type: "object", properties: { topic: { type: "string" }, status: { type: "string" }, decisions: { type: "array", items: { type: "string" } }, next_steps: { type: "array", items: { type: "string" } } }, required: ["topic", "status"] } },
    { name: "session_resume", description: "Resume from last session state", inputSchema: { type: "object", properties: { topic: { type: "string" } } } },
    { name: "get_active_steering", description: "Load context-appropriate steering instructions", inputSchema: { type: "object", properties: { file_path: { type: "string" }, project: { type: "string" } } } },
    { name: "guide_propose_update", description: "Propose a guide update after a correction", inputSchema: { type: "object", properties: { file: { type: "string" }, change: { type: "string" }, reason: { type: "string" } }, required: ["file", "change", "reason"] } },
    { name: "workflow_start", description: "Start a structured workflow (tournament, deathmatch, wargame)", inputSchema: { type: "object", properties: { template: { type: "string" }, context: { type: "string" } }, required: ["template", "context"] } },
    { name: "workflow_advance", description: "Advance workflow to next phase", inputSchema: { type: "object", properties: { phase: { type: "string" }, result: { type: "string" } }, required: ["phase", "result"] } },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case "knowledge_search": {
      const limit = (args?.limit as number) || 5;
      const results = index.search(args?.query as string);
      const top = results.slice(0, limit).map((r) => {
        // Extract first meaningful paragraph as snippet (skip frontmatter)
        const lines = (r.content || "").split("\n");
        const bodyStart = lines.findIndex((l, i) => i > 0 && !l.startsWith("---") && !l.startsWith("sync:") && !l.startsWith("lastLocalEdit:") && l.trim().length > 20);
        const snippet = lines.slice(Math.max(0, bodyStart), bodyStart + 5).join("\n").slice(0, 400);
        return { path: r.path, title: r.title, score: Math.round(r.score * 100) / 100, snippet };
      });
      if (top.length === 0) return { content: [{ type: "text", text: "No results found for: " + args?.query }] };
      return { content: [{ type: "text", text: JSON.stringify(top, null, 2) }] };
    }

    case "knowledge_add": {
      const category = (args?.category as string) || "session";
      const dirMap: Record<string, string> = { session: "sessions", project: "projects", workflow: "workflow" };
      const targetDir = join(KNOWLEDGE_DIR, dirMap[category] || "sessions");
      if (!existsSync(targetDir)) mkdirSync(targetDir, { recursive: true });
      const slug = (args?.name as string).replace(/\s+/g, "-").toLowerCase().replace(/[^a-z0-9-]/g, "");
      const filePath = join(targetDir, `${slug}.md`);
      const date = new Date().toISOString().split("T")[0];
      const header = `---\nsync: draft\nlastLocalEdit: ${new Date().toISOString()}\ncreated: ${date}\n---\n\n`;
      const body = args?.content as string;
      writeFileSync(filePath, header + body, "utf-8");
      // Add to live index
      const relPath = relative(KNOWLEDGE_DIR, filePath).replace(/\\/g, "/");
      try { index.add({ id: relPath, path: relPath, title: slug, content: body }); } catch { /* already indexed */ }
      return { content: [{ type: "text", text: `Saved: ${relPath}` }] };
    }

    case "knowledge_list": {
      const cat = (args?.category as string) || "all";
      const dirs = cat === "all" ? ["sessions", "projects", "workflow", "shared"] : [cat === "session" ? "sessions" : cat === "project" ? "projects" : cat === "shared" ? "shared" : "workflow"];
      const entries: Array<{ category: string; file: string; modified: string }> = [];
      for (const dir of dirs) {
        const dirPath = join(KNOWLEDGE_DIR, dir);
        if (!existsSync(dirPath)) continue;
        for (const f of readdirSync(dirPath)) {
          if (!f.endsWith(".md")) continue;
          const stat = statSync(join(dirPath, f));
          entries.push({ category: dir, file: f, modified: stat.mtime.toISOString().split("T")[0] });
        }
      }
      entries.sort((a, b) => b.modified.localeCompare(a.modified));
      if (entries.length === 0) return { content: [{ type: "text", text: "Knowledge base is empty." }] };
      const table = entries.map((e) => `${e.modified}  ${e.category}/${e.file}`).join("\n");
      return { content: [{ type: "text", text: `${entries.length} entries:\n\n${table}` }] };
    }

    case "knowledge_prune": {
      const maxAge = (args?.older_than_days as number) || 90;
      const cutoff = new Date(Date.now() - maxAge * 24 * 60 * 60 * 1000);
      const stale: Array<{ path: string; modified: string; reason: string }> = [];
      const seen = new Map<string, string[]>();
      function walkForPrune(dir: string) {
        if (!existsSync(dir)) return;
        for (const entry of readdirSync(dir, { withFileTypes: true })) {
          const full = join(dir, entry.name);
          if (entry.isDirectory()) { if (entry.name !== ".git" && entry.name !== "shared") walkForPrune(full); }
          else if (entry.name.endsWith(".md") && entry.name !== ".gitkeep") {
            const stat = statSync(full);
            const relPath = relative(KNOWLEDGE_DIR, full).replace(/\\/g, "/");
            if (stat.mtime < cutoff) stale.push({ path: relPath, modified: stat.mtime.toISOString().split("T")[0], reason: `Not modified in ${maxAge}+ days` });
            const title = entry.name.replace(".md", "").replace(/-\d{4}-\d{2}-\d{2}$/, "");
            if (!seen.has(title)) seen.set(title, []);
            seen.get(title)!.push(relPath);
          }
        }
      }
      walkForPrune(KNOWLEDGE_DIR);
      const duplicates = [...seen.entries()].filter(([_, paths]) => paths.length > 1).map(([title, paths]) => ({ title, paths, reason: "Possible duplicates (similar names)" }));
      return { content: [{ type: "text", text: JSON.stringify({ stale: stale.slice(0, 20), duplicates, summary: `${stale.length} stale, ${duplicates.length} possible duplicates` }, null, 2) }] };
    }

    case "knowledge_delete": {
      const targetPath = join(KNOWLEDGE_DIR, args?.path as string);
      if (!existsSync(targetPath)) return { content: [{ type: "text", text: `Not found: ${args?.path}` }] };
      unlinkSync(targetPath);
      try { index.remove({ id: args?.path as string } as any); } catch { /* not in index */ }
      return { content: [{ type: "text", text: `Deleted: ${args?.path}` }] };
    }

    case "signal_read": {
      if (!existsSync(SIGNAL_FILE)) return { content: [{ type: "text", text: "ALL CLEAR - no signal file" }] };
      const signal = readFileSync(SIGNAL_FILE, "utf-8").trim();
      if (signal === "{}" || signal === "") return { content: [{ type: "text", text: "ALL CLEAR" }] };
      return { content: [{ type: "text", text: `SIGNAL ACTIVE:\n${signal}` }] };
    }

    case "signal_write": {
      const payload = JSON.stringify({ status: args?.status, reason: args?.reason, author: args?.author, created: new Date().toISOString() }, null, 2);
      writeFileSync(SIGNAL_FILE, payload, "utf-8");
      return { content: [{ type: "text", text: "Signal written." }] };
    }

    case "session_save": {
      const state = { topic: args?.topic, status: args?.status, decisions: args?.decisions || [], next_steps: args?.next_steps || [], saved_at: new Date().toISOString() };
      writeFileSync(SESSION_FILE, JSON.stringify(state, null, 2), "utf-8");
      return { content: [{ type: "text", text: `Session saved: ${args?.topic}` }] };
    }

    case "session_resume": {
      if (!existsSync(SESSION_FILE)) return { content: [{ type: "text", text: "No prior session found." }] };
      const state = readFileSync(SESSION_FILE, "utf-8");
      return { content: [{ type: "text", text: state }] };
    }

    case "get_active_steering": {
      if (!existsSync(STEERING_DIR)) return { content: [{ type: "text", text: "No steering directory found." }] };
      const files = readdirSync(STEERING_DIR).filter((f) => f.endsWith(".md"));
      const always = files.filter((f) => {
        const content = readFileSync(join(STEERING_DIR, f), "utf-8");
        return content.includes("inclusion: always");
      });
      const loaded = always.map((f) => ({ file: f, content: readFileSync(join(STEERING_DIR, f), "utf-8").slice(0, 1500) }));
      return { content: [{ type: "text", text: JSON.stringify(loaded, null, 2) }] };
    }

    case "guide_propose_update": {
      const proposalsFile = join(COPILOT_ROOT, "guide-proposals.json");
      const existing = existsSync(proposalsFile) ? JSON.parse(readFileSync(proposalsFile, "utf-8")) : [];
      existing.push({ id: Date.now(), file: args?.file, change: args?.change, reason: args?.reason, proposed_at: new Date().toISOString(), status: "pending" });
      writeFileSync(proposalsFile, JSON.stringify(existing, null, 2), "utf-8");
      return { content: [{ type: "text", text: `Proposal #${existing.length} queued for: ${args?.file}` }] };
    }

    case "workflow_start": {
      const wfFile = join(COPILOT_ROOT, "workflow-state.json");
      const state = { template: args?.template, context: args?.context, phase: "round-1-attack", started_at: new Date().toISOString(), challenges: [], defenses: [] };
      writeFileSync(wfFile, JSON.stringify(state, null, 2), "utf-8");
      return { content: [{ type: "text", text: `Workflow "${args?.template}" started. Phase: round-1-attack.\nContext: ${args?.context}\n\nProceed with Round 1 attack.` }] };
    }

    case "workflow_advance": {
      const wfFile = join(COPILOT_ROOT, "workflow-state.json");
      if (!existsSync(wfFile)) return { content: [{ type: "text", text: "No active workflow." }] };
      const state = JSON.parse(readFileSync(wfFile, "utf-8"));
      state.phase = args?.phase;
      state.last_result = args?.result;
      state.last_advanced = new Date().toISOString();
      writeFileSync(wfFile, JSON.stringify(state, null, 2), "utf-8");
      return { content: [{ type: "text", text: `Workflow advanced to: ${args?.phase}` }] };
    }

    default:
      return { content: [{ type: "text", text: `Unknown tool: ${name}` }] };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
