import "@testing-library/jest-dom"
import { vi } from "vitest"

// Mock DOM APIs that are not available in jsdom
Object.defineProperty(window, "URL", {
  value: {
    createObjectURL: vi.fn(() => "mock-url"),
    revokeObjectURL: vi.fn(),
  },
})

// Mock FileReader
global.FileReader = class MockFileReader {
  result: string | null = null
  onload: ((event: any) => void) | null = null
  onerror: ((event: any) => void) | null = null

  readAsText(file: File) {
    // Simulate async file reading
    setTimeout(() => {
      if (file.name.includes("error-file")) {
        this.onerror?.({ target: this })
      } else {
        try {
          // Extract content from the file constructor
          const content = (file as any)._content || ""
          this.result = content
          this.onload?.({ target: { result: content } })
        } catch (_error) {
          this.onerror?.({ target: this })
        }
      }
    }, 0)
  }
} as any

// Enhance File constructor to store content for testing
const OriginalFile = global.File
global.File = class MockFile extends OriginalFile {
  _content: string

  constructor(
    fileBits: BlobPart[],
    fileName: string,
    options?: FilePropertyBag
  ) {
    super(fileBits, fileName, options)
    this._content = fileBits.join("")
  }
} as any

// Mock Blob with text method
global.Blob = class MockBlob {
  content: string
  type: string

  constructor(content: any[], options: { type?: string } = {}) {
    this.content = content.join("")
    this.type = options.type || ""
  }

  async text() {
    return this.content
  }
} as any
