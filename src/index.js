import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

import getUploadTool, { uploadToolParams } from "./tools/uploadTool.js";
import getDeleteTool, { deleteAssetToolParams } from "./tools/deleteAssetTool.js";
import getGetAssetTool, { getAssetToolParams } from "./tools/getAssetTool.js";
import getFindAssetsTool, { findAssetsToolParams } from "./tools/findAssetsTool.js";

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
	"Upload an asset to Cloudinary",
	uploadToolParams,
	getUploadTool(cloudinary),
);

/**
 * Tool for Signed Uploading an asset to Cloudinary
 */
server.tool(
	"signed-upload",
	"Generate a signature for direct browser-based uploads",
	{
		params: z.record(z.any()).describe("Parameters to sign (folder, public_id, etc)"),
		timestamp: z.number().optional().describe("Timestamp to use (defaults to current time)"),
	},
	async ({ params, timestamp = Math.round(Date.now() / 1000) }) => {
		try {
			// Include timestamp in the parameters
			const paramsToSign = { ...params, timestamp };

			// Generate signature
			const signature = cloudinary.utils.api_sign_request(
				paramsToSign,
				cloudinary.config().api_secret
			);

			return {
				content: [
					{
						type: "text",
						text: JSON.stringify(
							{
								signature,
								timestamp,
								cloudName: cloudinary.config().cloud_name,
								apiKey: cloudinary.config().api_key,
							},
							null,
							2
						),
					},
				],
			};
		} catch (error) {
			return {
				content: [
					{
						type: "text",
						text: `Error generating signature: ${error.message}`,
					},
				],
				isError: true,
			};
		}
	}
);

/**
 * Tool for Deleting an asset from Cloudinary
 */
server.tool(
	"delete-asset",
	"Delete an asset from Cloudinary",
	deleteAssetToolParams,
	getDeleteTool(cloudinary)
);

/**
 * Tool for Getting asset details from Cloudinary
 */
server.tool(
	"get-asset",
	"Get details about a specific asset",
	getAssetToolParams,
	getGetAssetTool(cloudinary)
);

/**
 * Tool for finding assets in Cloudinary
 */
server.tool(
	"find-assets",
	"Search for assets in Cloudinary",
	findAssetsToolParams,
	getFindAssetsTool(cloudinary)
);

// Start the server with stdio transport
const main = async () => {
	const transport = new StdioServerTransport();
	await server.connect(transport);
	console.error("Cloudinary MCP Server running on stdio");
}

main()
	.catch((error) => {
	console.error("Fatal error in main():", error);
	process.exit(1);
});

// Export Cloudinary for testing
export {
	cloudinary,
}
