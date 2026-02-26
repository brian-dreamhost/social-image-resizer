export async function resizeImage(imageElement, targetWidth, targetHeight, mode = 'crop') {
  const canvas = document.createElement('canvas')
  canvas.width = targetWidth
  canvas.height = targetHeight
  const ctx = canvas.getContext('2d')

  if (mode === 'crop') {
    // Cover: scale to fill, crop center
    const scale = Math.max(targetWidth / imageElement.naturalWidth, targetHeight / imageElement.naturalHeight)
    const scaledW = imageElement.naturalWidth * scale
    const scaledH = imageElement.naturalHeight * scale
    const offsetX = (scaledW - targetWidth) / 2
    const offsetY = (scaledH - targetHeight) / 2
    ctx.drawImage(imageElement, -offsetX, -offsetY, scaledW, scaledH)
  } else {
    // Contain: scale to fit, letterbox with black
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, targetWidth, targetHeight)
    const scale = Math.min(targetWidth / imageElement.naturalWidth, targetHeight / imageElement.naturalHeight)
    const scaledW = imageElement.naturalWidth * scale
    const scaledH = imageElement.naturalHeight * scale
    const offsetX = (targetWidth - scaledW) / 2
    const offsetY = (targetHeight - scaledH) / 2
    ctx.drawImage(imageElement, offsetX, offsetY, scaledW, scaledH)
  }

  return canvas
}

export async function canvasToBlob(canvas, quality = 0.9) {
  return new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', quality))
}

export function downloadCanvas(canvas, filename) {
  const link = document.createElement('a')
  link.download = filename
  link.href = canvas.toDataURL('image/jpeg', 0.9)
  link.click()
}
