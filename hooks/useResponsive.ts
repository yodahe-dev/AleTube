"use client"

import { useEffect, useState } from "react"

export type DeviceType = "mobile" | "tablet" | "desktop"

export function useDeviceType(): DeviceType {
  const [device, setDevice] = useState<DeviceType>("desktop")

  useEffect(() => {
    const updateDevice = () => {
      const width = window.innerWidth
      if (width < 640) setDevice("mobile")
      else if (width < 1024) setDevice("tablet")
      else setDevice("desktop")
    }

    updateDevice()
    window.addEventListener("resize", updateDevice)
    return () => window.removeEventListener("resize", updateDevice)
  }, [])

  return device
}
