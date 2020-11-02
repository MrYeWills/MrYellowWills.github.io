<div id="root">
  <div>
    <input v-model="inputValue"/>
    <button @click="handleClick">提交</button>
    <ul>
      <todo-item
        v-for="(item,index) of list"
        :key="index"
        :msg="item"
        :index="index"
        @delete="handleDelete"
      ></todo-item>
    </ul>
  </div>
</div>

var TODOITEM = {
    props:['msg','index'],
    template:"<li @click='handleClick'>{{msg}}</li>",
    methods:{
      handleClick:function(){
        this.$emit('delete',this.index)
      }
    }
  }
  new Vue({
    el:"#root",
    components:{
      "todo-item":TODOITEM
    },
    data:{
      inputValue:'',
      list:[]
    },
    methods:{
      handleDelete:function(index){//父组件删除子组件想删除的数据
        this.list.splice(index,1)
      }
    }
  })