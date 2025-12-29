import "@testing-library/jest-dom";

// Define proper types for mock events
interface MockFileReaderEvent {
  target: {
    result: string | null;
  } | null;
}

interface MockFileWithContent extends File {
  _content?: string;
}

// Mock FileReader
global.FileReader = class MockFileReader {
  result: string | null = null;
  onload: ((event: MockFileReaderEvent) => void) | null = null;
  onerror: ((event: MockFileReaderEvent) => void) | null = null;

  readAsText(file: File) {
    // Simulate async file reading
    setTimeout(() => {
      if (file.name.includes("error-file")) {
        this.onerror?.({ target: this });
      } else {
        try {
          // Extract content from the file constructor
          const content = (file as MockFileWithContent)._content || "";
          this.result = content;
          this.onload?.({ target: { result: content } });
        } catch (_error) {
          this.onerror?.({ target: this });
        }
      }
    }, 0);
  }
} as unknown as typeof FileReader;

// Enhance File constructor to store content for testing
const OriginalFile = global.File;
global.File = class MockFile extends OriginalFile {
  _content: string;

  constructor(
    fileBits: BlobPart[],
    fileName: string,
    options?: FilePropertyBag
  ) {
    super(fileBits, fileName, options);
    this._content = fileBits.join("");
  }
} as unknown as typeof File;

// Mock Blob with text method
global.Blob = class MockBlob {
  content: string;
  type: string;

  constructor(
    content: (string | ArrayBuffer | ArrayBufferView)[],
    options: { type?: string } = {}
  ) {
    this.content = content.join("");
    this.type = options.type || "";
  }

  async text() {
    return this.content;
  }
} as unknown as typeof Blob;
