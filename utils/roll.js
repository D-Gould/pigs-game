const roll = () => {
    let pigOptions = [{name: "Razorback", points: 5}, {name: "Trotter", points: 5}, {name: "Snouter", points: 10}, {name: "Leaning Jowler", points: 15}, {name: "Dot Side", points: 0}, {name: "Plan side", points: 0}]
    const pig1Index = Math.floor((Math.random() * 6))
    const pig2Index = Math.floor((Math.random() * 6))
    console.log(pig1Index, pig2Index)
    const pig1 = pigOptions[pig1Index]
    const pig2 = pigOptions[pig2Index]
    return {type: "roll", pig1: pig1, pig2: pig2, score: pig1.points + pig2.points}
}

module.exports = roll;