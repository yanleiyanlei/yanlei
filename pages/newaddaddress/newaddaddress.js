const app = getApp();
Page({
  data: {
    region: ["省", "市", "区"],
    customItem: "",
    defalt: false,
    akey: 0
  },
  onLoad: function (options) {
    this.setData({
      page: options.page,
      goods_id: options.goods_id,
      spec_key: options.spec_key,
      num: options.num,
    })
  },
  bindRegionChange: function (e) {
    if (e.detail.value[0] == "北京市" || e.detail.value[0] == "天津市" || e.detail.value[0] == "河北省") {
      this.setData({
        region: e.detail.value
      })
    } else {
      wx.showToast({
        title: '商城暂时仅支持京津冀的配送',
        icon: "none",
        duration: 3000
      })
    }
  },
  defaltAddress: function (e) {
    var flag = e.currentTarget.dataset.defalt;
    if (!flag) {
      this.setData({
        defalt: !flag,
        akey: 1
      })
    } else {
      this.setData({
        defalt: !flag,
        akey: 0
      })
    }


  },
  formSubmit: function (e) {
    var that = this;
    var formData = e.detail.value;
    // console.log(formData.address_sheng)
    // console.log(["省", "市", "区"])
    // console.log(formData.address_sheng == ["省", "市", "区"])
    var userInfo = wx.getStorageSync("userinfo");
    var uid = userInfo.uid;
    if (that.data.defalt) {
      var akey = 1;
    } else {
      var akey = 0;
    }
    if (formData.address_content == "") {
      wx.showToast({
        title: "详细地址不能为空",
        icon: 'none',
        duration: 1000
      })
    }
    setTimeout(function () {
      wx.hideToast()
    }, 1000)
    if (formData.address_sheng[0] == "省" && formData.address_sheng[1] == "市" && formData.address_sheng[2] == "区") {
      wx.showToast({
        title: "区域不能为空",
        icon: 'none',
        duration: 1000
      })
    }
    setTimeout(function () {
      wx.hideToast()
    }, 1000)
    var regPhone = /^1[3|4|5|7|8][0-9]{9}$/;
    if (formData.beiyong_phone != "") {
      if (!regPhone.exec(formData.beiyong_phone)) {
        wx.showToast({
          title: "备用手机号码格式错误",
          icon: 'none',
          duration: 1000
        })
      }

    }
    if (!regPhone.exec(formData.address_phone)) {
      wx.showToast({
        title: "手机号码格式错误",
        icon: 'none',
        duration: 1000
      })
    }

    setTimeout(function () {
      wx.hideToast()
    }, 1000)
    if (formData.address_name == "") {
      wx.showToast({
        title: "姓名不能为空",
        icon: 'none',
        duration: 1000
      })
    }
    setTimeout(function () {
      wx.hideToast()
    }, 1000)
    var obj = { member_id: uid, type: 1, akey: akey, address_name: formData.address_name, address_phone: formData.address_phone, beiyong_phone: formData.beiyong_phone, address_sheng: formData.address_sheng, address_content: formData.address_content }
    if (formData.address_name != "" && regPhone.exec(formData.address_phone) && formData.address_sheng != "" && formData.address_content != "" && (regPhone.exec(formData.beiyong_phone) || formData.beiyong_phone == "")) {
      wx.request({
        url: app.globalData.Murl + '/Applets/User/AddAddress',
        data: obj,
        method: "post",
        success: function (res) {
          if (res.data.result == 2) {
            wx.showToast({
              title: "最多添加五条地址",
              icon: 'none',
              duration: 1000
            })
            setTimeout(function () {
              wx.hideToast()
            }, 1000)
          } else if (res.data.result == 1) {
            wx.redirectTo({
              url: '/pages/newaddress/newaddress?page=' + that.data.page + '&goods_id=' + that.data.goods_id + '&spec_key=' + that.data.spec_key + '&num=' + that.data.num,
            })
          }

        },
        fail: function () {
          wx.showToast({
            title: '系统繁忙',
            icon: "none",
            duration: 1000
          })
          wx.showToast({
            title: res.data.data,
            icon: "none",
            duration: 1000
          })
        }
      })




    }

  }

})