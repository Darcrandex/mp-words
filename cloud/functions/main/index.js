const fs = require("fs");
const TcbRouter = require("tcb-router");
const cloud = require("wx-server-sdk");

const CLOUD_ID = "cloud-db-0kmga";
cloud.init({ env: CLOUD_ID, throwOnNotFound: false });

const PAGE_SIZE = 10;

// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({ event });
  const db = cloud.database();
  const _ = db.command;
  const $ = _.aggregate;

  // 当前用户openid
  const { OPENID: openid } = cloud.getWXContext();
  const tableUser = db.collection("user");
  const tableAdmin = db.collection("admins");
  const tablePost = db.collection("post");
  const tableLike = db.collection("like");
  const tableCollect = db.collection("collect");

  // 获取管理员列表
  app.router("admin", async (ctx) => {
    try {
      const { data = [] } = await tableAdmin.get();
      ctx.body = { code: 20000, msg: "ok", data };
    } catch (err) {
      ctx.body = { code: 40000, msg: "获取管理员失败" + err, data: null };
    }
  });

  // 用户
  app.router("user/login", async (ctx) => {
    try {
      const {
        data: [user = null],
      } = await tableUser.where({ openid }).get();

      if (user) {
        ctx.body = { code: 20000, msg: "ok", data: user };
      } else {
        ctx.body = { code: 20001, msg: "not find", data: null };
      }
    } catch (err) {
      ctx.body = { code: 50000, data: null, msg: JSON.stringify(err) };
    }
  });

  app.router("user/sign-up", async (ctx) => {
    const { user = null } = ctx._req.event;
    if (!user) {
      ctx.body = { code: 40001, msg: "user info is required", data: null };
      return;
    }

    try {
      const {
        data: [user = null],
      } = await tableUser.where({ openid }).get();
      if (user) {
        ctx.body = { code: 40002, msg: "aready sign up", data: null };
        return;
      }
      const res = await tableUser.add({
        data: { openid, cover: "", ...user },
      });
      ctx.body = { code: 20000, msg: "sign up success", data: res.id };
    } catch (err) {
      ctx.body = { code: 50000, data: null, msg: JSON.stringify(err) };
    }
  });

  // 帖子
  app.router("post/list", async (ctx) => {
    const { page = 1 } = ctx._req.event;

    try {
      const { total = 0 } = await tablePost.count();
      let { list = [] } = await tablePost
        .aggregate()
        // 先限制数量
        .sort({ createDate: -1 })
        .skip((page - 1) * PAGE_SIZE)
        .limit(PAGE_SIZE)
        // 查询作者
        .lookup({
          from: "user",
          localField: "openid",
          foreignField: "openid",
          as: "author",
        })
        // 查询点赞总数量
        .lookup({
          from: "like",
          localField: "_id",
          foreignField: "post_id",
          as: "likeTotal",
        })
        // 查询收藏总数量
        .lookup({
          from: "collect",
          localField: "_id",
          foreignField: "post_id",
          as: "collectTotal",
        })
        .end();

      // 由于联表查询获得的字段值是个数组(目前不知道如果改),通过这种方式改成对象
      list = list.map((item) => ({
        ...item,
        author: item.author
          .map((a) => ({
            nickName: a.nickName,
            avatarUrl: a.avatarUrl,
          }))
          .pop(),
        like: item.likeTotal.some((v) => v.openid === openid),
        likeTotal: item.likeTotal.length,
        collect: item.collectTotal.some((v) => v.openid === openid),
        collectTotal: item.collectTotal.length,
      }));

      ctx.body = { code: 20000, data: { list, total }, msg: "ok" };
    } catch (err) {
      ctx.body = { code: 50000, data: null, msg: JSON.stringify(err) };
    }
  });

  // 按类型查询(针对当前用户)
  app.router("post/list-by-type", async (ctx) => {
    const { page = 1, type = "all" } = ctx._req.event;
    //type: 'all' | 'like' | 'collect'

    const max = 1000;
    const pageSize = 2 * PAGE_SIZE; //小列表数量多

    try {
      if (type === "all") {
        const { total = 0 } = await tablePost.where({ openid }).count();

        const { data = [] } = await tablePost
          .where({ openid })
          .orderBy("createDate", "desc")
          .skip((page - 1) * pageSize)
          .limit(pageSize)
          .get();
        ctx.body = { code: 20000, data: { list: data, total }, msg: "ok" };
      } else if (type === "like") {
        const { total = 0 } = await tableLike.count();
        const times = Math.ceil(total / max);
        const tasks = [];
        for (let i = 0; i < times; i++) {
          const promise = tableLike
            .skip(i * max)
            .limit(max)
            .where({ openid: _.eq(openid) })
            .get();
          tasks.push(promise);
        }

        // 当前用户所有点赞的映射表
        const { data: likeArr = [] } = (await Promise.all(tasks)).reduce(
          (acc, cur) => {
            return {
              data: acc.data.concat(cur.data),
              errMsg: acc.errMsg,
            };
          }
        );

        const likeIds = likeArr.map((v) => v.post_id);

        const { total: postTotal = 0 } = await tablePost
          .where(_.expr($.in(["$_id", likeIds])))
          .count();
        const { data: postLike } = await tablePost
          .where(_.expr($.in(["$_id", likeIds])))
          .orderBy("createDate", "desc")
          .skip((page - 1) * pageSize)
          .limit(pageSize)
          .get();

        ctx.body = {
          code: 20000,
          data: { list: postLike, total: postTotal },
          msg: "ok",
        };
      } else if (type === "collect") {
        const { total = 0 } = await tableCollect.count();
        const times = Math.ceil(total / max);
        const tasks = [];
        for (let i = 0; i < times; i++) {
          const promise = tableCollect
            .skip(i * max)
            .limit(max)
            .where({ openid: _.eq(openid) })
            .get();
          tasks.push(promise);
        }

        // 当前用户所有收藏的映射表
        const { data: collectArr = [] } = (await Promise.all(tasks)).reduce(
          (acc, cur) => {
            return {
              data: acc.data.concat(cur.data),
              errMsg: acc.errMsg,
            };
          }
        );

        const collectIds = collectArr.map((v) => v.post_id);

        const { total: postTotal = 0 } = await tablePost
          .where(_.expr($.in(["$_id", collectIds])))
          .count();
        const { data: postCollect } = await tablePost
          .where(_.expr($.in(["$_id", collectIds])))
          .orderBy("createDate", "desc")
          .skip((page - 1) * pageSize)
          .limit(pageSize)
          .get();

        ctx.body = {
          code: 20000,
          data: { list: postCollect, total: postTotal },
          msg: "ok",
        };
      }
    } catch (err) {
      ctx.body = { code: 50000, data: null, msg: JSON.stringify(err) };
    }
  });

  // 新增帖子
  app.router("post/add", async (ctx) => {
    const { img = "", content = "", from = "" } = ctx._req.event;

    try {
      const now = Date.now();
      const { _id } = await tablePost.add({
        data: { img, content, from, createDate: now, updateDate: now, openid },
      });

      ctx.body = { code: 20000, data: _id, msg: "ok" };
    } catch (err) {
      ctx.body = { code: 50000, data: null, msg: JSON.stringify(err) };
    }
  });

  // 查询详情
  app.router("post/detail", async (ctx) => {
    const { id = "" } = ctx._req.event;
    try {
      // 增加查阅次数
      await tablePost.doc(id).update({ data: { view: _.inc(1) } });

      let { list = [] } = await tablePost
        .aggregate()
        .match({ _id: db.command.eq(id) })
        .lookup({
          from: "user",
          localField: "openid",
          foreignField: "openid",
          as: "author",
        })
        // 查询点赞总数量
        .lookup({
          from: "like",
          localField: "_id",
          foreignField: "post_id",
          as: "likeTotal",
        })
        // 查询收藏总数量
        .lookup({
          from: "collect",
          localField: "_id",
          foreignField: "post_id",
          as: "collectTotal",
        })
        .end();

      const data = list
        .map((item) => ({
          ...item,
          author: item.author
            .map((a) => ({
              nickName: a.nickName,
              avatarUrl: a.avatarUrl,
            }))
            .pop(),
          like: item.likeTotal.some((v) => v.openid === openid),
          likeTotal: item.likeTotal.length,
          collect: item.collectTotal.some((v) => v.openid === openid),
          collectTotal: item.collectTotal.length,
        }))
        .pop();

      ctx.body = { code: 20000, data, msg: "ok" };
    } catch (err) {
      ctx.body = { code: 50000, data: null, msg: JSON.stringify(err) };
    }
  });

  // 更新帖子
  app.router("post/update", async (ctx) => {
    const { id = "", img = "", content = "", from = "" } = ctx._req.event;
    const now = Date.now();

    try {
      const res = await tablePost
        .doc(id)
        .update({ data: { img, content, from, updateDate: now } });

      ctx.body = { code: 20000, data: res, msg: "update success" };
    } catch (err) {
      ctx.body = { code: 50000, data: null, msg: JSON.stringify(err) };
    }
  });

  // 删帖
  app.router("post/remove", async (ctx) => {
    const { id = "" } = ctx._req.event;
    try {
      const res = await tablePost.where({ _id: db.command.eq(id) }).remove();
      ctx.body = { code: 20000, data: res, msg: "ok" };
    } catch (err) {
      ctx.body = { code: 50000, data: null, msg: JSON.stringify(err) };
    }
  });

  // 点赞/取消点赞
  app.router("post/like", async (ctx) => {
    const { id = "" } = ctx._req.event;
    try {
      const { total = 0 } = await tableLike.where({ post_id: id }).count();
      if (total > 0) {
        await tableLike.where({ post_id: id }).remove();
      } else {
        await tableLike.add({ data: { post_id: id, openid } });
      }

      ctx.body = { code: 20000, data: null, msg: "ok" };
    } catch (err) {
      ctx.body = { code: 50000, data: null, msg: JSON.stringify(err) };
    }
  });

  // 收藏/取消收藏
  app.router("post/collect", async (ctx) => {
    const { id = "" } = ctx._req.event;
    try {
      const { total = 0 } = await tableCollect.where({ post_id: id }).count();
      if (total > 0) {
        await tableCollect.where({ post_id: id }).remove();
      } else {
        await tableCollect.add({ data: { post_id: id, openid } });
      }

      ctx.body = { code: 20000, data: null, msg: "ok" };
    } catch (err) {
      ctx.body = { code: 50000, data: null, msg: JSON.stringify(err) };
    }
  });

  // 文件管理
  app.router("file/upload", async (ctx) => {
    const { filePath = "" } = ctx._req.event;
    const postfix = filePath.split(".").pop();
    const fileStream = fs.createReadStream(filePath);

    try {
      const { fileID = "" } = await cloud.uploadFile({
        cloudPath: `${randomStr()}_${Date.now()}.${postfix}`,
        fileContent: fileStream,
      });

      ctx.body = { code: 20000, data: fileID, msg: "upload success" };
    } catch (err) {
      ctx.body = { code: 50000, data: null, msg: JSON.stringify(err) };
    }
  });

  return app.serve();
};

/**
 * @name randomStr
 * @desc 随机字符串
 * @param {Number} len - 字符串长度
 */
function randomStr(len = 16) {
  const string =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const l = string.length;
  let str = "";
  for (let i = 0; i < len; i++) {
    const index = Math.floor((Math.random() * 100 * l) % l);
    str += string[index];
  }
  return str;
}
