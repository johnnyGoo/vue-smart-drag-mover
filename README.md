# vue-smart-drag-mover
##### A Vue.js Component
### Usage
```
npm install vue-smart-drag-mover --save
import VueSmartDragMover from 'vue-smart-drag-mover'
```
```
npm run dev
npm run build
```


### Install:
```
Vue.use(VueSmartDragMover,{remember:false,x:0,y:0,minX:0,maxX:100,minY:0,maxY:100});
remember:Boolean 记住当前值
x:Number x初始值
y:Number y初始值
minX:Number x最小值
maxX:Number x最大值
minY:Number y最小值
maxY:Number y最大值
```
### Html
```html
 <div v-dragmove="tap" >dragmove</div>

```
### callback
```
dragmove(x:Number,y:Number)
```

