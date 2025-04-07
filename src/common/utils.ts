const logger = {
	info: (...args: any[]) => {
		const msg = `[INFO] ${args.join(" ")}`;
		process.stderr.write(`${msg}\n`);
	},
	debug: (...args: any[]) => {
		const msg = `\x1b[36m[DEBUG]\x1b[0m ${args.join(" ")}`;
		process.stderr.write(`${msg}\n`);
	},
	warn: (...args: any[]) => {
		const msg = `\x1b[33m[WARN]\x1b[0m ${args.join(" ")}`;
		process.stderr.write(`${msg}\n`);
	},
	error: (...args: any[]) => {
		const msg = `\x1b[31m[ERROR]\x1b[0m ${args.join(" ")}`;
		process.stderr.write(`${msg}\n`);
	},
};

function deepObjectKeys(obj: any, onlyPlaceholders: boolean = false): string[] {
	const keys: string[] = [];

	function traverseObject(obj: Record<string, any>, prefix: string = "") {
		if (typeof obj !== "object" || !obj) return;

		for (const objKey of Object.keys(obj)) {
			const currObj = obj[objKey] as Record<string, any> | string;
			const keyName = prefix ? `${prefix}.${objKey}` : objKey;

			if (onlyPlaceholders) {
				const bracketsRegex = /<[^>]+>/gi;
				if (typeof currObj === "string" && bracketsRegex.test(currObj)) {
					keys.push(keyName);
				}
			} else {
				keys.push(keyName);
			}

			if (typeof currObj === "object" && !Array.isArray(currObj) && !!currObj) {
				traverseObject(currObj, objKey);
			}
		}
	}

	traverseObject(obj);
	return keys;
}

function extractKeyValuesFromText(text: string, keys: string[]) {
	const regex = new RegExp(`(${keys.join("|")}): (.*?)(\n|$)`, "gi");
	const matches = text.match(regex);

	if (!matches) {
		return {};
	}

	const result: Record<string, string> = {};

	matches.forEach((match) => {
		const [key, value] = match.split(":");
		const extractedKey = key.trim();
		const extractedValues = value.trim();

		if (extractedKey) {
			result[extractedKey] = extractedValues ?? "";
		}
	});

	return result;
}

export { logger, deepObjectKeys, extractKeyValuesFromText };
