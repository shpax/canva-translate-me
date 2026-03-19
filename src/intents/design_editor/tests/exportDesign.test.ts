import {
  arrayBufferToBase64,
  downloadImageAsBase64,
  exportCurrentPageAsBase64,
} from "../lib/exportDesign";

// ---------------------------------------------------------------------------
// arrayBufferToBase64 — pure function, no I/O
// ---------------------------------------------------------------------------
describe("arrayBufferToBase64", () => {
  it("encodes an ArrayBuffer to a base64 string", () => {
    const buf = Buffer.from("hello");
    const input = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
    expect(arrayBufferToBase64(input)).toBe(btoa("hello"));
  });

  it("handles an empty buffer", () => {
    expect(arrayBufferToBase64(new ArrayBuffer(0))).toBe("");
  });
});

// ---------------------------------------------------------------------------
// downloadImageAsBase64
// ---------------------------------------------------------------------------
describe("downloadImageAsBase64", () => {
  it("fetches a URL and returns base64-encoded content", async () => {
    const rawBuf = Buffer.from("img-data");
    const bytes = rawBuf.buffer.slice(rawBuf.byteOffset, rawBuf.byteOffset + rawBuf.byteLength);
    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      arrayBuffer: async () => bytes,
    });

    const b64 = await downloadImageAsBase64(
      "https://cdn.canva.com/img.png",
      mockFetch as typeof fetch,
    );

    expect(b64).toBe(btoa("img-data"));
  });

  it("throws export_failed when the download fails", async () => {
    const mockFetch = jest.fn().mockResolvedValue({ ok: false, status: 404 });

    await expect(
      downloadImageAsBase64("https://cdn.canva.com/missing.png", mockFetch as typeof fetch),
    ).rejects.toMatchObject({ code: "export_failed" });
  });
});

// ---------------------------------------------------------------------------
// exportCurrentPageAsBase64 — uses requestExport from @canva/design (mocked via jest.setup.ts)
// ---------------------------------------------------------------------------
describe("exportCurrentPageAsBase64", () => {
  const { requestExport } = jest.requireMock("@canva/design") as {
    requestExport: jest.MockedFunction<typeof import("@canva/design").requestExport>;
  };

  it("returns base64 image when export succeeds", async () => {
    const rawBuf = Buffer.from("png-bytes");
    const bytes = rawBuf.buffer.slice(rawBuf.byteOffset, rawBuf.byteOffset + rawBuf.byteLength);
    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      arrayBuffer: async () => bytes,
    });

    requestExport.mockResolvedValueOnce({
      status: "completed",
      exportBlobs: [{ url: "https://cdn.canva.com/export.png" }],
    } as Awaited<ReturnType<typeof import("@canva/design").requestExport>>);

    const b64 = await exportCurrentPageAsBase64(mockFetch as typeof fetch);
    expect(b64).toBe(btoa("png-bytes"));
    expect(mockFetch).toHaveBeenCalledWith("https://cdn.canva.com/export.png");
  });

  it("throws export_failed when export is aborted", async () => {
    requestExport.mockResolvedValueOnce({ status: "aborted" } as Awaited<
      ReturnType<typeof import("@canva/design").requestExport>
    >);
    // fetch is never reached when aborted, but must be provided to avoid ReferenceError
    const stubFetch = jest.fn() as unknown as typeof fetch;

    await expect(exportCurrentPageAsBase64(stubFetch)).rejects.toMatchObject({
      code: "export_failed",
    });
  });
});
