const checkRoyal = (sorted) => {
    for (let i = 0; i < sorted.length-4; i++) {
        if (sorted[i].value == 9 
            && sorted[i].suit == sorted[i+1].suit
            && sorted[i+1].value == 10
            && sorted[i+1].suit == sorted[i+2].suit
            && sorted[i+2].value == 11
            && sorted[i+2].suit == sorted[i+3].suit
            && sorted[i+3].value == 12
            && sorted[i+3].suit == sorted[i+4].suit
            && sorted[i+4].value == 13
            ) {
                console.log("Found Royal Flush!!!!!!");
                return {
                    found: 1,
                }
        }
    }
    return {
        found: 0,
    }
}

module.exports = { checkRoyal };