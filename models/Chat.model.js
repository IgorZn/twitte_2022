const mongoose = require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId;

const ChatSchema = new mongoose.Schema({
    chatName: {
        type: String,
        trim: true
    },
    isGroupChat: {
        type: Boolean,
        default: false
    },
    users: [
        {
            type: 'ObjectId',
            ref: 'User'
        }
    ],
    latestMessage: {
        type: 'ObjectId',
        ref: 'Message'
    }

}, {
    timestamps: true
});

ChatSchema.static({
    checkId: async function (id) {
        return mongoose.isValidObjectId(id)
    },
    getChatByUserId: async function (currentUserId, otherUserId) {
        return this.findOneAndUpdate({
            isGroupChat: false,
            users: {
                /*
                *   $size - Оператор соответствует любому массиву
                *           с количеством элементов, указанным в аргументе.
                *
                *   db.collection.find( { field: { $size: 2 } } );
                *
                *   // return
                *   { field: [ red, green ] } and { field: [ apple, lime ] }
                *
                *   // but NOT return
                *   { field: fruit } or { field: [ orange, lemon, grapefruit ] }
                *
                *   $all - Оператор выбирает документы, в которых значением поля является массив,
                *          содержащий все указанные элементы. Т.е. всё, что указано д\б в массиве
                *          или false
                *
                *   // example
                *   $elemMatch
                *
                *   // data
                *   { _id: 1, results: [ 82, 85, 88 ] }
                *   { _id: 2, results: [ 75, 88, 89 ] }
                *
                *   // query
                *   db.scores.find({ results: { $elemMatch: { $gte: 80, $lt: 85 } } } )
                *
                *   // return
                *   { "_id" : 1, "results" : [ 82, 85, 88 ] }
                *
                *   Т.е. в нашем случае: найди пользователей у которых размер массива 'users' = 2
                *   и в нем все элементы должны соот-ть условиям "$elemMatch"
                *
                * */

                /*
                *   1 -- $size, $all и $elemMatch -- это просто фильтр.
                *   если нашел, то выход, если нет, то №2
                * */

                $size: 2,
                $all: [
                    {$elemMatch: {$eq: new ObjectId(currentUserId)}},
                    {$elemMatch: {$eq: new ObjectId(otherUserId)}},
                ]
            }
        }, {
            /*
            *   используй эти значения, если ничего не нашлось
            *   и это будет использован оператор "upsert: true"
            *   т.е. "upsert" будет смотреть в "$setOnInsert" при
            *   создании значений для поля "users", если ничего
            *   не нашлось или возьмет то, что нашел.
            * */

            /*
            *   3 -- значения по-умолчанию, для №2
            * */

            $setOnInsert: {
                users: [currentUserId, otherUserId]
            }
        }, {
            /*
            *   2 -- а эта часть выполниться, если фильтр ничего не нашел
            * */

            new: true, // if true, return the modified document rather than the original
            upsert: true // Make this update into an upsert
        })
            .populate("users");
    },
})

module.exports = mongoose.model('Chat', ChatSchema);