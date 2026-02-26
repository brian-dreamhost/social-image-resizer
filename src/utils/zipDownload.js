import JSZip from 'jszip'

export async function downloadAllAsZip(canvases, baseName = 'social-images') {
  const zip = new JSZip()
  for (const { canvas, filename } of canvases) {
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.9))
    zip.file(filename, blob)
  }
  const zipBlob = await zip.generateAsync({ type: 'blob' })
  const url = URL.createObjectURL(zipBlob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${baseName}-all-sizes.zip`
  link.click()
  URL.revokeObjectURL(url)
}
