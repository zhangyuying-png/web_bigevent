$(function () {
    var layer = layui.layer

    var form = layui.form

    var laypage = layui.laypage

    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + '' + hh + ':' + mm + ':' + ss
    }

    // 定义一个补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    // 定义一个查询参数对象
    var q = {
        pagenum: 1,//页码值默认第一页
        pagesize: 2,//每页显示几条数据
        cate_id: '', //文章分类的 Id
        state: ''  //文章的状态，可选值有：已发布、草稿
    }

    initTable()

    initCate()

    // 获取文章列表数据的方法
    function initTable() {
        // 发起ajax请求
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                layer.msg('获取文章列表成功！')

                // 使用模板引擎渲染页面数据
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)

                // 调用渲染分页的方法
                renderPage(res.total)
            }
        })
    }

    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类列表失败！')
                }
                // 调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                // 通知 layui 重新渲染表单区域的UI结构
                form.render()
            }
        })
    }

    // 为筛选表单绑定提交事件
    $('#form-search').on('submit', function (e) {
        // 阻止表单的默认提交行为
        e.preventDefault()
        // 获取表单选中项的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        // 为查询参数赋值
        q.cate_id = cate_id
        q.state = state
        // 重新获取获取文章列表数据
        initTable()
    })

    // 定义一个分页的方法
    function renderPage(total) {
        // 调用 laypage.render(方法来渲染页面结构)
        laypage.render({
            elem: 'pageBox', //分页容器的id
            count: total, //总数据条数
            limit: q.pagesize, //每页显示几条数据
            curr: q.pagenum, //设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // 分页发生切换的时候，触发 jump 回调

            // 触发 jump 回调的方式有两种：
            // 1.点击页码 触发 jump 回调
            // 2.只要调用了 laypage.render() 方法，就会触发 jump 回调 

            jump: function (obj, first) {

                // 可以通过 first 的值 来判断通过哪种方式触发的 jump 回调
                // 如果 first 的值为 true ，证明是方式2触发的
                // 否则，就是方式1触发的
                console.log(first);

                console.log(obj.curr);
                // 把最新的页码值 赋值到 q这个查询参数对象中的pagenum
                q.pagenum = obj.curr

                // 把最新的条目数 赋值到 q这个查询参数对象中的pagesize
                q.pagesize = obj.limit

                // 根据对应的 q 获取对应的数据列表 并渲染表格
                // initTable()

                if (!first) {
                    initTable()
                }
            }
        })
    }

    // 通过代理的方式 为删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function () {

        // 获取删除按钮的个数
        var len = $('.btn-delete').length
        console.log(len);

        // 定义一个文章的id
        var id = $(this).attr('data-id')

        // 询问用户是否要删除文章
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            // 发请求，调接口
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！')

                    // 当数据删除完成之后 需要判断当前页码是否还有剩余的数据
                    // 如果没有剩余数据了 则让页码值 -1
                    // 再重新调用 initTable() 方法
                    // 4

                    if (len === 1) {
                        // 如果 len 的值等于1 证明删除完毕后 页面没有任何数据
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            })

            layer.close(index);
        });
    })

    // 通过代理的方式 为编辑按钮绑定点击事件
    $('tbody').on('click', '.btn-edit', function () {
        var id = $('.btn-edit').attr('data-id')

        location.href = '/article/art_pub.html?id=' + id

        // // 3.发起ajax请求 获取文章数据
        // $.ajax({
        //     method: 'GET',
        //     url: '/my/article/' + id,
        //     success: function (res) {
        //         console.log(res);
        //         if (res.status !== 0) {
        //             return layer.msg('获取文章失败！')
        //         }
        //         layer.msg('获取文章成功！')
        //     }
        // })

    })

})