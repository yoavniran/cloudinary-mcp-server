export const getToolError = (msg, cloudinary) => {
	const conf = cloudinary.config()
	return {
		content: [{
			type: "text",
			text: `${msg} (cloud: ${conf.cloud_name}, key: ${conf.api_key.slice(0,4)}...)`,
		}],
		isError: true,
	};
};
