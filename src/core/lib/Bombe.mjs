/**
 * Emulation of the Bombe machine.
 *
 * @author s2224834
 * @copyright Crown Copyright 2019
 * @license Apache-2.0
 */

import OperationError from "../errors/OperationError";
import Utils from "../Utils";
import {Rotor, a2i, i2a} from "./Enigma";

/**
 * Convenience/optimisation subclass of Rotor
 *
 * This allows creating multiple Rotors which share backing maps, to avoid repeatedly parsing the
 * rotor spec strings and duplicating the maps in memory.
 */
class CopyRotor extends Rotor {
    /**
     * Return a copy of this Rotor.
     */
    copy() {
        const clone = {
            map: this.map,
            revMap: this.revMap,
            pos: this.pos,
            step: this.step,
            transform: this.transform,
            revTransform: this.revTransform,
        };
        return clone;
    }
}

/**
 * Node in the menu graph
 *
 * A node represents a cipher/plaintext letter.
 */
class Node {
    /**
     * Node constructor.
     * @param {number} letter - The plain/ciphertext letter this node represents (as a number).
     */
    constructor(letter) {
        this.letter = letter;
        this.edges = new Set();
        this.visited = false;
    }
}

/**
 * Edge in the menu graph
 *
 * An edge represents an Enigma machine transformation between two letters.
 */
class Edge {
    /**
     * Edge constructor - an Enigma machine mapping between letters
     * @param {number} pos - The rotor position, relative to the beginning of the crib, at this edge
     * @param {number} node1 - Letter at one end (as a number)
     * @param {number} node2 - Letter at the other end
     */
    constructor(pos, node1, node2) {
        this.pos = pos;
        this.node1 = node1;
        this.node2 = node2;
        node1.edges.add(this);
        node2.edges.add(this);
        this.visited = false;
    }

    /**
     * Given the node at one end of this edge, return the other end.
     * @param node {number} - The node we have
     * @returns {number}
     */
    getOther(node) {
        if (this.node1 === node) {
            return this.node2;
        }
        return this.node1;
    }
}

/**
 * Scrambler.
 *
 * This is effectively just an Enigma machine, but it only operates on one character at a time and
 * the stepping mechanism is different.
 */
class Scrambler {
    /** Scrambler constructor.
     * @param {Object[]} rotors - List of rotors in this scrambler
     * @param {Object} reflector - This scrambler's reflector
     * @param {number} pos - Position offset from start of crib
     * @param {number} end1 - Letter in menu this scrambler is attached to
     * @param {number} end2 - Other letter in menu this scrambler is attached to
     */
    constructor(rotors, reflector, pos, end1, end2) {
        this.reflector = reflector;
        this.rotors = rotors;
        this.rotorsRev = [].concat(rotors).reverse();
        this.initialPos = pos;
        this.rotors[0].pos += pos;
        this.end1 = end1;
        this.end2 = end2;
    }

    /**
     * Step the rotors forward.
     *
     * All nodes in the Bombe step in sync.
     * @param {number} n - How many rotors to step
     */
    step(n) {
        // The Bombe steps the slowest rotor on an actual Enigma first.
        for (let i=this.rotors.length - 1; i>=this.rotors.length-n; i--) {
            this.rotors[i].step();
        }
    }

    /**
     * Run a letter through the scrambler.
     * @param {number} i - The letter to transform (as a number)
     * @returns {number}
     */
    transform(i) {
        let letter = i;
        for (const rotor of this.rotors) {
            letter = rotor.transform(letter);
        }
        letter = this.reflector.transform(letter);
        for (const rotor of this.rotorsRev) {
            letter = rotor.revTransform(letter);
        }
        return letter;
    }

    /**
     * Given one letter in the menu this scrambler maps to, return the other.
     * @param end {number} - The node we have
     * @returns {number}
     */
    getOtherEnd(end) {
        if (this.end1 === end) {
            return this.end2;
        }
        return this.end1;
    }

    /**
     * Read the position this scrambler is set to.
     * Note that because of Enigma's stepping, you need to set an actual Enigma to the previous
     * position in order to get it to make a certain set of electrical connections when a button
     * is pressed - this function *does* take this into account.
     * However, as with the rest of the Bombe, it does not take stepping into account - the middle
     * and slow rotors are treated as static.
     * @return {string}
     */
    getPos() {
        let result = "";
        for (let i=0; i<this.rotors.length; i++) {
            let pos = this.rotors[i].pos;
            // Enigma steps *before* encrypting each character. This means we need to roll the fast
            // rotor back by one before outputting it, to ensure the position is correct for the
            // first character.
            // As usual with the Bombe we do not take stepping of other rotors into account!
            if (i === 0) {
                pos = Utils.mod(pos - 1, 26);
            }
            result += i2a(pos);
        }
        return result.split("").reverse().join("");
    }
}

/**
 * Bombe simulator class.
 */
