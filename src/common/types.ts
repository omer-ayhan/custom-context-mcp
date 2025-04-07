import z from "zod";

const GroupTextByJsonSchema = z.object({
	template: z.string().describe("JSON template with placeholders"),
});
const TextToJsonSchema = z.object({
	template: z.string().describe("JSON template with placeholders"),
	text: z.string().describe("Groupped text from groupTextByJson tool"),
});

export type GroupTextByJsonSchemaType = z.infer<typeof GroupTextByJsonSchema>;
export type TextToJsonSchemaType = z.infer<typeof TextToJsonSchema>;

export { GroupTextByJsonSchema, TextToJsonSchema };
