import type { ExportableStoreState } from "@web/lib/file-validation";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useStripStore } from "../strip-store";

// Mock DOM APIs
const mockCreateObjectURL = vi.fn(() => "mock-url");
const mockRevokeObjectURL = vi.fn();
const mockClick = vi.fn();
const mockAppendChild = vi.fn();
const mockRemoveChild = vi.fn();

Object.defineProperty(window, "URL", {
  value: {
    createObjectURL: mockCreateObjectURL,
    revokeObjectURL: mockRevokeObjectURL,
  },
});

Object.defineProperty(document, "createElement", {
  value: vi.fn(() => ({
    href: "",
    download: "",
    click: mockClick,
    style: {},
    parentNode: null,
  })),
});

Object.defineProperty(document.body, "appendChild", {
  value: vi.fn((element) => {
    element.parentNode = document.body;
    mockAppendChild(element);
    return element;
  }),
});

Object.defineProperty(document.body, "removeChild", {
  value: mockRemoveChild,
});

// Helper function to reset store to initial state
function resetStore() {
  // Clear localStorage to reset persisted state
  localStorage.clear();

  // Reset store state
  const store = useStripStore.getState();
  store.setRoomWidth(0);
  store.setRoomHeight(0);
  store.setStripWidth(0);
  // Clear all strips
  const currentLengths = [...store.stripLengths];
  currentLengths.forEach((length) => {
    store.removeAll(length);
  });
}

