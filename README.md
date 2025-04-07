# Custom Context MCP Server

This Model Context Protocol (MCP) server provides tools for structuring and extracting data from text according to JSON templates.

## Features

### Text-to-JSON Transformation

- Group and structure text based on JSON templates with placeholders
- Extract information from AI-generated text into structured JSON formats
- Support for any arbitrary JSON structure with nested placeholders
- Intelligent extraction of key-value pairs from text
- Process AI outputs into structured data for downstream applications

## Getting Started

### Installation

```bash
npm install
```

### Running the server

```bash
npm start
```

For development with hot reloading:

```bash
npm run dev:watch
```

## Usage

This MCP server provides two main tools:

### 1. Group Text by JSON (`group-text-by-json`)

This tool takes a JSON template with placeholders and generates a prompt for an AI to group text according to the template's structure.

```json
{
	"template": "{ \"type\": \"<type>\", \"text\": \"<text>\" }"
}
```

The tool analyzes the template, extracts placeholder keys, and returns a prompt that guides the AI to extract information in a key-value format.

### 2. Text to JSON (`text-to-json`)

This tool takes the grouped text output from the previous step and converts it into a structured JSON object based on the original template.

```json
{
	"template": "{ \"type\": \"<type>\", \"text\": \"<text>\" }",
	"text": "type: pen\ntext: This is a blue pen"
}
```

It extracts key-value pairs from the text and structures them according to the template.

## Example Workflow

1. **Define a JSON template with placeholders:**

   ```json
   {
   	"item": {
   		"name": "<name>",
   		"price": "<price>",
   		"description": "<description>"
   	}
   }
   ```

2. **Use `group-text-by-json` to create a prompt for AI:**

   - The tool identifies placeholder keys: name, price, description
   - Generates a prompt instructing the AI to group information by these keys

3. **Send the prompt to an AI model and receive grouped text:**

   ```
   name: Blue Pen
   price: $2.99
   description: A smooth-writing ballpoint pen with blue ink
   ```

4. **Use `text-to-json` to convert the grouped text to JSON:**
   - Result:
   ```json
   {
   	"item": {
   		"name": "Blue Pen",
   		"price": "$2.99",
   		"description": "A smooth-writing ballpoint pen with blue ink"
   	}
   }
   ```

## Template Format

Templates can include placeholders anywhere within a valid JSON structure:

- Use angle brackets to define placeholders: `<name>`, `<type>`, `<price>`, etc.
- The template must be a valid JSON string
- Placeholders can be at any level of nesting
- Supports complex nested structures

Example template with nested placeholders:

```json
{
	"product": {
		"details": {
			"name": "<name>",
			"category": "<category>"
		},
		"pricing": {
			"amount": "<price>",
			"currency": "USD"
		}
	},
	"metadata": {
		"timestamp": "2023-09-01T12:00:00Z"
	}
}
```

## Implementation Details

The server works by:

1. Analyzing JSON templates to extract placeholder keys
2. Generating prompts that guide AI models to extract information by these keys
3. Parsing AI-generated text to extract key-value pairs
4. Reconstructing JSON objects based on the original template structure

## Development

### Prerequisites

- Node.js v18 or higher
- npm or yarn

### Build and Run

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run the server
npm start

# Development with hot reloading
npm run dev:watch
```

### Custom Hot Reloading

This project includes a custom hot reloading setup that combines:

- **nodemon**: Watches for file changes in the src directory and rebuilds TypeScript files
- **browser-sync**: Automatically refreshes the browser when build files change
- **Concurrent execution**: Runs both services simultaneously with output synchronization

The setup is configured in:

- `nodemon.json`: Controls TypeScript watching and rebuilding
- `package.json`: Uses concurrently to run nodemon and browser-sync together

To use the custom hot reloading feature:

```bash
npm run dev:watch
```

This creates a development environment where:

1. TypeScript files are automatically rebuilt when changed
2. The MCP server restarts with the updated code
3. Connected browsers refresh to show the latest changes

### Using with MCP Inspector

You can use the MCP Inspector for debugging:

```bash
npm run dev
```

This runs the server with the MCP Inspector for visual debugging of requests and responses.
