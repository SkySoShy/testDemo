const MongoClient = require('mongodb').MongoClient;
const url = `mongodb://localhost:27017`

MongoClient.connect(url, (err, db) => {
    if (err) throw err
    console.log('数据库已经创建');
    const dbase = db.db('register')

    const myobj = {name: 'cainiao', url: 'www.runoob'}
    dbase.createCollection('site').insertOne(myobj, (err, res) => {
        if (err) throw err
        console.log('文档插入成功')
        db.close()
    })
})