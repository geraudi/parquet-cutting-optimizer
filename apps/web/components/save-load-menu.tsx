"use client";

import type { Room, Strip } from "@web/lib/calculator";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Archive, Download, FileDown, FileUp, Upload } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface SavedVersion {
  date: string;
  calcResult: { rooms: Room[]; restStrips: Strip[] };
  roomSize: { width: number; height: number };
  stripLengths: number[];
}

interface SaveLoadMenuProps {
  onLoadVersion?: (version: SavedVersion) => void;
  currentVersion?: {
    calcResult: { rooms: Room[]; restStrips: Strip[] };
    roomSize: { width: number; height: number };
    stripLengths: number[];
  };
}

export function SaveLoadMenu({
  onLoadVersion,
  currentVersion,
}: SaveLoadMenuProps) {
  const [savedVersions, setSavedVersions] = useState<SavedVersion[]>([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  // Load saved versions
  // biome-ignore lint/correctness/useExhaustiveDependencies: <ignore other changes>
  useEffect(() => {
    const savesRaw = localStorage.getItem("parquet-layout:saves");
    setSavedVersions(savesRaw ? JSON.parse(savesRaw) : []);
  }, [showHistoryModal]);

  // Export to JSON file
  const exportToFile = useCallback(() => {
    const savesRaw = localStorage.getItem("parquet-layout:saves");
    const saves = savesRaw ? JSON.parse(savesRaw) : [];
    const dataStr = JSON.stringify(saves, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `parquet-saves-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, []);

  // Import from JSON file
  const importFromFile = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const imported = JSON.parse(event.target?.result as string);
          if (Array.isArray(imported)) {
            localStorage.setItem(
              "parquet-layout:saves",
              JSON.stringify(imported)
            );
            setSavedVersions(imported);
            alert(`${imported.length} version(s) importée(s) avec succès !`);
          }
        } catch (error) {
          alert("Erreur lors de l'import du fichier");
          console.error(error);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }, []);

  // Load version from history
  const loadVersion = useCallback(
    (version: SavedVersion) => {
      // Dispatch custom event for the parquet-layout page to listen
      window.dispatchEvent(
        new CustomEvent("parquet-layout:load-version", { detail: version })
      );
      onLoadVersion?.(version);
      setShowHistoryModal(false);
    },
    [onLoadVersion]
  );

  // Delete version
  const deleteVersion = useCallback(
    (date: string) => {
      const updated = savedVersions.filter((v) => v.date !== date);
      setSavedVersions(updated);
      localStorage.setItem("parquet-layout:saves", JSON.stringify(updated));
    },
    [savedVersions]
  );

  // Save current version
  const saveCurrentVersion = useCallback(() => {
    // Get current version from window global (set by parquet-layout page)
    const globalCurrentVersion =
      (window as unknown as { parquetCurrentVersion?: typeof currentVersion })
        .parquetCurrentVersion || currentVersion;

    if (!globalCurrentVersion) {
      alert(
        "Aucune version à enregistrer. Allez sur la page de résultats pour enregistrer une version."
      );
      return;
    }
    try {
      const savesRaw = localStorage.getItem("parquet-layout:saves");
      const saves = savesRaw ? JSON.parse(savesRaw) : [];
      const newSave = {
        date: new Date().toISOString(),
        ...globalCurrentVersion,
      };
      const updated = [newSave, ...saves];
      localStorage.setItem("parquet-layout:saves", JSON.stringify(updated));
      setSavedVersions(updated);
      alert("Version enregistrée avec succès !");
    } catch (error) {
      console.error("Erreur lors de l'enregistrement", error);
      alert("Erreur lors de l'enregistrement");
    }
  }, [currentVersion]);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            title="Import / Export"
            className="h-9 w-9"
          >
            <Archive className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onClick={saveCurrentVersion}>
            <Download className="mr-2 h-4 w-4" />
            Enregistrer la version actuelle
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowHistoryModal(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Charger depuis l'historique
          </DropdownMenuItem>
          <DropdownMenuItem onClick={exportToFile}>
            <FileDown className="mr-2 h-4 w-4" />
            Exporter vers un fichier
          </DropdownMenuItem>
          <DropdownMenuItem onClick={importFromFile}>
            <FileUp className="mr-2 h-4 w-4" />
            Importer depuis un fichier
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showHistoryModal} onOpenChange={setShowHistoryModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Versions enregistrées</DialogTitle>
            <DialogDescription>
              Chargez ou supprimez vos versions enregistrées
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 mt-4">
            {savedVersions.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Aucune version enregistrée
              </p>
            ) : (
              savedVersions.map((v) => (
                <div
                  key={v.date}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent"
                >
                  <div>
                    <div className="text-sm font-medium">
                      {new Date(v.date).toLocaleString("fr-FR")}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {v.stripLengths.length} lames,{" "}
                      {v.calcResult.restStrips.length} chutes
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => loadVersion(v)}
                    >
                      Charger
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteVersion(v.date)}
                    >
                      Supprimer
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
