export const createCloudinaryMock = () => {
	return {
		config: () => ({
			cloud_name: "test-cloud",
			api_key: "test-key",
			api_secret: "test-secret"
		}),
		uploader: {
			upload: vi.fn(),
			upload_stream: vi.fn()
		},
		utils: {
			api_sign_request: vi.fn()
		},
		api: {
			resource: vi.fn(),
			resources_by_asset_ids: vi.fn(),
			delete_resources: vi.fn(),
			search: vi.fn(),
			usage: vi.fn(),  // Added usage method to the mock
		},
	};
};
