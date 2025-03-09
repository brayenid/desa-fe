/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs')
const path = require('path')

const pathsToCopy = [
  { src: 'public', dest: '.next/standalone/public' },
  { src: '.next/static', dest: '.next/standalone/.next/static' }
]

// Fungsi rekursif untuk menyalin folder dan file dengan logging
function copyFolderSync(src, dest) {
  if (!fs.existsSync(src)) {
    console.warn(`Warning: Source folder "${src}" does not exist. Skipping.`)
    return
  }

  // Buat folder tujuan jika belum ada
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true })
  }

  // Baca isi folder
  const entries = fs.readdirSync(src, { withFileTypes: true })

  entries.forEach((entry) => {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)

    if (entry.isDirectory()) {
      copyFolderSync(srcPath, destPath) // Rekursif untuk folder
    } else {
      try {
        fs.copyFileSync(srcPath, destPath) // Salin file
        console.log(`Copied file: ${srcPath} → ${destPath}`)
      } catch (err) {
        console.error(`Error copying file "${srcPath}" → "${destPath}":`, err)
      }
    }
  })
}

// Jalankan penyalinan untuk setiap path yang diberikan
pathsToCopy.forEach(({ src, dest }) => {
  try {
    console.log(`Copying "${src}" to "${dest}"...`)
    copyFolderSync(path.resolve(__dirname, src), path.resolve(__dirname, dest))
    console.log(`Successfully copied "${src}" to "${dest}"`)
  } catch (err) {
    console.error(`Error copying "${src}" to "${dest}":`, err)
  }
})
