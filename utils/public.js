let getImage = function (count, sizeType, sourceType){
  return new Promise ((resolve,reject)=>{
    if (count==0){
      console.log('当前可选择图片的数量为0')
      reject(false)
      return;
    }
    wx.chooseImage({
      count: count ? count:9,
      sizeType: sizeType ? sizeType:['original', 'compressed'],
      sourceType: sourceType ? sourceType:['album', 'camera'],
      success: function (res) {
        resolve(res.tempFilePaths)
      },
      fail:function(err){
        reject(err)
      }
    })
  }) 
}

let getToast = function (title,type) {
    wx.showToast({
      title: title,
      icon: type ? type : 'none',
      duration: 1500
    })
}

let getModal = function(content,showCancel) {
  return new Promise ((resolve,reject)=>{
    wx.showModal({
      title: "提示",
      content: content,
      showCancel: showCancel,
      success: function(mos_res){
        resolve(mos_res);
      },
      fail: function(err){
        reject(err);
      }
    })
  }) 
}

export default{
  getImage,
  getToast,
  getModal
}