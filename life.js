console.log('Welcome to life')

const aliveCells = [/*4643,4644,4645,4647,4648,4649,4742,4746,4750,4842,4850,4943,4949,5044,5048,5145,5147,5246*/]

var app = new Vue({
	el: '#app',
	data: {
		cells: [...Array(this.totalCells).keys()].map(x => aliveCells.includes(x)),
		colNumber: 100,
		intervalIds: [],
		rowNumber: 100,
		speed: 200,
		totalCells: 10000,
	},
	methods: {
		/**
		* Return the column of the cell at the given index. Start at 0.
		*/
		cellIdx: function (row, col) {
			return this.rowNumber * row + col
		},
		/**
		* Return the row of the cell at the given index. Start at 0.
		*/
		getRow: function (cellIdx) {
			return Math.floor(cellIdx / 100)
		},
		/**
		* Return the column of the cell at the given index. Start at 0.
		*/
		getCol: function (cellIdx) {
			return cellIdx % 100
		},
		/**
		* Return the number of alive siblings cells of the one at the given index
		*/
		getSiblingsAlive: function (cellIdx) {
			// Top and bottom sibligs
			const siblings = [
				this.cells[cellIdx - this.colNumber],
				this.cells[cellIdx + this.colNumber]
			]
			// left col siblings
			if (this.getCol(cellIdx) !== 0) {
				siblings.push(this.cells[cellIdx - this.colNumber - 1])
				siblings.push(this.cells[cellIdx - 1])
				siblings.push(this.cells[cellIdx + this.colNumber - 1])
			}
			// Right col siblings
			if (this.getCol(cellIdx) !== (this.colNumber - 1)) {
				siblings.push(this.cells[cellIdx - this.colNumber + 1])
				siblings.push(this.cells[cellIdx + 1])
				siblings.push(this.cells[cellIdx + this.colNumber + 1])
			}
			return siblings.reduce((acc, c) => c ? ++acc : acc, 0)
		},
		/**
		* Main function.
		* Compute the next cells generation, and toggle their state in the DOM
		*/
		life: function (keepState) {
			const nextGen = this.cells.map((cellState, cellIdx) => {
				let isAlive
				if (!keepState) isAlive = cellState ? this.resolveAlive(cellIdx) : this.resolveDead(cellIdx)
				else isAlive = cellState

				//setCellDisplay(cell, isAlive)
				return isAlive
			})
			this.cells = nextGen
		},
		/**
		* Reset the table to initial state
		*/
		reset: function () {
			this.cells = [...Array(this.totalCells).keys()].map(x => aliveCells.includes(x))
			this.life(true)
		},
		/**
		* Return if the alive cell at the given index is alive at the next gen
		*/
		resolveAlive: function (cellIdx) {
			return [2, 3].includes(this.getSiblingsAlive(cellIdx))
		},
		/**
		* Return if the dead cell at the given index is alive at the next gen
		*/
		resolveDead: function (cellIdx) {
			return 3 === this.getSiblingsAlive(cellIdx)
		},
		/**
		* Set the display of the cell, given its state
		*/
		// setCellDisplay: function (cell, alive) {
		// 	alive ? cell.className = 'cell alive' : cell.className = 'cell'
		// },
		slowDown: function () {
			this.speed = this.speed + 50
		},
		speedUp: function () {
			this.speed = Math.max(0, this.speed - 50)
		},
		start: function () {
			this.intervalIds.push(window.setInterval(this.life, this.speed))
		},
		stop: function () {
			this.intervalIds.forEach(id => window.clearInterval(id))
		},
		/**
		* Toggle the cell State.
		*/
		toggleCell: function (cellIdx, event) {
			if (event.type === 'click' || (event.type === 'mouseover' && event.buttons === 1)) {
				this.cells[cellIdx] = !this.cells[cellIdx]
				// this.setCellDisplay(event.target, this.cells[cellIdx])
			}
		},
	},
})