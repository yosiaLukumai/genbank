// This is a mock data file that would be replaced with actual API calls in a real application

// Generate realistic time-series data
function generateTimeSeriesData(
  timeRange: string,
  baseTemp: number,
  baseHumidity: number,
  variance = 2,
  isFridge = false,
) {
  const now = new Date()
  const data = []
  let points = 24 // Default for 24h
  let interval = 60 // minutes

  if (timeRange === "7d") {
    points = 7 * 24
    interval = 60 * 24 // daily
  } else if (timeRange === "30d") {
    points = 30
    interval = 60 * 24 // daily
  }

  for (let i = points - 1; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * interval * 60 * 1000)

    // Add some randomness to the data
    const tempVariance = (Math.random() - 0.5) * variance
    const humidityVariance = (Math.random() - 0.5) * variance * 2

    // For fridges, we want to simulate occasional temperature spikes
    const temperature = baseTemp + tempVariance
    let humidity = baseHumidity + humidityVariance

    // Ensure humidity stays within realistic bounds
    humidity = Math.max(5, Math.min(95, humidity))

    // Format time based on timeRange
    let time
    if (timeRange === "24h") {
      time = timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else {
      time = timestamp.toLocaleDateString([], { month: "short", day: "numeric" })
    }

    data.push({
      time,
      timestamp: timestamp.getTime(),
      temperature: Number(temperature.toFixed(1)),
      humidity: Number(humidity.toFixed(1)),
    })
  }

  return data
}

// Determine status based on thresholds
function determineStatus(value: number, min: number, max: number) {
  if (value < min - 2 || value > max + 2) {
    return "critical"
  } else if (value < min || value > max) {
    return "warning"
  }
  return "normal"
}

// Mock room data
export async function getRoomData(timeRange = "24h") {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const baseTemp = 22
  const baseHumidity = 45
  const history = generateTimeSeriesData(timeRange, baseTemp, baseHumidity)

  // Get the latest values (last item in the array)
  const latest = history[history.length - 1]

  // Determine status
  const tempStatus = determineStatus(latest.temperature, 18, 26)
  const humidityStatus = determineStatus(latest.humidity, 30, 60)

  // Overall status is the worst of the two
  const status =
    tempStatus === "critical" || humidityStatus === "critical"
      ? "critical"
      : tempStatus === "warning" || humidityStatus === "warning"
        ? "warning"
        : "normal"

  return {
    id: "room-main",
    name: "Main Coldroom",
    temperature: latest.temperature,
    humidity: latest.humidity,
    status,
    history,
    thresholds: {
      temperature: { min: 18, max: 26 },
      humidity: { min: 30, max: 60 },
    },
  }
}

// Mock fridges data
export async function getFridges(timeRange = "24h") {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return [
    {
      id: "fridge-1",
      name: "Main Storage Fridge",
      temperature: -17.2,
      humidity: 10.5,
      status: "normal",
      lastUpdated: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      thresholds: {
        temperature: { min: -20, max: -15 },
        humidity: { min: 5, max: 15 },
      },
      history: generateTimeSeriesData(timeRange, -17, 10, 1, true),
    },
    {
      id: "fridge-2",
      name: "Backup Storage",
      temperature: -18.4,
      humidity: 12.1,
      status: "normal",
      lastUpdated: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      thresholds: {
        temperature: { min: -20, max: -16 },
        humidity: { min: 8, max: 15 },
      },
      history: generateTimeSeriesData(timeRange, -18, 12, 0.8, true),
    },
    {
      id: "fridge-3",
      name: "Research Samples",
      temperature: -15.3,
      humidity: 15.7,
      status: "warning",
      lastUpdated: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      thresholds: {
        temperature: { min: -18, max: -14 },
        humidity: { min: 10, max: 15 },
      },
      history: generateTimeSeriesData(timeRange, -15, 15, 1.5, true),
    },
    {
      id: "fridge-4",
      name: "Long-term Storage",
      temperature: -22.1,
      humidity: 8.3,
      status: "critical",
      lastUpdated: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      thresholds: {
        temperature: { min: -20, max: -18 },
        humidity: { min: 10, max: 12 },
      },
      history: generateTimeSeriesData(timeRange, -22, 8, 1.2, true),
    },
  ].map((fridge) => {
    // Get the latest values
    const latest = fridge.history[fridge.history.length - 1]

    // Update current values with the latest from history
    fridge.temperature = latest.temperature
    fridge.humidity = latest.humidity

    // Determine status based on thresholds
    const tempStatus = determineStatus(
      latest.temperature,
      fridge.thresholds.temperature.min,
      fridge.thresholds.temperature.max,
    )

    const humidityStatus = determineStatus(
      latest.humidity,
      fridge.thresholds.humidity.min,
      fridge.thresholds.humidity.max,
    )

    // Overall status is the worst of the two
    fridge.status =
      tempStatus === "critical" || humidityStatus === "critical"
        ? "critical"
        : tempStatus === "warning" || humidityStatus === "warning"
          ? "warning"
          : "normal"

    return fridge
  })
}

// Mock users data
export async function getUsers() {
  // Simulate network delay



  return [
    {
      id: "user-1",
      name: "John Doe",
      email: "john@example.com",
      role: "admin",
      avatar: "/green-tractor-field.png",
    },
    {
      id: "user-2",
      name: "Jane Smith",
      email: "jane@example.com",
      role: "user",
      avatar: "/javascript-code-abstract.png",
    },
    {
      id: "user-3",
      name: "Bob Johnson",
      email: "bob@example.com",
      role: "viewer",
      avatar: "/abstract-geometric-bj.png",
    },
  ]
}

// Mock current user
export async function getCurrentUser() {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return {
    id: "user-1",
    name: "John Doe",
    email: "john@example.com",
    role: "admin",
    avatar: "/green-tractor-field.png",
    bio: "Seed bank administrator with 5+ years of experience in agricultural preservation and coldroom management. Passionate about biodiversity and sustainable farming practices.",
  }
}

// Simplified getLogs function with combined room and fridge data
export async function getLogs() {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const fridges = await getFridges()
  const roomData = await getRoomData()
  const now = new Date()
  const logs = []

  // Generate a smaller dataset to reduce complexity
  for (let i = 0; i < 20; i++) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)

    // Generate 2 log entries per day
    for (let h = 0; h < 2; h++) {
      const logTime = new Date(date.getTime() + h * 12 * 60 * 60 * 1000)

      // Room data
      const roomTemp = roomData.temperature + (Math.random() - 0.5) * 2
      const roomHumidity = roomData.humidity + (Math.random() - 0.5) * 5

      // Add one log per fridge
      fridges.forEach((fridge) => {
        const fridgeTemp = fridge.temperature + (Math.random() - 0.5) * 1
        const fridgeHumidity = fridge.humidity + (Math.random() - 0.5) * 2

        // Determine status
        const status = Math.random() > 0.8 ? "warning" : Math.random() > 0.95 ? "critical" : "normal"

        logs.push({
          id: `log-${fridge.id}-${logTime.getTime()}`,
          timestamp: logTime.toISOString().replace("T", " ").substring(0, 19),
          fridgeId: fridge.id,
          fridgeName: fridge.name,
          roomTemperature: Number(roomTemp.toFixed(1)),
          roomHumidity: Number(roomHumidity.toFixed(1)),
          fridgeTemperature: Number(fridgeTemp.toFixed(1)),
          fridgeHumidity: Number(fridgeHumidity.toFixed(1)),
          status,
        })
      })
    }
  }

  return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}
