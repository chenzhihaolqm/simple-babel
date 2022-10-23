const types = require('../types')
const NodePath = require('./path/nodePath.js')

module.exports = function traverse(node, vistors = {}, parent, parentPath ,key, listKey) {
   const type = node.type
   const defination = types.vistorKeys.get(type) || {}
   let visitorFun = vistors[type] || {}
   if(typeof visitorFun === 'function') {
      visitorFun = {
        enter: visitorFun
      }
   }
   const path = new NodePath(node, parent, parentPath, key, listKey)
   visitorFun.enter && visitorFun.enter(path)
   const keys = defination.vistors || []
   keys.forEach((key, index) => {
    const prop = node[key]
    if(Array.isArray(prop)) {
       prop.forEach((childNode) => {
         traverse(childNode, vistors, node, path, key, index)
       })
    }else {
        traverse(prop, vistors, node, path, key)
    }
   })
   visitorFun.exit && visitorFun.exit(path)
}