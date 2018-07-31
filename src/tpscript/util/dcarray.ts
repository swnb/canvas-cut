export const deepcoyeArray = (array: any[]): any[] =>
    array.every(ele => !Array.isArray(ele))
        ? [...array]
        : array.map(
              (ele: any) => (Array.isArray(ele) ? deepcoyeArray(ele) : ele)
          );
