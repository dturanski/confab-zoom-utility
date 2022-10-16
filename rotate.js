/*
 * Author: David Turanski
 */
// All confab members
const confab = [
    'David Turanski',
    'Becca Mudge',
    'Becky Birch',
    'Bob Lee',
    'Court Federle',
    'David Keehn',
    'Hank Seifert',
    'Indira Balkasoon',
    'Jim Holik',
    'Jim Oppenheim',
    'John Butler',
    'Paul Coen',
    'Paul Engleman',
    'Daniel Blank',
    'Margaret Manos',
    'Mark McCullough',
    'Peter Ory',
    'Seth Perlman',
    'Jim Simon',
    'Peter Strugatz',
    'Jim Cousins',
    'Debora Stern',
    'Nick Clapp',
    'Jim Ettore',
    'Chuck Savage',
    'Nancy Israel',
    'Tom Pastore']

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
    //console.log("num=" + num + " preferred=" + preferred_breakout_size + " max = " + max_breakout_size)
    let breakout_rooms = Math.floor(num / preferred_breakout_size)
    let r = num % preferred_breakout_size
    if (preferred_breakout_size - r == 1) {
        breakout_rooms = breakout_rooms + 1
    }

    while (Math.floor(num / breakout_rooms) > preferred_breakout_size) {
        breakout_rooms++
    }
    //console.log("breakout_rooms=" + breakout_rooms + ", r=" + r)
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

function assign(participants) {
    let allocation = breakout_room_allocation(participants.length)
    console.log("Allocation: " + allocation)
    console.log(participants)
    let unshuffled = [...Array(participants.length).keys()]

    assignments = {}
    for (let r = 0; r < rotations; r++) {
        rotation = {}
        let shuffled = shuffleArray(unshuffled)
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
//console.log(assign(confab))

