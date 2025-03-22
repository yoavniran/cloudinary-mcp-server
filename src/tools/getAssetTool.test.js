import { createCloudinaryMock } from "../../test/cloudinary.mock";
import getGetAssetTool from "./getAssetTool.js";

describe("getAssetTool", () => {
	let cloudinaryMock;
	let getAssetTool;

	beforeEach(() => {
		cloudinaryMock = createCloudinaryMock();
		getAssetTool = getGetAssetTool(cloudinaryMock);
		vi.clearAllMocks();
	});

	it("should get asset by publicId", async () => {
		const mockAsset = { public_id: "test123", format: "jpg", url: "http://example.com/test.jpg" };
		cloudinaryMock.api.resource.mockResolvedValue(mockAsset);

		const result = await getAssetTool({
			publicId: "test123",
			resourceType: "image",
		});

		expect(cloudinaryMock.api.resource).toHaveBeenCalledWith("test123",
			expect.objectContaining({ resource_type: "image" }));
		expect(result.content[0].text).toContain("test123");
		expect(result.isError).toBe(false);
	});

	it("should get asset by assetId", async () => {
		const mockAsset = { public_id: "test123", asset_id: "asset123" };
		cloudinaryMock.api.resources_by_asset_ids.mockResolvedValue({
			resources: [mockAsset],
		});

		const result = await getAssetTool({
			assetId: "asset123",
		});

		expect(cloudinaryMock.api.resources_by_asset_ids).toHaveBeenCalledWith(["asset123"], expect.any(Object));
		expect(result.content[0].text).toContain("test123");
		expect(result.isError).toBe(false);
	});

	it("should return error if neither publicId nor assetId is provided", async () => {
		const result = await getAssetTool({});

		expect(result.content[0].text).toContain("Either assetId or publicId must be provided");
		expect(result.isError).toBe(true);
	});

	it("should handle API errors", async () => {
		cloudinaryMock.api.resource.mockRejectedValue(new Error("Resource not found"));

		const result = await getAssetTool({
			publicId: "test123",
		});

		expect(result.content[0].text).toContain("Error retrieving asset: Resource not found");
		expect(result.isError).toBe(true);
	});
});
