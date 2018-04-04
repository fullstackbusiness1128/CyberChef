/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Dish from "./Dish";
import Ingredient from "./Ingredient";

/**
 * The Operation specified by the user to be run.
 */
class Operation {

    /**
     * Operation constructor
     */
    constructor() {
        // Private fields
        this._inputType       = -1;
        this._outputType      = -1;
        this._breakpoint      = false;
        this._disabled        = false;
        this._flowControl     = false;
        this._ingList         = [];

        // Public fields
        this.name             = "";
        this.module           = "";
        this.description      = "";
    }


    /**
     * Interface for operation runner
     *
     * @param {*} input
     * @param {Object[]} args
     * @returns {*}
     */
    run(input, args) {
        return input;
    }


    /**
     * Interface for forward highlighter
     *
     * @param {Object[]} pos
     * @param {number} pos[].start
     * @param {number} pos[].end
     * @param {Object[]} args
     * @returns {Object[]} pos
     */
    highlight(pos, args) {
        return false;
    }


    /**
     * Interface for reverse highlighter
     *
     * @param {Object[]} pos
     * @param {number} pos[].start
     * @param {number} pos[].end
     * @param {Object[]} args
     * @returns {Object[]} pos
     */
    highlightReverse(pos, args) {
        return false;
    }


    /**
     * Sets the input type as a Dish enum.
     *
     * @param {string} typeStr
     */
    set inputType(typeStr) {
        this._inputType = Dish.typeEnum(typeStr);
    }


    /**
     * Gets the input type as a readable string.
     *
     * @returns {string}
     */
    get inputType() {
        return Dish.enumLookup(this._inputType);
    }


    /**
     * Sets the output type as a Dish enum.
     *
     * @param {string} typeStr
     */
    set outputType(typeStr) {
        this._outputType = Dish.typeEnum(typeStr);
    }


    /**
     * Gets the output type as a readable string.
     *
     * @returns {string}
     */
    get outputType() {
        return Dish.enumLookup(this._outputType);
    }


    /**
     * Sets the args for the current operation.
     *
     * @param {Object[]} conf
     */
    set args(conf) {
        conf.forEach(arg => {
            const ingredient = new Ingredient(arg);
            this.addIngredient(ingredient);
        });
    }


    /**
     * Gets the args for the current operation.
     *
     * @param {Object[]} conf
     */
    get args() {
        return this._ingList.map(ing => {
            return {
                name: ing.name,
                type: ing.type,
                value: ing.defaultValue
            };
        });
    }


    /**
     * Returns the value of the Operation as it should be displayed in a recipe config.
     *
     * @returns {Object}
     */
    get config() {
        return {
            "op": this.name,
            "args": this._ingList.map(ing => ing.conf)
        };
    }


    /**
     * Adds a new Ingredient to this Operation.
     *
     * @param {Ingredient} ingredient
     */
    addIngredient(ingredient) {
        this._ingList.push(ingredient);
    }


    /**
     * Set the Ingredient values for this Operation.
     *
     * @param {Object[]} ingValues
     */
    set ingValues(ingValues) {
        ingValues.forEach((val, i) => {
            this._ingList[i].value = val;
        });
    }


    /**
     * Get the Ingredient values for this Operation.
     *
     * @returns {Object[]}
     */
    get ingValues() {
        return this._ingList.map(ing => ing.value);
    }


    /**
     * Set whether this Operation has a breakpoint.
     *
     * @param {boolean} value
     */
    set breakpoint(value) {
        this._breakpoint = !!value;
    }


    /**
     * Returns true if this Operation has a breakpoint set.
     *
     * @returns {boolean}
     */
    get breakpoint() {
        return this._breakpoint;
    }


    /**
     * Set whether this Operation is disabled.
     *
     * @param {boolean} value
     */
    set disabled(value) {
        this._disabled = !!value;
    }


    /**
     * Returns true if this Operation is disabled.
     *
     * @returns {boolean}
     */
    get disabled() {
        return this._disabled;
    }


    /**
     * Returns true if this Operation is a flow control.
     *
     * @returns {boolean}
     */
    get flowControl() {
        return this._flowControl;
    }

}

export default Operation;
