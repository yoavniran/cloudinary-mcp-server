<img src="https://github.com/yoavniran/cloudinary-mcp-server/blob/main/cld-mcp-server.png?raw=true" width="120" height="120" align="center" />

# Cloudinary MCP Server

<p align="center">
    <a href="https://badge.fury.io/js/cloudinary-mcp-server">
        <img src="https://badge.fury.io/js/cloudinary-mcp-server.svg" alt="npm version" height="20">
    </a>
</p>

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
        "cloudinary-mcp-server": {
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


### Tools

The following tools are available:

1. **upload**
    - Description: Upload an asset to Cloudinary
    - Parameters:
        - `source`: URL, file path, base64 content, or binary data to upload
        - `folder`: Optional folder path in Cloudinary
        - `publicId`: Optional public ID for the uploaded asset
        - `resourceType`: Type of resource to upload (image, video, raw, auto)
        - `tags`: Comma-separated list of tags to assign to the asset

2. **delete-asset**
    - Description: Delete an asset from Cloudinary
    - Parameters:
        - `publicId`: The public ID of the asset to delete
        - `assetId`: The asset ID of the asset to delete

3. **get-asset**
    - Description: Get details about a specific asset
    - Parameters:
        - `assetId`: The Cloudinary asset ID
        - `publicId`: The public ID of the asset
        - `resourceType`: Type of asset (image, raw, video)
        - `type`: Delivery type (upload, private, authenticated, etc.)
        - `tags`: Whether to include the list of tag names
        - `context`: Whether to include contextual metadata
        - `metadata`: Whether to include structured metadata

4. **find-assets**
    - Description: Search for assets in Cloudinary
    - Parameters:
        - `expression`: Search expression (e.g. 'tags=cat' or 'public_id:folder/*')
        - `resourceType`: Resource type (image, video, raw)
        - `maxResults`: Maximum number of results (1-500)
        - `nextCursor`: Next cursor for pagination
        - `tags`: Include tags in the response
        - `context`: Include context in the response
