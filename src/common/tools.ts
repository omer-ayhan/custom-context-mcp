import { deepObjectKeys, extractKeyValuesFromText, logger } from "./utils.js";

const groupTextByJsonTool = (template: string) => {
	if (!template) {
		throw new Error("Both template and text are required");
	}

	try {
		logger.info("Template:", template);

		let objectKeys: string[] = [];

		try {
			const templateObj = JSON.parse(template);
			objectKeys = deepObjectKeys(templateObj, true);
		} catch (parseError) {
			logger.error("Failed to parse template:", parseError);
			throw new Error(`Invalid template format: ${parseError}`);
		}

		const resultPrompt = `
        You are a helpful assistant that groups text based on JSON keys.
        Here are the keys in the template: ${objectKeys.join(", ")}.
        Please group the text based on the keys. and give me the result in raw text.
        Don't give it in JSON format or object format. It should be in the following format:

        Format:
        <key>: <corresponding text found in the text>

        Here's an example:

        sentence: The MacBook Pro costs $2,499.

        result:
        brand: MacBook
        price: $2,499
        description: The MacBook Pro is a powerful laptop with a Retina display.
        
        `;

		return {
			content: [
				{
					type: "text",
					text: resultPrompt,
				},
			],
		};
	} catch (error) {
		logger.error("Error processing template:", error);
		throw new Error(`Failed to process template: ${error}`);
	}
};

const textToJsonTool = (template: string, text: string) => {
	if (!template || !text) {
		throw new Error("Both template and text are required");
	}

	try {
		const templateObj = JSON.parse(template);
		const templateKeys = deepObjectKeys(templateObj, true);

		const jsonResult = extractKeyValuesFromText(text, templateKeys);

		const resultPrompt = `
		Print this JSON result in JSON format.

		JSON result:
		${JSON.stringify(jsonResult)}

		`;

		return {
			content: [
				{
					type: "text",
					text: resultPrompt,
				},
			],
		};
	} catch (error) {
		logger.error("Error processing template:", error);
		throw new Error(`Failed to process template: ${error}`);
	}
};

export { groupTextByJsonTool, textToJsonTool };
