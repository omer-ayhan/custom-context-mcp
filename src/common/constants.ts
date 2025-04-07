import { ServerCapabilities } from "@modelcontextprotocol/sdk/types.js";

const VERSION = "0.0.1";

const MCP_SERVER_NAME = "custom-context-mcp";
const TOOL_NAMES = {
	groupTextByJson: "group-text-by-json",
	textToJson: "text-to-json",
};
const MCP_CAPABILITIES: ServerCapabilities = {
	tools: {},
};

export { VERSION, MCP_SERVER_NAME, TOOL_NAMES, MCP_CAPABILITIES };
