import { z } from "zod";
import { getToolError } from "../utils.js";
import getCloudinaryTool from "./getCloudinaryTool.js";

export const uploadToolParams = {
	source: z.union([
		z.string().url().describe("URL of the image/video to upload"),
		z.string().describe("Base64 encoded file content or file path"),
		z.instanceof(Buffer).describe("Binary data to upload")
	]).describe("The source media to upload (URL, file path, base64 content, or binary data)"),
	folder: z.string().optional().describe("Optional folder path in Cloudinary"),
	publicId: z.string().optional().describe("Optional public ID for the uploaded asset"),
	resourceType: z.enum(["image", "video", "raw", "auto"]).default("auto").describe("Type of resource to upload"),
	tags: z.string().optional().describe("Comma-separated list of tags to assign to the asset"),
};

const uploadTool = async (cloudinary, { source, folder, publicId, resourceType, tags }) => {
	try {
		const uploadOptions = {
			resource_type: resourceType,
			folder,
			public_id: publicId,
			tags,
		};

		let uploadResult;

		// Handle different source types
		if (typeof source === 'string') {
			uploadResult = await cloudinary.uploader.upload(source, uploadOptions);
		} else if (Buffer.isBuffer(source)) {
			// Handle Buffer data
			uploadResult = await new Promise((resolve, reject) => {
				const uploadStream = cloudinary.uploader.upload_stream(
					uploadOptions,
					(error, result) => {
						if (error) {
							return reject(error);
						}
						resolve(result);
					}
				);
				uploadStream.end(source);
			});
		} else {
			throw new Error("unknown source type: " + typeof source);
		}

		return {
			content: [
				{
					type: "text",
					text: JSON.stringify(uploadResult, null, 2)
				}
			],
			isError: false,
		};
	} catch (error) {
		return getToolError(`Error uploading to Cloudinary: ${error.message}`, cloudinary);
	}
}

export default getCloudinaryTool(uploadTool);

