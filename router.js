const express = require('express')
const User = require('./models/user')

const router = express.Router()

// 渲染首页
router.get('/' , function (req,res) {
  // console.log(req.session.user)
  res.render('index.html' , {
    user: req.session.user
  })
})

// 渲染登录页面
router.get('/login' , function (req,res) {
  res.render('login.html')
})

// 登录发出的请求
router.post('/login' , function (req,res) {
  console.log(req.body)
  var body = req.body

  User.findOne({
    email: body.email
  } , (err,user) => {
    if(err) {
      return res.status(500).json({
        err_code: 500,
        message: err.message
      })
    }
    // 如果没有邮箱，则不进行下面步骤
    if(!user) {
      return res.status(200).json({
        err_code: 2,
        message: '不存在该用户'
      })
    }
    // 如果判断邮箱存在，则证明存在用户，再进行判断密码
    User.findOne({
      password: body.password
    }, (err, data) => {
      if(err) {
        return res.status(500).json({
          err_code: 500,
          message: err.message
        })
      }
      if(!data) {
        return res.status(200).json({
          err_code: 1,
          message: '密码不正确'
        })
      }
      // 邮箱和密码都正确，记录登录状态
      req.session.user = data

      res.status(200).json({
        err_code: 0,
        message: 'OK'
      })
    })
  })
})

// 用户退出的请求
router.get('/logout' , function (req,res) {
  req.session.user = null
  res.redirect('/login')
})

// 渲染注册页面
router.get('/register' , function (req,res) {
  res.render('register.html')
})

// 注册发出的请求
router.post('/register' , function (req,res) {
  // 1.获取表单提交的数据
  // console.log(req.body)
  // 2.操作数据库
  var body = req.body
  User.findOne({
    $or: [{email: body.email},{nickname: body.nickname}]
  } , (err,data) => {
    if(err) {
      return res.status(500).json({
        err_code: 500,
        message: 'Server Error'
      })
    }
    if(data) {
      // console.log('已存在', body)
      return res.status(200).json({
        err_code: 1,
        message: 'Email or nickname already exists'
      })
    }
    // console.log('新的', body)
    new User(body).save().then(user => {
      req.session.user = user
      res.status(200).json({
        err_code: 0,
        message: 'OK'
      })
    }).catch(err => {
      res.status(500).json({
        err_code: 500,
        message: 'New User Server Error'
      })
    })
  })
})

// 渲染设置页面
router.get('/settings/profile' , function (req,res) {
  res.render('./settings/profile.html' , {
    user: req.session.user
  })
})

// 更新设置页面发出的请求
router.post('/settings/profile' , function (req,res) {
  var body = req.body
  // console.log(body)
  User.updateOne({
    email: body.email,
    password: body.password
  } , body , (err, data) => {
    if(err) {
      return res.status(500).json({
        err_code: 500,
        message: '服务器忙碌，请稍后再试...'
      })
    }
    // console.log(data)
    // 如果有 data 则说明更新操作成功，则使用客户端跳转到首页
    req.session.user = body

    res.status(200).json({
      err_code: 0,
      message: '更新操作完成'
    })
  })
})

// 渲染账户设置页面
router.get('/settings/admin' , function (req,res) {
  res.render('./settings/admin.html' , {
    user: req.session.user
  })
})

// 处理账户设置页面发送的表单提交
router.post('/settings/admin' , function (req,res) {
  var body = req.body
  console.log(body)
  if(body.oldPass !== req.session.user.password) {
    return res.status(200).json({
      err_code: 1,
      message: '当前密码和初始密码不一致'
    })
  } else if(body.newPass1 !== body.newPass2) {
    return res.status(200).json({
      err_code: 2,
      message: '两次输入的新密码不一致'
    })
  }
  // console.log('可以处理')
  User.updateOne({
    password: body.oldPass
  } , {
    password: body.newPass2
  } , (err,success) => {
    if(err) {
      return res.status(500).json({
        err_code: 500,
        message: '服务器忙碌，请稍后再试...'
      })
    }
    // 如果修改成功，则客户端重定向到首页
    res.status(200).json({
      err_code: 0,
      message: 'OK'
    })
  })
})

module.exports = router