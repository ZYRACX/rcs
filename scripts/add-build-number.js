const fs = require("fs")

const pkg = JSON.parse(fs.readFileSync("./package.json"))

const build = process.env.GITHUB_RUN_NUMBER || 0

pkg.version = pkg.version + "." + build

fs.writeFileSync("./package.json", JSON.stringify(pkg, null, 2))

console.log("New version:", pkg.version)