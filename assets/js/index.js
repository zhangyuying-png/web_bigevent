$(function () {
    getUserInfo()

    var layer = layui.layer

    // 点击退出 实现跳转到登录页面
    $('#btnLogout').on('click', function () {
        layer.confirm('确认退出登录？', { icon: 3, title: '提示' },
            function (index) {
                //do something

                // 1.清空token
                localStorage.removeItem('token')
                // 2.给当前页面设置href值
                location.href = '/login.html'

                layer.close(index);
            });
    })
})

// 获取用户的信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers就是请求头
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取信息失败！')
            }
            // 调用 renderAvatar 渲染用户的头像
            renderAvatar(res.data)
        },

        // 不论成功还是失败 都会调用 complete 回调函数
        // complete: function (res) {

        //     // console.log('执行了complete回调：');
        //     // console.log(res);

        //     // 在 complete 函数中 可以使用 res.responseJSON 拿到服务器响应回来的数据
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {

        //         // 1.强制清空token
        //         localStorage.removeItem('token')

        //         // 2.强制跳转至登录页面
        //         location.href = '/login.html'
        //     }
        // }
    })
}

// 渲染用户的头像
function renderAvatar(user) {
    // 1.设置用户的名称
    var name = user.nickname || user.username
    // 2.设置欢迎的文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
    // 3.按需渲染用户的头像
    if (user.user_pic !== null) {
        // 3.1渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        // 3.2渲染文字头像 
        $('.layui-nav-img').hide()
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }
}