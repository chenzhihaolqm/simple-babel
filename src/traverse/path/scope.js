class Binding{
    constructor(id, path) {
       this.id = id 
       this.path = path
       this.referenced = false
       this.referencePaht = []
    }
}
class Scope {
    constructor(parentScope, path) {
        this.parent = parentScope
        this.path = path
        this.bindings = {}
        path.traverse({
            VariableDeclarator: (childPath) => {
               const id = childPath.node.id.name
               const binding = new Binding(id, childPath)
               this.registerBindings(id, binding)
            },
            FunctionDeclarator(childPath) {

            }
        })
        path.traverse({
            Identifier: (childPath) => {
                const id = childPath.node.name
                const binding = this.getBinding(id)
                if(binding && !childPath.findParent(function(p) { return p.isVariableDeclarator() })) {
                    binding.referenced = true
                    binding.referencePaht.push(childPath)
                }
                
            }
        })
    }
    getBinding(id) {
        return this.bindings[id] || (this.parent && this.parent.getBinding(id))
    }
    registerBindings(id, binding) {
      this.bindings[id] = binding
    }
}
module.exports = Scope