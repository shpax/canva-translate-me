import { parseTranslationResponse } from "../lib/anthropicClient";

// ---------------------------------------------------------------------------
// parseTranslationResponse — pure, no I/O
// ---------------------------------------------------------------------------
describe("parseTranslationResponse", () => {
  it("parses a valid JSON array from Claude", () => {
    const input = JSON.stringify([
      { original: "Hello", a: "Привіт", b: "Вітаю", c: "Здрастуйте" },
    ]);

    const result = parseTranslationResponse(input);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      original: "Hello",
      a: "Привіт",
      b: "Вітаю",
      c: "Здрастуйте",
    });
  });

  it("strips markdown code fences before parsing", () => {
    const input = "```json\n[{\"original\":\"Hi\",\"a\":\"Привіт\",\"b\":\"Вітаю\",\"c\":\"Здрастуйте\"}]\n```";
    const result = parseTranslationResponse(input);
    expect(result[0]?.original).toBe("Hi");
  });

  it("throws parse_error for non-JSON input", () => {
    expect(() => parseTranslationResponse("not json")).toThrow(
      expect.objectContaining({ code: "parse_error" }),
    );
  });

  it("throws parse_error for a JSON object (not array)", () => {
    expect(() => parseTranslationResponse("{}")).toThrow(
      expect.objectContaining({ code: "parse_error" }),
    );
  });

  it("throws no_text for an empty array", () => {
    expect(() => parseTranslationResponse("[]")).toThrow(
      expect.objectContaining({ code: "no_text" }),
    );
  });

  it("throws parse_error when a required field is missing", () => {
    const input = JSON.stringify([{ original: "Hi", a: "Привіт", b: "Вітаю" }]); // missing c
    expect(() => parseTranslationResponse(input)).toThrow(
      expect.objectContaining({ code: "parse_error" }),
    );
  });

  it("throws parse_error when a field is not a string", () => {
    const input = JSON.stringify([{ original: 42, a: "Привіт", b: "Вітаю", c: "Здрастуйте" }]);
    expect(() => parseTranslationResponse(input)).toThrow(
      expect.objectContaining({ code: "parse_error" }),
    );
  });
});
