const checkFour = (sorted) => {
    for (let i = 0; i < sorted.length-3; i++) { 
        if (sorted[i].value == sorted[i+1].value) {
            if(sorted[i+1].value == sorted[i+2].value) {
                if(sorted[i+2].value == sorted[i+3].value) {
                    if(sorted[sorted.length-1].value != sorted[i].value) {
                        return {
                            found: 1,
                            Rank: sorted[i].value,
                            highCard: sorted[sorted.length-1].value,
                        }
                    }
                    if(sorted[sorted.length-1].value == sorted[i].value) {
                        return {
                            found: 1,
                            Rank: sorted[i].value,
                            highCard: sorted[sorted.length-5].value,
                        }
                    }
                }
            }
        }
      }
    return {
        found: 0,
    }
}

module.exports = { checkFour };