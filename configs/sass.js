const fs = require('fs')
const path = require('path')
const sass = require('node-sass')

let dir = path.join(__dirname, '../app/public/styles/sass/')
let out = path.join(__dirname, '../app/public/styles/css/')

let files = fs.readdirSync(dir)
for (const file of files) {
    let url = dir + file
    let cssUrl = out + file.replace('.sass', '.css')
    sass.render({
        file: url
    }, (error, result) => {
        if (error) throw error
        fs.writeFile(cssUrl, result.css, err => {
            if (err) throw err
        })
    })
}