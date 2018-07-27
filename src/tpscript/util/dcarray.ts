export const deepcoyeArray = (array: any[]): any[] => {
    if (array.every(ele => !Array.isArray(ele))) {
        return [...array];
    } else {
        return array.map((ele: any) => {
            if (Array.isArray(ele)) {
                return deepcoyeArray(ele);
            } else {
                return ele;
            }
        });
    }
};
