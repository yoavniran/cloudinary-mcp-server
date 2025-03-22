import getCloudinaryTool from "./getCloudinaryTool.js";
import { z } from "zod";

export const getAssetToolParams = {
	assetId: z.string().optional().describe("The Cloudinary asset ID"),
	publicId: z.string().optional().describe("The public ID of the asset"),
	resourceType: z.enum(["image", "raw", "video"]).optional().describe("Type of asset. Default: image"),
	type: z.enum(["upload", "private", "authenticated", "fetch", "facebook", "twitter", "gravatar", "youtube", "hulu", "vimeo", "animoto", "worldstarhiphop", "dailymotion", "list"]).optional().describe("Delivery type. Default: upload"),
	tags: z.boolean().optional().describe("Whether to include the list of tag names. Default: false"),
	context: z.boolean().optional().describe("Whether to include contextual metadata. Default: false"),
	metadata: z.boolean().optional().describe("Whether to include structured metadata. Default: false")
};

const getAssetTool = async (cloudinary, params) => {
	if (!params.assetId && !params.publicId) {
		return {
			content: [
				{
					type: "text",
					text: "Error: Either assetId or publicId must be provided"
				}
			],
			isError: true
		};
	}

	try {
		const { assetId, publicId, tags, context, metadata, resourceType, type } = params;
		let resource;

		if (publicId) {
			resource = await cloudinary.api.resource(publicId, {
				resource_type: resourceType,
				type: type,
				tags,
				context,
				metadata,
			});
		} else {
			const result = await cloudinary.api
				.resources_by_asset_ids([assetId], {
					tags, context, metadata,
				});

			resource = result.resources[0] || null;
		}

		return {
			content: [{
				type: "text",
				text: JSON.stringify(resource, null, 2)
			}],
			isError: false,
		};

	} catch (error) {
		return {
			content: [
				{
					type: "text",
					text: `Error retrieving asset: ${error.message || "unknown error"}`
				}
			],
			isError: true
		};
	}

}

export default getCloudinaryTool(getAssetTool);

