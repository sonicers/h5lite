// 云存储服务名绑定的域名
const domain = 'https://uss.sonicers.com';
// 云存储服务名
const server = 'static-sonicers';
//上传到服务器的文件夹路径
const pathInServer = '/sike';


const UpyunUpload = require('anve-upload-upyun');
const path = require('path');
const fs = require('fs');
const configFilePath = './upyun.config.js';

let name;
let passwd;

const configExist = fs.existsSync(configFilePath);
if (configExist) {
    const config = require(configFilePath);
    name = config.name;
    passwd = config.passwd;
    console.log("domain:" + config.domain);
    console.log("server:" + config.server);
    console.log("pathInServer:" + config.pathInServer);
    console.log("name:" + config.name);
    console.log("passwd:" + config.passwd);
}

new UpyunUpload({
    /**
     * 上传的服务名
     */
    serviceName: server,
    /**
     * 操作员账号
     */
    operatorName: name,
    /**
     * 操作员密码
     */
    password: passwd,
    /**
     * 上传服务器路径
     */
    remoteFilePath: pathInServer,
    /**
     * 本地文件夹路径
     */
    filePath: path.resolve(__dirname, './dist'),
    /**
     * 是否打开上传前的提示 默认打开
     */
    openConfirm: false,
    /**
     * 上传成功回调
     * @param {array} files [成功文件列表]
     */
    success: function (files) {
        console.log('success', files);
        console.info('Check at：' + domain + pathInServer + '/index.html');
    },
    /**
     * 上传失败回调
     * @param {array} files [失败文件列表]
     */
    error: function (files) {
        console.log('error', files)
    }
});
