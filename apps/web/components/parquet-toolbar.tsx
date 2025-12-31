"use client";

import { SaveLoadMenu } from "@web/components/save-load-menu";
import type { Room, Strip } from "@web/lib/calculator";
import { Button } from "@workspace/ui/components/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip";
import {
  FileDown,
  Maximize2,
  Minimize2,
  Printer,
  RotateCcw,
  Settings,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

interface SavedVersion {
  date: string;
  calcResult: { rooms: Room[]; restStrips: Strip[] };
  roomSize: { width: number; height: number };
  stripLengths: number[];
}

interface ParquetToolbarProps {
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onPrint?: () => void;
  onExportPDF?: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onReset?: () => void;
  onOpenSidebar?: () => void;
  currentVersion?: {
    calcResult: { rooms: Room[]; restStrips: Strip[] };
    roomSize: { width: number; height: number };
    stripLengths: number[];
  };
  onLoadVersion?: (version: SavedVersion) => void;
}

export function ParquetToolbar({
  isFullscreen,
  onToggleFullscreen,
  onPrint,
  onExportPDF,
  onZoomIn,
  onZoomOut,
  onReset,
  onOpenSidebar,
  currentVersion,
  onLoadVersion,
}: ParquetToolbarProps) {
  const toolbarClasses = isFullscreen
    ? "absolute top-4 right-4 z-30 flex items-center gap-2 bg-slate-800/95 backdrop-blur-md border-2 border-slate-600/80 rounded-xl shadow-2xl p-2 transition-all duration-300 hover:shadow-3xl"
    : "absolute top-4 right-4 z-30 flex items-center gap-2 bg-white/95 backdrop-blur-md border-2 border-slate-200/80 rounded-xl shadow-2xl p-2 transition-all duration-300 hover:shadow-3xl";

  const buttonClasses = isFullscreen
    ? "h-9 w-9 hover:bg-slate-700 text-slate-100 hover:text-white transition-all duration-200"
    : "h-9 w-9 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200";

  const separatorClasses = isFullscreen
    ? "pr-2 border-r border-slate-600"
    : "pr-2 border-r border-slate-200";

  const printButtonClasses = isFullscreen
    ? "h-9 w-9 hover:bg-emerald-900/50 text-slate-100 hover:text-emerald-300 transition-all duration-200"
    : "h-9 w-9 hover:bg-emerald-50 hover:text-emerald-600 transition-all duration-200";

  const exportButtonClasses = isFullscreen
    ? "h-9 w-9 hover:bg-amber-900/50 text-slate-100 hover:text-amber-300 transition-all duration-200"
    : "h-9 w-9 hover:bg-amber-50 hover:text-amber-600 transition-all duration-200";

  return (
    <TooltipProvider delayDuration={300}>
      <div className={toolbarClasses}>
        {/* Configuration Group */}
        {onOpenSidebar && (
          <div className={`flex items-center gap-1 ${separatorClasses}`}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onOpenSidebar}
                  className={buttonClasses}
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p className="text-xs font-medium">Configuration</p>
              </TooltipContent>
            </Tooltip>

            {/* Save/Load Menu integrated */}
            <SaveLoadMenu
              currentVersion={currentVersion}
              onLoadVersion={onLoadVersion}
            />
          </div>
        )}

        {/* View Controls Group */}
        <div className={`flex items-center gap-1 ${separatorClasses}`}>
          {onZoomIn && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onZoomIn}
                  className={buttonClasses}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p className="text-xs font-medium">Zoomer</p>
              </TooltipContent>
            </Tooltip>
          )}

          {onZoomOut && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onZoomOut}
                  className={buttonClasses}
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p className="text-xs font-medium">Dézoomer</p>
              </TooltipContent>
            </Tooltip>
          )}

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggleFullscreen}
                className={buttonClasses}
              >
                {isFullscreen ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p className="text-xs font-medium">
                {isFullscreen ? "Quitter le plein écran" : "Plein écran"}
              </p>
            </TooltipContent>
          </Tooltip>

          {onReset && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onReset}
                  className={buttonClasses}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p className="text-xs font-medium">Réinitialiser la vue</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>

        {/* Export Controls Group */}
        <div className="flex items-center gap-1">
          {onPrint && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onPrint}
                  className={printButtonClasses}
                >
                  <Printer className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p className="text-xs font-medium">Imprimer</p>
              </TooltipContent>
            </Tooltip>
          )}

          {onExportPDF && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onExportPDF}
                  className={exportButtonClasses}
                >
                  <FileDown className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p className="text-xs font-medium">Exporter en PDF</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
