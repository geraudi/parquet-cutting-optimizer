"use client";

import {
  formatValidationError,
  type ImportResult,
} from "@web/lib/file-validation";
import { showErrorToast, showSuccessToast } from "@web/lib/toast";
import { useStripStore } from "@web/store/strip-store";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { cn } from "@workspace/ui/lib/utils";
import { Download, Loader2, Upload } from "lucide-react";
import { useRef, useState } from "react";

interface ImportExportControlsProps {
  className?: string;
}

export function ImportExportControls({ className }: ImportExportControlsProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const exportConfiguration = useStripStore(
    (state) => state.exportConfiguration
  );
  const importConfiguration = useStripStore(
    (state) => state.importConfiguration
  );

  const handleExport = async () => {
    setIsExporting(true);

    try {
      exportConfiguration();
      showSuccessToast({
        title: "Export réussi",
        message: "Votre configuration a été téléchargée avec succès.",
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erreur inconnue";
      showErrorToast({
        title: "Échec de l'export",
        message: `Impossible d'exporter la configuration: ${errorMessage}`,
        duration: 8000,
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);

    try {
      const result: ImportResult = await importConfiguration(file);

      if (result.success) {
        showSuccessToast({
          title: "Import réussi",
          message: "Votre configuration a été restaurée avec succès.",
        });
      } else {
        // Use enhanced error formatting for better user experience
        const formattedError = formatValidationError(
          result.error || "Échec de l'import"
        );

        showErrorToast({
          title: formattedError.title,
          message:
            formattedError.message +
            (formattedError.suggestions
              ? `\n\nSuggestions:\n• ${formattedError.suggestions.join("\n• ")}`
              : ""),
          duration: 10000, // Longer duration for error messages with suggestions
        });
      }
    } catch (error) {
      // Handle unexpected errors during import process
      const errorMessage =
        error instanceof Error ? error.message : "Erreur inconnue";
      const formattedError = formatValidationError(errorMessage);

      showErrorToast({
        title: formattedError.title,
        message: formattedError.message,
        duration: 8000,
      });
    } finally {
      setIsImporting(false);
      // Reset file input to allow selecting the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <Button
          onClick={handleExport}
          disabled={isExporting || isImporting}
          variant="outline"
          size="default"
          className="flex-1 sm:flex-none transition-all hover:shadow-sm"
          title="Télécharger votre configuration actuelle en tant que fichier JSON"
        >
          {isExporting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          {isExporting ? "Export en cours..." : "Exporter la configuration"}
        </Button>

        <Button
          onClick={handleImportClick}
          disabled={isImporting || isExporting}
          variant="outline"
          size="default"
          className="flex-1 sm:flex-none transition-all hover:shadow-sm"
          title="Importer un fichier de configuration précédemment sauvegardé"
        >
          {isImporting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Upload className="mr-2 h-4 w-4" />
          )}
          {isImporting ? "Import en cours..." : "Importer une configuration"}
        </Button>

        <Input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileSelect}
          className="hidden"
          aria-label="Sélectionner un fichier de configuration à importer"
        />
      </div>
    </div>
  );
}
