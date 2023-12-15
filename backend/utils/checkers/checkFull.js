const checkFull = (sorted) => {
    for (let i = 0; i < sorted.length-4; i++) {     //maybe different length
        if(sorted[i].value == sorted[i+1].value) {
            if(sorted[i+1].value == sorted[i+2].value) {
                for (let x = i+3; x < sorted.length-1; x++) {
                    if(sorted[x].value == sorted[x+1].value) {
                        return {
                            found: 1,
                            //pair1Rank: sorted[i].value,
                            //pair2Rank: sorted[x].value,
                            //highCard: sorted[sorted.length-1].value,
                        }
                    }
                }
            } else {
                for (let x = i+2; x < sorted.length-2; x++) {
                    if(sorted[x].value == sorted[x+1].value) {
                        if(sorted[x+1].value == sorted[x+2].value) {
                            console.log("found full house");
                            return {
                                found: 1,
                                //pair1Rank: sorted[i].value,
                                //pair2Rank: sorted[x].value,
                                //highCard: sorted[sorted.length-1].value,
                            }
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

module.exports = { checkFull };