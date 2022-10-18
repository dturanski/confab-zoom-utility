/*
 * Author: David Turanski
 */
// The number of rotations (e.g., rotate every 15 minutes)
const rotations = 4
const preferred_breakout_size = 4
const min_breakout_size = 7

function shuffleArray(array) {
    return array.map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value)
}

/*
Ideal breakout size = 4, require even distribution  n, n+1, or n-1 per room
2 - 6 => 1 room
7 => (4, 3)  
8 => (4, 4)
9 => (4, 5)
10 => (4, 3, 3)
11 => (4, 4, 3)
12 => (4, 4, 4)
13 => (4, 4, 5)
14 (4, 5, 5)
15 => (4, 4, 4, 3)
16 => (4, 4, 4, 4)
17 => (4, 4, 4, 5)
18 => (4, 4, 5, 5)
19 => (4, 5, 5, 5)
21 => (4, 4, 4, 4, 5)
*/
function breakout_room_allocation(num) {
    let breakout_rooms = Math.floor(num / preferred_breakout_size)
    let r = num % preferred_breakout_size
    if (preferred_breakout_size - r == 1) {
        breakout_rooms = breakout_rooms + 1
    }

    while (Math.floor(num / breakout_rooms) > preferred_breakout_size) {
        breakout_rooms++
    }
    let allocation = new Array(breakout_rooms);
    let total = 0

    for (let i = 0; i < allocation.length; i++) {
        allocation[i] = preferred_breakout_size
        total = total + allocation[i]
    }

    for (let i = 0; i < allocation.length; i++) {
        if (total < num) {
            allocation[i]++
            total++
        } else if (total > num) {
            allocation[i]--
            total--
        }
    }
    return allocation

}

function interactions(assignments) {
    // How many interactions for each participant.
    let interactions = {}
    sessions = Object.keys(assignments)
    for (var s in sessions) {
        rooms = Object.keys(assignments[sessions[s]])
        for (var r in rooms) {
            let names = assignments[sessions[s]][rooms[r]]
            for (var i in names ) {
                let name = names[i]
                if (!interactions.hasOwnProperty(name)) {
                    interactions[name] = new Set([])
                } 

                for (other in names) {
                    if (name !== names[other]) {
                        interactions[name].add(names[other])
                    }

                }
            }
        }
    }
    keys = Object.keys(interactions)
    for (k in keys) {
        interactions[keys[k]] = Array.from( interactions[keys[k]])
    }
    return interactions
}

function interactions_score(interacions) {
    let names = Object.keys(interacions)
    let max_interactions = 0
    let min_interactions = names.length
    let range = 0
    let total_interactions = 0;
    const interactions_weight = 80.0
    const range_weight = 20.0
    
    for (var i=0; i < names.length; i++) {
        let num_interactions = interacions[names[i]].length
        total_interactions += num_interactions
        max_interactions = Math.max(max_interactions, num_interactions)
        min_interactions = Math.min(min_interactions, num_interactions)
    }
    range = max_interactions - min_interactions
    let score = 0
    if (range == 0 && total_interactions == names.length * (names.length - 1)) {
        score = Infinity
    } else {
       score = (interactions_weight*total_interactions)/(range_weight*(range + 1))
    }   
    console.log("total interactions = " + total_interactions +  " range = " + range + " max = " + max_interactions + "  min = " + min_interactions + " score = " + score)
    return score
}

function assign_random(participants, allocation) {
    assignments = {}
    for (let r = 0; r < rotations; r++) {
        rotation = {}
        let shuffled = shuffleArray([...Array(participants.length).keys()])
        let j = 0
        for (let i = 0; i < allocation.length; i++) {
            let breakout = shuffled.slice(j, j + allocation[i])
            j += allocation[i]
            rotation["Breakout room " + (i+1)]= breakout.map(function (index) {
                return participants[index]
            })
        }
        assignments["Session " + (r+1)] = rotation
    }
    return assignments
}

/*
Call assign_random up to 1000 times and take the maximum score. 
*/
function assign(participants) {
    let allocation = breakout_room_allocation(participants.length)
    const best_score = Infinity
    const ITERATIONS = 1000
    let max_score = 0;
    let iter = 0
    let optimal_assigments = {}
    while (iter < ITERATIONS && max_score < best_score ){
        let assignments =  assign_random(participants, allocation)
        let score = interactions_score(interactions(assignments))
        max_score = Math.max(score, max_score)
        if (score == max_score) {
            console.log("max score = " + max_score)
            optimal_assigments = assignments
        }
        iter++
    }
    console.log("iter:" + iter + " max: " + max_score + " best: " + best_score)
    //TODO: This is onlyuseful for debugging
    interactions_score(interactions(optimal_assigments))
    return optimal_assigments
}