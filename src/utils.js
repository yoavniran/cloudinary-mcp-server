export const getToolError = (msg, cloudinary) => {
	return {
		content: [{
			type: "text",
			text: `${msg} (cloud: ${cloudinary.config().cloud_name})`,
		}],
		isError: true,
	};
};
