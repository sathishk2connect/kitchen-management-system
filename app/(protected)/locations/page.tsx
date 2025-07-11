"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { LocationTable } from "@/components/locations/location-table"
import { LocationForm } from "@/components/locations/location-form"
import { useLocations } from "@/lib/hooks/use-locations"
import { Loader2, Plus, RefreshCw } from "lucide-react"
import { ApiDebugPanel } from "@/components/debug/api-debug-panel"

export default function LocationsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState(null)
  const { locations, isLoading, error, debugInfo, createLocation, updateLocation, deleteLocation, refreshLocations } =
    useLocations()

  const handleCreateLocation = async (locationData) => {
    setIsSubmitting(true)
    try {
      await createLocation(locationData)
      setIsFormOpen(false)
    } catch (error) {
      console.error("Failed to create location:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateLocation = async (locationData) => {
    setIsSubmitting(true)
    try {
      await updateLocation(locationData)
      setIsFormOpen(false)
      setSelectedLocation(null)
    } catch (error) {
      console.error("Failed to update location:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteLocation = async (locationId) => {
    try {
      await deleteLocation(locationId)
    } catch (error) {
      console.error("Failed to delete location:", error)
    }
  }

  const handleEditLocation = (location) => {
    setSelectedLocation(location)
    setIsFormOpen(true)
  }

  const handleFormClose = () => {
    setIsFormOpen(false)
    setSelectedLocation(null)
  }

  const handleRefresh = () => {
    refreshLocations()
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Location Management</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {error && (
        <ApiDebugPanel error={error} debugInfo={debugInfo} onRetry={handleRefresh} title="Error Loading Locations" />
      )}

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          <span className="ml-2 text-lg text-gray-500">Loading locations...</span>
        </div>
      ) : (
        <LocationTable />
      )}

      <LocationForm
        open={isFormOpen}
        onOpenChange={handleFormClose}
        onSubmit={selectedLocation ? handleUpdateLocation : handleCreateLocation}
        location={selectedLocation}
        isLoading={isSubmitting}
      />
    </div>
  )
}