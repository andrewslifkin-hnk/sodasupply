"use client"

import { useUrlParameters, updateUrlParameters, getUrlWithParameters, useAdminPanel } from "@/hooks/use-url-parameters"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Copy, Eye, EyeOff, X } from "lucide-react"

export function AdminPanel() {
  const params = useUrlParameters()
  const isAdminVisible = useAdminPanel()

  const copyUrl = (paramUpdates: Partial<typeof params>) => {
    const url = getUrlWithParameters(paramUpdates)
    navigator.clipboard.writeText(url)
  }

  const closeAdmin = () => {
    updateUrlParameters({ admin_panel: false })
  }

  const presetConfigs = {
    default: {},
    noSelectors: { store_selector: false, distributor_selector: false },
    onlyStore: { distributor_selector: false, promo_banner: false },
    onlyDistributor: { store_selector: false, promo_banner: false },
    minimal: { store_selector: false, distributor_selector: false, promo_banner: false, search_overlay: false },
  }

  // Only render when admin_panel=true in URL
  if (!isAdminVisible) {
    return null
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 z-50 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-sm font-medium">Feature Controls</CardTitle>
          <CardDescription className="text-xs">URL Parameter Management</CardDescription>
        </div>
        <Button
          onClick={closeAdmin}
          variant="ghost"
          size="sm"
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Individual Controls */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="store-selector" className="text-sm">Store Selector</Label>
            <Switch
              id="store-selector"
              checked={params.store_selector}
              onCheckedChange={(checked) => updateUrlParameters({ store_selector: checked })}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="distributor-selector" className="text-sm">Distributor Selector</Label>
            <Switch
              id="distributor-selector"
              checked={params.distributor_selector}
              onCheckedChange={(checked) => updateUrlParameters({ distributor_selector: checked })}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="promo-banner" className="text-sm">Promo Banner</Label>
            <Switch
              id="promo-banner"
              checked={params.promo_banner}
              onCheckedChange={(checked) => updateUrlParameters({ promo_banner: checked })}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="search-overlay" className="text-sm">Search Overlay</Label>
            <Switch
              id="search-overlay"
              checked={params.search_overlay}
              onCheckedChange={(checked) => updateUrlParameters({ search_overlay: checked })}
            />
          </div>
        </div>

        {/* Preset Configurations */}
        <div className="border-t pt-3">
          <h4 className="text-sm font-medium mb-2">Quick Presets</h4>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateUrlParameters(presetConfigs.default)}
              className="text-xs"
            >
              Default
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateUrlParameters(presetConfigs.noSelectors)}
              className="text-xs"
            >
              No Selectors
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateUrlParameters(presetConfigs.onlyStore)}
              className="text-xs"
            >
              Store Only
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateUrlParameters(presetConfigs.minimal)}
              className="text-xs"
            >
              Minimal
            </Button>
          </div>
        </div>

        {/* URL Generation */}
        <div className="border-t pt-3">
          <h4 className="text-sm font-medium mb-2">Generate URLs</h4>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyUrl(presetConfigs.noSelectors)}
              className="text-xs flex-1"
            >
              <Copy className="h-3 w-3 mr-1" />
              No Selectors
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyUrl(params)}
              className="text-xs flex-1"
            >
              <Copy className="h-3 w-3 mr-1" />
              Current
            </Button>
          </div>
        </div>

        {/* Current State */}
        <div className="border-t pt-3">
          <h4 className="text-sm font-medium mb-1">Current State</h4>
          <div className="text-xs space-y-1 font-mono bg-gray-50 p-2 rounded">
            <div>store: {params.store_selector.toString()}</div>
            <div>distributor: {params.distributor_selector.toString()}</div>
            <div>promo: {params.promo_banner.toString()}</div>
            <div>search: {params.search_overlay.toString()}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 