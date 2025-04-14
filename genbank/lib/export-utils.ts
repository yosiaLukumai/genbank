/**
 * Utility functions for exporting data in different formats
 */

/**
 * Export data to CSV format and trigger download
 */
export function exportToCSV(data: any[], filename: string) {
  if (!data || !data.length) {
    console.warn("No data to export")
    return
  }

  // Get headers from the first item
  const headers = Object.keys(data[0])

  // Create CSV content
  const csvContent = [
    // Headers row
    headers.join(","),
    // Data rows
    ...data.map((item) =>
      headers
        .map((header) => {
          // Handle special cases for CSV formatting
          const value = item[header]

          // If value contains commas, quotes, or newlines, wrap in quotes
          if (typeof value === "string" && (value.includes(",") || value.includes('"') || value.includes("\n"))) {
            return `"${value.replace(/"/g, '""')}"`
          }

          return value
        })
        .join(","),
    ),
  ].join("\n")

  // Create and trigger download
  downloadFile(csvContent, `${filename}.csv`, "text/csv")
}

/**
 * Export data to JSON format and trigger download
 */
export function exportToJSON(data: any[], filename: string) {
  if (!data || !data.length) {
    console.warn("No data to export")
    return
  }

  const jsonContent = JSON.stringify(data, null, 2)

  // Create and trigger download
  downloadFile(jsonContent, `${filename}.json`, "application/json")
}

/**
 * Helper function to trigger file download
 */
function downloadFile(content: string, filename: string, contentType: string) {
  const blob = new Blob([content], { type: contentType })
  const url = URL.createObjectURL(blob)

  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()

  // Clean up
  setTimeout(() => {
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, 100)
}
