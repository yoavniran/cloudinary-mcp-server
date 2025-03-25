import { createCloudinaryMock } from "../../test/cloudinary.mock";
import getUsageTool, { getUsageToolParams } from "./getUsageTool.js";
import { z } from "zod";

describe("getUsageTool", () => {
	let cloudinaryMock;
	let usageTool;

	beforeEach(() => {
		cloudinaryMock = createCloudinaryMock();
		usageTool = getUsageTool(cloudinaryMock);
		vi.clearAllMocks();
	});

	it("should have proper parameter schema", () => {
		expect(getUsageToolParams).toBeDefined();
		expect(getUsageToolParams.date).toBeInstanceOf(z.ZodOptional);
	});

	it("should successfully get usage data without date parameter", async () => {
		const mockUsageData = {
			plan: "free",
			last_updated: "2023-05-10",
			transformations: {
				usage: 10,
				limit: 500
			},
			objects: {
				usage: 5,
				limit: 100
			}
		};

		cloudinaryMock.api.usage.mockResolvedValue(mockUsageData);

		const result = await usageTool({});

		expect(cloudinaryMock.api.usage).toHaveBeenCalledWith({});
		expect(result.isError).toBe(false);
		expect(result.content).toHaveLength(1);
		expect(result.content[0].type).toBe("text");
		expect(JSON.parse(result.content[0].text)).toEqual(mockUsageData);
	});

	it("should successfully get usage data with date parameter", async () => {
		const mockUsageData = {
			plan: "free",
			last_updated: "2023-04-15",
			transformations: {
				usage: 8,
				limit: 500
			},
			objects: {
				usage: 3,
				limit: 100
			}
		};

		const date = "2023-04-15";
		cloudinaryMock.api.usage.mockResolvedValue(mockUsageData);

		const result = await usageTool({ date });

		expect(cloudinaryMock.api.usage).toHaveBeenCalledWith({ date });
		expect(result.isError).toBe(false);
		expect(result.content).toHaveLength(1);
		expect(result.content[0].type).toBe("text");
		expect(JSON.parse(result.content[0].text)).toEqual(mockUsageData);
	});

	it("should handle API errors", async () => {
		const errorMessage = "API Error: Invalid date format";
		cloudinaryMock.api.usage.mockRejectedValue(new Error(errorMessage));

		const result = await usageTool({ date: "invalid-date" });

		expect(result.isError).toBe(true);
		expect(result.content).toHaveLength(1);
		expect(result.content[0].type).toBe("text");
		expect(result.content[0].text).toContain(errorMessage);
		expect(result.content[0].text).toContain(`(cloud: ${cloudinaryMock.config().cloud_name}, key: ${cloudinaryMock.config().api_key.slice(0, 4)}...)`);
	});
});
