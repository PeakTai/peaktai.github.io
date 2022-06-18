
今天聊一下类似微信朋友圈这样的业务该怎么设计数据库的表结构，纯个人观点，希望能够提供一点参考价值。

数据库使用 MongoDB，因为 MongoDB 比较灵活，支持属性层级较复杂的数据存储，并且可以为这些属性设置索引，有些情况使用 mysql
可能要创建不少关联表然后联表查询，使用 MongoDB 程序能更简洁一些。此外 MongoDB
支持分片集群，对于数据量大的业务承载能力更好一些，下面涉及创建集合（相当于mysql中的表）的部分也会有分区键。

### 约定

为了直观易读，所有的集合中的数据结构都使用 TypeScript
的接口定义来表示。由于习惯问题，后面出现的 mongo 的集合，统一称作为表。

### 联系人

系人表记录自己有哪些好友。

```ts
interface contact {
  _id: string
  /**
  * 用户id.
  */
  userId: string
  /**
  * 好友id.
  */
  contactId: string
  // 其它属省略，不会出现在后面的查询中
}
```

创建唯一索引：

```js
db.contact.createIndex({userId: 1, contactId: 1}, {unique: true})
```

### 联系人标签

微信中有个给联系人打标签的功能，朋友圈动态可以使用标签来设置权限，所以我们要创建一个联系人标签表。

```js
interface contactTag {
  _id: string;
  /**
  * 创建人ID.
  */
  creatorId:string;
  /**
  * 用户ID.
  */
  userId: string;
  /**
  * 标签ID.
  */
  tagId: string;
}
```

创建唯一索引，将 userId 放前面，方便使用 userId 查询自己被好友打上了哪些标签。

```js
db.contactTag.createIndex({userId: 1, tagId: 1}, {unique: true})
```

### 联系人权限

微信中可以对联系人设置朋友圈权限：不看他（她）、不让他（她）看我。所以我们增加一个权限设置表。

```ts
interface momentSetting {
  /**
  * 与用户id一对一关联.
  */
  _id: string
  /**
  * 被排除的用户ID，不看他（她）.
  */
  excludedUserIds: string[]
  /**
  * 反向排除的用户ID，不让他（她）看我.
  */
  reverseExcludedUserIds: string[]
}
```

为 reverseExcludedUserIds 创建索引，用于查询自己被哪些好友屏蔽。

```js
db.momentSetting.createIndex({reverseExcludedUserIds: 1})
```

### 群

朋友圈的动态可以设置根据群设置权限，所以必须得得增加群用户这个表。

```ts
interface groupUser {
  _id: string
  /**
  * 微信群id.
  */
  groupId: string
  /**
  * 用户id.
  */
  userId: string
}
```

创建唯一索引，将 userId 放前面，方便查询自己所在的群。

```ts
db.groupUser.createIndex({userId: 1, groupId: 1}, {unique: true})
```

### 朋友圈动态

微信朋友圈在发动态时，可以设置谁可以看：公共（所有人）、私密（仅自己）、部分可见（可设置人、群和标签）、不给谁看（可设置人、群和标签）。这些设置是的，只能选择一个。

下面是动态表的数据结构：\

```ts
interface moment {
  /**
  * 带有时间顺序的id，由时间戮加随机数生成.
  */
  _id: string
  /**
  * 作者id.
  */
  creatorId: string
  /**
  * 开放类型，公开、私密，部分人等. public 表示公开，private 表示私密，
  * partly-visible 表示部分可见，partly-invisible 表示部分人不可见（不让谁看）.
  * 当值为 partly-visible 或 partly-invisible，下面的几个属性才有效.
  */
  openType: 'public' | 'private' | 'partly-visible' | 'partly-invisible',
  /**
  * 受限或开放的群组id列表.
  */
  groupIds: string[]
  /**
  * 受限或开放的标签id列表.
  */
  tagIds: string[]
  /**
  * 受限或开放的用户id列表.
  */
  userIds: string[]
  // 其它的属性，如内容、创建时间等字段此处省略，这些字段不出现在查询语句中
}
```

本文主要说明如何做查询，内容等字段不出现在查询语句中，此处省略，不做相关的介绍。然后我们为创建人id和_id创建索引，以方便后面按时间顺序查询记录。

```js
db.moment.createIndex({creatorId: 1, _id: -1})
```

动态表可以将 creatorId 设置为分区键，这样不同的用户的数据会分布在不同的节点上，在写入数据时能避免热片问题。

```js
sh.shardCollection( "库名.moment", { "creatorId" : "hashed" } )
```

### 查询流程

相关的表都已经创建好了，现在可以开始做查询逻辑了。

#### 获取朋友圈可见的好友ID列表

从联系人集合中查询当前用户所有好友的ID，在程序中存为 contactIds 。

```js
db.contact.find({userId:'当前用户ID'},{contactId:1})
```

从动态设置集合中查询当前用户被哪些好友屏蔽，得到这些好友的ID，在程序中存为 `unfriendlyContactIds` 。

```js
db.momentSetting.find({reverseExcludedUserIds:'当前用户ID'},{_id:1})
```

从动态设置表中查询当前用户屏蔽了哪些好友，得到这些好友的ID，在程序中存为 `excludedUserIds` 。

```js
db.momentSetting.find({_id:'当前用户ID'},{excludedUserIds:1})
```

然后从 `contactIds` 删除掉 `unfriendlyContactIds` 和 `excludedUserIds` 中包含的用户ID，得到所有可以查看朋友圈的好友ID，
在程序中记为 `friendlyContactIds` 。

#### 获取所有标签ID

从联系人标签集合中查询当前用户被好友打上的所有标签的ID，在程序中存为 <code>tagIds</code> 。

```js
db.contactTag.find({userId:'当前用户ID'},{tagId:1})
```

#### 获取所有群组ID

从君用户集合中查询当前用户所在的所有群ID，在程序中记为 <code>groupIds</code> 。

```js
db.groupUser.find({userId:'当前用户ID'},{groupId:1})
```

#### 查询动态表

经过前面的几次查询，我们得到以下数据：



有了这些信息，就可以从动态集合（表）中查询记录了。上面的信息不需要每次都重新查询一次，可以查询后缓存一段时间，一般情况下很少会有改动，加载新动态时可复用。

```js
db.moment.find({
  creatorId: {$in: '插入 friendlyContactIds'}
  _id: {$gt: '上次查询最后一条记录的ID'},
  $or: [
      {openType: 'public'},
      {
          openType: 'partly-visible',
          $or: [
              {groupIds: {$in: '插入 groupIds'}},
              {tagIds: {$in: '插入 tagIds'}},
              {userIds: '当前用户ID'}
          ]
      },
      {
          openType: 'partly-invisible',
          $and: [
              {groupIds: {$nin: '插入 groupIds'}},
              {tagIds: {$nin: '插入 tagIds'}},
              {userIds: {$ne: '当前用户ID'}}
          ]
      }
  ]
}).sort({_id: -1}).limit(20)
```

上面的查询语句中需要程序中动态插入前面查询到的数据记录，_id
的过虑条件用于翻页，首次查询不需要。查询主要依赖于动态表的字段 creatorId 和 _id
联合索引，群组ID、标签ID和用户ID没有必要创建索引，意义不大。

### 总结

整个流程没有什么复杂的查询，仅最后查询动态表稍微麻烦一点点。随着好友数量的增加，查询的效率会有所降低，所以业务上需要限制好友的数量。
