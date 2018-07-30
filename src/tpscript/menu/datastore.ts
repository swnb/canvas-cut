// 每一类的子菜单数据
export interface SubMenuDataType {
    typeocde: number;
    x: number;
    y: number;
    width: number;
    height: number;
}

// 子菜单的 所有数据
export interface SubMenu {
    [propname: string]: SubMenuDataType[];
}

// 专门创建的数据结构体来储存这些子菜单的数据
export const SubMenuDataStore: SubMenu = Object.create(null);
