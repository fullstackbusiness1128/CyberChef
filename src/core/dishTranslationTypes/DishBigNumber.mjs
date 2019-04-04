/**
 * @author d98762625 [d98762625@gmail.com]
 * @copyright Crown Copyright 2019
 * @license Apache-2.0
 */

import DishTranslationType from "./DishTranslationType";
import Utils from "../Utils";
import BigNumber from "bignumber.js";

/**
 * translation methods for BigNumber Dishes
 */
class DishBigNumber extends DishTranslationType {

    /**
     * convert the given value to a ArrayBuffer
     * @param {BigNumber} value
     */
    static toArrayBuffer() {
        DishBigNumber.checkForValue(this.value);
        this.value = BigNumber.isBigNumber(this.value) ? Utils.strToArrayBuffer(this.value.toFixed()) : new ArrayBuffer;
    }

    /**
     * convert the given value from a ArrayBuffer
     * @param {boolean} notUTF8
     */
    static fromArrayBuffer(notUTF8) {
        DishBigNumber.checkForValue(this.value);
        try {
            this.value = new BigNumber(Utils.arrayBufferToStr(this.value, !notUTF8));
        } catch (err) {
            this.value = new BigNumber(NaN);
        }
    }
}

export default DishBigNumber;
