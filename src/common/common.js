import axios from 'axios';
import { url, educationUrl, httpUrl } from '../../build/serverurl';
import COS from 'cos-js-sdk-v5';
var _this;
export function Tool() {
    _this = this;
    _this.COS = null;
    _this.baseURL = httpUrl;
    _this.FILE_URL_DIVIDE = '$@';
    _this.PhoneNumber = null;
    _this.ToKen = null;
    _this.state = null;
    _this.manageRegion = null;
}
/**
 * 初始化COS实例
 * @param {string} PhoneNumber
 * @param {string} ToKen
 */
Tool.prototype.newCos = function(PhoneNumber, ToKen) {
        _this.PhoneNumber = PhoneNumber;
        _this.ToKen = ToKen;
        _this.COS = new COS({
            getAuthorization: function(options, callback) {
                var method = (options.Method || 'get').toLowerCase();
                var key = options.Key || '';
                var pathname = key.indexOf('/') === 0 ? key : '/' + key;

                var option = {
                    url: '/home/auth',
                    baseURL: _this.baseURL,
                    // method: 'post',
                    method: 'get',
                    params: {
                        method: method,
                        pathname: pathname,
                        PhoneNumber: PhoneNumber,
                        ToKen: ToKen
                    },
                };
                axios(option).then(function(res) {
                    callback(res['data']);
                }).catch(function(err) {
                    callback(err);
                });
            },
            FileParallelLimit: 3, // 控制文件上传并发数
            ChunkParallelLimit: 3, // 控制单个文件下分片上传并发数
            // ProgressInterval: 1000,  // 控制上传的 onProgress 回调的间隔
        });
    }
    // 上传
Tool.prototype.uploadCos = function(file, save_path, attr, resolve, reject) {
        console.log('*****************')
        console.log(file);
        _this.COS.putObject({
            Bucket: 'xcgk20180320-1256236574',
            /* 必须 */
            Region: 'ap-chengdu',
            /* 必须 */
            Key: save_path,
            /* 必须 */
            StorageClass: 'STANDARD',
            Body: file, // 上传文件对象
        }, function(err, data) {
            if (err) {
                reject(err);
            } else {
                if (data.statusCode === 200) {
                    resolve({
                        data: data,
                        attr: attr
                    })
                } else {
                    reject(err)
                }
            }
            console.log(err || data);
        });

    }
    /**
     * @param {String} type 文件类型 'pic'
     * @param {Array} fileList 包含文件的数组
     * @param {Function} cb 上传图片成功后的回调函数
     */
Tool.prototype.myUpload = function(type, fileList, cb) {

        var promise_arr = [];
        var keys = Object.keys(fileList);
        var handler;
        console.log('**************------------------')
        console.log(fileList)
        var save_path, fileType;
        keys.forEach(attr => {

            fileList[attr].forEach((file, index) => {
                fileType = file['type'] || file.raw['type'];
                console.log(fileType);
                if (!fileType.includes('image')) {
                    alert('上传文件类型错误，请上传图片');
                } else {
                    var p = new Promise((resolve, reject) => {
                        var timestamp = new Date().getTime();
                        fileType = fileType.split('/')[1];
                        fileType === 'jpeg' && (fileType = 'jpg');

                        save_path = type + '/' + _this.PhoneNumber + '_' + timestamp + '.' + fileType;
                        if (fileType === 'jpg') {
                            handler = function(err, data) {
                                var ms = new Date().getTime();
                                var save_key = type + '/' + _this.PhoneNumber + '_' + ms + '.' + fileType;
                                _this.uploadCos(data, save_key, attr, resolve, reject);
                            };
                            _this.compress(file.raw, 0.7, handler);
                        } else {
                            _this.uploadCos(file.raw, save_path, attr, resolve, reject);
                        }

                    });
                    promise_arr.push(p);
                }
            });
        });
        if (promise_arr['length']) {
            Promise.all(promise_arr).then(res => {
                console.log('all回调')
                console.log(res)
                cb(res);
            }).catch(err => {
                console.log(err);
            });
        }
    }
    /**
     * 提交表单数据轮子  适用于有图片提交的场景
     * @param {Object} params_myUpload
     * @param {Object} params_postForm
     */
Tool.prototype.submit = function(params_myUpload, params_postForm) {
    var postForm = function(temp) {
        var _data = Object.assign(params_postForm.data, temp);
        _data.PhoneNumber = _this.PhoneNumber;
        _data.ToKen = _this.ToKen;
        var options = {
            url: params_postForm.url,
            baseURL: _this.baseURL,
            method: 'post',
            data: _data
        };
        console.log('上传图片成功');
        console.log(options.data);
        axios(options).then(function(res) {
            params_postForm.success(res, temp);
        }).catch(function(err) {
            console.log(err);
        });
    }
    var submit = function() {
        _this.myUpload(params_myUpload.fileType, params_myUpload.fileList, function(res) {
            console.log('resolve回调')
            console.log(res)
            var temp = {};
            res.forEach((item) => {
                temp[item.attr] || (temp[item.attr] = '');
                if (temp[item.attr]) {
                    temp[item.attr] += (_this.FILE_URL_DIVIDE + item.data['Location']);
                } else {
                    temp[item.attr] += item.data['Location'];
                }
            });
            console.log(temp);
            postForm(temp);
        });
    }
    submit();
}

/* 压缩处理图片 */
Tool.prototype.compress = function(file, quality, callback) {
        if (!window.FileReader || !window.Blob) {
            return errorHandler('您的浏览器不支持图片压缩')();
        }
        var reader;
        var mimeType;
        reader = new FileReader();
        reader.onload = createImage;
        reader.onerror = errorHandler('图片读取失败！');
        mimeType = file['type'];
        reader.readAsDataURL(file);

        function createImage() {
            var dataURL = this.result;
            var image = new Image();
            image.onload = compressImage;
            image.onerror = errorHandler('图片加载失败');
            image.src = dataURL;
        }

        function compressImage() {
            var canvas = document.createElement('canvas');
            var ctx;
            var dataURI;
            var result;

            canvas.width = this.naturalWidth;
            canvas.height = this.naturalHeight;
            ctx = canvas.getContext('2d');
            ctx.drawImage(this, 0, 0);
            dataURI = canvas.toDataURL(mimeType, quality);
            result = dataURIToBlob(dataURI);
            callback(null, result);
        }

        function dataURIToBlob(dataURI) {
            var type = dataURI.match(/data:([^;]+)/)[1];
            var base64 = dataURI.replace(/^[^,]+,/, '');
            var byteString = atob(base64);

            var ia = new Uint8Array(byteString.length);
            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }

            return new Blob([ia], { type: type });
        }

        function errorHandler(message) {
            return function() {
                var error = new Error('Compression Error:', message);
                callback(error, null);
            };
        }
    }
    /**
     * 获取COS签名后地址
     * @param {string} key 文件名
     * @param {function} cb 展示图片数组
     */
Tool.prototype.getCos = function(key, cb) {
    _this.COS.getObjectUrl({
        Bucket: 'xcgk20180320-1256236574',
        /* 必须 */
        Region: 'ap-chengdu',
        /* 必须 */
        Key: key,
        /* 必须 */
        Sign: true
    }, function(err, data) {
        //签名后的回调
        if (err) {} else {
            cb(data.Url);
        }
        // console.log(err || data.Url);
    });
}