describe("StripStore Import/Export Actions", () => {
  beforeEach(() => {
    // Reset store state before each test
    resetStore();

    // Clear all mocks
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
    resetStore();
  });

  describe("exportConfiguration", () => {
    it("should export configuration with default state", () => {
      const store = useStripStore.getState();

      store.exportConfiguration();

      expect(mockCreateObjectURL).toHaveBeenCalledWith(expect.any(Blob));
      expect(document.createElement).toHaveBeenCalledWith("a");
      expect(mockAppendChild).toHaveBeenCalled();
      expect(mockClick).toHaveBeenCalled();
      expect(mockRemoveChild).toHaveBeenCalled();
      expect(mockRevokeObjectURL).toHaveBeenCalledWith("mock-url");
    });

    it("should export configuration with populated state", () => {
      const store = useStripStore.getState();

      // Set up test state
      store.setRoomWidth(500);
      store.setRoomHeight(300);
      store.setStripWidth(13);
      store.add(120, 2);
      store.add(80, 2);

      store.exportConfiguration();

      // Verify blob creation was called
      expect(mockCreateObjectURL).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "application/json",
        })
      );

      // Get the blob content to verify the exported data
      const blobCall = mockCreateObjectURL.mock.calls[0][0] as Blob;
      expect(blobCall.type).toBe("application/json");
    });

    it("should generate filename with timestamp", () => {
      const store = useStripStore.getState();
      const mockElement = {
        href: "",
        download: "",
        click: mockClick,
      };

      vi.mocked(document.createElement).mockReturnValue(
        mockElement as HTMLAnchorElement
      );

      store.exportConfiguration();

      expect(mockElement.download).toMatch(
        /^parquet-configuration-\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}\.json$/
      );
    });

    it("should include version and timestamp metadata in exported data", async () => {
      const store = useStripStore.getState();

      // Set up test state
      store.setRoomWidth(500);
      store.setRoomHeight(300);
      store.setStripWidth(13);
      store.add(120);

      store.exportConfiguration();

      // Get the blob and read its content
      const blobCall = mockCreateObjectURL.mock.calls[0][0] as Blob;
      const text = await blobCall.text();
      const exportedData = JSON.parse(text) as ExportableStoreState;

      expect(exportedData).toMatchObject({
        roomSize: { width: 500, height: 300 },
        stripWidth: 13,
        stripLengths: [120],
        totalLength: 0, // totalLength is not automatically calculated in the store
        version: "1.0.0",
      });
      expect(exportedData.exportedAt).toMatch(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
      );
    });
  });

  describe("importConfiguration", () => {
    it("should successfully import valid configuration", async () => {
      const store = useStripStore.getState();

      const validConfig: ExportableStoreState = {
        roomSize: { width: 400, height: 250 },
        stripWidth: 15,
        stripLengths: [100, 150, 200],
        totalLength: 450,
        version: "1.0.0",
        exportedAt: "2025-10-10T12:00:00.000Z",
      };

      const mockFile = new File([JSON.stringify(validConfig)], "config.json", {
        type: "application/json",
      });

      const result = await store.importConfiguration(mockFile);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(validConfig);

      // Verify store state was updated
      const updatedState = useStripStore.getState();
      expect(updatedState.roomSize).toEqual({ width: 400, height: 250 });
      expect(updatedState.stripWidth).toBe(15);
      expect(updatedState.stripLengths).toEqual([100, 150, 200]);
      expect(updatedState.totalLength).toBe(450);
    });

    it("should handle invalid JSON file", async () => {
      const store = useStripStore.getState();

      const mockFile = new File(["invalid json content"], "invalid.json", {
        type: "application/json",
      });

      const result = await store.importConfiguration(mockFile);

      expect(result.success).toBe(false);
      expect(result.error).toContain("Invalid JSON format");
    });

    it("should handle file with missing required fields", async () => {
      const store = useStripStore.getState();

      const invalidConfig = {
        roomSize: { width: 400, height: 250 },
        // Missing stripWidth, stripLengths, totalLength, version, exportedAt
      };

      const mockFile = new File(
        [JSON.stringify(invalidConfig)],
        "incomplete.json",
        {
          type: "application/json",
        }
      );

      const result = await store.importConfiguration(mockFile);

      expect(result.success).toBe(false);
      expect(result.error).toContain("Validation failed");
      expect(result.error).toContain("Missing required field");
    });

    it("should handle file with invalid data types", async () => {
      const store = useStripStore.getState();

      const invalidConfig = {
        roomSize: { width: "invalid", height: 250 },
        stripWidth: 15,
        stripLengths: [100, "invalid", 200],
        totalLength: 450,
        version: "1.0.0",
        exportedAt: "2025-10-10T12:00:00.000Z",
      };

      const mockFile = new File(
        [JSON.stringify(invalidConfig)],
        "invalid-types.json",
        {
          type: "application/json",
        }
      );

      const result = await store.importConfiguration(mockFile);

      expect(result.success).toBe(false);
      expect(result.error).toContain("Validation failed");
    });

    it("should handle file with negative numeric values", async () => {
      const store = useStripStore.getState();

      const invalidConfig = {
        roomSize: { width: -100, height: 250 },
        stripWidth: -15,
        stripLengths: [100, -50, 200],
        totalLength: -450,
        version: "1.0.0",
        exportedAt: "2025-10-10T12:00:00.000Z",
      };

      const mockFile = new File(
        [JSON.stringify(invalidConfig)],
        "negative-values.json",
        {
          type: "application/json",
        }
      );

      const result = await store.importConfiguration(mockFile);

      expect(result.success).toBe(false);
      expect(result.error).toContain("Validation failed");
    });

    it("should handle file with invalid version format", async () => {
      const store = useStripStore.getState();

      const invalidConfig = {
        roomSize: { width: 400, height: 250 },
        stripWidth: 15,
        stripLengths: [100, 150, 200],
        totalLength: 450,
        version: "invalid-version",
        exportedAt: "2025-10-10T12:00:00.000Z",
      };

      const mockFile = new File(
        [JSON.stringify(invalidConfig)],
        "invalid-version.json",
        {
          type: "application/json",
        }
      );

      const result = await store.importConfiguration(mockFile);

      expect(result.success).toBe(false);
      expect(result.error).toContain("Validation failed");
      expect(result.error).toContain(
        "version must be a valid semantic version"
      );
    });

    it("should handle file with invalid date format", async () => {
      const store = useStripStore.getState();

      const invalidConfig = {
        roomSize: { width: 400, height: 250 },
        stripWidth: 15,
        stripLengths: [100, 150, 200],
        totalLength: 450,
        version: "1.0.0",
        exportedAt: "invalid-date",
      };

      const mockFile = new File(
        [JSON.stringify(invalidConfig)],
        "invalid-date.json",
        {
          type: "application/json",
        }
      );

      const result = await store.importConfiguration(mockFile);

      expect(result.success).toBe(false);
      expect(result.error).toContain("Validation failed");
      expect(result.error).toContain(
        "exportedAt must be a valid ISO date string"
      );
    });

    it("should not modify store state on import failure", async () => {
      // Clear localStorage and reset store first
      localStorage.clear();
      const store = useStripStore.getState();

      // Set initial state after reset
      store.setRoomWidth(100);
      store.setRoomHeight(200);
      store.setStripWidth(10);
      store.add(50);

      // Capture the state after setting it
      const currentStoreState = useStripStore.getState();
      const initialState = {
        roomSize: { width: 100, height: 200 },
        stripWidth: 10,
        stripLengths: [50],
        totalLength: currentStoreState.totalLength, // Use actual totalLength from store
      };

      const mockFile = new File(["invalid json"], "invalid.json", {
        type: "application/json",
      });

      const result = await store.importConfiguration(mockFile);

      expect(result.success).toBe(false);

      // Verify store state remained unchanged
      const currentState = useStripStore.getState();
      expect(currentState.roomSize).toEqual(initialState.roomSize);
      expect(currentState.stripWidth).toBe(initialState.stripWidth);
      expect(currentState.stripLengths).toEqual(initialState.stripLengths);
      expect(currentState.totalLength).toBe(initialState.totalLength);
    });

    it("should handle file reading errors gracefully", async () => {
      const store = useStripStore.getState();

      // Create a mock file that will trigger FileReader error
      const mockFile = new File(["content"], "error-file.json", {
        type: "application/json",
      });

      // Mock FileReader to simulate error
      const originalFileReader = global.FileReader;
      global.FileReader = class MockErrorFileReader {
        onerror: ((event: { target: MockErrorFileReader }) => void) | null =
          null;

        readAsText() {
          setTimeout(() => {
            this.onerror?.({ target: this });
          }, 0);
        }
      } as unknown as typeof FileReader;

      const result = await store.importConfiguration(mockFile);

      expect(result.success).toBe(false);
      expect(result.error).toContain("Failed to read file");

      // Restore original FileReader
      global.FileReader = originalFileReader;
    });

    it("should handle empty file", async () => {
      const store = useStripStore.getState();

      const mockFile = new File([""], "empty.json", {
        type: "application/json",
      });

      const result = await store.importConfiguration(mockFile);

      expect(result.success).toBe(false);
      expect(result.error).toMatch(
        /File is empty|Invalid JSON format|Failed to read file/
      );
    });

    it("should handle large file size validation", async () => {
      const store = useStripStore.getState();

      // Create a mock file that exceeds size limit
      const largeContent = "x".repeat(11 * 1024 * 1024); // 11MB
      const mockFile = new File([largeContent], "large.json", {
        type: "application/json",
      });

      const result = await store.importConfiguration(mockFile);

      expect(result.success).toBe(false);
      expect(result.error).toContain("File size too large");
    });

    it("should handle non-JSON file type", async () => {
      const store = useStripStore.getState();

      const mockFile = new File(["some content"], "document.txt", {
        type: "text/plain",
      });

      const result = await store.importConfiguration(mockFile);

      expect(result.success).toBe(false);
      expect(result.error).toContain("File must be a JSON file");
    });
  });

  describe("Edge Cases and Error Handling", () => {
    it("should handle export with empty strip lengths array", () => {
      const store = useStripStore.getState();

      store.setRoomWidth(500);
      store.setRoomHeight(300);
      store.setStripWidth(13);
      // stripLengths remains empty

      expect(() => store.exportConfiguration()).not.toThrow();
      expect(mockCreateObjectURL).toHaveBeenCalled();
    });

    it("should handle import with empty strip lengths array", async () => {
      const store = useStripStore.getState();

      const validConfig: ExportableStoreState = {
        roomSize: { width: 400, height: 250 },
        stripWidth: 15,
        stripLengths: [], // Empty array
        totalLength: 0,
        version: "1.0.0",
        exportedAt: "2025-10-10T12:00:00.000Z",
      };

      const mockFile = new File(
        [JSON.stringify(validConfig)],
        "empty-strips.json",
        {
          type: "application/json",
        }
      );

      const result = await store.importConfiguration(mockFile);

      expect(result.success).toBe(true);
      expect(result.data?.stripLengths).toEqual([]);

      const updatedState = useStripStore.getState();
      expect(updatedState.stripLengths).toEqual([]);
    });

    it("should handle import with zero values", async () => {
      const store = useStripStore.getState();

      const validConfig: ExportableStoreState = {
        roomSize: { width: 0, height: 0 },
        stripWidth: 0,
        stripLengths: [0, 0],
        totalLength: 0,
        version: "1.0.0",
        exportedAt: "2025-10-10T12:00:00.000Z",
      };

      const mockFile = new File(
        [JSON.stringify(validConfig)],
        "zero-values.json",
        {
          type: "application/json",
        }
      );

      const result = await store.importConfiguration(mockFile);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(validConfig);
    });

    it("should handle concurrent import operations", async () => {
      const store = useStripStore.getState();

      const config1: ExportableStoreState = {
        roomSize: { width: 100, height: 100 },
        stripWidth: 10,
        stripLengths: [50],
        totalLength: 50,
        version: "1.0.0",
        exportedAt: "2025-10-10T12:00:00.000Z",
      };

      const config2: ExportableStoreState = {
        roomSize: { width: 200, height: 200 },
        stripWidth: 20,
        stripLengths: [100],
        totalLength: 100,
        version: "1.0.0",
        exportedAt: "2025-10-10T12:01:00.000Z",
      };

      const file1 = new File([JSON.stringify(config1)], "config1.json", {
        type: "application/json",
      });

      const file2 = new File([JSON.stringify(config2)], "config2.json", {
        type: "application/json",
      });

      // Start both imports concurrently
      const [result1, result2] = await Promise.all([
        store.importConfiguration(file1),
        store.importConfiguration(file2),
      ]);

      expect(result1.success).toBe(true);
      expect(result2.success).toBe(true);

      // The final state should be from one of the imports
      const finalState = useStripStore.getState();
      const isConfig1 = finalState.roomSize.width === 100;
      const isConfig2 = finalState.roomSize.width === 200;
      expect(isConfig1 || isConfig2).toBe(true);
    });
  });
});
