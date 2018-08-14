interface ImgSrcMap{
    [propname:string]:string
}

interface ImgMap{
    [propname:string]:HTMLImageElement
}

const imgSrcMap:ImgSrcMap={
    tmp:"/usr/tmp"
}

const imgMap:ImgMap=Object.create(null)

// 创建代理层
const imgMapProxy=new Proxy(imgMap,{
    get:(target:ImgMap,props:string)=>target[props],
    set:(target:ImgMap,prop:string,value:HTMLImageElement)=>{
        imgMap[prop]=value
        
    }
})


const loadImg=(cb:()=>void)=>{
    for (const key in imgSrcMap){
        const Img=new Image()
        Img.src=imgSrcMap[key]
        Img.onload=()=>imgMap[key]=Img
    }

    cb()
}