import getCloudinaryTool from "./getCloudinaryTool.js";
import { z } from "zod";

export const findAssetsToolParams = {
	expression: z.string().optional().describe("Search expression (e.g. 'tags=cat' or 'public_id:folder/*')"),
	resourceType: z.enum(["image", "video", "raw"]).default("image").describe("Resource type"),
	maxResults: z.number().min(1).max(500).default(10).describe("Maximum number of results"),
	nextCursor: z.string().optional().describe("Next cursor for pagination"),
	tags: z.boolean().optional().describe("Include tags in the response"),
	context: z.boolean().optional().describe("Include context in the response"),
};

const findAssetsTool = async (cloudinary, {
	expression,
	resourceType,
	maxResults,
	nextCursor,
	tags,
	context,
}) => {
	try {
		const options = {
			expression,
			resource_type: resourceType,
			max_results: maxResults,
			next_cursor: nextCursor,
			tags,
			context,
		};

		const result = await cloudinary.api.search(options);

		if (!result?.total_count) {
			return {
				content: [
					{
						type: "text",
						text: "No assets found matching the search criteria",
					},
				],
			};
		}

		return {
			content: [{
				type: "text",
				text: JSON.stringify(result, null, 2),
			}],
			isError: false,
		};

	} catch (error) {
		return {
			content: [
				{
					type: "text",
					text: `Error searching assets: ${error.message}`,
				},
			],
			isError: true,
		};
	}
};

export default getCloudinaryTool(findAssetsTool);
