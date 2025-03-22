import { createCloudinaryMock } from "../../test/cloudinary.mock";
import getDeleteTool from "./deleteAssetTool.js";

describe("deleteAssetTool", () => {
	let cloudinaryMock;
	let deleteTool;

	global.fetch = vi.fn();

	beforeEach(() => {
		cloudinaryMock = createCloudinaryMock();
		deleteTool = getDeleteTool(cloudinaryMock);
		vi.clearAllMocks();
	});

	it("should delete asset by publicId", async () => {
		const mockResult = { deleted: { "test123": "deleted" } };
		cloudinaryMock.api.delete_resources.mockResolvedValue(mockResult);

		const result = await deleteTool({
			publicId: "test123",
		});

		expect(cloudinaryMock.api.delete_resources).toHaveBeenCalledWith("test123");
		expect(result.content[0].text).toContain("Successfully deleted asset: 'test123'");
		expect(result.isError).toBe(false);
	});

	it("should return error if deletion fails for nonexistent public ID", async () => {
		const mockResult = { deleted: { "test123": "not_found" } };
		cloudinaryMock.api.delete_resources.mockResolvedValue(mockResult);

		const result = await deleteTool({
			publicId: "test123",
		});

		expect(result.content[0].text).toContain("Failed to delete asset with publicId: 'test123'");
		expect(result.isError).toBe(true);
	});

	it("should return error when neither publicId nor assetId is provided", async () => {
		const result = await deleteTool({});

		expect(result.content[0].text).toContain("Must provide either publicId or assetId to delete");
		expect(result.isError).toBe(true);
	});

	it("should handle API errors", async () => {
		cloudinaryMock.api.delete_resources.mockRejectedValue(new Error("Permission denied"));

		const result = await deleteTool({
			publicId: "test123",
		});

		expect(result.content[0].text).toContain("Error deleting asset: Permission denied");
		expect(result.isError).toBe(true);
	});
});
