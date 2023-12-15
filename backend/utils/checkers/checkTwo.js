const checkTwo = (sorted) => {
    console.log(sorted);
    
    for (let i = 0; i < sorted.length-1; i++) { 
        if (sorted[i].value == sorted[i+1].value) {
            console.log("Found Pair!!!!!!");
        }
      }

    return{

    }
}

module.exports = { checkTwo };