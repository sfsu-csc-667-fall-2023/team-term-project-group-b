const checkTwoPair = (sorted) => {
    for (let i = 0; i < sorted.length-1; i++) {
        if (sorted[i].value == sorted[i+1].value) {
            for (let x = i+2; x < sorted.length-1; x++) {
                if (sorted[x].value == sorted[x+1].value) {
                    return {
                        found: 1,
                        pair1Rank: sorted[i].value,
                        pair2Rank: sorted[x].value,
                        //highCard: sorted[sorted.length-1].value,
                    }
                }
            }
        }
    }
    return {
        found: 0,
    }
}

module.exports = { checkTwoPair };