export class BombeMachine {
    /**
     * Construct a Bombe.
     *
     * Note that there is no handling of offsets here: the crib specified must exactly match the
     * ciphertext. It will check that the crib is sane (length is vaguely sensible and there's no
     * matching characters between crib and ciphertext) but cannot check further - if it's wrong
     * your results will be wrong!
     * @param {string[]} rotors - list of rotor spec strings (without step points!)
     * @param {Object} reflector - Reflector object
     * @param {string} ciphertext - The ciphertext to attack
     * @param {string} crib - Known plaintext for this ciphertext
     * @param {function} update - Function to call to send status updates (optional)
     */
    constructor(rotors, reflector, ciphertext, crib, update=undefined) {
        if (ciphertext.length !== crib.length) {
            throw new OperationError("Ciphertext and crib length differ");
        }
        if (crib.length < 2) {
            // This is the absolute bare minimum to be sane, and even then it's likely too short to
            // be useful
            throw new OperationError("Crib is too short");
        }
        if (crib.length > 25) {
            // A crib longer than this will definitely cause the middle rotor to step somewhere
            // A shorter crib is preferable to reduce this chance, of course
            throw new OperationError("Crib is too long");
        }
        for (let i=0; i<ciphertext.length; i++) {
            if (ciphertext[i] === crib[i]) {
                throw new OperationError(`Invalid crib: character ${ciphertext[i]} at pos ${i} in both ciphertext and crib`);
            }
        }
        this.ciphertext = ciphertext;
        this.crib = crib;
        // This is ordered from the Enigma fast rotor to the slow, so bottom to top for the Bombe
        this.baseRotors = [];
        for (const rstr of rotors) {
            const rotor = new CopyRotor(rstr, "", "A", "A");
            this.baseRotors.push(rotor);
        }
        this.updateFn = update;

        const [mostConnected, edges] = this.makeMenu();

        // This is the bundle of wires corresponding to the 26 letters within each of the 26
        // possible nodes in the menu
        this.wires = new Array(26*26).fill(false);

        // These are the pseudo-Engima devices corresponding to each edge in the menu, and the
        // nodes in the menu they each connect to
        this.scramblers = new Array();
        for (let i=0; i<26; i++) {
            this.scramblers.push(new Array());
        }
        this.allScramblers = new Array();
        this.indicator = undefined;
        for (const edge of edges) {
            const cRotors = [];
            for (const r of this.baseRotors) {
                cRotors.push(r.copy());
            }
            const end1 = a2i(edge.node1.letter);
            const end2 = a2i(edge.node2.letter);
            const scrambler = new Scrambler(cRotors, reflector, edge.pos, end1, end2);
            if (edge.pos === 0) {
                this.indicator = scrambler;
            }
            this.scramblers[end1].push(scrambler);
            this.scramblers[end2].push(scrambler);
            this.allScramblers.push(scrambler);
        }
        // The Bombe uses a set of rotors to keep track of what settings it's testing. We cheat and
        // use one of the actual scramblers if there's one in the right position, but if not we'll
        // just create one.
        if (this.indicator === undefined) {
            this.indicator = new Scrambler(this.baseRotors, reflector, 0, undefined);
            this.allScramblers.push(this.indicator);
        }

        this.testRegister = a2i(mostConnected.letter);
        // This is an arbitrary letter other than the most connected letter
        for (const edge of mostConnected.edges) {
            this.testInput = [this.testRegister, a2i(edge.getOther(mostConnected).letter)];
            break;
        }
    }

    /**
     * If we have a way of sending status messages, do so.
     * @param {string} msg - Message to send.
     */
    update(msg) {
        if (this.updateFn !== undefined) {
            this.updateFn(msg);
        }
    }

    /**
     * Recursive depth-first search on the menu graph.
     * This is used to a) isolate unconnected sub-graphs, and b) count the number of loops in each
     * of those graphs.
     * @param {Object} node - Node object to start the search from
     * @returns {[number, number, Object, number, Object[]} - loop count, node count, most connected
     *      node, order of most connected node, list of edges in this sub-graph
     */
    dfs(node) {
        let loops = 0;
        let nNodes = 1;
        let mostConnected = node;
        let nConnections = mostConnected.edges.size;
        let edges = new Set();
        node.visited = true;
        for (const edge of node.edges) {
            if (edge.visited) {
                // Already been here from the other end.
                continue;
            }
            edge.visited = true;
            edges.add(edge);
            const other = edge.getOther(node);
            if (other.visited) {
                // We have a loop, record that and continue
                loops += 1;
                continue;
            }
            // This is a newly visited node
            const [oLoops, oNNodes, oMostConnected, oNConnections, oEdges] = this.dfs(other);
            loops += oLoops;
            nNodes += oNNodes;
            edges = new Set([...edges, ...oEdges]);
            if (oNConnections > nConnections) {
                mostConnected = oMostConnected;
                nConnections = oNConnections;
            }
        }
        return [loops, nNodes, mostConnected, nConnections, edges];
    }

