/**
 * @author n1474335 [n1474335@gmail.com]
 * @author j433866 [j433866@gmail.com]
 * @copyright Crown Copyright 2019
 * @license Apache-2.0
 */

import ChefWorker from "worker-loader?inline&fallback=false!../core/ChefWorker";

/**
 * Waiter to handle conversations with the ChefWorker
 */
class WorkerWaiter {

    /**
     * WorkerWaiter constructor
     *
     * @param {App} app - The main view object for CyberChef
     * @param {Manager} manager - The CyberChef event manager
     */
    constructor(app, manager) {
        this.app = app;
        this.manager = manager;

        this.chefWorkers = [];
        this.maxWorkers = navigator.hardwareConcurrency || 4;
        this.inputs = [];
        this.totalOutputs = 0;
    }

    /**
     * Terminates any existing ChefWorkers and sets up a new worker
     */
    setupChefWorker() {
        for (let i = 0; i < this.chefWorkers.length; i++) {
            const worker = this.chefWorkers.pop();
            worker.terminate();
        }

        this.addChefWorker();
    }

    /**
     * Adds a new ChefWorker
     *
     * @returns {number} The index of the created worker
     */
    addChefWorker() {
        // First find if there are any inactive workers, as this will be
        // more efficient than creating a new one
        for (let i = 0; i < this.chefWorkers.length; i++) {
            if (!this.chefWorkers[i].active) {
                return i;
            }
        }

        if (this.chefWorkers.length === this.maxWorkers) {
            // Can't create any more workers
            return -1;
        }

        log.debug("Adding new ChefWorker");

        // Create a new ChefWorker and send it the docURL
        const newWorker = new ChefWorker();
        newWorker.addEventListener("message", this.handleChefMessage.bind(this));
        let docURL = document.location.href.split(/[#?]/)[0];
        const index = docURL.lastIndexOf("/");
        if (index > 0) {
            docURL = docURL.substring(0, index);
        }
        newWorker.postMessage({"action": "docURL", "data": docURL});

        // Store the worker, whether or not it's active, and the inputNum as an object
        const newWorkerObj = {
            worker: newWorker,
            active: false,
            inputNum: this.manager.input.getActiveTab()
        };

        this.chefWorkers.push(newWorkerObj);
        return this.chefWorkers.indexOf(newWorkerObj);
    }

    /**
     * Removes a ChefWorker
     *
     * @param {Object} workerObj
     */
    removeChefWorker(workerObj) {
        const index = this.chefWorkers.indexOf(workerObj);
        if (index === -1) {
            return;
        }

        this.chefWorkers[index].worker.terminate();
        this.chefWorkers.splice(index, 1);

        // There should always be a ChefWorker loaded
        if (this.chefWorkers.length === 0) {
            this.addChefWorker();
        }
    }

    /**
     * Finds and returns the object for the ChefWorker of a given inputNum
     *
     * @param {number} inputNum
     */
    getChefWorker(inputNum) {
        for (let i = 0; i < this.chefWorkers.length; i++) {
            if (this.chefWorkers[i].inputNum === inputNum) {
                return this.chefWorkers[i];
            }
        }
    }

    /**
     * Handler for messages sent back by the ChefWorkers
     *
     * @param {MessageEvent} e
     */
    handleChefMessage(e) {
        const r = e.data;
        let inputNum = 0;
        log.debug(`Receiving ${r.action} from ChefWorker.`);

        if (r.data.hasOwnProperty("inputNum")) {
            inputNum = r.data.inputNum;
        }

        const currentWorker = this.getChefWorker(inputNum);

        switch (r.action) {
            case "bakeComplete":
                log.debug(`Bake ${inputNum} complete.`);
                this.updateOutput(r.data, r.data.inputNum);

                if (this.inputs.length > 0) {
                    const nextInput = this.inputs.pop();
                    log.debug(`Baking input ${nextInput.inputNum}.`);
                    this.manager.output.updateOutputStatus("baking", nextInput.inputNum);
                    this.manager.output.updateOutputMessage("Baking...", nextInput.inputNum);
                    currentWorker.inputNum = nextInput.inputNum;
                    currentWorker.active = true;
                    currentWorker.worker.postMessage({
                        action: "bake",
                        data: {
                            input: nextInput.input,
                            recipeConfig: nextInput.recipeConfig,
                            options: nextInput.options,
                            progress: nextInput.progress,
                            step: nextInput.step,
                            inputNum: nextInput.inputNum
                        }
                    });
                    this.displayProgress();
                } else {
                    // The ChefWorker is no longer needed
                    log.debug("No more inputs to bake. Closing ChefWorker.");
                    this.removeChefWorker(currentWorker);

                    this.displayProgress();

                    const progress = this.getBakeProgress();
                    if (progress.total === progress.baked) {
                        this.bakingComplete();
                    }
                }

                break;
            case "BakeError":
                this.manager.output.updateOutputError(r.data, inputNum);
                // do more here
                break;
            case "dishReturned":
                this.callbacks[r.data.id](r.data);
                break;
            case "silentBakeComplete":
                break;
            case "workerLoaded":
                this.app.workerLoaded = true;
                log.debug("ChefWorker loaded.");
                this.app.loaded();
                break;
            case "statusMessage":
                // Status message should be done per output
                // log.error(r);
                this.manager.output.updateOutputMessage(r.data.message, r.data.inputNum);
                break;
            case "optionUpdate":
                log.debug(`Setting ${r.data.option} to ${r.data.value}`);
                this.app.options[r.data.option] = r.data.value;
                break;
            case "setRegisters":
                // Should this update with the tabs?
                this.manager.recipe.setRegisters(r.data.opIndex, r.data.numPrevRegisters, r.data.registers);
                break;
            case "highlightsCalculated":
                this.manager.highlighter.displayHighlights(r.data.pos, r.data.direction);
                break;
            default:
                log.error("Unrecognised message from ChefWorker", e);
                break;
        }
    }

    /**
     * Update the value of an output
     *
     * @param {Object} data
     * @param {number} inputNum
     */
    updateOutput(data, inputNum) {

        this.manager.output.updateOutputValue(data, inputNum);
        this.manager.output.updateOutputStatus("baked", inputNum);

        this.manager.recipe.updateBreakpointIndicator(this.app.progress);
    }

    /**
     * Updates the UI to show if baking is in process or not.
     *
     * @param {boolean} bakingStatus
     */
    setBakingStatus(bakingStatus) {
        this.app.baking = bakingStatus;
        this.manager.controls.toggleBakeButtonFunction(bakingStatus);
    }

    /**
     * Get the progress of the ChefWorkers
     */
    getBakeProgress() {
        const pendingInputs = this.inputs.length;
        let bakingInputs = 0;

        for (let i = 0; i < this.chefWorkers.length; i++) {
            if (this.chefWorkers[i].active) {
                bakingInputs++;
            }
        }

        const total = this.totalOutputs;
        const bakedInputs = total - pendingInputs - bakingInputs;

        return {
            total: total,
            pending: pendingInputs,
            baking: bakingInputs,
            baked: bakedInputs
        };
    }

    /**
     * Cancels the current bake by terminating and removing all ChefWorkers
     */
    cancelBake() {
        for (let i = this.chefWorkers.length - 1; i >= 0; i--) {
            this.removeChefWorker(this.chefWorkers[i]);
        }
        this.setBakingStatus(false);
        this.inputs = [];
        this.totalOutputs = 0;
        this.manager.controls.showStaleIndicator();
        this.displayProgress();
    }

    /**
     * Handler for completed bakes
     */
    bakingComplete() {
        this.setBakingStatus(false);

        // look into changing this to something better
        // for (let i = 0; i < this.outputs.length; i++) {
        //     if (this.outputs[i].data.error) {
        //         this.app.handleError(this.outputs[i].error);
        //     }
        // }

        // What are these for?
        // Should be a value for each input, not just one
        // this.app.progress = this.outputs[0].data.progress;
        // this.app.dish = this.outputs[0].data.dish;
        this.manager.recipe.updateBreakpointIndicator(this.app.progress);
        // Don't need to update the output here as updateOutput() will take care of that
        document.getElementById("bake").style.background = "";
        this.totalOutputs = 0; // Reset for next time
        log.debug("--- Bake complete ---");
    }

    /**
     * Bakes the current input using the current recipe.
     * Either sends the input and recipe to a ChefWorker,
     * or, if there's already the max running, adds it to inputs
     *
     * @param {string | Array} input
     * @param {Object[]} recipeConfig
     * @param {Object} options
     * @param {number} progress
     * @param {boolean} step
     */
    bake(input, recipeConfig, options, progress, step) {
        this.setBakingStatus(true);

        if (typeof input === "string") {
            input = [{
                input: input,
                inputNum: this.manager.input.getActiveTab()
            }];
        }

        for (let i = 0; i < input.length; i++) {
            this.totalOutputs++;
            this.manager.output.updateOutputStatus("pending", input[i].inputNum);
            this.manager.output.updateOutputMessage(`Input ${input[i].inputNum} has not been baked yet.`, input[i].inputNum);
            // If an input exists for the current inputNum, remove it
            for (let x = 0; x < this.inputs.length; x++) {
                if (this.inputs[x].inputNum === input[i].inputNum) {
                    this.inputs.splice(x, 1);
                }
            }
            const workerId = this.addChefWorker();
            if (workerId !== -1) {
                // Send the input to the ChefWorker
                this.manager.output.updateOutputStatus("baking", input[i].inputNum);
                this.manager.output.updateOutputMessage("Baking...", input[i].inputNum);
                this.chefWorkers[workerId].active = true;
                this.chefWorkers[workerId].inputNum = input[i].inputNum;
                this.chefWorkers[workerId].worker.postMessage({
                    action: "bake",
                    data: {
                        input: input[i].input,
                        recipeConfig: recipeConfig,
                        options: options,
                        progress: progress,
                        step: step,
                        inputNum: input[i].inputNum
                    }
                });
            } else {
                // Add the input to inputs so it can be processed when ready
                this.inputs.push({
                    input: input[i].input,
                    recipeConfig: recipeConfig,
                    options: options,
                    progress: progress,
                    step: step,
                    inputNum: input[i].inputNum
                });
            }
        }
    }

    /**
     * Asks the ChefWorker to run a silent bake, forcing the browser to load and cache all the relevant
     * JavaScript code needed to do a real bake.
     *
     * @param {Object[]} [recipeConfig]
     */
    silentBake(recipeConfig) {
        // If there aren't any active ChefWorkers, addChefWorker will
        // return an inactive worker instead of creating a new one
        const workerId = this.addChefWorker();
        if (workerId === -1) return;
        this.chefWorkers[workerId].worker.postMessage({
            action: "silentBake",
            data: {
                recipeConfig: recipeConfig
            }
        });
    }

    /**
     * Asks the ChefWorker to return the dish as the specified type
     *
     * @param {Dish} dish
     * @param {string} type
     * @param {Function} callback
     */
    getDishAs(dish, type, callback) {
        const id = this.callbackID++;
        const workerId = this.addChefWorker();
        if (workerId === -1) return;

        this.callbacks[id] = callback;
        this.chefWorkers[workerId].worker.postMessage({
            action: "getDishAs",
            data: {
                dish: dish,
                type: type,
                id: id
            }
        });
    }

    /**
     * Sets the console log level in the workers.
     *
     * @param {string} level
     */
    setLogLevel(level) {
        for (let i = 0; i < this.chefWorkers.length; i++) {
            this.chefWorkers[i].worker.postMessage({
                action: "setLogLevel",
                data: log.getLevel()
            });
        }
    }

    /**
     * Display the bake progress in the output bar and bake button
     */
    displayProgress() {
        const progress = this.getBakeProgress();
        const percentComplete = ((progress.pending + progress.baking) / progress.total) * 100;
        const bakeButton = document.getElementById("bake");
        if (this.app.baking) {
            if (percentComplete < 100) {
                document.getElementById("bake").style.background = `linear-gradient(to left, #fea79a ${percentComplete}%, #f44336 ${percentComplete}%)`;
            } else {
                bakeButton.style.background = "";
            }
        } else {
            // not baking
            bakeButton.style.background = "";
        }

        const bakeInfo = document.getElementById("bake-info");
        let width = progress.total.toString().length;
        width = width < 2 ? 2 : width;

        const totalStr = progress.total.toString().padStart(width, " ").replace(/ /g, "&nbsp;");
        const bakedStr = progress.baked.toString().padStart(width, " ").replace(/ /g, "&nbsp;");
        const pendingStr = progress.pending.toString().padStart(width, " ").replace(/ /g, "&nbsp;");
        const bakingStr = progress.baking.toString().padStart(width, " ").replace(/ /g, "&nbsp;");

        let msg = "Total: " + totalStr;
        msg += "<br>Baked: " + bakedStr;

        if (progress.pending > 0) {
            msg += "<br>Pending: " + pendingStr;
        } else if (progress.baking > 0) {
            msg += "<br>Baking: " + bakingStr;
        }

        bakeInfo.innerHTML = msg;

    }
}

export default WorkerWaiter;
