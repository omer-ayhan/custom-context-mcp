import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
	CallToolRequestSchema,
	ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import { zodToJsonSchema } from "zod-to-json-schema";

import { logger } from "./common/utils.js";
import {
	GroupTextByJsonSchema,
	GroupTextByJsonSchemaType,
	TextToJsonSchema,
	TextToJsonSchemaType,
} from "./common/types.js";
import { groupTextByJsonTool, textToJsonTool } from "./common/tools.js";
import {
	MCP_CAPABILITIES,
	MCP_SERVER_NAME,
	TOOL_NAMES,
	VERSION,
} from "./common/constants.js";

const server = new Server(
	{
		name: MCP_SERVER_NAME,
		version: VERSION,
	},
	{
		capabilities: MCP_CAPABILITIES,
	}
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
	logger.info("[MCP] Received tools/list request");
	const response = {
		tools: [
			{
				name: TOOL_NAMES.groupTextByJson,
				description:
					"Gives a prompt text for AI to group text based on JSON placeholders. This tool accepts a JSON template with placeholders.",
				inputSchema: zodToJsonSchema(GroupTextByJsonSchema),
			},
			{
				name: TOOL_NAMES.textToJson,
				description: `Converts groupped text from ${TOOL_NAMES.groupTextByJson} tool to JSON. This tool accepts a JSON template with placeholders and groupped text from ${TOOL_NAMES.groupTextByJson} tool.`,
				inputSchema: zodToJsonSchema(TextToJsonSchema),
			},
		],
	};

	return response;
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
	const { name, arguments: args } = request.params;
	logger.info(`[MCP] Received tools/call request for tool: ${name}`);
	logger.debug(`[MCP] Tool arguments: ${JSON.stringify(args, null, 2)}`);

	if (!args) {
		throw new Error("Arguments are required");
	}

	switch (name) {
		case TOOL_NAMES.groupTextByJson:
			const groupTextByJsonArgs = args as GroupTextByJsonSchemaType;
			return groupTextByJsonTool(groupTextByJsonArgs.template);
		case TOOL_NAMES.textToJson:
			const textToJsonArgs = args as TextToJsonSchemaType;
			return textToJsonTool(textToJsonArgs.template, textToJsonArgs.text);
		default:
			throw new Error(`Unknown tool: ${name}`);
	}
});

async function runServer() {
	try {
		logger.info("Initializing MCP Server...");
		const transport = new StdioServerTransport();

		logger.info("Connecting to transport...");
		await server.connect(transport);

		logger.info("Custom Context MCP Server running on stdio");
		logger.info(
			"Server information:",
			JSON.stringify({
				name: MCP_SERVER_NAME,
				tools: [TOOL_NAMES.groupTextByJson],
			})
		);

		logger.info("MCP Server is ready to accept requests");

		process.on("SIGINT", () => {
			logger.info("Received SIGINT signal, shutting down...");
			process.exit(0);
		});

		process.on("SIGTERM", () => {
			logger.info("Received SIGTERM signal, shutting down...");
			process.exit(0);
		});

		process.on("uncaughtException", (error: Error) => {
			logger.error("Uncaught exception:", error);
		});
	} catch (error) {
		logger.error("Fatal error during server initialization:", error);
		process.exit(1);
	}
}

runServer().catch((error) => {
	logger.error("Fatal error while running server:", error);
	if (error instanceof Error) {
		logger.error("Stack trace:", error.stack);
	}
	process.exit(1);
});
