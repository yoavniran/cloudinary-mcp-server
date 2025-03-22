# Cloudinary MCP Server

A Model Context Protocol server that exposes Cloudinary Upload & Admin API methods as tools by AI assistants. 
This integration allows AI systems to trigger and interact with your Cloudinary cloud.

## How It Works

The MCP server:

-   Makes calls on your behalf to the Cloudinary API
-   Enables uploading of assets to Cloudinary
-   Enables management of assets in your Cloudinary cloud

It relies on the Cloudinary [API](https://cloudinary.com/documentation/admin_api) to perform these actions. Not all methods and parameters are supported. 
More will be added over time. 

Open an [issue](https://github.com/yoavniran/cloudinary-mcp-server/issues) with a request for specific method if you need it.

## Benefits

-   Turn your Cloudinary cloud actions into callable tools for AI assistants
-   Turn your Cloudinary assets into data for AI assistants

## Usage with Claude Desktop

### Prerequisites

-   NodeJS
-   MCP Client (like Claude Desktop App)
-   Create & Copy Cloudinary API Key/Secret at: [API KEYS](https://console.cloudinary.com/settings/api-keys)

### Installation

To use this server with the Claude Desktop app, add the following configuration to the "mcpServers" section of your `claude_desktop_config.json`:

```json
{
    "mcpServers": {
        "make": {
            "command": "npx",
            "args": ["-y", "cloudinary-mcp-server"],
            "env": {
                "CLOUDINARY_CLOUD_NAME": "<cloud name>",
                "CLOUDINARY_API_KEY": "<api-key>",
                "CLOUDINARY_API_SECRET": "<api-secret>"
            }
        }
    }
}
```

-   `CLOUDINARY_CLOUD_NAME` - your cloud name
-   `CLOUDINARY_API_KEY` - The API Key for your cloud
-   `CLOUDINARY_API_SECRET` - The API Secret for your cloud
