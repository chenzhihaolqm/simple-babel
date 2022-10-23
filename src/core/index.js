const parser = require('../parser')
const traverse = require('../traverse')


function transformSync(code, options) {
   const ast = parser.parse(code)
   console.log('ast', ast)
   const vistors = {}
   options.plugins && options.plugins.forEach(plugin => {
      Object.assign(vistors, plugin())
   })
   traverse(ast, vistors)
}
const code = `const a = 1, b =2;
const c = a + b;
alert(1)
`
const plugins = [
    function() {
        return {
            VariableDeclarator: function(path){
                console.log(path.node)
            },
            BinaryExpression: function(path) {
                console.log('BinaryExpression, left', path.node.left)
            }
        }
    },
    function() {
        return {
            CallExpression: function(path) {
                if(path.node.callee.name === 'alert') {
                    path.remove()
                }
            }
        }
    },
    function(api, options) {
        return {
            Program: function(path) {
                const bindings = path.scode.bindings
                Object.entries(bindings).forEach(([id, binding]) => {
                    if(binding.referenced){
                        path.remove()
                    }
                })
                debugger
            }
        }
    }
]
transformSync(code, {
    plugins: plugins
})

module.exports = {
    transformSync
}