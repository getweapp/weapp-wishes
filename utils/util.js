let _sentenceId;

const domain = 'https://api.getweapp.com/vendor';
const storage = require('./wishes');

const _getRandom = (n) => {
  return Math.floor(Math.random() * parseInt(n))
}

let _changeOne = (relation,sex) => {
  let len = storage.classify[relation][sex].length;
  let index = _getRandom(len);
  let sentenceId = storage.classify[relation][sex][index]
  if (sentenceId === _sentenceId) {
    this._changeOne()
  } else {
    _sentenceId = sentenceId;
    console.log(storage.sentence[sentenceId])
    return storage.sentence[sentenceId];
  }
}

let _pushList = (relation,sex) => {
  let index_list = storage.classify[relation][sex];
  let _list = []
  for (let i = 0 ; i < index_list.length; i++){
    let id = index_list[i];
    //与后端数据结构保持一致
    _list.push({
      id: id,
      wishes: storage.sentence[id]
    })
  }
  return _list;
}


/**
 * @param opt [Object] 请求所需要的参数
 *  key: path       请求的路径，目前支持 wishes, lists
 *  key: realtion   关系ID
 *  key: sex        性别ID
 *  key: id         祝福语ID (可选)
 *  key: type       请求方式，不填则为GET
 * @param cb [Function] 请求后的回调函数,传入的参数为相应的数据结果
 */
const request = (opt,cb) => {
  wx.request({
    url:`${domain}/${opt.path}?app_name=wishes&relation_id=${opt.relation}&gender_id=${opt.sex}&wishes_id=${opt.id}`,
    type: opt.type || 'GET',
    success:(res) => {
      //实际上为请求失败，是对后端的容错处理
      if(typeof res.data.data === 'undefined'){
        console.log('remote-fail','res.data.data is undefined');
        if (opt.path === 'wishes'){
          cb(_changeOne(opt.relation,opt.sex,opt.id));
          //cb(this.getPublish());
          //this.setData({'sentence':});
        }
        if (opt.path === 'lists'){
          cb(_pushList(opt.relation,opt.sex,opt.id));
        }
        return;
      }

      console.log('remote-success',res.data.data)
      if (opt.path === 'wishes'){
        cb(res.data.data)
      }

      if (opt.path === 'lists'){
        cb(res.data.data)
      }
    },
    fail:(err) => {
      console.log('remote-fail',err);
      if (opt.path === 'wishes'){
        cb(_changeOne(opt.relation,opt.sex));
      }
      if (opt.path === 'lists'){
        cb(_pushList(opt.relation,opt.sex));
      }
    }
  })
}

const formatNumber = (n) => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const today = () =>{
  let year,month,day;
  let date = new Date();
  year = date.getFullYear();
  month = formatNumber(date.getMonth() + 1);
  day = formatNumber(date.getDate());
  return `${year}年${month}月${day}日`;
}

module.exports = {
  request,
  today
}
