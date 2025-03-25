import { z } from "zod";
import { getToolError } from "../utils.js";
import getCloudinaryTool from "./getCloudinaryTool.js";

export const getUsageToolParams = {
	date: z.string().optional().describe("The date for the usage report. Must be within the last 3 months and specified in the format: yyyy-mm-dd. Default: the current date")
}

const getUsageTool = async (cloudinary, { date }) => {
	try {
		const usageOptions = {
			date
		};

		const usageResult = await cloudinary.api.usage(usageOptions);

		return {
			content: [
				{
					type: "text",
					text: JSON.stringify(usageResult, null, 2)
				}
			],
			isError: false,
		};
	} catch (error) {
		return getToolError(`Error getting usage report from Cloudinary: ${error.message}`, cloudinary);
	}
};

export default getCloudinaryTool(getUsageTool);
