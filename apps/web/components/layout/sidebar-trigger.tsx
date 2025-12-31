"use client";

import { Button } from "@workspace/ui/components/button";
import { Settings } from "lucide-react";

interface SidebarTriggerProps {
  onClick: () => void;
}

export function SidebarTrigger({ onClick }: SidebarTriggerProps) {
  return (
    <Button variant="outline" size="icon" onClick={onClick}>
      <Settings className="h-4 w-4" />
    </Button>
  );
}
