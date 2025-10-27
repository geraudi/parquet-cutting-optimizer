"use client"

import RemainingStrips from "@web/components/remaining-strips"
import RoomView from "@web/components/room-view"
import { calculate, type Room, type Strip } from "@web/lib/calculator"
import { useStripStore } from "@web/store/strip-store"
import { Button } from "@workspace/ui/components/button"
import Big from "big.js"
import { ArrowLeft, RotateCcw, Save } from "lucide-react"
import Link from "next/link"
import { type JSX, useCallback, useEffect, useRef, useState } from "react"

interface SavedVersion {
  date: string
  calcResult: { rooms: Room[]; restStrips: Strip[] }
  roomSize: { width: number; height: number }
  stripLengths: number[]
}

export default function Page(): JSX.Element {
  const roomSize = useStripStore((state) => state.roomSize)
  const stripLengths = useStripStore((state) => state.stripLengths)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [_calcKey, setCalcKey] = useState(0)
  const [calcResult, setCalcResult] = useState<{
    rooms: Room[]
    restStrips: Strip[]
  } | null>(null)
  const [calcError, setCalcError] = useState<Error | null>(null)
  const [savedVersions, setSavedVersions] = useState<SavedVersion[]>([])
  const isFirstLoad = useRef(true)
  const [latestRooms, setLatestRooms] = useState<Room[]>([])

  const recalculate = useCallback(() => {
    setCalcKey((k) => k + 1)
  }, [])

  // Recalculate on every change of calcKey, roomSize or stripLengths
  useEffect(() => {
    try {
      const result = calculate([roomSize], stripLengths)
      setCalcResult(result)
      setCalcError(null)
    } catch (e) {
      setCalcResult(null)
      setCalcError(e as Error)
    }
  }, [roomSize, stripLengths])

  // Load saved versions on first render
  useEffect(() => {
    if (isFirstLoad.current) {
      const savesRaw = localStorage.getItem("parquet-layout:saves")
      setSavedVersions(savesRaw ? JSON.parse(savesRaw) : [])
      isFirstLoad.current = false
    }
  }, [])

  // Update the list when saving a new version
  const saveCurrentVersion = useCallback(() => {
    if (!calcResult) return
    try {
      const savesRaw = localStorage.getItem("parquet-layout:saves")
      const saves = savesRaw ? JSON.parse(savesRaw) : []
      const newSave = {
        date: new Date().toISOString(),
        calcResult: {
          ...calcResult,
          rooms: latestRooms.length > 0 ? latestRooms : calcResult.rooms,
        },
        roomSize,
        stripLengths,
      }
      const updated = [newSave, ...saves]
      localStorage.setItem("parquet-layout:saves", JSON.stringify(updated))
      setSavedVersions(updated)
    } catch (e) {
      console.error("Erreur lors de l'enregistrement", e)
    }
  }, [calcResult, roomSize, stripLengths, latestRooms])

  // Load a saved version
  const loadVersion = (version: SavedVersion) => {
    setCalcResult(version.calcResult)
  }

  // Function to delete a saved version
  const deleteVersion = (date: string) => {
    const updated = savedVersions.filter((v) => v.date !== date)
    setSavedVersions(updated)
    localStorage.setItem("parquet-layout:saves", JSON.stringify(updated))
  }

  if (calcError) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen p-8 max-w-4xl mx-auto">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-destructive">
            Erreur de calcul
          </h1>
          <p className="text-muted-foreground">
            Impossible de calculer la disposition optimale. Veuillez vérifier
            vos données et réessayer.
          </p>
          <Button asChild className="mt-4">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Retour à la configuration
            </Link>
          </Button>
        </div>
      </main>
    )
  }

  if (!calcResult) {
    return null
  }
  const { rooms, restStrips } = calcResult

  return (
    <main className="min-h-screen p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <Button asChild variant="ghost" className="mb-4">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Retour à la configuration
          </Link>
        </Button>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Disposition optimale du parquet
          </h1>
          <p className="text-muted-foreground">
            Voici une disposition calculée pour votre pièce
          </p>
          <div className="flex justify-center mt-4 gap-2">
            <Button onClick={recalculate} className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              Recalculer
            </Button>
            <Button
              onClick={saveCurrentVersion}
              className="flex items-center gap-2"
              disabled={!calcResult}
              variant="secondary"
            >
              <Save className="w-4 h-4" />
              Enregistrer cette version
            </Button>
          </div>
        </div>
      </div>
      <div className="space-y-8">
        {/* Bloc des versions enregistrées */}
        {savedVersions.length > 0 && (
          <div className="p-6 border rounded-lg bg-card shadow-sm">
            <h2 className="text-xl font-semibold mb-4">
              Versions enregistrées
            </h2>
            <div className="space-y-2">
              {savedVersions.map((v) => (
                <div
                  key={v.date}
                  className="flex items-center justify-between p-2 border rounded mb-2"
                >
                  <div>
                    <div className="text-sm font-medium">
                      {new Date(v.date).toLocaleString()}
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
              ))}
            </div>
          </div>
        )}
        <div className="p-6 border rounded-lg bg-card shadow-sm">
          <RoomView
            rooms={rooms}
            isFullscreen={isFullscreen}
            setIsFullscreen={setIsFullscreen}
            onRoomsChange={setLatestRooms}
          />
        </div>
        {!isFullscreen && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 border rounded-lg bg-card shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Lames restantes</h2>
              <RemainingStrips strips={restStrips} roomSizes={[roomSize]} />
            </div>
            <div className="p-6 border rounded-lg bg-card shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Statistiques</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Superficie de la pièce
                  </span>
                  <span className="font-medium">
                    {Big(roomSize.height)
                      .mul(roomSize.width)
                      .div(10000)
                      .toFixed(2)}{" "}
                    cm²
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Nombre total de lames
                  </span>
                  <span className="font-medium">{stripLengths.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Lames restantes</span>
                  <span className="font-medium">{restStrips.length}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
