// 入口函数
$(function () {
    // 点击“去注册账号” 跳转到注册的div
    $('#link_reg').on('click', function () {
        $('.login-box').hide()
        $('.reg-box').show()
    })

    // 点击“去登录” 跳转到登录的div
    $('#link_login').on('click', function () {
        $('.login-box').show()
        $('.reg-box').hide()
    })

    // 从layui中获取form对象
    var form = layui.form
    // 导入layer
    var layer = layui.layer

    // 通过form.verify()函数自定义校验规则
    form.verify({
        // 自定义了一个叫psw的校验规则
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        // 自定义一个repwd校验规则
        repwd: function (value) {
            // 拿到密码框的值
            var pwd = $('.reg-box [name=password]').val()
            // 判断两次密码输入是否一致
            if (value !== pwd)
                return '两次密码不一致'
            // 如果不一致，则返回一个提示信息
        }
    })

    // 监听注册表单的提交事件
    $('#form_reg').on('submit', function (e) {
        // 阻止表单的默认提交行为
        e.preventDefault()
        // 发起ajax的post请求
        // 向老师要了一个新的接口
        $.post('/api/reguser',
            {
                username: $('#form_reg [name=username]').val(),
                password: $('#form_reg [name=password]').val()
            },
            function (res) {
                if (res.status !== 0) {
                    // return console.log(res.message)
                    return layer.msg(res.message);
                }
                // console.log('注册成功!');
                layer.msg('注册成功,请登录!')
                // 模拟人的点击行为
                $('#link_login').click()
            })

    })

    // 监听登录表单的提交事件
    $('#form_login').submit(function (e) {
        e.preventDefault()
        $.ajax({
            url: '/api/login',
            method: 'POST',
            // 快速获取表单数据
            data:
                $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败！')
                }
                layer.msg('登录成功！')
                // 设置权限密码
                localStorage.setItem('token', res.token)
                // 跳转到主页面
                location.href = '/index.html'
            }
        })
    })
})