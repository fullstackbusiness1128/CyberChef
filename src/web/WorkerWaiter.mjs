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
        this.bakeId = 0;
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
        newWorker.postMessage({
            action: "setLogLevel",
            data: log.getLevel()
        });

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

        if (this.chefWorkers.length > 1 || this.chefWorkers[index].active) {
            this.chefWorkers[index].worker.terminate();
            this.chefWorkers.splice(index, 1);
        }

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

                if (r.data.error) {
                    this.app.handleError(r.data.error);
                    this.manager.output.updateOutputError(r.data.error, inputNum, r.data.progress);
                    this.workerFinished(currentWorker);
                } else {
                    this.updateOutput(r.data, r.data.inputNum, r.data.bakeId, r.data.progress);
                    this.workerFinished(currentWorker);
                }
                break;
            case "bakeError":
                this.app.handleError(r.data.error);
                this.manager.output.updateOutputError(r.data.error, inputNum, r.data.progress);
                this.app.progress = r.data.progress;
                this.workerFinished(currentWorker);
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
                this.manager.output.updateOutputMessage(r.data.message, r.data.inputNum, true);
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
     * @param {number} bakeId
     * @param {number} progress
     */
    updateOutput(data, inputNum, bakeId, progress) {
        this.manager.output.updateOutputBakeId(bakeId, inputNum);
        this.manager.output.updateOutputProgress(progress, inputNum);
        this.manager.output.updateOutputValue(data, inputNum, false);
        this.manager.output.updateOutputStatus("baked", inputNum);
    }

    /**
     * Updates the UI to show if baking is in process or not.
     *
     * @param {boolean} bakingStatus
     */
    setBakingStatus(bakingStatus) {
        this.app.baking = bakingStatus;
        this.manager.controls.toggleBakeButtonFunction(bakingStatus);

        if (bakingStatus) this.manager.output.hideMagicButton();
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
            const inputNum = this.chefWorkers[i].inputNum;
            this.removeChefWorker(this.chefWorkers[i]);
            this.manager.output.updateOutputStatus("inactive", inputNum);
        }
        this.setBakingStatus(false);

        for (let i = 0; i < this.inputs.length; i++) {
            this.manager.output.updateOutputStatus("inactive", this.inputs[i].inputNum);
        }

        this.inputs = [];
        this.totalOutputs = 0;
        this.manager.output.set(this.manager.output.getActiveTab());
    }

    /**
     * Handle a worker completing baking
     */
    workerFinished(workerObj) {
        if (this.inputs.length > 0) {
            this.bakeNextInput(this.chefWorkers.indexOf(workerObj));
        } else {
            // The ChefWorker is no longer needed
            log.debug("No more inputs to bake. Closing ChefWorker.");
            workerObj.active = false;
            this.removeChefWorker(workerObj);

            const progress = this.getBakeProgress();
            if (progress.total === progress.baked) {
                this.bakingComplete();
            }
        }
    }

    /**
     * Handler for completed bakes
     */
    bakingComplete() {
        this.setBakingStatus(false);
        let duration = new Date().getTime() - this.bakeStartTime;
        duration = duration.toString() + "ms";
        const progress = this.getBakeProgress();

        let width = progress.total.toString().length;
        if (duration.length > width) {
            width = duration.length;
        }
        width = width < 2 ? 2 : width;

        const totalStr = progress.total.toString().padStart(width, " ").replace(/ /g, "&nbsp;");
        const durationStr = duration.padStart(width, " ").replace(/ /g, "&nbsp;");

        const msg = `Total: ${totalStr}<br>Time: ${durationStr}`;

        document.getElementById("bake-info").innerHTML = msg;
        document.getElementById("bake").style.background = "";
        this.totalOutputs = 0; // Reset for next time
        log.debug("--- Bake complete ---");
    }

    /**
     * Bakes the next input
     *
     * @param {number} workerIdx
     */
    bakeNextInput(workerIdx) {
        if (this.inputs.length === 0) return;
        if (workerIdx === -1) return;
        if (!this.chefWorkers[workerIdx]) return;

        const nextInput = this.inputs.splice(0, 1)[0];
        if (typeof nextInput.inputNum === "string") nextInput.inputNum = parseInt(nextInput.inputNum, 10);

        log.debug(`Baking input ${nextInput.inputNum}.`);
        this.manager.output.updateOutputMessage(`Baking input ${nextInput.inputNum}...`, nextInput.inputNum, false);
        this.manager.output.updateOutputStatus("baking", nextInput.inputNum);

        this.chefWorkers[workerIdx].inputNum = nextInput.inputNum;
        this.chefWorkers[workerIdx].active = true;
        const input = nextInput.input;
        if (typeof input === "string") {
            this.chefWorkers[workerIdx].worker.postMessage({
                action: "bake",
                data: {
                    input: input,
                    recipeConfig: this.recipeConfig,
                    options: this.options,
                    progress: this.progress,
                    step: this.step,
                    inputNum: nextInput.inputNum,
                    bakeId: this.bakeId
                }
            });
        } else {
            this.chefWorkers[workerIdx].worker.postMessage({
                action: "bake",
                data: {
                    input: input,
                    recipeConfig: this.recipeConfig,
                    options: this.options,
                    progress: this.progress,
                    step: this.step,
                    inputNum: nextInput.inputNum,
                    bakeId: this.bakeId
                }
            }, [nextInput.input]);
        }
    }

    /**
     * Bakes the current input using the current recipe.
     *
     * @param {Object[]} recipeConfig
     * @param {Object} options
     * @param {number} progress
     * @param {boolean} step
     */
    bake(recipeConfig, options, progress, step) {
        for (let i = this.chefWorkers.length - 1; i >= 0; i--) {
            this.removeChefWorker(this.chefWorkers[i]);
        }

        this.setBakingStatus(true);
        this.manager.recipe.updateBreakpointIndicator(false);
        this.bakeStartTime = new Date().getTime();
        this.bakeId++;
        this.recipeConfig = recipeConfig;
        this.options = options;
        this.progress = progress;
        this.step = step;

        let numWorkers = this.maxWorkers;
        if (this.inputs.length < numWorkers) {
            numWorkers = this.inputs.length;
        }
        for (let i = 0; i < numWorkers; i++) {
            const workerIdx = this.addChefWorker();
            if (workerIdx === -1) break;
            this.bakeNextInput(workerIdx);
        }
        this.displayProgress();
    }

    /**
     * Queues an input ready to be baked
     *
     * @param {object} inputData
     * @param {string | ArrayBuffer} inputData.input
     * @param {number} inputData.inputNum
     * @param {boolean} inputData.override
     */
    queueInput(inputData) {
        for (let i = 0; i < this.chefWorkers; i++) {
            if (this.chefWorkers[i].inputNum === inputData.inputNum) {
                this.chefWorkers[i].worker.terminate();
                this.chefWorkers.splice(i, 1);
                this.bakeNextInput(this.addChefWorker());
                this.bakingInputs--;
                break;
            }
        }
        this.manager.output.updateOutputMessage(`Input ${inputData.inputNum} has not been baked yet.`, inputData.inputNum, false);
        this.manager.output.updateOutputStatus("pending", inputData.inputNum);


        if (inputData.override) {
            this.totalOutputs = 1;
            this.inputs = [inputData];
        } else {
            this.totalOutputs++;
            this.inputs.push(inputData);
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

        if (progress.total === progress.baked) return;

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

        if (progress.total !== progress.baked) {
            setTimeout(function() {
                this.displayProgress();
            }.bind(this), 100);
        }

    }

    /**
     * Asks the ChefWorker to calculate highlight offsets if possible.
     *
     * @param {Object[]} recipeConfig
     * @param {string} direction
     * @param {Object} pos - The position object for the highlight.
     * @param {number} pos.start - The start offset.
     * @param {number} pos.end - The end offset.
     */
    highlight(recipeConfig, direction, pos) {
        const workerIdx = this.addChefWorker();
        if (workerIdx === -1) return;
        this.chefWorkers[workerIdx].worker.postMessage({
            action: "highlight",
            data: {
                recipeConfig: recipeConfig,
                direction: direction,
                pos: pos
            }
        });
    }
}

export default WorkerWaiter;
