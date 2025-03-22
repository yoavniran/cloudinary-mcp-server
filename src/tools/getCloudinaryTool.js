const getCloudinaryTool = (tool) => {
	return (cloudinary) => (params) => tool(cloudinary, params);
};

export default getCloudinaryTool;
