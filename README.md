# 使用

```js
const tab = new Table({ // 配置对象
    columns: [ // 显示多少列
        {
            title: '学号', // 每一列的标题
            propName: 'sNo' // 数据对应的属性名
        },
        {
            title: '姓名',
            propName: 'name',
            render(val, data) {
                return `<a href="./detail/${data.sNo}">${val}</a>`
            }
        },
        {
            title: '性别',
            propName: 'sex',
            render(val, data) {
                // val表示单个学生数据中对应属性值 data表示单个学生数据中所有属性
                return val === 1 ? "女" : "男"
            }
        },
        {
            title: '操作',
            propName: 'id',
            render(val, data) {
                return `<button>编辑</button><button>删除</button>`
            }
        }
    ],
    container: document.querySelector('.container'),
    pageOptions: { // 针对分页的配置
        pageSize: 1
    }
});
```

## 数据测试
```js
(async () => {
    const resp = await getStudents();
    tab.dataSource = resp.findByPage;
    tab.dataCount = resp.cont;

    tab.pager.onPageChange = async newPage => {
        const resp = await getStudents(newPage);
        tab.dataSource = resp.findByPage;
        tab.dataCount = rep.cont;
    }
})()
```