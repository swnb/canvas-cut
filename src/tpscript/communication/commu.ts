export class Com {
    // 单例模式
    private static instance: Com;
    static create() {
        Com.instance = new Com();
        return Com.instance;
    }
    static getInstance() {
        return Com.instance ? Com.instance : Com.create();
    }

    regist(fn: (...arg: any[]) => any) {}
    emit() {}
}

// 老子写不下去了，前端真的难
