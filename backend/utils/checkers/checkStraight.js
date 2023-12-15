const checkStraight = (sorted) => {
    for (let i = 0; i < sorted.length-4; i++) {
        if (sorted[i].value == sorted[i+1].value-1
            && sorted[i+1].value == sorted[i+2].value-1
            && sorted[i+2].value == sorted[i+3].value-1
            && sorted[i+3].value == sorted[i+4].value-1){
                return {
                    found: 1,
                }
            }
    }
    return {
        found: 0,
    }
}

module.exports = { checkStraight };