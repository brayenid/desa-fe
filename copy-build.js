/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs')
const path = require('path')

const pathsToCopy = [
  { src: 'public', dest: '.next/standalone/public' },
  { src: '.next/static', dest: '.next/standalone/.next/static' }
]

// Fungsi rekursif untuk menyalin folder dan file
function copyFolderSync(src, dest) {
  const srcPath = path.join(__dirname, src)
  const destPath = path.join(__dirname, dest)

  if (!fs.existsSync(srcPath)) {
    console.warn(`Warning: Source folder "${src}" does not exist. Skipping.`)
    return
  }

  if (!fs.existsSync(destPath)) {
    fs.mkdirSync(destPath, { recursive: true })
  }

  const entries = fs.readdirSync(srcPath, { withFileTypes: true })

  for (const entry of entries) {
    const entrySrc = path.join(srcPath, entry.name)
    const entryDest = path.join(destPath, entry.name)

    if (entry.isDirectory()) {
      copyFolderSync(entrySrc, entryDest)
    } else {
      fs.copyFileSync(entrySrc, entryDest)
    }
  }
}

// Eksekusi penyalinan untuk setiap path
pathsToCopy.forEach(({ src, dest }) => {
  try {
    copyFolderSync(src, dest)
    console.log(`Successfully copied "${src}" to "${dest}"`)
  } catch (err) {
    console.error(`Error copying "${src}" to "${dest}":`, err)
  }
})
