/* config-overrides.js */
const path = require('path');
const theme = require('./theme');
const { override, fixBabelImports, addWebpackAlias, addLessLoader } = require('customize-cra');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const WebpackAliyunOss = require('webpack-aliyun-oss');


const isAnalysis = process.env.ANALYSIS === 'true';
const isEnvProduction = process.env.NODE_ENV === 'production';
const useS3 = process.env.S3_ENABLED === 'true';

const addAnalysisPlugin = config => {
  config.plugins.push(new BundleAnalyzerPlugin());
  return config;
}

const addAliyunOssPlugin = (config) => {
  config.plugins.push(new WebpackAliyunOss({
    dist: process.env.S3_FILE_PREFIX,
    region: process.env.S3_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    accessKeySecret: process.env.AWS_SECRET_ACCESS_KEY,
    bucket: process.env.S3_BUCKET,
    timeout: 600 * 1000,
    setOssPath(filePath) {
      // some operations to filePath
      let re = /.*(static[\s\S]+)/g
      let match = re.exec(filePath.replace(/\\/g, '/'))
      if(!match) {
        return;
      }
      return match[1];
    },
  }));

  return config;
}

module.exports = override(
  addWebpackAlias({
    shared:  path.join(__dirname, 'src/shared'),
    interfaces:  path.join(__dirname, 'src/interfaces'),
    assets: path.join(__dirname, 'src/assets'),
    '@': path.join(__dirname, 'src'),
  }),
  addLessLoader({
    lessOptions: {
      javascriptEnabled: true,
      modifyVars: theme,
    },
  }),
  fixBabelImports('import', { libraryName: 'antd', libraryDirectory: 'lib', style: true }),
  isAnalysis && addAnalysisPlugin,
  isEnvProduction && useS3 && addAliyunOssPlugin,
)