const acorn = require('acorn')

function parse(code) {
    const Parser = acorn.Parser
    return Parser.parse(code, {
        locations: true
    })
}

module.exports = {
   parse
}

