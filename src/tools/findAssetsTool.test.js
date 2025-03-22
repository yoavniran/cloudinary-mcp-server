import { createCloudinaryMock } from "../../test/cloudinary.mock";
import getFindAssetsTool from "./findAssetsTool.js";

describe("findAssetsTool", () => {
	let cloudinaryMock;
	let findAssetsTool;

	beforeEach(() => {
		cloudinaryMock = createCloudinaryMock();
		findAssetsTool = getFindAssetsTool(cloudinaryMock);
		vi.clearAllMocks();
	});

	it("should return assets when found", async () => {
		const mockResult = {
			total_count: 2,
			resources: [
				{ public_id: "test1", format: "jpg" },
				{ public_id: "test2", format: "png" },
			],
		};
		cloudinaryMock.api.search.mockResolvedValue(mockResult);

		const result = await findAssetsTool({
			expression: "tags=cat",
			resourceType: "image",
			maxResults: 10,
		});

		expect(cloudinaryMock.api.search).toHaveBeenCalledWith({
			expression: "tags=cat",
			resource_type: "image",
			max_results: 10,
			next_cursor: undefined,
			tags: undefined,
			context: undefined,
		});
		expect(result.content[0].text).toContain("test1");
		expect(result.content[0].text).toContain("test2");
		expect(result.isError).toBe(false);
	});

	it("should handle case when no assets are found", async () => {
		cloudinaryMock.api.search.mockResolvedValue({ total_count: 0, resources: [] });

		const result = await findAssetsTool({
			expression: "tags=nonexistent",
			resourceType: "image",
			maxResults: 10,
		});

		expect(result.content[0].text).toBe("No assets found matching the search criteria");
		expect(result.isError).toBeFalsy();
	});

	it("should handle API errors", async () => {
		cloudinaryMock.api.search.mockRejectedValue(new Error("Invalid search expression"));

		const result = await findAssetsTool({
			expression: "invalid:syntax",
			resourceType: "image",
			maxResults: 10,
		});

		expect(result.content[0].text).toContain("Error searching assets: Invalid search expression");
		expect(result.isError).toBe(true);
		expect(result.content[0].text).toContain(`(cloud: ${cloudinaryMock.config().cloud_name})`)
	});
});
