class Table {
    constructor(options = {}) {
        // Object.assign({}, defaultOptions, options);
        this.options = {
            ...{ // 默认配置
                columns: [],
                container: document.body,
                className: 'easy-table' // 表格样式类名
            }, 
            ...options
        } // 最终配置
        this.init();
    }

    set dataCount(val) {
        if (!this.pager) {
            this.pager = new Pager({
                container: this.tfoot,
                ...this.options.pageOptions
            })
            this.pager.total = val;
            this.pager.render();
        }
    }

    get dataSource() {
        return this._dataSource
    }

    set dataSource(val) {
        if (!Array.isArray(val)) {
           throw new TypeError('数据必须是一个标准的数组');
        }
        this.tbody.innerHTML = ''; // 清空之前的元素
        for (const data of val) {
            const tr = document.createElement('tr');
            // 每一行有多少列
            for (const col of this.options.columns) {
                const td = document.createElement('td');
                const val = data[col.propName];
                if (typeof col.render === 'function') {
                    td.innerHTML = col.render(val, data);
                } else {
                    td.innerHTML = val;
                }
                tr.appendChild(td);
            }
            this.tbody.appendChild(tr);
        }
        this._dataSource = val;
    }
    
    /**
     * 表格初始化(生成各种dom元素)
     */
    init() {
        // 创建表格元素
        this.tableDom = document.createElement("table");
        this.tableDom.className = this.options.className;

        // 表头
        this.thead = document.createElement('thead');
        const tr = document.createElement("tr"); // 表头下只有一行
        this.thead.appendChild(tr);
        this.tableDom.appendChild(this.thead);
        // 创建多少td
        for (const col of this.options.columns) {
            const th = document.createElement('th');
            th.innerText = col.title;
            tr.appendChild(th);
        }

        // 表体
        this.tbody = document.createElement('tbody');
        this.tableDom.appendChild(this.tbody);

        // 表尾
        const tfoot = document.createElement('tfoot');
        const footTr = document.createElement('tr');
        const footTd = document.createElement('td');
        footTd.colSpan = this.options.columns.length;
        footTr.appendChild(footTd);
        tfoot.appendChild(footTr);
        this.tfoot = footTd;
        this.tableDom.appendChild(tfoot);

        this.options.container.appendChild(this.tableDom);
    }
}

class Pager {
    constructor({ total = 0, current = 1, container = document.body,
        pageSize = 10, panelNumber = 5
    } = {}) {
        this.total = total;
        this.current = current;
        this.container = container;
        this.pageSize = pageSize;
        this.panelNumber = panelNumber;
        this.render();
    }

    /**
     * 总页数
     * @readonly
     * @memberof Pager
     */
    get pageNumber() {
        return Math.ceil(this.total / this.pageSize); 
    }

    /**
     * 渲染页码
     */
    render() {
        this.container.innerHTML = '';
        this.dom = document.createElement('div');
        this.dom.className = 'pager';

        const createSpan = (content, page) => {
            const span = document.createElement('span');
            span.innerText = content;
            this.dom.appendChild(span);
            span.onclick = () => {
                this.current = page;
                this.render();
                if (typeof this.onPageChange === 'function') {
                    this.onPageChange(page);
                }
            }
            return span;
        }

        // 生成首页和上一页
        if (this.current > 1) {
            createSpan('首页', 1);
            createSpan('上一页', this.current - 1);
        }

        // 中间部分
        let min = this.current - Math.floor(this.panelNumber / 2);
        if (min < 1) {
            min = 1;
        }
        let max = min + this.panelNumber - 1;
        if (max > this.pageNumber) {
            max = this.pageNumber
        }
        for (let i = min; i <= max; i++) {
            const span = createSpan(i, i);
            if (i === this.current) {
                span.className = 'current';
            }
        }
        
        // 生成尾页和下一页
        if (this.current < this.pageNumber) {
            createSpan('下一页', this.current + 1);
            createSpan('尾页', this.pageNumber);
        }     

        this.container.appendChild(this.dom);
    }
}