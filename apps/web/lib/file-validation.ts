import type { RoomSize } from "./calculator";

/**
 * Interface for the exportable store state
 * Contains all the data that needs to be persisted and restored
 */
export interface ExportableStoreState {
  roomSize: RoomSize;
  stripWidth: number;
  stripLengths: number[];
  totalLength: number;
  version: string;
  exportedAt: string;
}

/**
 * Result interface for import operations
 * Provides success/failure status and error details
 */
export interface ImportResult {
  success: boolean;
  error?: string;
  data?: ExportableStoreState;
}

/**
 * Enum for different types of validation errors
 */
export enum ValidationErrorType {
  INVALID_JSON = "INVALID_JSON",
  MISSING_REQUIRED_FIELD = "MISSING_REQUIRED_FIELD",
  INVALID_DATA_TYPE = "INVALID_DATA_TYPE",
  INVALID_NUMERIC_VALUE = "INVALID_NUMERIC_VALUE",
  INVALID_ARRAY_STRUCTURE = "INVALID_ARRAY_STRUCTURE",
  VERSION_INCOMPATIBLE = "VERSION_INCOMPATIBLE",
  FILE_READ_ERROR = "FILE_READ_ERROR",
}

/**
 * Detailed validation error with type and context
 */
export interface ValidationError {
  type: ValidationErrorType;
  message: string;
  field?: string;
  value?: unknown;
}

/**
 * Type guard to check if a value is a valid RoomSize
 */
export function isValidRoomSize(value: unknown): value is RoomSize {
  if (!value || typeof value !== "object") {
    return false;
  }

  const roomSize = value as Record<string, unknown>;
  return (
    typeof roomSize.width === "number" &&
    typeof roomSize.height === "number" &&
    roomSize.width >= 0 &&
    roomSize.height >= 0
  );
}

/**
 * Type guard to check if a value is a valid array of numbers
 */
export function isValidNumberArray(value: unknown): value is number[] {
  return (
    Array.isArray(value) &&
    value.every((item) => typeof item === "number" && item >= 0)
  );
}

/**
 * Type guard to check if a value is a valid version string
 */
export function isValidVersion(value: unknown): value is string {
  return typeof value === "string" && /^\d+\.\d+\.\d+$/.test(value);
}

/**
 * Type guard to check if a value is a valid ISO date string
 */
export function isValidISODate(value: unknown): value is string {
  if (typeof value !== "string") {
    return false;
  }

  const date = new Date(value);
  return !Number.isNaN(date.getTime()) && date.toISOString() === value;
}

/**
 * Validates the structure and content of exportable store state
 */
export function validateExportableStoreState(data: unknown): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!data || typeof data !== "object") {
    errors.push({
      type: ValidationErrorType.INVALID_DATA_TYPE,
      message: "Data must be an object",
      value: data,
    });
    return errors;
  }

  const state = data as Record<string, unknown>;

  // Validate roomSize
  if (!("roomSize" in state)) {
    errors.push({
      type: ValidationErrorType.MISSING_REQUIRED_FIELD,
      message: "Missing required field: roomSize",
      field: "roomSize",
    });
  } else if (!isValidRoomSize(state.roomSize)) {
    errors.push({
      type: ValidationErrorType.INVALID_DATA_TYPE,
      message:
        "roomSize must be an object with numeric width and height properties",
      field: "roomSize",
      value: state.roomSize,
    });
  }

  // Validate stripWidth
  if (!("stripWidth" in state)) {
    errors.push({
      type: ValidationErrorType.MISSING_REQUIRED_FIELD,
      message: "Missing required field: stripWidth",
      field: "stripWidth",
    });
  } else if (typeof state.stripWidth !== "number" || state.stripWidth < 0) {
    errors.push({
      type: ValidationErrorType.INVALID_NUMERIC_VALUE,
      message: "stripWidth must be a non-negative number",
      field: "stripWidth",
      value: state.stripWidth,
    });
  }

  // Validate stripLengths
  if (!("stripLengths" in state)) {
    errors.push({
      type: ValidationErrorType.MISSING_REQUIRED_FIELD,
      message: "Missing required field: stripLengths",
      field: "stripLengths",
    });
  } else if (!isValidNumberArray(state.stripLengths)) {
    errors.push({
      type: ValidationErrorType.INVALID_ARRAY_STRUCTURE,
      message: "stripLengths must be an array of non-negative numbers",
      field: "stripLengths",
      value: state.stripLengths,
    });
  }

  // Validate totalLength
  if (!("totalLength" in state)) {
    errors.push({
      type: ValidationErrorType.MISSING_REQUIRED_FIELD,
      message: "Missing required field: totalLength",
      field: "totalLength",
    });
  } else if (typeof state.totalLength !== "number" || state.totalLength < 0) {
    errors.push({
      type: ValidationErrorType.INVALID_NUMERIC_VALUE,
      message: "totalLength must be a non-negative number",
      field: "totalLength",
      value: state.totalLength,
    });
  }

  // Validate version
  if (!("version" in state)) {
    errors.push({
      type: ValidationErrorType.MISSING_REQUIRED_FIELD,
      message: "Missing required field: version",
      field: "version",
    });
  } else if (!isValidVersion(state.version)) {
    errors.push({
      type: ValidationErrorType.VERSION_INCOMPATIBLE,
      message:
        "version must be a valid semantic version string (e.g., '1.0.0')",
      field: "version",
      value: state.version,
    });
  }

  // Validate exportedAt
  if (!("exportedAt" in state)) {
    errors.push({
      type: ValidationErrorType.MISSING_REQUIRED_FIELD,
      message: "Missing required field: exportedAt",
      field: "exportedAt",
    });
  } else if (!isValidISODate(state.exportedAt)) {
    errors.push({
      type: ValidationErrorType.INVALID_DATA_TYPE,
      message: "exportedAt must be a valid ISO date string",
      field: "exportedAt",
      value: state.exportedAt,
    });
  }

  return errors;
}

