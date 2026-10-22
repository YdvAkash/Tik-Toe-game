'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

class FakeClassList {
    constructor() {
        this.values = new Set();
    }

    add(...names) {
        names.forEach(name => this.values.add(name));
    }

    remove(...names) {
        names.forEach(name => this.values.delete(name));
    }

    contains(name) {
        return this.values.has(name);
    }
}

class FakeElement {
    constructor(index = null) {
        this.index = index;
        this.innerText = '';
        this.classList = new FakeClassList();
        this.listeners = {};
    }

    addEventListener(event, listener) {
        (this.listeners[event] ??= []).push(listener);
    }

    getAttribute(name) {
        return name === 'data-index' ? String(this.index) : null;
    }

    click() {
        for (const listener of this.listeners.click ?? []) {
            listener({ target: this });
        }
    }
}

function createGame() {
    const cells = Array.from({ length: 9 }, (_, index) => new FakeElement(index));
    const elements = {
        message: new FakeElement(),
        reset: new FakeElement(),
        congratulations: new FakeElement(),
    };
    const document = {
        addEventListener(event, callback) {
            if (event === 'DOMContentLoaded') callback();
        },
        querySelectorAll(selector) {
            assert.equal(selector, '.cell');
            return cells;
        },
        getElementById(id) {
            return elements[id];
        },
    };

    const source = fs.readFileSync(path.join(__dirname, '..', 'script.js'), 'utf8');
    vm.runInNewContext(source, { document });

    return { cells, ...elements };
}

test('an occupied cell cannot be played twice', () => {
    const game = createGame();

    game.cells[0].click();
    game.cells[0].click();
    game.cells[1].click();

    assert.equal(game.cells[0].innerText, 'X');
    assert.equal(game.cells[1].innerText, 'O');
});

test('a winning line announces the winner and ends the game', () => {
    const game = createGame();

    [0, 3, 1, 4, 2].forEach(index => game.cells[index].click());

    assert.equal(game.message.innerText, 'Player X has won!');
    assert.equal(game.congratulations.classList.contains('show'), true);

    game.cells[5].click();
    assert.equal(game.cells[5].innerText, '');
});

test('a full board without a winning line is a draw', () => {
    const game = createGame();

    [0, 1, 2, 4, 3, 5, 7, 6, 8].forEach(index => game.cells[index].click());

    assert.equal(game.message.innerText, 'Game is a draw!');
});

test('reset clears the board and starts a new game with X', () => {
    const game = createGame();

    [0, 3, 1, 4, 2].forEach(index => game.cells[index].click());
    game.reset.click();
    game.cells[0].click();

    assert.equal(game.message.innerText, '');
    assert.equal(game.cells[0].innerText, 'X');
    assert.equal(game.congratulations.classList.contains('show'), false);
    assert.equal(game.cells.slice(1).every(cell => cell.innerText === ''), true);
});
