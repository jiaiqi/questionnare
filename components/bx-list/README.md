# 列表组件
## 属性

| 参数          | 说明                                       | 格式                                                    | 可选值                 | 默认值 |
| ------------- | ------------------------------------------ | ------------------------------------------------------- | ---------------------- | ------ |
| viewType      | 视图类型                                   | String                                                  | normal/grid/image-text | normal |
| viewTemp      | 显示字段映射模版                           | {title:‘xxx’,titleTips:‘xxx’,content:‘xxx’,footer:‘xx’} | -                      |        |
| imageNum      | 图片数量，仅在viewType为image-text时生效   | Number                                                  | -                      | 1      |
| gridRowNum    | 每行显示几条数据，仅在viewType为grid时生效 | Number                                                  | 1，2，3(最大为3)       | 2      |
| rowKey        | 唯一字段                                   | String                                                  | -                      | ‘id’   |
| serviceName   | 列表数据的服务名                           | String                                                  | -                      | -      |
| condition     | 列表数据的查询条件                         | [{colName:””,ruleType:””,value:””}]                     |                        | -      |
| rownumber     | 每页显示的数据条数                         | Number                                                  | -                      | 10     |
| order         | 排序配置                                   | [{colName:"activity_no",orderType: "asc"}]              | -                      | -      |
| showSearchBar | 是否显示搜索栏                             | Boolean                                                 | true/false             | false  |
| searchWords   | 关键词                                     | String                                                  | -                      |        |
| searchColumn  | 用来搜索的colName                          | String                                                  | ‘name’                 |        |
| gridButton    | 列表公共按钮配置                           | Array                                                   | -                      | -      |
| rowButton     | 列表每一项的按钮配置                       | Array                                                   | -                      | -      |
| srv_cols      | 列表要显示的字段以及字段属性配置           | Array                                                   | -                      | -      |


## 事件

| 事件名称         | 说明               | 回调参数             |
| ---------------- | ------------------ | -------------------- |
| @list-change     | 列表数据发生变化   | 改变后的列表数据     |
| @clickFootBtn    | 某一项按钮点击事件 | {button:xxx,row:xxx} |
| @click-list-item | 点击了某一行       | 该行的数据           |



## 内置方法(可通过$refs调用)

| 方法名        | 作用           | 返回值 |
| ------------- | -------------- | ------ |
| getListData() | 获取去列表数据 |        |
| onRefresh()   | 刷新列表数据   |        |
|               |                |        |

