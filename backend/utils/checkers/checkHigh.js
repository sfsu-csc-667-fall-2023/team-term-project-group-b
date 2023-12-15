const checkHigh = (sorted) => {
    return{
        found:1,
        high:sorted[sorted.length-1],
        rank:sorted[sorted.length-1],
    }
}

module.exports = { checkHigh };