/*
Order files:

from: tree /tmp/downloads
/tmp/downloads
├── doc.txt
├── img.png
├── math.xlsx
├── note.txt

to: tree /tmp/downloads_organized
├── png
│	└── img.png
├── txt
│	├── doc.txt
│	└── note.txt
└── xlsx
	└── math.xlsx
*/

const fs = require('fs')
const path = require('path')

const originPath = "/tmp/downloads"
const destinyPath = "/tmp/downloads_organized"

function getAllFiles(dirPath, recursive = false, files = []) {
	var items = (fs.readdirSync(dirPath, { withFileTypes: true }))
	for (const item of items) {
		if (!item.isFile() && recursive) {
			getAllFiles(path.join(item.parentPath, item.name), recursive, files)
		} else {
			files.push(item)
		}
	}
	return files.map(file => {
		return {
			name: file.name,
			path: file.path	
		}
	})
}


function organizeFiles() {
	console.log("\nOrganizing files:\n")
	if (fs.existsSync(destinyPath)) {
		fs.rmSync(destinyPath, { recursive: true })
		console.log(`Directory ${destinyPath} removed`)
	}
	fs.mkdirSync(destinyPath, { recursive: true })
	console.log(`Directory ${destinyPath} created`)

	const files = getAllFiles(originPath, true)
	for (const item of files) {
		const fileExtension = path.extname(item.name).slice(1)
		const fileOrigin = path.join(originPath, item.name)
		const fileDirDestiny = path.join(destinyPath, fileExtension)
		const fileDestiny = path.join(fileDirDestiny, item.name)
		fs.mkdirSync(fileDirDestiny, { recursive: true })
		fs.renameSync(fileOrigin, fileDestiny)
		console.log(`File ${fileOrigin} successfully moved to ${fileDestiny}`)
	}

	console.log(getAllFiles(destinyPath, true))
}

function createFiles() {
	console.log("\nCreating temp files:\n")
	const fileNames = [
		"doc.txt",
		"img.png",
		"math.xlsx",
		"note.txt",
	]
	if (fs.existsSync(originPath)) {
		fs.rmSync(originPath, { recursive: true })
		console.log(`Directory ${originPath} removed`)
	}
	fs.mkdirSync(originPath, { recursive: true })
	console.log(`Directory ${originPath} created`)

	for (const item of fileNames) {
		const fileFullPath = path.join(originPath, item)
		fs.writeFileSync(fileFullPath, "")
		console.log(`Creating file ${fileFullPath}`)
	}
	console.log(getAllFiles(originPath, true))
}

createFiles()
organizeFiles()
