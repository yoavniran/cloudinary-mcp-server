import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

import getUploadTool, { uploadToolParams } from "./tools/uploadTool.js";
import getDeleteTool, { deleteAssetToolParams } from "./tools/deleteAssetTool.js";
import getGetAssetTool, { getAssetToolParams } from "./tools/getAssetTool.js";
import getFindAssetsTool, { findAssetsToolParams } from "./tools/findAssetsTool.js";
import getUsageTool, { getUsageToolParams } from "./tools/getUsageTool.js";

dotenv.config();

["CLOUDINARY_CLOUD_NAME", "CLOUDINARY_API_KEY", "CLOUDINARY_API_SECRET"].forEach((envVar) => {
	if (!process.env[envVar]) {
		console.error(`Please provide ${envVar} environment variable.`);
		process.exit(1);
	}
});

// Configure Cloudinary with environment variables
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Create server instance
const server = new McpServer({
	name: "cloudinary",
	version: "1.0.0",
});

/**
 * Tool for Uploading an asset to Cloudinary
 */
server.tool(
	"upload",
	"Upload a file (asset) to Cloudinary",
	uploadToolParams,
	getUploadTool(cloudinary),
);

/**
 * Tool for Deleting an asset from Cloudinary
 */
server.tool(
	"delete-asset",
	"Delete a file (asset) from Cloudinary",
	deleteAssetToolParams,
	getDeleteTool(cloudinary),
);

/**
 * Tool for Getting asset details from Cloudinary
 */
server.tool(
	"get-asset",
	"Get the details of a specific file (asset)",
	getAssetToolParams,
	getGetAssetTool(cloudinary),
);

/**
 * Tool for finding assets in Cloudinary
 */
server.tool(
	"find-assets",
	"Search for existing files (assets) in Cloudinary with a query expression",
	findAssetsToolParams,
	getFindAssetsTool(cloudinary),
);

/**
 * Tool for getting usage information from Cloudinary
 */
server.tool(
	"get-usage",
	"Get a report on the status of your product environment usage, including storage, credits, bandwidth, requests, number of resources, and add-on usage",
	getUsageToolParams,
	getUsageTool(cloudinary),
);


// Start the server with stdio transport
const main = async () => {
	const transport = new StdioServerTransport();
	await server.connect(transport);
	console.error("Cloudinary MCP Server running on stdio");
};

main()
	.catch((error) => {
		console.error("Fatal error in main():", error);
		process.exit(1);
	});

// Export Cloudinary for testing
export {
	cloudinary,
};
