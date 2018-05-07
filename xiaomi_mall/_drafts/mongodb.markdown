---
layout: "post"
title: "mongodb"
date: "2018-05-07 09:19"
---

    - 插入集合
        - db.createCollection
        - db.user.insert
            - 插入用户
                - db.user.insert({userID:123,username: 'leo',userAge: 29,class:{name: 'genius',num:10}})
    - 查看集合
        - show collection

    - 删除数据库
        - db.dropDatabase()

    - 删除集合
        - db.user.drop()

    - 查看数据
        - db.user.find()
        - db.user.findOne()
        - db.user.update()
        - db.user.remove()
