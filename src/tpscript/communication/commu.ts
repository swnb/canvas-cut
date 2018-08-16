type Subscribe = (arg: object | number | string | any) => void;

type Subscribes = Subscribe[];

interface InterfaceRegister {
	[propsname: string]: Subscribes;
}

class Commutation {
	// 单例模式
	public static instance: Commutation;

	public static getInstance: () => Commutation = () => {
		if (Commutation.instance) {
			return Commutation.instance;
		} else {
			return (Commutation.instance = Commutation.create());
		}
	};

	private static create() {
		return new Commutation();
	}

	private register: InterfaceRegister;

	constructor() {
		// 生成注册的列表的内存对象，对于所有注册的事件都在这个列表里面
		this.register = {};
	}
	/**
	 * setNewEvent return the dispatch function
	 */
	public setNewEvent(eventType: string) {
		return (somedata: any) => {
			const subscribe = this.getRegisterLists(eventType);
			// 发布事件
			if (subscribe.length > 0) {
				this.register[eventType].forEach(cbfn => {
					cbfn(somedata);
				});
			}
		};
	}
	/**
	 * setNewRegister return nothing
	 */
	public setNewRegister(eventType: string, cbfn: Subscribe) {
		this.getRegisterLists(eventType).push(cbfn);
	}

	private getRegisterLists(eventType: string) {
		if (this.register[eventType]) {
			return this.register[eventType];
		} else {
			return (this.register[eventType] = []);
		}
	}
}

const Center = Commutation.getInstance();

export { Center };
