const checkTwo = (sorted) => {
    for (let i = 0; i < sorted.length-1; i++) { 
        if (sorted[i].value == sorted[i+1].value) {
            if (sorted[sorted.length-1].value != sorted[i].value) {
                return {
                    found: 1,
                    rank: sorted[i].value,
                    high: sorted[sorted.length-1].value,
                }
            } else if (sorted[sorted.length-1].value == sorted[i].value) {
                return {
                    found: 1,
                    rank: sorted[i].value,
                    high: sorted[sorted.length-3].value,
                }
            }
        }
      }
    return {
        found: 0,
    }
}

module.exports = { checkTwo };