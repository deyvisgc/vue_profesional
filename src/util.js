const countProperties = (obj) => {
    if (typeof obj === 'object') {
        return Object.keys(obj).length
    } else {
        return 0
    }
}
export default countProperties