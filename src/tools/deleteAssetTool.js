import getCloudinaryTool from "./getCloudinaryTool.js";
import { z } from "zod";

export const deleteAssetToolParams = {
	publicId: z.string().optional().describe("The public ID of the asset to delete"),
	assetId: z.string().optional().describe("The asset ID of the asset to delete")
};

const deleteWithAssetId = (assetIds) => {
	const config = cloudinary.config();

	if (!assetIds || !Array.isArray(assetIds) || assetIds.length === 0) {
		return Promise.reject(new Error('You must provide an array of asset IDs'));
	}

	// Format asset_ids[] parameters according to the API requirements
	const formData = new URLSearchParams();
	assetIds.forEach(id => formData.append('asset_ids[]', id));

	// Build the request URL
	const apiUrl = `https://api.cloudinary.com/v1_1/${config.cloud_name}/resources`;

	return fetch(apiUrl, {
		method: 'DELETE',
		headers: {
			'Authorization': `Basic ${Buffer.from(`${config.api_key}:${config.api_secret}`).toString('base64')}`,
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: formData.toString()
	});
}

const deleteAssetTool = async (cloudinary, { publicId, assetId }) => {
	try {
		let result;

		if (!publicId && !assetId) {
			throw new Error(`Must provide either publicId or assetId to delete`);
		}

		if (publicId) {
			// Delete by public ID using Cloudinary API
			result = await cloudinary.api.delete_resources(publicId);
			if (!result || result?.deleted[publicId] === "not_found") {
				return {
					content: [{
						type: "text",
						text: `Failed to delete asset with publicId: '${publicId}' - not_found`
					}],
					isError: true
				};
			}
		} else {
			// Delete by asset ID using /resources endpoint
			result = await deleteWithAssetId([assetId]);

			if (!result.ok) {
				return {
					content: [{
						type: "text",
						text: `Failed to delete asset with assetId: '${assetId}' - ${result.error.message}`
					}],
					isError: true
				};
			}
		}

		return {
			content: [{
				type: "text",
				text: `Successfully deleted asset: '${publicId || assetId}'`
			}],
			isError: false,
		};
	} catch (error) {
		return {
			content: [{
				type: "text",
				text: `Error deleting asset: ${error.message}`
			}],
			isError: true
		};
	}
};

export default getCloudinaryTool(deleteAssetTool);
