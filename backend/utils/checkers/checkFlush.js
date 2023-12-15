const checkFlush = (sorted) => {
    for (let i = 0; i < sorted.length-4; i++) {
        if(sorted[i].suit == sorted[i+1].suit) {
            if(sorted[i+1].suit == sorted[i+2].suit) {
                if(sorted[i+2].suit == sorted[i+3].suit) {
                    if(sorted[i+3].suit == sorted[i+4].suit) {
                            return {
                                found:1,
                                high:sorted[sorted.length-1],
                            }
                    }
                }
            }
        }
    }
    return {
        found:0,
    }
}

module.exports = { checkFlush };