/**
 * Validates JSON content and returns parsed data or validation errors
 */
export function validateImportedJSON(jsonContent: string): ImportResult {
  let parsedData: unknown;

  try {
    parsedData = JSON.parse(jsonContent);
  } catch (error) {
    // Provide more specific JSON parsing error messages
    if (error instanceof SyntaxError) {
      const message = error.message;
      if (message.includes("Unexpected end of JSON input")) {
        return {
          success: false,
          error:
            "Invalid JSON format: file appears to be truncated or incomplete",
        };
      }
      if (message.includes("Unexpected token")) {
        return {
          success: false,
          error:
            "Invalid JSON format: file contains invalid characters or syntax errors",
        };
      }
    }

    return {
      success: false,
      error: `Invalid JSON format: ${error instanceof Error ? error.message : "Unknown parsing error"}`,
    };
  }

  // Validate the parsed data structure
  const validationErrors = validateExportableStoreState(parsedData);

  if (validationErrors.length > 0) {
    // Create detailed error message with specific field information
    const errorMessage = validationErrors
      .map(
        (error) => `${error.field ? `${error.field}: ` : ""}${error.message}`
      )
      .join("; ");

    return {
      success: false,
      error: `Validation failed: ${errorMessage}`,
    };
  }

  return {
    success: true,
    data: parsedData as ExportableStoreState,
  };
}

/**
 * Validates a File object and reads its content for import
 */
