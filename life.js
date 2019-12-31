console.log('Welcome to life')

const totalCells = 10000
const colNumber = 100
const rowNumber = 100

const aliveCells = [
    3007, 3008,
    3107, 3108,
    
    2717,
    2817, 2818, 2819, 2820,
    2918, 2919, 2920, 2921,
    3018, 3021,
    3118, 3119, 3120, 3121,
    3217, 3218, 3219, 3220,
    3317,
    
    2932, 2933,
    3031, 3033,
    3130, 3131, 3132,
    3229, 3230, 3231,
    3330, 3331, 3332,
    3431, 3433,
    3532, 3533,
    
    3141, 3142,
    3241, 3242
]
let cells = [...Array(totalCells).keys()].map(x => aliveCells.includes(x))
const main = document.getElementById('main')

/**
* Rows and cells creation and insertion in the DOM.
*/
const init = () => {
	// Rows creation and insertion
	for (r = 0; r < rowNumber; r++) {
		const row = document.createElement('tr')
		row.className = 'row'
		main.appendChild(row)
		
		// Cells creation and insertion
		for (c = 0; c < colNumber; c++) {
			const cell = document.createElement('td')
			const cellIdx = rowNumber * r + c
			setCellDisplay(cell, cells[cellIdx])
			cell.onclick = toggleCell(cell, cellIdx)
			cell.onmouseover = toggleCell(cell, cellIdx)
			row.appendChild(cell)
		}
	}
}

/**
* Main function.
* Compute the next cells generation, and toggle their state in the DOM
*/
const life = (keepState) => {
	const nextGen = cells.map((cellState, cellIdx) => {
		const row = main.childNodes.item(getRow(cellIdx) + 2)
		const cell = row.childNodes.item(getCol(cellIdx))
		let isAlive
		if (!keepState)	isAlive = cellState ? resolveAlive(cellIdx) : resolveDead(cellIdx)
		else isAlive = cellState
	
		setCellDisplay(cell, isAlive)
		return isAlive
	})
	cells = nextGen
}

/**
* Return if the alive cell at the given index is alive at the next gen
*/
const resolveAlive = cellIdx => {
	return [2, 3].includes(getSiblingsAlive(cellIdx))
}

/**
* Return if the dead cell at the given index is alive at the next gen
*/
const resolveDead = cellIdx => {
	return 3 === getSiblingsAlive(cellIdx)
}

/**
* Return the number of alive siblings cells of the one at the given index
*/
const getSiblingsAlive = cellIdx => {
	// Top and bottom sibligs
	const siblings = [
		cells[cellIdx - colNumber],
		cells[cellIdx + colNumber]
	]
	// left col siblings
	if (getCol(cellIdx) !== 0) {
		siblings.push(cells[cellIdx - colNumber - 1])
		siblings.push(cells[cellIdx - 1])
		siblings.push(cells[cellIdx + colNumber - 1])
	}
	// Right col siblings
	if (getCol(cellIdx) !== (colNumber - 1)) {
		siblings.push(cells[cellIdx - colNumber + 1])
		siblings.push(cells[cellIdx + 1])
		siblings.push(cells[cellIdx + colNumber + 1])
	}
	return siblings.reduce((acc, c) => c ? ++acc : acc, 0)
}

/**
* Return the row of the cell at the given index. Start at 0.
*/
const getRow = (cellIdx) => Math.floor(cellIdx / 100)

/**
* Return the column of the cell at the given index. Start at 0.
*/
const getCol = (cellIdx) => cellIdx % 100

/**
* Toggle the cell State.
* It deals with the data and the display.
*/
const toggleCell = (cell, cellIdx) => (event) => {
	if (event.type === 'click' || (event.type === 'mouseover' && event.buttons === 1)) {
		cells[cellIdx] = !cells[cellIdx]
		setCellDisplay(cell, cells[cellIdx])
	}
}

/**
* Return an array containing the index of the alive cells.
*/
const getAliveCells = () => cells.reduce((acc, c, i) => c ? [...acc, i] : acc, [])

/**
* Set the display of the cell, given its state
*/
const setCellDisplay = (cell, alive) => alive ? cell.className = 'cell alive' : cell.className = 'cell'

/**
* Reset the table to initial state
*/
const reset = () => {
	cells = [...Array(totalCells).keys()].map(x => aliveCells.includes(x))
	life(true)
}
/**
* Utilities
*/
let speed = 200
const speedUp = () => restart(Math.max(1, speed - 50))
const slowDown = () => restart(speed + 50)
let intervalIds = []
const start = () => !intervalIds.length && intervalIds.push(window.setInterval(life, speed))
const stop = () => {
    intervalIds.forEach((id) => window.clearInterval(id))
    intervalIds = []
}
const restart = sleep => {
    speed = sleep
    if (intervalIds.length) {
        stop()
        start()
    }
}
init()