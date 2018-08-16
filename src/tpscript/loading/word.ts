import { Center } from "../communication/commu";

const _word = ["|", "<", "=", "图", "形", "λ", "切", "割", "=", ">", "|"];

let Word = "";

let once = false;

const emit = Center.setNewEvent("sliceWord");

export const word: {
    length: number;
    nextlength: number;
    word: string;
} = {
    length: 0,
    nextlength: 0,
    get word() {
        if (word.length === _word.length) {
            // 已经到了最后末端
            if (!once) {
                // 这里最好只触发一次就好了
                once = true;
                emit(null);
            }
            return _word.join("");
        }

        if (word.length !== this.nextlength) {
            // 正在增加数字，不要改动他
            return Word;
        }

        // 没有到末尾，上面一次的增加也进行完成，开始进行下面的增加吧
        word.nextlength = word.length + 1;
        setTimeout(() => {
            // 完成增加
            Word = _word.slice(0, word.nextlength).join("");
            word.length = word.nextlength;
        }, 300);

        return Word;
    }
};