export async function validateImportFile(file: File): Promise<ImportResult> {
  // Check if file exists and is valid
  if (!file) {
    return {
      success: false,
      error: "No file selected",
    };
  }

  // Check file name
  if (!file.name) {
    return {
      success: false,
      error: "Invalid file: file name is missing",
    };
  }

  // Check file type
  if (!file.type.includes("json") && !file.name.endsWith(".json")) {
    return {
      success: false,
      error: "File must be a JSON file",
    };
  }

  // Check file size (limit to 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    return {
      success: false,
      error: "File size too large. Maximum allowed size is 10MB",
    };
  }

  // Check for empty files
  if (file.size === 0) {
    return {
      success: false,
      error: "File is empty",
    };
  }

  try {
    const fileContent = await readFileAsText(file);

    // Check for empty content after reading
    if (!fileContent || fileContent.trim().length === 0) {
      return {
        success: false,
        error: "File content is empty",
      };
    }

    return validateImportedJSON(fileContent);
  } catch (error) {
    // Provide more specific error messages based on the error type
    if (error instanceof Error) {
      if (error.name === "NotReadableError") {
        return {
          success: false,
          error:
            "Failed to read file: file may be corrupted or in use by another application",
        };
      }
      if (error.name === "SecurityError") {
        return {
          success: false,
          error:
            "Failed to read file: access denied due to security restrictions",
        };
      }
    }

    return {
      success: false,
      error: `Failed to read file: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

/**
 * Utility function to read a File as text
 */
function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      if (event.target?.result) {
        resolve(event.target.result as string);
      } else {
        reject(new Error("Failed to read file content"));
      }
    };

    reader.onerror = () => {
      reject(new Error("File reading failed"));
    };

    reader.readAsText(file);
  });
}

/**
 * Enhanced error message formatting with specific error types
 */
export interface FormattedError {
  title: string;
  message: string;
  type: "error" | "warning";
  suggestions?: string[];
}

/**
 * Creates detailed user-friendly error messages from validation errors
 */
export function formatValidationError(error: string): FormattedError {
  // File reading errors
  if (error.includes("Failed to read file")) {
    return {
      title: "Erreur de lecture du fichier",
      message:
        "Impossible de lire le fichier sélectionné. Le fichier pourrait être corrompu ou inaccessible.",
      type: "error",
      suggestions: [
        "Vérifiez que le fichier n'est pas corrompu",
        "Essayez de sélectionner un autre fichier",
        "Assurez-vous que le fichier n'est pas ouvert dans une autre application",
      ],
    };
  }

  // JSON parsing errors
  if (
    error.includes("Invalid JSON format") ||
    error.includes("Unexpected token")
  ) {
    return {
      title: "Format de fichier invalide",
      message:
        "Le fichier sélectionné n'est pas un fichier JSON valide ou est corrompu.",
      type: "error",
      suggestions: [
        "Vérifiez que le fichier a été exporté correctement",
        "Assurez-vous que le fichier n'a pas été modifié manuellement",
        "Essayez d'exporter une nouvelle configuration",
      ],
    };
  }

  // File type errors
  if (error.includes("File must be a JSON file")) {
    return {
      title: "Type de fichier incorrect",
      message:
        "Seuls les fichiers JSON sont acceptés pour l'import de configuration.",
      type: "error",
      suggestions: [
        "Sélectionnez un fichier avec l'extension .json",
        "Utilisez uniquement des fichiers exportés par cette application",
      ],
    };
  }

  // File size errors
  if (error.includes("File size too large")) {
    return {
      title: "Fichier trop volumineux",
      message:
        "Le fichier sélectionné dépasse la taille maximale autorisée de 10 MB.",
      type: "error",
      suggestions: [
        "Vérifiez que vous avez sélectionné le bon fichier",
        "Les fichiers de configuration sont généralement très petits",
      ],
    };
  }

  // Version compatibility errors
  if (
    error.includes("version must be a valid semantic version") ||
    error.includes("VERSION_INCOMPATIBLE")
  ) {
    return {
      title: "Version incompatible",
      message:
        "Ce fichier de configuration provient d'une version incompatible de l'application.",
      type: "error",
      suggestions: [
        "Utilisez un fichier exporté depuis une version compatible",
        "Mettez à jour l'application si nécessaire",
        "Créez une nouvelle configuration si le fichier est trop ancien",
      ],
    };
  }

  // Missing required fields
  if (error.includes("Missing required field")) {
    const fieldMatch = error.match(/Missing required field: (\w+)/);
    const fieldName = fieldMatch ? fieldMatch[1] : "inconnu";

    return {
      title: "Données manquantes",
      message: `Le fichier de configuration ne contient pas toutes les données requises (champ manquant: ${fieldName}).`,
      type: "error",
      suggestions: [
        "Vérifiez que le fichier n'a pas été modifié",
        "Utilisez un fichier exporté récemment",
        "Créez une nouvelle configuration si nécessaire",
      ],
    };
  }

  // Invalid numeric values
  if (
    error.includes("must be a non-negative number") ||
    error.includes("INVALID_NUMERIC_VALUE")
  ) {
    return {
      title: "Valeurs numériques invalides",
      message:
        "Le fichier contient des valeurs numériques incorrectes ou négatives.",
      type: "error",
      suggestions: [
        "Vérifiez l'intégrité du fichier",
        "Assurez-vous que le fichier n'a pas été modifié manuellement",
        "Utilisez un fichier exporté directement par l'application",
      ],
    };
  }

  // Invalid array structure
  if (
    error.includes("must be an array") ||
    error.includes("INVALID_ARRAY_STRUCTURE")
  ) {
    return {
      title: "Structure de données invalide",
      message: "La structure des données de longueurs de lames est incorrecte.",
      type: "error",
      suggestions: [
        "Utilisez uniquement des fichiers exportés par cette application",
        "Vérifiez que le fichier n'a pas été corrompu",
        "Créez une nouvelle configuration si le problème persiste",
      ],
    };
  }

  // Room size validation errors
  if (error.includes("roomSize")) {
    return {
      title: "Dimensions de pièce invalides",
      message:
        "Les dimensions de la pièce dans le fichier sont incorrectes ou manquantes.",
      type: "error",
      suggestions: [
        "Vérifiez que les dimensions sont des nombres positifs",
        "Assurez-vous que le fichier contient les données de largeur et hauteur",
      ],
    };
  }

  // Generic validation errors
  if (error.includes("Validation failed")) {
    return {
      title: "Erreur de validation",
      message: "Le fichier de configuration ne respecte pas le format attendu.",
      type: "error",
      suggestions: [
        "Utilisez uniquement des fichiers exportés par cette application",
        "Vérifiez que le fichier n'a pas été modifié",
        "Contactez le support si le problème persiste",
      ],
    };
  }

  // Default error for unknown cases
  return {
    title: "Erreur d'import",
    message: error || "Une erreur inconnue s'est produite lors de l'import.",
    type: "error",
    suggestions: [
      "Vérifiez le fichier sélectionné",
      "Essayez avec un autre fichier de configuration",
      "Redémarrez l'application si le problème persiste",
    ],
  };
}

/**
 * Creates user-friendly error message from validation errors (legacy function for backward compatibility)
 */
export function formatValidationErrorSimple(error: string): string {
  const formatted = formatValidationError(error);
  return `${formatted.title}: ${formatted.message}`;
}
