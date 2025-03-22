import { createCloudinaryMock } from "../../test/cloudinary.mock";
import getUploadTool from "./uploadTool.js";

describe("uploadTool", () => {
	let cloudinaryMock;
	let uploadTool;

	beforeEach(() => {
		cloudinaryMock = createCloudinaryMock();
		uploadTool = getUploadTool(cloudinaryMock);
		vi.clearAllMocks();
	});

	it("should upload from URL successfully", async () => {
		const mockResult = { public_id: "test123", secure_url: "https://res.cloudinary.com/test" };
		cloudinaryMock.uploader.upload.mockResolvedValue(mockResult);

		const result = await uploadTool({
			source: "https://example.com/image.jpg",
			resourceType: "image",
		});

		expect(cloudinaryMock.uploader.upload).toHaveBeenCalledWith("https://example.com/image.jpg",
			expect.objectContaining({ resource_type: "image" }));
		expect(result.content[0].text).toContain("test123");
		expect(result.isError).toBe(false);
	});

	it("should handle errors during upload", async () => {
		const err = new Error("Upload failed")
		cloudinaryMock.uploader.upload.mockRejectedValue(err);

		const result = await uploadTool({
			source: "https://example.com/image.jpg",
			resourceType: "image",
		});

		expect(result.content[0].text).toContain("Error uploading to Cloudinary: Upload failed");
		expect(result.isError).toBe(true);
	});
});