    /**
     * Build a menu from the ciphertext and crib.
     * A menu is just a graph where letters in either the ciphertext or crib (Enigma is symmetric,
     * so there's no difference mathematically) are nodes and states of the Enigma machine itself
     * are the edges.
     * Additionally, we want a single connected graph, and of the subgraphs available, we want the
     * one with the most loops (since these generate feedback cycles which efficiently close off
     * disallowed states).
     * Finally, we want to identify the most connected node in that graph (as it's the best choice
     * of measurement point).
     * @returns [Object, Object[]] - the most connected node, and the list of edges in the subgraph
     */
    makeMenu() {
        // First, we make a graph of all of the mappings given by the crib
        // Make all nodes first
        const nodes = new Map();
        for (const c of this.ciphertext + this.crib) {
            if (!nodes.has(c)) {
                const node = new Node(c);
                nodes.set(c, node);
            }
        }
        // Then all edges
        for (let i=0; i<this.crib.length; i++) {
            const a = this.crib[i];
            const b = this.ciphertext[i];
            new Edge(i, nodes.get(a), nodes.get(b));
        }
        // list of [loop_count, node_count, most_connected_node, connections_on_most_connected, edges]
        const graphs = [];
        // Then, for each unconnected subgraph, we count the number of loops and nodes
        for (const start of nodes.keys()) {
            if (nodes.get(start).visited) {
                continue;
            }
            const subgraph = this.dfs(nodes.get(start));
            graphs.push(subgraph);
        }
        // Return the subgraph with the most loops (ties broken by node count)
        graphs.sort((a, b) => {
            let result = b[0] - a[0];
            if (result === 0) {
                result = b[1] - a[1];
            }
            return result;
        });
        this.nLoops = graphs[0][0];
        return [graphs[0][2], graphs[0][4]];
    }

    /**
     * Implement Welchman's diagonal board: If A steckers to B, that implies B steckers to A, and
     * so forth. This function just gets the paired wire.
     * @param {number[2]} i - Bombe state wire
     * @returns {number[2]}
     */
    getDiagonal(i) {
        return [i[1], i[0]];
    }

    /**
     * Bombe electrical simulation. Energise a wire. For all connected wires (both via the diagonal
     * board and via the scramblers), energise them too, recursively.
     * @param {number[2]} i - Bombe state wire
     */
    energise(i) {
        const idx = 26*i[0] + i[1];
        if (this.wires[idx]) {
            return;
        }
        this.energiseCount ++;
        this.wires[idx] = true;
        this.energise(this.getDiagonal(i));

        for (const scrambler of this.scramblers[i[0]]) {
            const out = scrambler.transform(i[1]);
            const other = scrambler.getOtherEnd(i[0]);
            this.energise([other, out]);
        }
    }

    /**
     * Having set up the Bombe, do the actual attack run. This tries every possible rotor setting
     * and attempts to logically invalidate them. If it can't, it's added to the list of candidate
     * solutions.
     * @returns {string[][2]} - list of pairs of candidate rotor setting, and calculated stecker pair
     */
    run() {
        let stops = 0;
        const result = [];
        // For each possible rotor setting
        const nChecks = Math.pow(26, this.baseRotors.length);
        for (let i=1; i<=nChecks; i++) {
            this.wires.fill(false);
            // Energise the test input, follow the current through each scrambler
            // (and the diagonal board)
            this.energiseCount = 0;
            this.energise(this.testInput);
            // Count the energised outputs
            let count = 0;
            for (let j=26*this.testRegister; j<26*(1+this.testRegister); j++) {
                if (this.wires[j]) {
                    count++;
                }
            }
            // If it's not all of them, we have a stop
            if (count < 26) {
                stops += 1;
                let stecker;
                // The Bombe tells us one stecker pair as well. The input wire and test register we
                // started with are hypothesised to be a stecker pair.
                if (count === 25) {
                    // Our steckering hypothesis is wrong. Correct value is the un-energised wire.
                    for (let j=0; j<26; j++) {
                        if (!this.wires[26*this.testRegister + j]) {
                            stecker = `${i2a(this.testRegister)} <-> ${i2a(j)}`;
                            break;
                        }
                    }
                } else if (count === 1) {
                    // This means our hypothesis for the steckering is correct.
                    stecker = `${i2a(this.testRegister)} <-> ${i2a(this.testInput[1])}`;
                } else {
                    // Unusual, probably indicative of a poor menu. I'm a little unclear on how
                    // this was really handled, but we'll return it for the moment.
                    stecker = `? (wire count: ${count})`;
                }
                result.push([this.indicator.getPos(), stecker]);
            }
            // Step all the scramblers
            // This loop counts how many rotors have reached their starting position (meaning the
            // next one needs to step as well)
            let n = 1;
            for (let j=1; j<this.baseRotors.length; j++) {
                if ((i % Math.pow(26, j)) === 0) {
                    n++;
                } else {
                    break;
                }
            }
            for (const scrambler of this.allScramblers) {
                scrambler.step(n);
            }
            // Send status messages at what seems to be a reasonably sensible frequency
            if (n > 2) {
                const msg = `Bombe run with ${this.nLoops} loops in menu (2+ desirable): ${stops} stops, ${Math.floor(100 * i / nChecks)}% done`;
                this.update(msg);
            }
        }
        return result;
    }
}
